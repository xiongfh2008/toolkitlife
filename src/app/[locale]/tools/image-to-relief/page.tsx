"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

type Step = "upload" | "ready" | "done";

interface Grid {
  data: Float32Array;
  w: number;
  h: number;
}

/**
 * Extract a luminance height map from the image (aspect-preserving) and
 * optionally smooth it. Bright pixels become raised geometry by default.
 */
function buildHeightGrid(
  img: HTMLImageElement,
  size: number,
  smooth: number,
  invert: boolean
): Grid {
  const w = size;
  const h = Math.max(2, Math.round(size * (img.naturalHeight / img.naturalWidth)));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;

  const grid = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    grid[i] = 0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2];
  }

  // Box-blur smoothing to tame noisy edges before displacement.
  for (let s = 0; s < smooth; s++) {
    const next = new Float32Array(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let sum = 0;
        let n = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const xx = x + dx;
            const yy = y + dy;
            if (xx >= 0 && xx < w && yy >= 0 && yy < h) {
              sum += grid[yy * w + xx];
              n++;
            }
          }
        }
        next[y * w + x] = sum / n;
      }
    }
    grid.set(next);
  }

  if (invert) {
    for (let i = 0; i < grid.length; i++) grid[i] = 255 - grid[i];
  }
  return { data: grid, w, h };
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export default function ImageToReliefPage() {
  const t = useTranslations("tools.image-to-relief");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [step, setStep] = useState<Step>("upload");
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [imgUrl, setImgUrl] = useState("");
  const [size, setSize] = useState(192);
  const [strength, setStrength] = useState(2.5);
  const [smooth, setSmooth] = useState(2);
  const [invert, setInvert] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const meshRef = useRef<{ mesh: unknown; dispose: () => void } | null>(null);
  const rendererRef = useRef<{ dispose: () => void; el: HTMLCanvasElement } | null>(null);

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      setImg(image);
      setImgUrl(url);
      setStep("ready");
    };
    image.src = url;
  }, []);

  useEffect(() => {
    return () => {
      rendererRef.current?.dispose();
      if (imgUrl) URL.revokeObjectURL(imgUrl);
    };
  }, [imgUrl]);

  const generate = useCallback(async () => {
    if (!img) return;
    setGenerating(true);
    setError("");
    try {
      const THREE = await import("three");
      const { OrbitControls } = await import(
        "three/examples/jsm/controls/OrbitControls.js"
      );

      // Release the previous mesh/renderer if any.
      meshRef.current?.dispose();
      rendererRef.current?.dispose();
      const container = containerRef.current;
      if (!container) throw new Error("preview container not mounted");
      container.innerHTML = "";

      const { data, w, h } = buildHeightGrid(img, size, smooth, invert);

      const planeW = 1.8;
      const planeH = planeW * (h / w);
      const geo = new THREE.PlaneGeometry(planeW, planeH, w - 1, h - 1);
      const pos = geo.attributes.position as THREE.BufferAttribute;
      const uv = geo.attributes.uv as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        const v = uv.getY(i); // v: 1 (top) -> 0 (bottom)
        const u = uv.getX(i);
        const gx = Math.min(w - 1, Math.round(u * (w - 1)));
        const gy = Math.min(h - 1, Math.round((1 - v) * (h - 1)));
        pos.setZ(i, (data[gy * w + gx] / 255) * strength);
      }
      geo.computeVertexNormals();

      const texture = new THREE.Texture(img);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.85,
        metalness: 0.05,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, material);
      meshRef.current = {
        mesh,
        dispose: () => {
          geo.dispose();
          texture.dispose();
          material.dispose();
        },
      };

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      const renderW = container.clientWidth || 640;
      const renderH = 400;
      renderer.setSize(renderW, renderH);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);
      rendererRef.current = {
        dispose: () => renderer.dispose(),
        el: renderer.domElement,
      };

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0d0d12);
      scene.add(new THREE.AmbientLight(0xffffff, 0.75));
      const dir = new THREE.DirectionalLight(0xffffff, 1.8);
      dir.position.set(2, 3, 4);
      scene.add(dir);
      scene.add(mesh);

      const camera = new THREE.PerspectiveCamera(45, renderW / renderH, 0.01, 100);
      camera.position.set(1.6, 1.1, 2.2);
      camera.lookAt(0, 0, 0);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.target.set(0, 0, 0);

      const render = () => renderer.render(scene, camera);
      controls.addEventListener("change", render);
      render();

      setStep("done");
    } catch (e) {
      console.error(e);
      setError(t("errors.failed"));
      setStep("ready");
    } finally {
      setGenerating(false);
    }
  }, [img, size, strength, smooth, invert, t]);

  const exportGLB = useCallback(async () => {
    const cur = meshRef.current;
    if (!cur || !(cur.mesh as { isMesh?: boolean }).isMesh) return;
    try {
      const { GLTFExporter } = await import(
        "three/examples/jsm/exporters/GLTFExporter.js"
      );
      const exporter = new GLTFExporter();
      const gltf = (await exporter.parseAsync(cur.mesh as never, {
        binary: true,
      })) as ArrayBuffer;
      downloadBlob(new Blob([gltf], { type: "model/gltf-binary" }), "relief.glb");
    } catch (e) {
      console.error(e);
      setError(t("errors.failed"));
    }
  }, [t]);

  const exportSTL = useCallback(async () => {
    const cur = meshRef.current;
    if (!cur || !(cur.mesh as { isMesh?: boolean }).isMesh) return;
    try {
      const THREE = await import("three");
      const { STLExporter } = await import(
        "three/examples/jsm/exporters/STLExporter.js"
      );
      const geo = (cur.mesh as THREE.Mesh).geometry.clone();
      // Lay the relief flat (base on XZ, raised features pointing +Y) for slicers.
      geo.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
      const tmp = new THREE.Mesh(geo);
      const view = new STLExporter().parse(tmp, { binary: true });
      const buf =
        view instanceof DataView ? view.buffer : new TextEncoder().encode(view).buffer;
      downloadBlob(new Blob([buf], { type: "model/stl" }), "relief.stl");
    } catch (e) {
      console.error(e);
      setError(t("errors.failed"));
    }
  }, [t]);

  const reset = () => {
    meshRef.current?.dispose();
    rendererRef.current?.dispose();
    meshRef.current = null;
    rendererRef.current = null;
    if (containerRef.current) containerRef.current.innerHTML = "";
    if (imgUrl) URL.revokeObjectURL(imgUrl);
    setImg(null);
    setImgUrl("");
    setError("");
    setStep("upload");
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      category={t("category")}
      slug="image-to-relief"
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-5">
        {error && (
          <div className="rounded-lg border border-red-800 bg-red-900/30 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {step === "upload" && (
          <label className="block cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500">
            <div className="mb-4 text-4xl">🧊</div>
            <p className="font-medium text-zinc-300">{t("labels.dropPrompt")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("labels.dropHint")}</p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && loadImage(e.target.files[0])}
            />
          </label>
        )}

        {(step === "ready" || step === "done") && (
          <div className="space-y-4">
            {img && (
              <div className="flex items-center gap-3">
                <img
                  src={imgUrl}
                  alt="source"
                  className="h-16 w-16 rounded-lg border border-zinc-800 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-zinc-300">{t("labels.source")}</p>
                  <button
                    onClick={reset}
                    className={`${btn} mt-1 bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
                  >
                    {t("labels.newImage")}
                  </button>
                </div>
              </div>
            )}

            {/* Parameters */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  {t("labels.gridSize")} · {size}×{size}
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
                >
                  {[96, 144, 192, 256].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  {t("labels.strength")} · {strength.toFixed(1)}
                </label>
                <input
                  type="range"
                  min={0.5}
                  max={6}
                  step={0.1}
                  value={strength}
                  onChange={(e) => setStrength(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  {t("labels.smooth")} · {smooth}
                </label>
                <input
                  type="range"
                  min={0}
                  max={6}
                  step={1}
                  value={smooth}
                  onChange={(e) => setSmooth(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    checked={invert}
                    onChange={(e) => setInvert(e.target.checked)}
                    className="h-4 w-4 accent-blue-600"
                  />
                  {t("labels.invert")}
                </label>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={generate}
                disabled={generating}
                className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
              >
                {generating ? t("labels.generating") : t("labels.generate")}
              </button>
              {step === "done" && (
                <>
                  <button
                    onClick={exportGLB}
                    className={`${btn} bg-zinc-800 text-zinc-200 hover:bg-zinc-700`}
                  >
                    {t("labels.downloadGlb")}
                  </button>
                  <button
                    onClick={exportSTL}
                    className={`${btn} bg-zinc-800 text-zinc-200 hover:bg-zinc-700`}
                  >
                    {t("labels.downloadStl")}
                  </button>
                </>
              )}
            </div>

            <div
              ref={containerRef}
              className="h-[400px] w-full overflow-hidden rounded-xl border border-zinc-800 bg-[#0d0d12]"
            />
            {step === "done" && (
              <p className="mt-2 text-xs text-zinc-500">{t("labels.previewHint")}</p>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
