#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Search Console "Discovered - currently not indexed" 扫描脚本
===========================================================

【重要背景 —— 请先读】
  1. Google 的 URL Inspection API（index.inspect）是只读的：只能查询单个 URL 的收录状态，
     官方文档明确 "View the indexed, or indexable, status of the provided URL"，
     调用它【不会】触发重新抓取，也没有任何"请求索引"参数。
  2. Google 没有面向普通网页的"请求编入索引"API（Indexing API 仅支持 JobPosting /
     BroadcastEvent 结构化数据，普通页面会被拒绝）。
  3. Search Console API 没有"按收录状态批量列出 URL"的接口，只能逐个 URL 检查。
     配额：每属性每天 2000 次，每分钟 600 次。

【本脚本能做什么】
  - 从 sitemap.xml（或本地 URL 列表文件）读取全站 URL，自动去重。
  - 逐个调用 URL Inspection API 检查收录状态（内置限速 + 429 退避 + 断点续跑）。
  - 筛选出 coverageState 为 "Discovered - currently not indexed" 的 URL，
    输出 CSV 报告与 GSC 检查链接。
  - 支持 --open 自动打开浏览器进入 GSC 检查页，便于人工点击"请求编入索引"
    （这是官方唯一允许的"请求索引"途径，目前无法用 API 替代）。

【准备（服务账号方式，适合定时任务）】
  1. Google Cloud Console 创建项目，启用 "Google Search Console API"。
  2. 创建服务账号并下载 JSON 密钥。
  3. 在 Search Console「设置 → 用户和权限」把服务账号邮箱添加为（完整/受限）用户。
  4. 安装依赖：pip install google-auth requests

【准备（OAuth 方式，适合个人账号）】
  1. Google Cloud Console 创建 OAuth 2.0 客户端（类型"桌面应用"），下载 client_secret.json。
  2. 首次运行会弹出浏览器授权，之后 token 缓存在 ./token.json。
  3. pip install google-auth requests google-auth-oauthlib

【使用示例】
  # 全站扫描（1188 个 URL，约 3~4 分钟跑完，一天配额内）
  python scripts/gsc_request_indexing.py --service-account sa.json \
      --site-url "https://www.toolkitlife.com/"

  # 分批扫描：每天只查前 300 个（配合断点续跑，多天轮询全站）
  python scripts/gsc_request_indexing.py --service-account sa.json \
      --site-url "https://www.toolkitlife.com/" --limit 300

  # 扫描完成后，打开浏览器进入匹配 URL 的 GSC 检查页，人工点"请求编入索引"
  python scripts/gsc_request_indexing.py --service-account sa.json \
      --site-url "https://www.toolkitlife.com/" --open

  # 使用 OAuth 客户端密钥（个人账号）并扫描更多状态
  python scripts/gsc_request_indexing.py --client-secrets client_secret.json \
      --site-url "https://www.toolkitlife.com/" \
      --states "discovered - currently not indexed,crawled - currently not indexed"

  # 只读取本地 URL 列表文件（每行一个 URL），不拉 sitemap
  python scripts/gsc_request_indexing.py --service-account sa.json \
      --site-url "https://www.toolkitlife.com/" --urls-file urls.txt

【输出文件（均在当前目录）】
  gsc_index_report.csv      全部已检查 URL 的状态明细
  gsc_request_index_links.txt  匹配目标状态 URL 的 GSC 检查链接（点进去可"请求编入索引"）
  gsc_index_progress.json   断点续跑状态（重跑会自动跳过已检查的 URL，--force 可强制重查）
"""
import argparse
import csv
import json
import sys
import time
import urllib.error
import urllib.request
import webbrowser
import xml.etree.ElementTree as ET
from pathlib import Path

API_URL = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect"
SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]

# 每属性每天 2000 次、每分钟 600 次；留出余量按 500 次/分钟限速
MIN_INTERVAL = 0.12
DAILY_SAFE_LIMIT = 1900

DEFAULT_TARGET_STATES = {"discovered - currently not indexed"}

PROGRESS_FILE = "gsc_index_progress.json"
REPORT_CSV = "gsc_index_report.csv"
LINKS_TXT = "gsc_request_index_links.txt"


# ---------------------------------------------------------------- URL 收集
def fetch_url(url: str, timeout: int = 30) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "gsc-index-scanner/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read()


def urls_from_sitemap(sitemap_url: str, depth: int = 0) -> list:
    """解析 sitemap（支持 sitemapindex 嵌套），返回全部 loc。"""
    if depth > 3:
        return []
    raw = fetch_url(sitemap_url)
    root = ET.fromstring(raw)
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = []
    if root.tag.endswith("sitemapindex"):
        for loc in root.findall("sm:sitemap/sm:loc", ns):
            urls.extend(urls_from_sitemap(loc.text.strip(), depth + 1))
    elif root.tag.endswith("urlset"):
        for loc in root.findall("sm:url/sm:loc", ns):
            urls.append(loc.text.strip())
    return urls


def urls_from_file(path: str) -> list:
    return [ln.strip() for ln in Path(path).read_text(encoding="utf-8").splitlines() if ln.strip()]


def load_credentials(args):
    """构造 AuthorizedSession。优先服务账号，其次 OAuth 客户端密钥。"""
    if args.service_account:
        from google.oauth2 import service_account

        creds = service_account.Credentials.from_service_account_file(
            args.service_account, scopes=SCOPES
        )
    elif args.client_secrets:
        try:
            from google.auth.transport.requests import AuthorizedSession
            from google_auth_oauthlib.flow import InstalledAppFlow
        except ImportError:
            sys.exit("缺少依赖：pip install google-auth-oauthlib")
        flow = InstalledAppFlow.from_client_secrets_file(args.client_secrets, SCOPES)
        creds = flow.run_local_server(port=0, open_browser=True)
        # 缓存 token，避免每次重新授权
        Path("token.json").write_text(
            json.dumps({"refresh_token": creds.refresh_token, "token_uri": creds.token_uri,
                        "client_id": creds.client_id, "client_secret": creds.client_secret,
                        "scopes": list(creds.scopes)})
        )
    else:
        sys.exit("必须提供 --service-account 或 --client-secrets 之一")

    from google.auth.transport.requests import AuthorizedSession

    return AuthorizedSession(creds)


def inspect_url(session, site_url: str, url: str) -> dict:
    """调用 URL Inspection API 检查单个 URL，返回状态摘要。"""
    body = {"inspectionUrl": url, "siteUrl": site_url, "languageCode": "en-US"}
    resp = session.post(API_URL, json=body, timeout=30)
    if resp.status_code == 429:  # 限速，按 Retry-After 退避
        wait = float(resp.headers.get("Retry-After", 5) or 5)
        raise RateLimited(wait)
    if resp.status_code in (401, 403):
        sys.exit(f"认证失败（{resp.status_code}）：{resp.text}。检查密钥/权限后重试。")
    if resp.status_code >= 400:
        return {"error": f"HTTP {resp.status_code}: {resp.text[:200]}"}
    data = resp.json()
    result = data.get("inspectionResult", {})
    idx = result.get("indexStatusResult", {})
    return {
        "url": url,
        "coverageState": idx.get("coverageState", ""),
        "verdict": idx.get("verdict", ""),
        "indexingState": idx.get("indexingState", ""),
        "pageFetchState": idx.get("pageFetchState", ""),
        "lastCrawlTime": idx.get("lastCrawlTime", ""),
        "userCanonical": idx.get("userCanonical", ""),
        "googleCanonical": idx.get("googleCanonical", ""),
        "inspectionResultLink": result.get("inspectionResultLink", ""),
    }


class RateLimited(Exception):
    def __init__(self, wait: float):
        super().__init__(f"rate limited, wait {wait}s")
        self.wait = wait


def matches_target(state: str, targets: set, loose: bool) -> bool:
    s = state.lower()
    if not s:
        return False
    if s in targets:
        return True
    if loose:
        return any(t in s for t in targets)
    return False


def main() -> None:
    ap = argparse.ArgumentParser(description="扫描 Search Console 中未收录的 URL")
    ap.add_argument("--service-account", help="服务账号 JSON 密钥路径")
    ap.add_argument("--client-secrets", help="OAuth 客户端密钥（桌面应用）路径")
    ap.add_argument("--site-url", required=True,
                    help="Search Console 属性。URL 前缀属性需带尾斜杠，如 https://www.toolkitlife.com/ ；"
                         "域名属性用 sc-domain:toolkitlife.com")
    ap.add_argument("--sitemap", default="https://www.toolkitlife.com/sitemap.xml",
                    help="sitemap 地址（默认 https://www.toolkitlife.com/sitemap.xml）")
    ap.add_argument("--urls-file", help="本地 URL 列表文件（每行一个），优先于 --sitemap")
    ap.add_argument("--states", default="discovered - currently not indexed",
                    help="要筛选的状态（逗号分隔，小写），默认 discovered - currently not indexed")
    ap.add_argument("--loose", action="store_true", help="状态按子串匹配（防止 Google 措辞微调）")
    ap.add_argument("--limit", type=int, default=0, help="本次最多检查的 URL 数（0=不限制）")
    ap.add_argument("--force", action="store_true", help="忽略进度文件，强制重新检查")
    ap.add_argument("--dry-run", action="store_true", help="只收集 URL 并统计，不调用 API")
    ap.add_argument("--open", action="store_true", help="检查后自动在浏览器打开匹配 URL 的 GSC 检查页")
    args = ap.parse_args()

    targets = {s.strip().lower() for s in args.states.split(",") if s.strip()}

    # 1. 收集 URL
    if args.urls_file:
        urls = urls_from_file(args.urls_file)
    else:
        try:
            urls = urls_from_sitemap(args.sitemap)
        except (urllib.error.URLError, ET.ParseError) as e:
            sys.exit(f"sitemap 获取/解析失败（{args.sitemap}）：{e}")
    # 去重并保持顺序
    seen, unique = set(), []
    for u in urls:
        if u not in seen:
            seen.add(u)
            unique.append(u)
    urls = unique
    print(f"共 {len(urls)} 个 URL（去重后）")

    if args.dry_run:
        print("dry-run 结束（未调用 API）")
        return

    # 2. 进度文件（断点续跑）
    progress = json.loads(Path(PROGRESS_FILE).read_text(encoding="utf-8")) \
        if Path(PROGRESS_FILE).exists() else {"inspected": {}, "failed": {}}
    todo = []
    for u in urls:
        if args.force or (u not in progress["inspected"] and u not in progress["failed"]):
            todo.append(u)
    print(f"待检查：{len(todo)} 个（已检查 {len(progress['inspected'])}，失败 {len(progress['failed'])}）")
    if not todo:
        print("没有待检查的 URL。使用 --force 可强制重新检查。")
        return

    if args.limit:
        todo = todo[: args.limit]
        print(f"本次限制检查 {len(todo)} 个")

    # 3. 逐个检查
    session = load_credentials(args)
    results = []
    for i, u in enumerate(todo, 1):
        for attempt in range(6):
            try:
                record = inspect_url(session, args.site_url, u)
                break
            except RateLimited as e:
                if attempt == 5:
                    record = {"url": u, "error": f"持续限速: {e}"}
                else:
                    time.sleep(e.wait)
        if "error" in record:
            progress["failed"][u] = record["error"]
            print(f"[{i}/{len(todo)}] 失败 {u}: {record['error']}")
        else:
            progress["inspected"][u] = record
            results.append(record)
            if i % 50 == 0 or i == len(todo):
                print(f"[{i}/{len(todo)}] 已检查 {i}，累计命中 {sum(1 for r in results if matches_target(r['coverageState'], targets, args.loose))} 个")
        Path(PROGRESS_FILE).write_text(json.dumps(progress, ensure_ascii=False, indent=2), encoding="utf-8")
        if i < len(todo):
            time.sleep(MIN_INTERVAL)
        if i >= DAILY_SAFE_LIMIT:
            print(f"已接近日配额（{DAILY_SAFE_LIMIT} 次），提前停止。进度已保存，明天重跑可继续。")
            break

    # 4. 汇总 + 输出
    hits = [r for r in results if matches_target(r["coverageState"], targets, args.loose)]
    all_rows = list(progress["inspected"].values())

    with open(REPORT_CSV, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "url", "coverageState", "verdict", "indexingState", "pageFetchState",
            "lastCrawlTime", "userCanonical", "googleCanonical", "inspectionResultLink"])
        writer.writeheader()
        writer.writerows(all_rows)

    with open(LINKS_TXT, "w", encoding="utf-8") as f:
        for r in hits:
            link = r.get("inspectionResultLink") or f"https://search.google.com/search-console/inspect?resource_id={args.site_url}&stuck_url={r['url']}"
            f.write(f"{r['url']}\t{link}\n")

    print(f"\n已检查：{len(all_rows)} 个，命中目标状态：{len(hits)} 个")
    print(f"CSV 报告：{REPORT_CSV}  链接：{LINKS_TXT}")
    print("\n命中 URL（" + ("、".join(t for t in targets) or "全部") + "）：")
    for r in hits:
        print("  " + r["url"])

    if hits:
        print("\n注意：官方 API 无法请求编入索引（只读）。请打开上面的 GSC 检查链接，")
        print("在页面中点击「请求编入索引」。建议每天只提交少量（10~50 个），避免被视为垃圾信号。")
        if args.open:
            for r in hits:
                link = r.get("inspectionResultLink") or (
                    f"https://search.google.com/search-console/inspect?resource_id={args.site_url}&stuck_url={r['url']}")
                webbrowser.open(link)


if __name__ == "__main__":
    main()
