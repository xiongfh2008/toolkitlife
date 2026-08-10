"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

const GRID_SIZE = 16;
const CELL_SIZE = 20;

function createEmptyGrid(): string[][] {
  return Array.from({ length: GRID_SIZE }, () => Array.from({ length: GRID_SIZE }, () => ""));
}

export default function PixelArtPage() {
  const t = useTranslations("tools.pixel-art");
  const [grid, setGrid] = useState<string[][]>(createEmptyGrid);
  const [color, setColor] = useState("#3b82f6");
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const paintCell = (row: number, col: number) => {
    setGrid((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = next[row][col] === color ? "" : color;
      return next;
    });
  };

  const clear = () => setGrid(createEmptyGrid());

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "pixel-art.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const downloadSvg = () => {
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${GRID_SIZE}" height="${GRID_SIZE}" shape-rendering="crispEdges">\n`;
    svg += `  <rect width="${GRID_SIZE}" height="${GRID_SIZE}" fill="#18181b"/>\n`;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const cell = grid[r][c];
        if (cell) {
          svg += `  <rect x="${c}" y="${r}" width="1" height="1" fill="${cell}"/>\n`;
        }
      }
    }
    svg += "</svg>";

    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pixel-art.svg";
    link.click();
    URL.revokeObjectURL(url);
  };

  const drawPreview = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = GRID_SIZE * CELL_SIZE;
    canvas.height = GRID_SIZE * CELL_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#18181b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const cell = grid[r][c];
        if (cell) {
          ctx.fillStyle = cell;
          ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      }
    }

    ctx.strokeStyle = "#27272a";
    ctx.beginPath();
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
    }
    ctx.stroke();
  };

  useEffect(() => {
    drawPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid]);

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="pixel-art"
    >
      <div className="max-w-4xl space-y-4">
        <div className="flex flex-wrap items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-8 w-8 cursor-pointer rounded border border-zinc-700 bg-transparent"
            />
            <span className="text-sm text-zinc-300">{t("labels.color")}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={clear}
              className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-600 transition-colors"
            >
              {t("buttons.clear")}
            </button>
            <button
              onClick={downloadPng}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
            >
              {t("buttons.downloadPng")}
            </button>
            <button
              onClick={downloadSvg}
              className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-600 transition-colors"
            >
              {t("buttons.downloadSvg")}
            </button>
          </div>
        </div>

        <div className="flex flex-col items-start gap-6 lg:flex-row">
          <div
            className="inline-grid rounded-lg border border-zinc-700 bg-zinc-950 p-1"
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
            onMouseLeave={() => setIsDrawing(false)}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => (
                <div
                  key={`${r}-${c}`}
                  onMouseDown={() => {
                    setIsDrawing(true);
                    paintCell(r, c);
                  }}
                  onMouseEnter={() => {
                    if (isDrawing) paintCell(r, c);
                  }}
                  onMouseUp={() => setIsDrawing(false)}
                  className="h-5 w-5 cursor-pointer border border-zinc-800/50"
                  style={{ backgroundColor: cell || "transparent" }}
                  title={`${r + 1}, ${c + 1}`}
                />
              ))
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">{t("labels.preview")}</label>
            <canvas
              ref={canvasRef}
              className="rounded-lg border border-zinc-800"
              style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
