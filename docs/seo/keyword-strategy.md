# ToolkitLife — 全站 SEO 关键词策略（2026-11-23）

配套文件：[keyword-map.csv](keyword-map.csv)（393 工具逐条映射，Excel 可直接打开筛选）。

## 1. 数据基线与诚实声明

- 工具总数 **393**（以 main 分支 `messages/en.json` → `home.tools` 为准，与 sitemap 一致），17 个分类。
- title/description/keywords **0 缺失**；FAQ 覆盖率 100%（均值 4.2 条）。
- 无 GSC / Keyword Planner / Ahrefs / Semrush 数据 → **本文档不含任何搜索量、难度、排名或 CTR 数字**。所有关键词分类基于代码功能核实 + 搜索意图常识推断，标记「待验证」。
- 历史审计（docs/seo-audit-baseline.md）中部分 P0 问题（llms.txt 计数、隐私声明）以当前源码复核为准。

## 2. 审计结论（按优先级）

| 级别 | 问题 | 规模 | 本轮处理 |
|---|---|---|---|
| P1 | ~~标题同质化内耗：108 对高相似 title~~ **已复核推翻**：旧规则（title 前 3 词共享）把方向反转对（JPG to PDF ↔ PDF to JPG）和限定词变体（Mortgage ↔ Auto Loan）误判为内耗。按意图重判后：同目标关键词竞争 **0 对已确认**；广义↔限定词潜在竞争 **19 对 / 28 个工具**（如 interest-calculator ↔ compound-interest-calculator），已在 keyword-map.csv 标为 P1「潜在竞争，待 GSC 验证」 | 19 对 | 详见 §4.1 复核方法与结果 |
| P1 | 8 个 P0 工具的功能-文案不匹配与内容缺口 | 8 页 | ✅ 本轮完成（详见 §3） |
| P2 | 115 个工具 description <80 字符（Marketing/Design 生成器类重灾区） | 29% | keyword-map.csv 已标「覆盖不足」+ 待办位置 |
| P2 | 67 个工具缺 guide（HowTo JSON-LD 内容源缺失） | 17% | 本轮为 image-file-size / qr-file-transfer / heic 三个 P0 工具补齐 |
| P2 | 4 个工具缺 relatedTools（iban-validator / swift-bic-checker / aba-routing-number-validator / screen-color-test） | 4 页 | ✅ 本轮补齐（金融校验三件套互链 + currency-converter；屏幕检测族互链） |
| P2 | 5 个热门工具零博客覆盖（pdf-long-image / heic / qr-file-transfer / claude-code-text-formatter / address-generator） | 内容营销空白 | ✅ 新增 3 篇（前三个），其余 2 篇列入内容计划 |
| P2 | search-aliases 18 条跨工具歧义（如「水印」→video-watermark+image-watermark） | 站内搜索 | 已记录，待后续用新别名消歧（本轮不动，避免破坏现有搜索行为） |
| P3 | llms.txt 等历史 P0 项 | — | 以当前源码复核，本轮未改动该文件 |

## 3. 第一批 8 个核心工具（本轮已实施）

| 工具 | 主关键词 | 长尾增量 | 关键功能核实结果（写入文案的依据） |
|---|---|---|---|
| pdf-long-image | pdf to long image | +3 长尾词 | PNG/JPG、80MP/32000px canvas 上限、pdf.js 本地处理 |
| image-file-size | compress image to 100kb | +4 长尾词 | 任意 KB 目标（非固定档位）、JPEG 质量扫描、**输出恒为 JPG**（已如实标注）、PNG/JPG/WebP 输入 |
| qr-file-transfer | offline qr file transfer | +3 长尾词 | 喷泉码 + SHA-256、64MB 上限、纯光传输（视线内可被拍摄，已如实标注） |
| heic | heic to jpg converter | +4 长尾词 | **修正 HEIF 虚假宣称**：代码仅接受 .heic；heic2any 客户端、单文件处理 |
| video-transcript | video transcript extractor | +3 长尾词 | YouTube/Bilibili/Vimeo/Dailymotion/TED；B 站需 SESSDATA（平台限制如实保留） |
| claude-code-text-formatter | claude code text formatter | +2 长尾词 | 仅三类清理：ANSI CSI 转义、控制字符、行号前缀 |
| address-generator | random address generator | +3 长尾词 | Faker 模拟 + 可选真实模式；24 国；「仅供测试、不保证存在」声明保留 |
| json-to-rust | json to rust struct | +3 长尾词 | serde derive/rename_all/Option/Vec/HashMap；修复 relatedTools 重复项 |

同步完成：5 个发布语言（zh/ja/ko/ru/es）对 8 工具的 metadata/keywords 本地化（自然搜索表达，如 zh「图片压缩到100KB」「HEIC转JPG」）、4 个 relatedTools 缺失补齐（6 语言）、3 篇博客的 blogPosts 文案（6 语言）。

## 4. 关键词分类规则（keyword-map.csv 各列定义）

- **已覆盖**：FAQ>0 且 description≥80 字符。
- **覆盖不足**：description<80 或缺 guide —— 工具能力真实存在但页面文字表达不足，是后续批次的主要工作面。
- **功能不支持关键词**：不写入任何文案（例：heic 批量转换——工具单文件处理；address 不可虚构「真实可投递」）。
- **潜在关键词**：仅记录在 CSV potential 列，未经搜索工具验证，不承诺覆盖。
- **内耗判定（2026-11-24 修订）**：仅凭 title 字符串相似不构成内耗证据。现行规则见 §4.1。

### 4.1 标题相似复核方法与结果（2026-11-24）

旧报告「108 对 P1」由脚本按「title 前 3 词共享」判定，该规则已被推翻，原因与重判结果如下：

**判定层级（从严到宽）**

1. **目标关键词相同**（真竞争）：去掉 converter/calculator/generator 等通用头词后，核心词组完全一致。结果：393 工具中仅 3 组——全部为**方向反转对**（Image to Base64 ↔ Base64 to Image、JPG to PDF ↔ PDF to JPG、PNG to PDF ↔ PDF to PNG），搜索意图相反，**不构成竞争**。→ **已确认同目标关键词竞争：0 对**。
2. **意图重复**（广义工具同时可能服务限定查询）：广义头词工具 ↔ 限定词变体工具（如 interest-calculator ↔ compound-interest-calculator、mortgage-calculator ↔ mortgage-payoff-calculator、video-converter ↔ video-to-gif）。title 的限定词形成了各自的独立查询，但广义页内容可能同时满足限定查询 → **潜在竞争 19 对 / 28 个工具**，标 P1、逐行注明「潜在竞争对，待 GSC 验证」，无 GSC 数据前**不宣称已确认内耗**。
3. **字符串相似但意图不同**（排除）：方向反转对（4 对）、不同传输机制（qr-file-transfer ↔ file-transfer）、不同操作对象（video-watermark ↔ video-watermark-remover：添加 vs 移除）、强限定意图（live-wallpaper ↔ wallpaper、dog-age ↔ age、hourly-to-salary ↔ salary）等共 10 对，无需处理。

**统计口径差异说明**

- 「Finance 计算器簇 **117**」是**全站 title 含 calculator 的工具数**（实测 118，跨所有 17 个分类统计），不是 Finance 分类工具数。
- keyword-map.csv Finance 分类 **67** = `messages/en.json` → `home.tools` 中 `category=Finance` 的工具数。
- 交叉部分：Finance 分类内 title 含 calculator 的工具为 **63**。两个数字口径不同，不能混用。

后续批次处理方式：19 对潜在竞争对在拿到 GSC 查询数据后，按「两页是否对同一查询都获得曝光」逐对验证；确有重叠的才改写 title/description 差异化，避免无据大改。

## 5. 博客与内链（本轮）

新增 3 篇（均链接目标工具 + 相关既有文章，诚实标注限制）：

1. how-to-combine-pdf-pages-into-one-image → /tools/pdf-long-image
2. how-to-convert-heic-to-jpg → /tools/heic
3. how-to-transfer-files-with-qr-codes → /tools/qr-file-transfer

未实施（内容计划）：How to Remove ANSI Codes from Terminal Output（claude-code-text-formatter）、How to Generate Rust Structs from JSON（json-to-rust 已有 json-to-code 覆盖，优先级低）、address-generator 教程（需先确认搜索意图价值）。

## 6. 多语言 SEO

- 发布语言：en/zh/ja/ko/ru/es（`publishedLocales`）；de/fr/pt 保持英文回退、不擅自改为可索引（以当前 routing.ts 为准）。
- 本轮只对 8 个 P0 工具做 5 语言 metadata/keywords 本地化；FAQ/guide 的 5 语言翻译维持现状（后续批次）。
- 关键词非直译：zh 用「图片压缩到100KB」「AI消除笔」类市场词；ja 用「容量 圧縮」等习惯表达。CSV 中语言列仅含 en 主行，多语言变体在工具内 keywords 数组中体现。

## 7. 后续批次路线

1. ~~Finance 计算器簇（117 工具）title 差异化~~ 改为：**19 对潜在竞争对（§4.1）** 的 GSC 验证与确有重叠后的 title 差异化；全站 118 个 calculator 类工具的 title 巡检仅在 GSC 证实内耗时进行。
2. 115 个短 description 扩写（Marketing → Design → Utility 顺序）。
3. 67 个缺 guide 工具按流量优先补 HowTo。
4. search-aliases 歧义消解（18 处）。
5. claude-code-text-formatter / address-generator 两篇博客。
6. 全部改动需 GSC 数据回填验证（每批改动后观察 28 天）。
