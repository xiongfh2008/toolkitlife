# SEO/GEO 基线审计报告（2026-11-05，本地代码审计）

> 范围：本地仓库 `main` 分支（commit b7f05b4）。生产环境未检测；所有结论基于本地代码与构建产物，
> 未标注"待线上验证"的项均为本地静态验证。

## 一、规模基线

| 指标 | 数值 | 验证方式 |
|---|---|---|
| 工具路由目录（含 page.tsx） | 394 | 文件系统扫描 |
| `messages/en.json` home.tools 条目 | 394 | JSON 解析 |
| 博客文章页 | 18 + 博客索引 | 文件系统 + `blog-posts.ts` |
| 语言（路由可用） | 9（en zh ja ko ru es de fr pt） | `routing.ts` |
| 语言（发布/收录） | 6（en zh ja ko ru es），de/fr/pt 为英文回退 | `publishedLocales` |
| 可索引 URL（理论） | 6 × (4 静态 + 1 博客索引 + 18 博文 + 393 工具) = 6 × 416 = **2496**。⚠ 勘误（2026-11-06 独立验收）：初版按"394−12 个重定向 slug"估算为 2430，但 HEAD 时 messages 中实际只存在其中 1 个重定向 slug（image-format-converter），故基线即为 393 工具/语言 → 2496。 | 从 git HEAD `messages/en.json` 精确重算 |
| Sitemap URL 数 | 2496（静态构建后验证） | `npm run build` 产物 |
| de/fr/pt 内容状态 | 消息文件存在但内容为英文回退（如 address-generator 标题为英文） | JSON 抽样 |

## 二、基线检查结果

| 检查 | 结果 |
|---|---|
| `npx tsc --noEmit` | ✅ 通过（exit 0） |
| `npm run lint` | ⚠️ 444 problems（87 errors / 357 warnings）。约 60 个 error 来自根目录一次性工作脚本（`test_parse.js`、`.tmp_check_unit2.js` 等）与 vendored 压缩文件（`public/ffmpeg/ffmpeg-core.js`）；其余为 React Compiler 建议性规则（`memoization could not be preserved`、`setState in effect`），预存在，不影响构建 |
| `npm run build` | ✅ 成功。394 工具 × 9 语言静态预渲染，另有 /api/favicon、/api/geo-ip、/api/shorten、/api/video-transcript 4 个动态 API 路由 |

## 三、发现的问题清单（本地代码审计）

### P0（直接影响可索引性/AI 引用）

| # | 问题 | 证据 |
|---|---|---|
| P0-1 | **`public/llms.txt` 全部 393 个工具 URL 缺少语言前缀**（`/tools/xxx` 而非 `/en/tools/xxx`）。站点 `localePrefix: "always"` + next-intl middleware 会把无前缀 URL 302/308 重定向到 `/en/...`，AI 爬虫每次引用都要多一跳重定向，且与 llms-full.txt（有前缀）不一致 | `scripts/generate-llms-txt.mjs` L43；`public/llms.txt` 实测 393/393 无前缀 |
| P0-2 | **llms.txt 计数过期**：文件称 393 tools，当前 en.json home.tools 为 394（image-format-converter 为被重定向遮蔽的死条目仍被列出） | 生成脚本与消息文件不同步 |
| P0-3 | **llms.txt / llms-full.txt 隐私声明不准确**："All tools run entirely in the browser…No user data is collected or stored" —— 站点实际部署了 GA4、Yandex Metrika、Microsoft Clarity、Vercel Analytics，且 favicon/geo-ip/shorten/video-transcript 4 个工具走服务端 API 中继第三方服务。核心工具（文件/图片/视频处理）确实全本地，但绝对化表述与隐私政策页矛盾 | `src/app/[locale]/layout.tsx`（分析脚本）、4 个 API route、`privacy/page.tsx`（已正确披露分析） |
| P0-4 | **63 条失效内链**：json-to-typescript/go/java/python/kotlin/csharp/rust 共 7 个工具的 relatedTools 指向不存在的 `/tools/json-yaml-converter`，× 9 个语言 = 63 条死链（点击 404） | 9 个语言文件均验证 |

### P1

| # | 问题 | 证据 |
|---|---|---|
| P1-1 | **地址生成器选 Taiwan 必然报错**：`COUNTRIES` 含 `zh_TW` 但 `CITY_ANCHORS` 无 `zh_TW` 组 → `anchors[Math.floor(random*0)]` 为 undefined → catch 显示"生成失败" | `page.tsx` L117-121 vs `address-cities.ts` RAW 键表 |
| P1-2 | **Manchester 坐标非法**：`"Manchester|...|M53.4808,-2.2426"` 纬度带前缀 M → `NaN`，生成的坐标显示 "NaN" 并写入复制/下载结果 | `address-cities.ts` L50 |
| P1-3 | **UAE 占位邮编 `00000`**：ar 锚点三城邮编均为 `00000`（阿联酋无通用邮编制度，占位值属于"不适用的占位邮编"） | `address-cities.ts` L205-209 |
| P1-4 | **关键词堆砌页脚**：`ToolLayout` 底部渲染 `"{title} — free online {keywords}. No signup required. Works in your browser."`（394 工具全量，218 页显式传 keywords），为纯关键词串联，无阅读价值；代码注释自称"hidden visually but indexable"（实际为低对比可见文本，注释与事实不符） | `ToolLayout.tsx` L378-385 |
| P1-5 | **6 个工具 relatedTools 指向已重定向 slug**（image-format-converter，共 54 条链接经 308 跳转到 /convert） | en/zh/… excel-img、heic、image-file-size、img-size、ppt-img、svg-to-image |
| P1-6 | **`image-format-converter` 死条目**：同时存在 308 重定向（next.config.ts）、路由目录（不可达，被重定向遮蔽）、messages 键（home.tools + tools.*，9 语言）。sitemap 已正确排除，但它是 llms 计数/一致性校验的脏数据源 | 三处并存 |
| P1-7 | **面包屑 schema 分类 URL 为首页锚点**：BreadcrumbList 第 2 级 item 为 `https://toolkitlife.com/{locale}/#scene=xxx`（带 fragment 的首页 URL），fragment 在结构化数据中无意义 | `ToolLayout.tsx` L245 |
| P1-8 | **68/394 英文工具缺 guide**（内容深度不均，GEO 相关）；4 工具缺 relatedTools | en.json 统计 |
| P1-9 | **无语言前缀深链 404**（验证阶段发现）：proxy 中间件 matcher 仅为 `["/", "/(zh|en|ja|ko|ru)/:path*"]`，`/tools/x`、`/blog`、`/about` 等无前缀 URL 不经过 next-intl 重定向，直接 404。旧版 llms.txt 的 393 个裸 URL 因此全部 404（加重 P0-1）。已通过 next.config 增加 5 条 308 重定向修复（`/tools/:path*`、`/blog/:path*`、`/about`、`/privacy`、`/terms` → `/en/...`），静态资源不受影响 | `src/proxy.ts` config.matcher；E2E 实测 404 → 修复后 308→200 |

### P2

| # | 问题 | 证据 |
|---|---|---|
| P2-1 | en.json metadata.keywords 含无关词 "good morning images"（遗留垃圾词，meta keywords 已被主流引擎忽略，无排名影响） | en.json metadata |
| P2-2 | 根目录大量一次性工作文件被 git 跟踪（blog2.html、bmi.html、scripts/_batch-*.json 等），污染 lint 与仓库卫生，不影响线上 SEO | `git ls-files` |
| P2-3 | lint 中约 30 个 error 为 React Compiler 规则对真实源码的建议性报告（14 个工具页/组件），预存在，修复需逐页重构，超出本次 SEO 范围 | eslint 输出 |
| P2-4 | llms.txt 与 llms-full.txt 由两个脚本分别生成（generate-llms-txt.mjs / geo-gen-llmsfull.mjs），语言列表一处含 Español 一处不含，存在再次失同步风险 | 两脚本对比 |

## 四、已验证无问题的项

- ✅ **Sitemap**：394 slug ↔ 394 路由一一对应；12 个重定向 slug 已排除；仅含 6 个发布语言；博客 18 篇与页面目录一致；无伪造 lastModified（工具页无日期，博文用真实 dateModified）。
- ✅ **Canonical/Hreflang**：394 个工具 layout 全部含 6 语言 + `"x-default"` 引号写法，canonical 指向本语言 URL；`routing.alternateLinks: false` 正确关闭了 next-intl 的 HTTP Link header（避免 HTML hreflang 冲突）。首页 metadata hreflang 与 og:locale 一致。
- ✅ **Metadata**：394 工具 metadata.title/description 零重复；品牌名通过 `%s | ToolkitLife` 模板统一；OG/Twitter 完整；WebSite SearchAction 的 `?q=` 参数已被 home-client.tsx 实际支持。
- ✅ **JSON-LD**：SoftwareApplication/FAQPage/HowTo/BreadcrumbList/BlogPosting/WebSite+Organization 均以 plain `<script>` SSR 输出；`aggregateRating` 未设置（无虚构评分）；YMYL 工具（108 个）显示免责声明 aside；博客链接、博客页内 /tools/ 链接全部有效。
- ✅ **隐私页**：已披露 analytics/ads/第三方服务；"文件不离开设备"的表述对文件处理类工具成立。
- ✅ **robots.ts**：明确放行主流 AI 爬虫、封禁 Bytespider、声明 sitemap。
- ✅ **多语言切换**：de/fr/pt 不在切换器展示（`publishedLocales`），OG alternate 仅列 6 语言。

## 五、修复优先级计划

1. **P0-1/2/3**：统一由 `scripts/geo-gen-llmsfull.mjs` 生成两份 llms 文件（URL 加 /en 前缀、跳过重定向 slug、真实计数、准确隐私措辞），`generate-llms-txt.mjs` 同步修复或废弃。
2. **P0-4**：9 语言 relatedTools 死链修复（指向真实存在的 JSON 工具）。
3. **P1-1/2/3**：补 zh_TW 锚点、修 Manchester 坐标、ar 空邮编处理，并新增锚点数据校验。
4. **P1-4**：移除关键词页脚（保留 prop 兼容 218 个显式传参页面）。
5. **P1-5/6**：relatedTools 指向 /convert；删除死路由目录与死 messages 键。
6. **P1-7**：面包屑 schema 分类项改为不带 fragment 的首页 URL。
7. **P1-8**：为 address-generator 等重点工具扩写 guide（配合真实地址模式集成）。
8. 新增 `scripts/check-seo-consistency.mjs` 把上述一致性规则固化为可重复执行的校验。
