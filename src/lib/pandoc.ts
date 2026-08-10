// Runtime loader for the official Pandoc WASM build (Pandoc 3.9, ~58 MB).
// The binary is fetched from a CDN on demand — nothing is bundled into
// the page bundle (mirrors how FFmpeg.wasm is loaded from unpkg).
// The glue code (pandoc-core.js) is vendored from pandoc-wasm (MIT, see
// https://github.com/pandoc/pandoc-wasm) because the package's `exports`
// map blocks deep imports. The pandoc.wasm binary itself is GPL-2.0-or-later.

export interface PandocInstance {
  convert(
    options: Record<string, unknown>,
    stdin: string | null,
    files: Record<string, string | Blob>
  ): Promise<{
    stdout: string;
    stderr: string;
    warnings: unknown[];
    files: Record<string, Blob>;
    mediaFiles: Record<string, Blob>;
  }>;
  query(options: Record<string, unknown>): unknown;
  pandoc(
    argsStr: string,
    inData: string | Blob | null,
    resources: { filename: string; contents: string | Blob }[]
  ): Promise<{ out: string | Blob; mediaFiles: Map<string, string | Blob> }>;
}

// Try CDNs in order and fall back to the next one on failure.
// unpkg is reachable in most regions; jsDelivr mirrors are kept as backup.
const WASM_URLS = [
  "https://unpkg.com/pandoc-wasm@1.1.0/src/pandoc.wasm",
  "https://cdn.jsdelivr.net/npm/pandoc-wasm@1.1.0/src/pandoc.wasm",
  "https://fastly.jsdelivr.net/npm/pandoc-wasm@1.1.0/src/pandoc.wasm",
  "https://gcore.jsdelivr.net/npm/pandoc-wasm@1.1.0/src/pandoc.wasm",
];

let instancePromise: Promise<PandocInstance> | null = null;

export function loadPandoc(onProgress: (p: number) => void): Promise<PandocInstance> {
  // Reuse the already-instantiated engine (it is heavy) but always report
  // progress for the initial fetch.
  if (instancePromise) {
    onProgress(1);
    return instancePromise;
  }

  instancePromise = (async () => {
    const { createPandocInstance } = await import("@/lib/pandoc-core");

    let resp: Response | null = null;
    for (const url of WASM_URLS) {
      try {
        const r = await fetch(url);
        if (r.ok && r.body) {
          resp = r;
          break;
        }
      } catch {
        // network error — try the next CDN
      }
    }
    if (!resp || !resp.body) {
      throw new Error("Failed to download Pandoc engine from all CDNs");
    }

    // unpkg responses sometimes omit Content-Length; fall back to the known
    // binary size so the progress bar still moves during the download.
    const KNOWN_WASM_SIZE = 58_000_000;
    const total = Number(resp.headers.get("content-length")) || KNOWN_WASM_SIZE;
    const reader = resp.body.getReader();
    const chunks: Uint8Array[] = [];
    let received = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.length;
      onProgress(Math.min(received / total, 0.999));
    }
    onProgress(1);

    const bytes = new Uint8Array(received);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    const wasmBinary = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength
    );

    return (await createPandocInstance(wasmBinary)) as PandocInstance;
  })();

  return instancePromise;
}
