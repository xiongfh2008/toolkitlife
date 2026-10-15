const T = (ms) => AbortSignal.timeout(ms);
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const html = await (await fetch("https://www.ted.com/talks/bill_gates_the_next_outbreak_we_re_not_ready", { headers: { "User-Agent": UA }, signal: T(20000) })).text();
const nd = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
const props = JSON.parse(nd[1]).props.pageProps;
const tr = props.transcriptData.translation;
console.log("language:", JSON.stringify(tr.language));
process.exit(0);
