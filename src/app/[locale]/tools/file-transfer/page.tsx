"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import QRCode from "qrcode";
import type { MessageAction, Room } from "trystero";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

// 6-char room code alphabet (no ambiguous 0/O/1/I/L)
const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LEN = 6;
const APP_ID = "toolkitlife-file-transfer";

type FileMeta = {
  id?: string;
  name?: string;
  size?: number;
  type?: string;
};

type TransferItem = {
  id: string;
  name: string;
  size: number;
  direction: "out" | "in";
  progress: number;
  status: "transferring" | "done" | "error";
  url?: string;
};

type QueueEntry = { file: File; item: TransferItem };

function genCode() {
  const bytes = new Uint8Array(CODE_LEN);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => CODE_CHARS[b % CODE_CHARS.length]).join("");
}

function genId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function fmtSize(n: number) {
  if (!Number.isFinite(n) || n <= 0) return "0 B";
  if (n < 1024) return `${n} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let v = n;
  let i = -1;
  do {
    v /= 1024;
    i++;
  } while (v >= 1024 && i < units.length - 1);
  return `${v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2)} ${units[i]}`;
}

function triggerDownload(url: string, name: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function FileTransferPage() {
  const t = useTranslations("tools.file-transfer");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [status, setStatus] = useState<"idle" | "connecting" | "connected">("idle");
  const [code, setCode] = useState("");
  const [joinInput, setJoinInput] = useState("");
  const [peerCount, setPeerCount] = useState(0);
  const [transfers, setTransfers] = useState<TransferItem[]>([]);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorKey, setErrorKey] = useState<"joinFailed" | null>(null);

  const roomRef = useRef<Room | null>(null);
  const actionRef = useRef<MessageAction<File> | null>(null);
  const queueRef = useRef<QueueEntry[]>([]);
  const sendingRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Create or update an incoming transfer entry (progress events can arrive
  // before the first data message, so entries are upserted by metadata id).
  const upsertIncoming = useCallback(
    (meta: FileMeta, patch: Partial<TransferItem>) => {
      setTransfers((prev) => {
        if (!meta.id) return prev;
        if (!prev.some((tr) => tr.id === meta.id)) {
          return [
            {
              id: meta.id,
              name: meta.name ?? "file",
              size: meta.size ?? 0,
              direction: "in" as const,
              progress: 0,
              status: "transferring" as const,
              ...patch,
            },
            ...prev,
          ];
        }
        return prev.map((tr) => (tr.id === meta.id ? { ...tr, ...patch } : tr));
      });
    },
    []
  );

  const startRoom = useCallback(
    async (roomCode: string) => {
      // Leave any previous room first (also guards React StrictMode double-mount)
      const prevRoom = roomRef.current;
      roomRef.current = null;
      actionRef.current = null;
      queueRef.current = [];
      sendingRef.current = false;
      if (prevRoom) {
        try {
          await prevRoom.leave();
        } catch {
          /* ignore */
        }
      }
      setTransfers((prev) => {
        prev.forEach((tr) => tr.url && URL.revokeObjectURL(tr.url));
        return [];
      });
      setPeerCount(0);
      setErrorKey(null);
      setStatus("connecting");
      setCode(roomCode);
      try {
        const { joinRoom } = await import("trystero");
        const room = joinRoom({ appId: APP_ID }, `tft-${roomCode}`);
        roomRef.current = room;

        const action = room.makeAction<File>("file");
        actionRef.current = action;

        // Binary payloads arrive as ArrayBuffers; both they and Blobs are
        // valid BlobParts so no branching is needed.
        action.onMessage = (data, { metadata }) => {
          const meta = (metadata ?? {}) as FileMeta;
          if (!meta.id) return;
          const blob = new Blob([data as BlobPart], {
            type: meta.type || "application/octet-stream",
          });
          const url = URL.createObjectURL(blob);
          upsertIncoming(meta, { progress: 1, status: "done", url });
          triggerDownload(url, meta.name ?? "file");
        };

        action.onReceiveProgress = (progress, { metadata }) => {
          const meta = (metadata ?? {}) as FileMeta;
          if (!meta.id) return;
          upsertIncoming(meta, { progress });
        };

        const syncPeers = () => setPeerCount(Object.keys(room.getPeers()).length);
        room.onPeerJoin = syncPeers;
        room.onPeerLeave = syncPeers;

        window.history.replaceState(null, "", `#${roomCode}`);
        setStatus("connected");
      } catch {
        setErrorKey("joinFailed");
        setStatus("idle");
        setCode("");
      }
    },
    [upsertIncoming]
  );

  const leaveRoom = useCallback(async () => {
    queueRef.current = [];
    sendingRef.current = false;
    const room = roomRef.current;
    roomRef.current = null;
    actionRef.current = null;
    if (room) {
      try {
        await room.leave();
      } catch {
        /* ignore */
      }
    }
    setTransfers((prev) => {
      prev.forEach((tr) => tr.url && URL.revokeObjectURL(tr.url));
      return [];
    });
    setPeerCount(0);
    setStatus("idle");
    setCode("");
    setQrDataUrl("");
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  // Auto-join when arriving via a shared link or QR code (#ABC123).
  // Deferred to a timeout so state updates don't run synchronously in the effect.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const m = window.location.hash.match(/^#([A-Z2-9]{6})$/i);
      if (m) void startRoom(m[1].toUpperCase());
    }, 0);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Leave the room when navigating away
  useEffect(() => {
    return () => {
      void roomRef.current?.leave().catch(() => {});
    };
  }, []);

  // QR code for the share link
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (status !== "connected" || !code) {
        if (!cancelled) setQrDataUrl("");
        return;
      }
      const url = `${window.location.origin}${window.location.pathname}#${code}`;
      try {
        const dataUrl = await QRCode.toDataURL(url, {
          width: 256,
          margin: 1,
          errorCorrectionLevel: "M",
        });
        if (!cancelled) setQrDataUrl(dataUrl);
      } catch {
        if (!cancelled) setQrDataUrl("");
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [status, code]);

  const processQueue = useCallback(async () => {
    if (sendingRef.current) return;
    sendingRef.current = true;
    for (;;) {
      const entry = queueRef.current.shift();
      if (!entry || !actionRef.current) break;
      const { file, item } = entry;
      const patch = (p: Partial<TransferItem>) =>
        setTransfers((prev) =>
          prev.map((tr) => (tr.id === item.id ? { ...tr, ...p } : tr))
        );
      try {
        await actionRef.current.send(file, {
          metadata: {
            id: item.id,
            name: file.name,
            size: file.size,
            type: file.type || "application/octet-stream",
          },
          onProgress: (progress: number) => patch({ progress }),
        });
        patch({ progress: 1, status: "done" });
      } catch {
        patch({ status: "error" });
      }
    }
    sendingRef.current = false;
  }, []);

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const arr = Array.from(files);
      if (!arr.length) return;
      const entries: QueueEntry[] = arr.map((file) => ({
        file,
        item: {
          id: genId(),
          name: file.name,
          size: file.size,
          direction: "out" as const,
          progress: 0,
          status: "transferring" as const,
        },
      }));
      setTransfers((prev) => [...entries.map((e) => e.item), ...prev]);
      queueRef.current.push(...entries);
      void processQueue();
    },
    [processQueue]
  );

  const createRoom = () => void startRoom(genCode());

  const joinRoomFromInput = () => {
    const c = joinInput.trim().toUpperCase();
    if (c.length === CODE_LEN) void startRoom(c);
  };

  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${code}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (peerCount > 0) handleFiles(e.dataTransfer.files);
  };

  const secondaryBtn =
    "rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-200 transition-colors";

  return (
    <ToolLayout
      title={t("title")}
      slug="file-transfer"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      {status === "idle" ? (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="mb-1 text-base font-medium text-zinc-100">
                {t("labels.createTitle")}
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-zinc-400">
                {t("labels.createDesc")}
              </p>
              <button
                onClick={createRoom}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500"
              >
                {t("labels.createRoom")}
              </button>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="mb-1 text-base font-medium text-zinc-100">
                {t("labels.joinTitle")}
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-zinc-400">
                {t("labels.joinDesc")}
              </p>
              <div className="flex gap-2">
                <input
                  value={joinInput}
                  onChange={(e) =>
                    setJoinInput(
                      e.target.value
                        .toUpperCase()
                        .replace(new RegExp(`[^${CODE_CHARS}]`, "g"), "")
                    )
                  }
                  onKeyDown={(e) => e.key === "Enter" && joinRoomFromInput()}
                  maxLength={CODE_LEN}
                  placeholder={t("labels.joinPlaceholder")}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 font-mono text-sm uppercase tracking-widest text-zinc-100 focus:border-blue-500 focus:outline-none"
                  spellCheck={false}
                  autoComplete="off"
                />
                <button
                  onClick={joinRoomFromInput}
                  disabled={joinInput.length !== CODE_LEN}
                  className="shrink-0 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
                >
                  {t("labels.joinRoom")}
                </button>
              </div>
            </div>
          </div>
          {errorKey && (
            <p className="text-sm text-red-400">{t(`errors.${errorKey}`)}</p>
          )}
          <p className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-4 text-xs leading-relaxed text-zinc-500">
            {t("labels.privacyNote")}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Room panel */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div className="min-w-0">
                <p className="mb-1 text-xs font-medium uppercase tracking-widest text-zinc-500">
                  {t("labels.roomCode")}
                </p>
                <p className="font-mono text-3xl font-semibold tracking-[0.25em] text-zinc-100">
                  {code}
                </p>
                <p
                  className={`mt-3 text-sm ${peerCount > 0 ? "text-green-500" : "text-zinc-400"}`}
                >
                  {peerCount > 0
                    ? t("peerStatus.connected", { count: peerCount })
                    : t("peerStatus.waiting")}
                </p>
              </div>
              {qrDataUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrDataUrl}
                  alt={t("labels.roomCode")}
                  className="h-28 w-28 shrink-0 rounded-lg border border-zinc-700 bg-white p-1.5"
                />
              )}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={copyLink}
                className={`${secondaryBtn} hover:border-blue-500/50 hover:text-blue-400`}
              >
                {copied ? t("labels.copied") : t("labels.copyLink")}
              </button>
              <button
                onClick={() => void leaveRoom()}
                className={`${secondaryBtn} hover:border-red-500/50 hover:text-red-400`}
              >
                {t("labels.leaveRoom")}
              </button>
            </div>
          </div>

          {errorKey && (
            <p className="text-sm text-red-400">{t(`errors.${errorKey}`)}</p>
          )}

          {/* Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              if (peerCount > 0) setDragActive(true);
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              if (peerCount > 0) setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={onDrop}
            onClick={() => {
              if (peerCount > 0) fileInputRef.current?.click();
            }}
            className={`rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
              peerCount === 0
                ? "cursor-not-allowed border-zinc-800 opacity-50"
                : dragActive
                  ? "cursor-pointer border-blue-500 bg-blue-950/30"
                  : "cursor-pointer border-zinc-700 bg-zinc-900/50 hover:border-blue-500/60"
            }`}
          >
            <p className="text-sm font-medium text-zinc-200">
              {peerCount === 0 ? t("peerStatus.waiting") : t("labels.dropHere")}
            </p>
            {peerCount > 0 && (
              <p className="mt-1 text-xs text-zinc-500">{t("labels.selectFiles")}</p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              hidden
              onChange={(e) => {
                if (e.target.files) handleFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          {/* Transfer list */}
          {transfers.length > 0 && (
            <div className="space-y-3">
              {transfers.map((tr) => (
                <div
                  key={tr.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span
                        className={`shrink-0 text-sm font-bold ${
                          tr.direction === "out" ? "text-blue-400" : "text-green-400"
                        }`}
                      >
                        {tr.direction === "out" ? "↑" : "↓"}
                      </span>
                      <span className="truncate text-sm text-zinc-200">{tr.name}</span>
                      <span className="shrink-0 text-xs text-zinc-500">
                        {fmtSize(tr.size)}
                      </span>
                    </div>
                    <div className="shrink-0 text-xs">
                      {tr.status === "done" && tr.url && (
                        <button
                          onClick={() => triggerDownload(tr.url!, tr.name)}
                          className="rounded-md border border-zinc-700 px-2.5 py-1 text-zinc-300 transition-colors hover:border-blue-500/50 hover:text-blue-400"
                        >
                          {t("transfer.save")}
                        </button>
                      )}
                      {tr.status === "done" && !tr.url && (
                        <span className="text-green-500">✓ {t("transfer.done")}</span>
                      )}
                      {tr.status === "error" && (
                        <span className="text-red-400">{t("transfer.failed")}</span>
                      )}
                      {tr.status === "transferring" && (
                        <span className="text-zinc-400">
                          {Math.round(tr.progress * 100)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className={`h-full rounded-full transition-all duration-200 ${
                        tr.status === "error"
                          ? "bg-red-500"
                          : tr.status === "done"
                            ? "bg-green-500"
                            : "bg-blue-500"
                      }`}
                      style={{ width: `${Math.max(2, Math.round(tr.progress * 100))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
