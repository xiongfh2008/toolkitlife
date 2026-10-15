// 探测各视频平台字幕的匿名可获取性（决定 video-transcript 可扩展哪些平台）
const T = (ms) => AbortSignal.timeout(ms);
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

async function probe(name, fn) {
  try {
    console.log(`\n===== ${name} =====`);
    await fn();
  } catch (e) {
    console.log(`ERR: ${e.message || e.cause?.code || e}`);
  }
}

// 1. TED：transcript.json 老接口 + talk 页面 __NEXT_DATA__
await probe("TED", async () => {
  const slug = "ken_robinson_says_schools_kill_creativity";
  let res = await fetch(`https://www.ted.com/talks/${slug}/transcript.json?language=en`, {
    headers: { "User-Agent": UA }, signal: T(15000),
  });
  console.log("transcript.json:", res.status);
  if (res.ok) {
    const j = await res.json();
    const paras = j?.transcripts?.en?.paragraphs?.length ?? 0;
    console.log("paragraphs:", paras, paras ? JSON.stringify(j.transcripts.en.paragraphs[0]).slice(0, 150) : "");
  }
  if (!res.ok) {
    res = await fetch(`https://www.ted.com/talks/${slug}`, { headers: { "User-Agent": UA }, signal: T(15000) });
    console.log("talk page:", res.status);
    if (res.ok) {
      const html = await res.text();
      const m = html.match(/"transcripts?Url"\s*:\s*"([^"]+)"/i) || html.match(/nextJson[\s\S]{0,50}transcript/i);
      console.log("has transcriptsUrl in page:", !!m, m?.[1] ?? "");
      console.log("has __NEXT_DATA__:", html.includes("__NEXT_DATA__"));
    }
  }
});

// 2. Vimeo：/config 的 text_tracks
await probe("Vimeo", async () => {
  const res = await fetch("https://vimeo.com/76979871/config", { headers: { "User-Agent": UA }, signal: T(15000) });
  console.log("config:", res.status);
  if (res.ok) {
    const j = await res.json();
    console.log("title:", j?.video?.title);
    console.log("text_tracks:", JSON.stringify(j?.request?.text_tracks)?.slice(0, 300));
  }
});

// 3. Dailymotion：metadata 接口的 subtitles
await probe("Dailymotion", async () => {
  const search = await (await fetch("https://api.dailymotion.com/videos?search=news&limit=3&fields=id,title", { signal: T(15000) })).json();
  console.log("search:", JSON.stringify(search?.list?.map((v) => ({ id: v.id, t: v.title.slice(0, 30) }))));
  const id = search?.list?.[0]?.id;
  if (id) {
    const res = await fetch(`https://www.dailymotion.com/player/metadata/video/${id}`, { headers: { "User-Agent": UA }, signal: T(15000) });
    console.log("metadata:", res.status);
    if (res.ok) {
      const j = await res.json();
      console.log("title:", j?.title);
      const subs = j?.subtitles;
      console.log("subtitles keys:", subs ? Object.keys(subs) : "none", JSON.stringify(subs?.data ? Object.keys(subs.data) : subs)?.slice(0, 200));
      const firstLang = subs?.data && Object.values(subs.data)[0];
      if (firstLang) {
        const label = Object.keys(subs.data)[0];
        const url = firstLang.find((s) => s.content_type === "application/json")?.url ?? firstLang[0].url;
        console.log("first subtitle url:", url?.slice(0, 120));
        const sr = await fetch(url, { headers: { "User-Agent": UA }, signal: T(15000) });
        const st = await sr.text();
        console.log(`subtitle fetch(${label}):`, sr.status, JSON.stringify(st.slice(0, 200)));
      }
    }
  }
});

// 4. TikTok：网页详情 JSON（大概率有签名墙）
await probe("TikTok", async () => {
  const url = "https://www.tiktok.com/@scout2015/video/6718335390845095173";
  const res = await fetch(url, { headers: { "User-Agent": UA }, signal: T(15000) });
  console.log("page:", res.status);
  if (res.ok) {
    const html = await res.text();
    console.log("has __UNIVERSAL_DATA_FOR_REHYDRATION__:", html.includes("__UNIVERSAL_DATA_FOR_REHYDRATION__"));
    console.log("has SIGI_STATE:", html.includes("SIGI_STATE"));
    console.log("has captcha/login wall:", /captcha|verify/i.test(html.slice(0, 3000)));
  }
});

// 5. 抖音：老 iteminfo 接口 + share 页
await probe("Douyin", async () => {
  let res = await fetch("https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=6918922846023888132", {
    headers: { "User-Agent": UA }, signal: T(15000),
  });
  console.log("iteminfo:", res.status, (await res.text()).slice(0, 120));
  res = await fetch("https://www.douyin.com/aweme/v1/web/aweme/detail/?aweme_id=6918922846023888132", {
    headers: { "User-Agent": UA, Referer: "https://www.douyin.com/" }, signal: T(15000),
  });
  console.log("web detail:", res.status, (await res.text()).slice(0, 150));
});

// 6. 西瓜视频：brief details 接口
await probe("IXigua", async () => {
  const res = await fetch("https://www.ixigua.com/api/public/videov2/brief/details?group_id=6858198822724884238", {
    headers: { "User-Agent": UA }, signal: T(15000),
  });
  console.log("brief details:", res.status, (await res.text()).slice(0, 200));
});

process.exit(0);
