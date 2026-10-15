// 测试 video-transcript API：验证 UTF-8 输出 + B 站多个热门视频的字幕可用率
const base = "http://localhost:3000/api/video-transcript?url=";

// 热门/知名视频 BV 号样本
const vids = [
  "BV1GJ411x7h7", // 【官方 MV】Never Gonna Give You Up (已知无字幕)
  "BV1fx411N7bU", // 【Official MV】勾指起誓
  "BV1uv411q7Mv", // 【官方MV】四秒之约
  "BV1bW411N7tb", // 极乐净土
];

for (const bv of vids) {
  try {
    const res = await fetch(base + bv, { signal: AbortSignal.timeout(30000) });
    const json = await res.json();
    if (json.segments) {
      const first = json.segments.slice(0, 2).map((s) => s.text).join(" | ");
      console.log(`OK   ${bv} lang=${json.language} segs=${json.segments.length} "${first}"`);
    } else {
      console.log(`FAIL ${bv} http=${res.status} error=${json.error}`);
    }
  } catch (e) {
    console.log(`ERR  ${bv} ${e.message}`);
  }
}

// 同时验证 YouTube 响应的 UTF-8 正确性
try {
  const res = await fetch(base + "dQw4w9WgXcQ", { signal: AbortSignal.timeout(30000) });
  const json = await res.json();
  console.log(`\nYT OK segs=${json.segments.length} first="${json.segments[0]?.text}"`);
} catch (e) {
  console.log(`YT ERR ${e.message}`);
}
process.exit(0);
