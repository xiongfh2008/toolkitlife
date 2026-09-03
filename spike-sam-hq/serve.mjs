/**
 * spike-sam-hq / serve.mjs —— 本地静态服务器
 * 关键点：返回 COOP: same-origin + COEP: credentialless 响应头，
 * 使页面满足 crossOriginIsolated，从而启用 onnxruntime-web 的 WASM 多线程
 * （也更接近真实站点的测量环境）。
 *
 * 用法：node serve.mjs   →  http://localhost:8787
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 8787);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".onnx": "application/octet-stream",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};

createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const filePath = normalize(join(root, pathname === "/" ? "index.html" : pathname));
  if (!filePath.startsWith(root)) {
    res.writeHead(403).end("forbidden");
    return;
  }
  try {
    const data = await readFile(filePath);
    res.writeHead(200, {
      "Content-Type": MIME[extname(filePath)] || "application/octet-stream",
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "credentialless",
      "Cache-Control": "no-cache",
    });
    res.end(data);
  } catch {
    res.writeHead(404).end("not found");
  }
}).listen(port, () => {
  console.log(`[spike-sam-hq] http://localhost:${port}   (Ctrl+C 退出)`);
});
