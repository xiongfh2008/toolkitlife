// 测试 bilibili 旧版接口是否匿名可拿字幕
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const bvid = "BV1Fbpt6qEPq"; // 诺奖光遗传学科普（大概率有 AI 字幕）
const view = await (await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`, { headers: { "User-Agent": UA } })).json();
const cid = view.data.cid;
console.log("cid:", cid, "title:", view.data.title);

const endpoints = [
  ["player.so legacy", `https://api.bilibili.com/x/player.so?id=cid:${cid}&bvid=${bvid}`, "text"],
  ["player/v2 non-wbi", `https://api.bilibili.com/x/player/v2?cid=${cid}&bvid=${bvid}`, "json"],
  ["player non-wbi", `https://api.bilibili.com/x/player?cid=${cid}&bvid=${bvid}`, "json"],
];

for (const [name, url, type] of endpoints) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Referer: "https://www.bilibili.com/" } });
    const text = await res.text();
    console.log(`\n=== ${name} http=${res.status} len=${text.length}`);
    if (type === "json") {
      try {
        const j = JSON.parse(text);
        console.log("subtitle:", JSON.stringify(j.data?.subtitle)?.slice(0, 300));
      } catch { console.log("non-json:", text.slice(0, 120)); }
    } else {
      const m = text.match(/<subtitle>([\s\S]*?)<\/subtitle>/);
      console.log("subtitle xml:", (m ? m[1] : "(no <subtitle> block)").slice(0, 300));
    }
  } catch (e) {
    console.log(`${name} ERR: ${e.message}`);
  }
}
process.exit(0);
