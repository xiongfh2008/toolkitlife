// 深挖：TED/Vimeo 正确端点、Dailymotion 有字幕样本、TikTok/抖音页面结构
const T = (ms) => AbortSignal.timeout(ms);
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

// 1. TED：看 transcript.json 返回的 HTML 是什么 + talk 页结构
console.log("===== TED deep =====");
try {
  const slug = "bill_gates_the_next_outbreak_we_re_not_ready";
  const res = await fetch(`https://www.ted.com/talks/${slug}/transcript.json?language=en`, {
    headers: { "User-Agent": UA, Accept: "application/json" }, redirect: "follow", signal: T(20000),
  });
  console.log("status:", res.status, "final url:", res.url);
  const text = await res.text();
  console.log("content head:", JSON.stringify(text.slice(0, 250)));
  if (!res.url.includes("transcript.json") || text.startsWith("<!DOCTYPE")) {
    // 拉 talk 页找 JSON 数据
    const p = await fetch(`https://www.ted.com/talks/${slug}`, { headers: { "User-Agent": UA }, signal: T(20000) });
    const html = await p.text();
    console.log("talk page:", p.status, "len:", html.length);
    for (const key of ["__NEXT_DATA__", "transcript", "paragraphs", "playerJson", "translationData"]) {
      console.log(`  contains "${key}":`, html.includes(key));
    }
    const nd = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
    if (nd) {
      const j = JSON.parse(nd[1]);
      const props = j?.props?.pageProps ?? {};
      console.log("pageProps keys:", Object.keys(props).slice(0, 20).join(","));
      const talk = props.talk ?? props.talkData ?? {};
      const tt = talk?.player_talks?.[0] ?? talk;
      console.log("translation keys:", tt?.translations ? tt.translations.slice(0, 2).map((t) => Object.keys(t).join("/")) : "none");
    }
  }
} catch (e) { console.log("ERR:", e.message); }

// 2. Vimeo：player 端点
console.log("\n===== Vimeo player config =====");
try {
  const res = await fetch("https://player.vimeo.com/video/76979871/config", {
    headers: { "User-Agent": UA, Referer: "https://vimeo.com/" }, signal: T(20000),
  });
  console.log("status:", res.status);
  const text = await res.text();
  if (text.startsWith("{")) {
    const j = JSON.parse(text);
    console.log("title:", j?.video?.title);
    console.log("text_tracks:", JSON.stringify(j?.request?.text_tracks)?.slice(0, 400));
  } else {
    console.log("non-json:", JSON.stringify(text.slice(0, 200)));
  }
} catch (e) { console.log("ERR:", e.message); }

// 3. Dailymotion：多找几个视频看有没有字幕（ASR 自动字幕）
console.log("\n===== Dailymotion sample subs =====");
try {
  const s = await (await fetch("https://api.dailymotion.com/videos?fields=id,title&sort=trending&limit=10", { signal: T(20000) })).json();
  for (const v of s.list ?? []) {
    const m = await (await fetch(`https://www.dailymotion.com/player/metadata/video/${v.id}`, { headers: { "User-Agent": UA }, signal: T(20000) })).json();
    const langs = m?.subtitles?.data ? Object.keys(m.subtitles.data) : [];
    console.log(`${v.id} subs=[${langs.join(",")}] "${v.title.slice(0, 40)}"`);
    if (langs.length > 0) {
      const arr = m.subtitles.data[langs[0]];
      const url = (arr.find((x) => x.content_type === "application/json") ?? arr[0]).url;
      const sr = await fetch(url, { headers: { "User-Agent": UA }, signal: T(20000) });
      const st = await sr.text();
      console.log(`  fetch(${langs[0]}):`, sr.status, JSON.stringify(st.slice(0, 250)));
      break;
    }
  }
} catch (e) { console.log("ERR:", e.message); }

// 4. TikTok：页面 HTML 里到底有什么
console.log("\n===== TikTok page content =====");
try {
  const res = await fetch("https://www.tiktok.com/@scout2015/video/6718335390845095173", { headers: { "User-Agent": UA }, signal: T(20000) });
  const html = await res.text();
  console.log("status:", res.status, "len:", html.length);
  console.log("head:", JSON.stringify(html.slice(0, 300)));
} catch (e) { console.log("ERR:", e.message); }

// 5. 抖音：iteminfo 原始内容
console.log("\n===== Douyin iteminfo raw =====");
try {
  const res = await fetch("https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=6918922846023888132", {
    headers: { "User-Agent": UA }, signal: T(20000),
  });
  const t = await res.text();
  console.log("status:", res.status, "len:", t.length, "head:", JSON.stringify(t.slice(0, 300)));
} catch (e) { console.log("ERR:", e.message); }

process.exit(0);
