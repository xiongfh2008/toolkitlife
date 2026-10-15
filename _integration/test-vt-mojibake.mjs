// 诊断 video-transcript 字幕乱码：查看库的原始返回 vs 各修复环节输出
const { YouTubeTranscriptApi } = await import("youtube-transcript-api-js");

const api = new YouTubeTranscriptApi();
const transcript = await api.fetch("dQw4w9WgXcQ", ["en"]);
const snippets = transcript.snippets;
console.log("total snippets:", snippets.length);

// 找包含疑似乱码的片段
for (const s of snippets.slice(0, 6)) {
  const text = String(s.text ?? "");
  const codes = [...text].map((c) => c.codePointAt(0).toString(16)).join(" ");
  console.log(JSON.stringify(text), "| codepoints:", codes);
}

// 模拟 route.ts 的 cleanText 链路
function decodeEntities(str) {
  return str
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}
function fixMisdecodedUtf8(str) {
  if (str.length === 0) return str;
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 0xff) return str;
    bytes[i] = str.charCodeAt(i) & 0xff;
  }
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return str;
  }
}
console.log("\n--- after cleanText chain ---");
for (const s of snippets.slice(0, 6)) {
  const raw = String(s.text ?? "");
  const cleaned = fixMisdecodedUtf8(decodeEntities(raw)).replace(/<[^>]+>/g, "").trim();
  console.log(JSON.stringify(cleaned));
}
process.exit(0);
