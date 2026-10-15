// 精确探测 Dailymotion subtitles.data 结构 + TED transcriptData 结构
const T = (ms) => AbortSignal.timeout(ms);
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

console.log("===== Dailymotion structure =====");
try {
  const m = await (await fetch("https://www.dailymotion.com/player/metadata/video/xbkhtby", { headers: { "User-Agent": UA }, signal: T(20000) })).json();
  const data = m.subtitles?.data;
  console.log("data keys:", Object.keys(data));
  const zh = data["zh-auto"];
  console.log("zh-auto type:", Array.isArray(zh) ? "array" : typeof zh);
  console.log("zh-auto:", JSON.stringify(zh).slice(0, 500));
  // 取一个字幕 URL 拉取内容
  const entries = Array.isArray(zh) ? zh : Object.values(zh);
  const pick = entries.find?.((x) => x.content_type === "application/json") ?? entries[0];
  console.log("pick:", JSON.stringify(pick).slice(0, 200));
  const sr = await fetch(pick.url, { headers: { "User-Agent": UA }, signal: T(20000) });
  const st = await sr.text();
  console.log("subtitle fetch:", sr.status, "head:", JSON.stringify(st.slice(0, 400)));
  console.log("video fields:", JSON.stringify({ title: m.title, owner: m.owner?.name ?? m.owner }));
} catch (e) { console.log("ERR:", e.message); }

console.log("\n===== TED transcriptData structure =====");
try {
  const slug = "bill_gates_the_next_outbreak_we_re_not_ready";
  const html = await (await fetch(`https://www.ted.com/talks/${slug}`, { headers: { "User-Agent": UA }, signal: T(20000) })).text();
  const nd = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  const props = JSON.parse(nd[1])?.props?.pageProps;
  const td = props.transcriptData;
  console.log("transcriptData keys:", td ? Object.keys(td) : "null");
  const tr = td?.translation ?? td?.translations;
  console.log("translation keys:", tr ? Object.keys(tr) : "none");
  console.log("lang:", tr?.language_code ?? tr?.languageCode);
  const paras = tr?.paragraphs ?? [];
  console.log("paragraphs:", paras.length);
  if (paras[0]) {
    console.log("para[0] keys:", Object.keys(paras[0]));
    const cues = paras[0].cues ?? paras[0].cue ?? [];
    console.log("cues[0..2]:", JSON.stringify(cues.slice(0, 3)));
  }
  console.log("videoData.title:", props.videoData?.title ?? props.videoData?.name);
  console.log("videoData keys:", Object.keys(props.videoData ?? {}).slice(0, 15).join(","));
  const speakers = props.videoData?.speakers;
  console.log("speakers:", JSON.stringify(speakers?.map?.((s) => s.name)) ?? "none");
} catch (e) { console.log("ERR:", e.message); }

// Vimeo vtt 直接拉取验证
console.log("\n===== Vimeo vtt fetch =====");
try {
  const cfg = await (await fetch("https://player.vimeo.com/video/76979871/config", { headers: { "User-Agent": UA, Referer: "https://vimeo.com/" }, signal: T(20000) })).json();
  const tracks = cfg.request.text_tracks;
  const de = tracks.find((t) => t.lang === "de");
  const sr = await fetch(de.url, { headers: { "User-Agent": UA, Referer: "https://player.vimeo.com/" }, signal: T(20000) });
  const st = await sr.text();
  console.log("vtt fetch:", sr.status, "head:", JSON.stringify(st.slice(0, 300)));
  console.log("video meta:", JSON.stringify({ title: cfg.video.title, owner: cfg.video.owner?.name ?? cfg.video.owner }));
} catch (e) { console.log("ERR:", e.message); }

process.exit(0);
