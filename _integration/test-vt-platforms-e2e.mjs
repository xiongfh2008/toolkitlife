// video-transcript 五平台 e2e 测试
const base = "http://localhost:3000/api/video-transcript?url=";
const cases = [
  ["YouTube", encodeURIComponent("https://www.youtube.com/watch?v=dQw4w9WgXcQ")],
  ["Vimeo", encodeURIComponent("https://vimeo.com/76979871")],
  ["Dailymotion", encodeURIComponent("https://www.dailymotion.com/video/xbkhtby")],
  ["TED", encodeURIComponent("https://www.ted.com/talks/bill_gates_the_next_outbreak_we_re_not_ready")],
  ["Bilibili(no_sub预期422)", encodeURIComponent("https://www.bilibili.com/video/BV1GJ411x7h7")],
  ["不支持的平台", encodeURIComponent("https://v.qq.com/x/cover/xxx")],
];

for (const [name, u] of cases) {
  try {
    const res = await fetch(base + u, { signal: AbortSignal.timeout(45000) });
    const json = await res.json();
    if (json.segments) {
      const first = json.segments.slice(0, 2).map((s) => s.text).join(" | ");
      console.log(`OK   ${name}: ${json.platform} segs=${json.segments.length} lang=${json.language} title="${String(json.title).slice(0, 40)}"`);
      console.log(`     first: "${first.slice(0, 90)}"`);
    } else {
      console.log(`FAIL ${name}: http=${res.status} error=${json.error}`);
    }
  } catch (e) {
    console.log(`ERR  ${name}: ${e.message}`);
  }
}
process.exit(0);
