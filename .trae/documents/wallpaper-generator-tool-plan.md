# 新增 Wallpaper Generator（壁纸生成器）工具

## Context

为 ToolkitLife 新增壁纸生成功能。采用程序化生成路线（用户已确认）：零模型下载、全设备可用、全客户端运行。开源集成：**easy-mesh-gradient**（MIT、零依赖）提供 mesh 渐变风格；极光彩带风格自研（~100 行 canvas，seeded PRNG）。复用 text-to-image 工具页模板（同为 canvas + PNG 导出）。

## 改动清单

### 1. 依赖
```bash
npm install easy-mesh-gradient
```

### 2. 新文件：工具页（2 个）

**`src/app/[locale]/tools/wallpaper-generator/layout.tsx`** — 复制 [text-to-image/layout.tsx](d:/AIProject/toolkitlife/src/app/[locale]/tools/text-to-image/layout.tsx)，slug 全部替换为 `wallpaper-generator`：generateStaticParams、metadata namespace、hreflang（6 语言 + x-default）、`<ToolMessages slug="wallpaper-generator">`。

**`src/app/[locale]/tools/wallpaper-generator/page.tsx`** — "use client"，ToolLayout 用法参考 [text-to-image/page.tsx](d:/AIProject/toolkitlife/src/app/[locale]/tools/text-to-image/page.tsx)。功能：
- 2 种风格：Mesh 渐变（`await import("easy-mesh-gradient")` 惰性加载）、极光彩带（自研）
- 12 个预设调色板 + 自定义 2-4 色
- 随机 seed + 可输入 seed（同 seed 同图）
- 尺寸预设：桌面 1920×1080 / 2560×1440 / 3840×2160；手机 1170×2532 / 1080×2400 / 1440×3200；平板 2048×2732
- 颗粒纹理开关；导出全分辨率 PNG

渲染架构：单一常驻预览 canvas（长边 ~640px 等比预览）；导出时新建 offscreen canvas 全分辨率重绘 → `toBlob` → 下载。极光风格不依赖 `ctx.filter`（Safari 兼容）。

### 3. messages（9 个文件，各 2 处）

`messages/{en,zh,ja,ko,ru,es}.json` 添加（de/fr/pt 按现状加英文文案）：
1. `home.tools["wallpaper-generator"]` = `{ name, description, category: "Design", icon: "🌌" }`（sitemap 自动收录）
2. `tools["wallpaper-generator"]` 块（结构对齐 en.json 中 text-to-image，L38050）：metadata、title/description/category、keywords（6 个真实搜索词）、faqs（4 条）、relatedTools（og-image-generator / svg-wave-generator / solid-color-image）、guide（whatIs/modes/howTo/tips，**howTo.items 驱动 HowTo schema**）、labels/buttons

zh 用真实搜索词（"壁纸生成器"、"手机壁纸制作"、"电脑壁纸 4k"）。

### 4. 注册与生成物

1. [src/data/scenes.ts](d:/AIProject/toolkitlife/src/data/scenes.ts) image 场景 tools 数组加入 `"wallpaper-generator"`（L52 附近）
2. `node scripts/split-home-data.mjs` 重新生成 scene-of-slug.ts（生成物勿手改）
3. `node scripts/generate-llms-txt.mjs` 更新 public/llms.txt

### 5. 无需改动
sitemap.ts（自动派生）、ToolLayout.tsx（直接复用）、其他工具的 relatedTools。

## 验证

1. `npx tsc --noEmit` + `npm run lint` 通过
2. dev server 验证 `/en/tools/wallpaper-generator`、`/zh/tools/wallpaper-generator`：两种风格出图正常、随机 seed 有效、各尺寸预设导出 PNG 分辨率正确、颗粒开关生效
3. 页面源码含 SoftwareApplication + FAQPage + HowTo + BreadcrumbList 四段 plain `<script>` JSON-LD
4. 首页 image 场景出现新工具；/sitemap.xml 含 6 语言新 URL；/llms.txt 有条目
5. 每次 Edit messages 后用 Grep 验证已写入磁盘（Edit 偶发静默丢失）
