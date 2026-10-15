// 批量探测：匿名状态下 B 站热门视频的字幕可用率
import crypto from "node:crypto";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const TAB = [46,47,18,2,53,8,23,32,15,50,10,31,58,3,45,35,27,43,5,49,33,9,42,19,29,28,14,39,12,38,41,13,37,48,7,16,24,55,40,61,26,17,0,1,60,51,30,4,22,25,54,21,56,59,6,63,57,62,11,36,20,34,44,52];
function mixinKey(o) { return TAB.map((n) => o[n]).join("").slice(0, 32); }
const nav = await (await fetch("https://api.bilibili.com/x/web-interface/nav", { headers: { "User-Agent": UA } })).json();
const imgKey = nav.data.wbi_img.img_url.split("/").pop().split(".")[0];
const subKey = nav.data.wbi_img.sub_url.split("/").pop().split(".")[0];
function encWbi(params) {
  const mk = mixinKey(imgKey + subKey);
  const wts = Math.round(Date.now() / 1000);
  const merged = { ...params, wts: String(wts) };
  const sorted = Object.keys(merged).sort().map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(merged[k])}`).join("&");
  const wRid = crypto.createHash("md5").update(sorted + mk).digest("hex");
  return new URLSearchParams({ ...merged, w_rid: wRid });
}

const pop = await (await fetch("https://api.bilibili.com/x/web-interface/popular?ps=20", { headers: { "User-Agent": UA } })).json();
const list = pop.data?.list ?? [];
console.log(`popular videos: ${list.length}`);

let hasSub = 0;
for (const v of list) {
  const bvid = v.bvid;
  const q = encWbi({ bvid, cid: String(v.cid) });
  const player = await (await fetch(`https://api.bilibili.com/x/player/wbi/v2?${q}`, { headers: { "User-Agent": UA, Referer: "https://www.bilibili.com/" } })).json();
  const subs = player.data?.subtitle?.subtitles ?? [];
  if (subs.length > 0) {
    hasSub++;
    console.log(`SUB  ${bvid} "${v.title.slice(0, 30)}" -> ${subs.map((s) => s.lan).join(",")}`);
  } else {
    console.log(`none ${bvid} "${v.title.slice(0, 30)}"`);
  }
  await new Promise((r) => setTimeout(r, 300));
}
console.log(`\nRESULT: ${hasSub}/${list.length} videos have anonymous-accessible subtitles`);
process.exit(0);
