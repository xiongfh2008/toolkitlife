// 直接探测 bilibili player API：无 Cookie 时 subtitle 字段结构
import crypto from "node:crypto";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const TAB = [46,47,18,2,53,8,23,32,15,50,10,31,58,3,45,35,27,43,5,49,33,9,42,19,29,28,14,39,12,38,41,13,37,48,7,16,24,55,40,61,26,17,0,1,60,51,30,4,22,25,54,21,56,59,6,63,57,62,11,36,20,34,44,52];
function mixinKey(o) { return TAB.map((n) => o[n]).join("").slice(0, 32); }

const nav = await (await fetch("https://api.bilibili.com/x/web-interface/nav", { headers: { "User-Agent": UA } })).json();
const imgKey = nav.data.wbi_img.img_url.split("/").pop().split(".")[0];
const subKey = nav.data.wbi_img.sub_url.split("/").pop().split(".")[0];
console.log("wbi keys ok");

function encWbi(params) {
  const mk = mixinKey(imgKey + subKey);
  const wts = Math.round(Date.now() / 1000);
  const merged = { ...params, wts: String(wts) };
  const sorted = Object.keys(merged).sort().map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(merged[k])}`).join("&");
  const wRid = crypto.createHash("md5").update(sorted + mk).digest("hex");
  return new URLSearchParams({ ...merged, w_rid: wRid });
}

const bvids = ["BV1fx411N7bU", "BV1GJ411x7h7"];
for (const bvid of bvids) {
  const view = await (await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`, { headers: { "User-Agent": UA } })).json();
  console.log(`\n=== ${bvid} "${view.data?.title}" code=${view.code}`);
  const cid = view.data?.cid;
  const q = encWbi({ bvid, cid: String(cid) });
  const player = await (await fetch(`https://api.bilibili.com/x/player/wbi/v2?${q}`, { headers: { "User-Agent": UA, Referer: "https://www.bilibili.com/" } })).json();
  const sub = player.data?.subtitle;
  console.log("subtitle field:", JSON.stringify(sub)?.slice(0, 400));
  console.log("player code:", player.code, player.message ?? "");
}
process.exit(0);
