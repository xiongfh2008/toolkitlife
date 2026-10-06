import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BILI_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const TIMEOUT_MS = 12000;

// Bilibili WBI 签名：公开算法（nav 接口取 img_key/sub_key → mixin_key → w_rid）
const MIXIN_KEY_ENC_TAB = [
  46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
  33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
  61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
  36, 20, 34, 44, 52,
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = any;

/** HTML/XML 实体解码（YouTube 字幕文本中常见） */
function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h: string) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

/**
 * 修复 UTF-8 字节流被误按 latin-1 解码导致的乱码（如 "♪" → "âª"）。
 * 仅当整段文本的字节流是合法 UTF-8 时才重解码，避免破坏真实 latin-1 文本。
 */
function fixMisdecodedUtf8(s: string): string {
  if (s.length === 0) return s;
  const bytes = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) {
    if (s.charCodeAt(i) > 0xff) return s; // 已含正确多字节字符，无需修复
    bytes[i] = s.charCodeAt(i) & 0xff;
  }
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return s; // 不是合法 UTF-8 流，保持原样
  }
}

/** 清洗字幕文本：实体解码 + 编码修复 + 去标签 */
function cleanText(raw: string): string {
  return fixMisdecodedUtf8(decodeEntities(raw)).replace(/<[^>]+>/g, "").trim();
}

function getMixinKey(orig: string): string {
  return MIXIN_KEY_ENC_TAB.map((n) => orig[n]).join("").slice(0, 32);
}

async function getWbiKeys(): Promise<{ imgKey: string; subKey: string }> {
  const res = await fetch("https://api.bilibili.com/x/web-interface/nav", {
    headers: { "User-Agent": BILI_UA, Referer: "https://www.bilibili.com/" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const json: Json = await res.json();
  const imgUrl: string = json?.data?.wbi_img?.img_url ?? "";
  const subUrl: string = json?.data?.wbi_img?.sub_url ?? "";
  if (!imgUrl || !subUrl) throw new Error("bili_nav_failed");
  const imgKey = imgUrl.split("/").pop()!.split(".")[0]!;
  const subKey = subUrl.split("/").pop()!.split(".")[0]!;
  return { imgKey, subKey };
}

function encWbi(
  params: Record<string, string>,
  imgKey: string,
  subKey: string
): URLSearchParams {
  const mixinKey = getMixinKey(imgKey + subKey);
  const wts = Math.round(Date.now() / 1000);
  const merged: Record<string, string> = { ...params, wts: String(wts) };
  const sorted = Object.keys(merged)
    .sort()
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(merged[k])}`)
    .join("&");
  const wRid = crypto.createHash("md5").update(sorted + mixinKey).digest("hex");
  return new URLSearchParams({ ...merged, w_rid: wRid });
}

async function fetchJson(url: string, cookie = ""): Promise<Json> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": BILI_UA,
      Referer: "https://www.bilibili.com/",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  return res.json();
}

function extractBvid(input: string): string | null {
  const m = input.match(/BV[a-zA-Z0-9]{10}/);
  return m ? m[0] : null;
}

function extractYoutubeId(input: string): string | null {
  const patterns = [
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
    /^([A-Za-z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = input.match(p);
    if (m) return m[1];
  }
  return null;
}

/** 展开 b23.tv 短链，返回真实 URL */
async function resolveRedirect(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return res.url || url;
  } catch {
    return url;
  }
}

async function fetchBilibiliTranscript(bvid: string, cookie = "") {
  const view = await fetchJson(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`, cookie);
  if (view.code !== 0 || !view.data) throw new Error("bili_view_failed");
  const { cid, title } = view.data;
  const ownerName: string = view.data?.owner?.name ?? "";

  const { imgKey, subKey } = await getWbiKeys();
  const signed = encWbi({ bvid, cid: String(cid) }, imgKey, subKey);
  const player = await fetchJson(`https://api.bilibili.com/x/player/wbi/v2?${signed.toString()}`, cookie);
  const subs: Json[] = player?.data?.subtitle?.subtitles ?? [];
  const sub = subs.find((s: Json) => s.subtitle_url);
  if (!sub) throw new Error("bili_no_subtitle");

  let subUrl: string = sub.subtitle_url;
  if (subUrl.startsWith("//")) subUrl = "https:" + subUrl;
  else if (subUrl.startsWith("http://")) subUrl = "https://" + subUrl.slice(7);

  const subJson = await fetchJson(subUrl, cookie);
  const body: Json[] = subJson?.body ?? [];
  const segments = body
    .map((b: Json) => ({
      start: Math.round(b.from ?? 0),
      text: cleanText(b.content ?? ""),
    }))
    .filter((s: Json) => s.text.length > 0);

  return {
    platform: "bilibili",
    title: title ?? "",
    author: ownerName,
    language: sub.lan_doc ?? "",
    segments,
  };
}

/** 把浏览器复制的原始 Cookie 字符串解析为 name/value 对 */
function parseRawCookieHeader(raw: string): { name: string; value: string }[] {
  const cleaned = raw.trim().replace(/^cookie:\s*/i, "");
  return cleaned
    .split(";")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const eq = p.indexOf("=");
      if (eq <= 0) return null;
      return { name: p.slice(0, eq).trim(), value: p.slice(eq + 1).trim() };
    })
    .filter((c): c is { name: string; value: string } => c !== null);
}

/** 把原始 Cookie 写成库可读取的临时 JSON cookie 文件，返回路径 */
function writeTempCookieFile(raw: string): string | null {
  const pairs = parseRawCookieHeader(raw);
  if (pairs.length === 0) return null;
  const jar = pairs.map((p) => ({
    name: p.name,
    value: p.value,
    domain: ".youtube.com",
    path: "/",
    secure: true,
    expiry: Math.floor(Date.now() / 1000) + 3600,
  }));
  const file = path.join(os.tmpdir(), `yt-cookie-${crypto.randomUUID()}.json`);
  fs.writeFileSync(file, JSON.stringify(jar), "utf-8");
  return file;
}

/**
 * innertube ANDROID 客户端兜底：网页端触发人机验证时，
 * Android 客户端通道通常仍可直接拿到字幕（无需 Cookie）。
 */
async function fetchYoutubeInnertube(videoId: string) {
  const res = await fetch(
    "https://www.youtube.com/youtubei/v1/player?key=AIzaSyA8eiZmM1FaDVjRy-df2KTyQ_vz_yYM39w",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "com.google.android.youtube/20.10.38 (Linux; U; Android 14) gzip",
        "X-YouTube-Client-Name": "3",
        "X-YouTube-Client-Version": "20.10.38",
      },
      body: JSON.stringify({
        context: {
          client: {
            clientName: "ANDROID",
            clientVersion: "20.10.38",
            androidSdkVersion: 34,
            hl: "en",
            gl: "US",
          },
        },
        videoId,
        contentCheckOk: true,
        racyCheckOk: true,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    }
  );
  const json: Json = await res.json();
  const status: string = json?.playabilityStatus?.status ?? "";
  if (status !== "OK") {
    const reason: string = json?.playabilityStatus?.reason ?? "innertube_unplayable";
    throw new Error(/sign in|not a bot|confirm/i.test(reason) ? "yt_bot_check" : reason);
  }

  const tracks: Json[] = json?.captions?.playerCaptionsTracklistRenderer?.captionTracks ?? [];
  const pref = ["zh-Hans", "zh", "en", "ja", "ko"];
  let track: Json | undefined;
  for (const lang of pref) {
    track =
      tracks.find((t) => (t.languageCode ?? "").startsWith(lang) && t.kind !== "asr") ??
      tracks.find((t) => (t.languageCode ?? "").startsWith(lang));
    if (track) break;
  }
  track ??= tracks[0];
  if (!track?.baseUrl) throw new Error("no_subtitle");

  const capRes = await fetch(`${track.baseUrl}&fmt=json3`, {
    headers: { "User-Agent": "com.google.android.youtube/20.10.38 (Linux; U; Android 14) gzip" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const capJson: Json = await capRes.json();
  const segments = (capJson?.events ?? [])
    .filter((ev: Json) => Array.isArray(ev.segs))
    .map((ev: Json) => ({
      start: Math.round((ev.tStartMs ?? 0) / 1000),
      text: cleanText((ev.segs ?? []).map((s: Json) => s.utf8 ?? "").join("")),
    }))
    .filter((s: Json) => s.text.length > 0);
  if (segments.length === 0) throw new Error("no_subtitle");

  return {
    segments,
    title: json?.videoDetails?.title ?? "",
    author: json?.videoDetails?.author ?? "",
    languageCode: track.languageCode ?? "",
  };
}

async function fetchYoutubeTranscript(videoId: string, cookie = "") {
  const { YouTubeTranscriptApi } = await import("youtube-transcript-api-js");
  const cookiePath = cookie ? writeTempCookieFile(cookie) : null;
  try {
    try {
      const api = new YouTubeTranscriptApi(undefined, undefined, cookiePath ? { cookiePath } : undefined);
      const transcript = await api.fetch(videoId, ["zh-Hans", "zh", "en", "ja", "ko"]);
      const segments = transcript.snippets.map((s: Json) => ({
        start: Math.round(s.start ?? 0),
        text: cleanText(String(s.text ?? "")),
      }));

      // 标题/作者优先用 innertube metadata，缺失时回退 oembed
      let title = transcript.metadata?.title ?? "";
      let author = "";
      if (!title) {
        try {
          const res = await fetch(
            `https://www.youtube.com/oembed?url=${encodeURIComponent(
              `https://www.youtube.com/watch?v=${videoId}`
            )}&format=json`,
            { signal: AbortSignal.timeout(TIMEOUT_MS) }
          );
          const meta: Json = await res.json();
          title = meta?.title ?? "";
          author = meta?.author_name ?? "";
        } catch {
          title = "";
        }
      }

      return {
        platform: "youtube",
        title,
        author: transcript.metadata?.author ?? author,
        language: transcript.languageCode ?? "",
        segments,
      };
    } catch (libErr) {
      // watch 网页端被人机验证/限流时，换 innertube ANDROID 通道重试（无需 Cookie）
      const fb = await fetchYoutubeInnertube(videoId).catch(() => null);
      if (fb && fb.segments.length > 0) {
        return {
          platform: "youtube",
          title: fb.title,
          author: fb.author,
          language: fb.languageCode,
          segments: fb.segments,
        };
      }
      throw libErr;
    }
  } finally {
    if (cookiePath) {
      try {
        fs.unlinkSync(cookiePath);
      } catch {
        // 清理失败不影响主流程
      }
    }
  }
}

export async function GET(req: NextRequest) {
  const input = req.nextUrl.searchParams.get("url")?.trim() ?? "";
  const cookie = req.nextUrl.searchParams.get("cookie")?.trim() ?? "";
  if (!input) {
    return NextResponse.json({ error: "invalid_url" }, { status: 400 });
  }

  try {
    let url = input;
    // 解析输入（短链/BV 号/完整链接）
    if (/^BV[a-zA-Z0-9]{10}$/.test(url)) {
      return NextResponse.json(await fetchBilibiliTranscript(url, cookie));
    }
    if (/^[A-Za-z0-9_-]{11}$/.test(url)) {
      return NextResponse.json(await fetchYoutubeTranscript(url, cookie));
    }
    if (url.includes("b23.tv")) url = await resolveRedirect(url);

    if (url.includes("bilibili.com")) {
      const bvid = extractBvid(url);
      if (!bvid) return NextResponse.json({ error: "unsupported_url" }, { status: 400 });
      return NextResponse.json(await fetchBilibiliTranscript(bvid, cookie));
    }

    const ytId = extractYoutubeId(url);
    if (ytId) {
      return NextResponse.json(await fetchYoutubeTranscript(ytId, cookie));
    }

    return NextResponse.json({ error: "unsupported_url" }, { status: 400 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "failed";
    // YouTube 错误分类：给前端可映射的稳定错误码
    try {
      const yt = await import("youtube-transcript-api-js");
      if (e instanceof yt.TranscriptsDisabled || e instanceof yt.NoTranscriptFound) {
        return NextResponse.json({ error: "no_subtitle" }, { status: 422 });
      }
      if (
        e instanceof yt.RequestBlocked ||
        e instanceof yt.RateLimitExceeded ||
        e instanceof yt.PoTokenRequired ||
        (e instanceof yt.VideoUnplayable && /sign in|not a bot|confirm/i.test((e as Json).reason ?? ""))
      ) {
        return NextResponse.json({ error: "yt_bot_check" }, { status: 429 });
      }
      if (
        e instanceof yt.VideoUnavailable ||
        e instanceof yt.AgeRestricted ||
        e instanceof yt.VideoUnplayable ||
        e instanceof yt.InvalidVideoId
      ) {
        return NextResponse.json({ error: "bili_view_failed" }, { status: 422 });
      }
    } catch {
      // 分类失败则走原始错误
    }
    const status = message === "bili_no_subtitle" || message === "no_subtitle" ? 422 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
