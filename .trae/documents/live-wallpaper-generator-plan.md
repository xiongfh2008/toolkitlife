# Live Wallpaper Generator（live-wallpaper-generator）实施计划

## Context

继静态壁纸生成器（wallpaper-generator，mesh/aurora + PNG 导出）上线后，用户需要"动态 3D 壁纸"能力。调研结论：集成 three.js 自研 3 种可无缝循环的 3D 场景，导出浏览器端可行的唯一视频路径——WebCodecs + mp4-muxer 离线逐帧编码 MP4（主路径），MediaRecorder WebM 兜底。用户可用 Lively Wallpaper / Wallpaper Engine / 手机 live wallpaper App 将导出的 MP4 设为桌面动态壁纸。

**已核实的关键事实**：
- three.js 已在依赖中（`three@^0.185.1` + `@types/three@^0.185.4`，image-to-relief 已用 `await import("three")` 懒加载先例），**无需新装**
- mp4-muxer v5.2.2（MIT，官方已标 deprecated，继任 Mediabunny）→ `npm install -E mp4-muxer@5.2.2` 精确 pin，全部用法隔离在单个 lib 文件便于日后迁移
- mp4-muxer v5 API：`new Muxer({ target: new ArrayBufferTarget(), video: { codec: "avc", width, height, frameRate }, fastStart: "in-memory" })`；喂数据方法是 **`addVideoChunk(chunk, meta)`**；收尾 `muxer.finalize()` → `muxer.target.buffer`
- MediaRecorder mimeType 挑选先例：screen-recorder/page.tsx（L30-57）
- publishedLocales = 6 语言（en/zh/ja/ko/ru/es），de/fr/pt 英文兜底；hreflang 6 语言 + x-default

## 文件清单

### 新增（4 个）
| 文件 | 内容 |
|---|---|
| `src/lib/live-wallpaper-scenes.ts` | 场景库（顶部 `import * as THREE from "three"`，整体由页面 dynamic import）。导出：`SceneKind`、`LiveScene {scene, camera, update(t), dispose()}`、`buildScene(kind, {seed, colors, loopSeconds})`（纯函数，预览/导出各实例化一份）、`createRenderer(canvas, w, h)`（`alpha:false, antialias:true, preserveDrawingBuffer:true`，pixelRatio 1，SRGB）、`PALETTES`（复用静态版 12 组 4 色）、`SIZE_PRESETS`（同静态版 7 预设）、`DURATIONS=[5,10,20]`、`FPS_OPTIONS=[30,60]`、`hashSeed/mulberry32`（从静态版搬入）、`estimateBitrate(w,h,fps)=clamp(W*H*fps*0.15, 5e6, 100e6)` |
| `src/lib/live-wallpaper-export.ts` | 导出管线。导出：`supportsWebCodecsExport(w,h,fps,bitrate)`（VideoEncoder/VideoFrame 检测 + codec 候选列表 isConfigSupported，返回 codec 或 null）、`exportVideo(opts, {onProgress, onMode, signal})`（内部自动选 MP4/WebM 路径）、`renderPoster({...})`（t=0 全分辨率 PNG，一次性 renderer） |
| `src/app/[locale]/tools/live-wallpaper-generator/page.tsx` | "use client"，复制 wallpaper-generator/page.tsx 骨架。UI：场景 3 按钮（Galaxy/Waves/Geometry）、色板 swatches + 自定义 4 色、seed + 🎲、尺寸 select + 自定义宽高（64–7680）、时长 5/10/20s、fps 30/60、预览 canvas（长边 ~640px，setAnimationLoop）、导出按钮（进度 % + 取消）、海报 PNG 按钮。挂载后 `await import("@/lib/live-wallpaper-export")` |
| `src/app/[locale]/tools/live-wallpaper-generator/layout.tsx` | 复制 wallpaper-generator/layout.tsx，替换 slug/namespace（`tools.live-wallpaper-generator.metadata`），hreflang 6 语言 + "x-default" |

### 修改
| 文件 | 改动 |
|---|---|
| `messages/{en,zh,ja,ko,ru,es,de,fr,pt}.json`（9 个） | ① `home.tools["live-wallpaper-generator"]`（name/description/category "Design"/icon 🎬）；② `tools["live-wallpaper-generator"]` 完整块：metadata/title/description/keywords[6]/faqs[4-5]（无缝循环？是否上传？分辨率时长？兼容性？）/relatedTools（wallpaper-generator、svg-wave-generator、image-to-relief）/guide(whatIs/modes/howTo 5 步/tips)/labels/buttons。沿用文本锚点插入法（上次 wallpaper-generator 脚本同款，注意 es 4 空格缩进、CRLF/LF 差异）；de/fr/pt 英文兜底；zh 关键词用真实搜索词（动态壁纸、3d壁纸、live壁纸、动态壁纸制作、电脑动态壁纸、手机动态壁纸） |
| `src/data/scenes.ts` | image 场景 `"wallpaper-generator"` 后插入 `"live-wallpaper-generator"` |
| `src/data/scene-of-slug.ts` | 重新生成：`node scripts/split-home-data.mjs` |
| `public/llms.txt` | 重新生成：`node scripts/generate-llms-txt.mjs` |
| `package.json` | `npm install -E mp4-muxer@5.2.2` |

不改动：sitemap.ts（自动派生）、ToolLayout、ToolMessages。

## 三场景周期循环数学

统一约定：`T`=循环秒数，`p = t/T ∈ [0,1)`。**所有时间项必须是 `2π·k·p`（k 整数）**，保证 f(0) == f(T) 帧级一致。禁止累加状态（`rotation += dt`），必须赋值式 `rotation = 2π·k·p`。

1. **Galaxy**：seeded 3 环组 Points（BufferGeometry + vertexColors + AdditiveBlending），每环 `rotation.y = 2π·k_r·p`（k_r seeded 整数 1..3，差速旋转）；可选相机方位角 `az = 2π·o·p`（o 整数，默认 0 固定机位）
2. **Waves**：PlaneGeometry(120 seg) 逐顶点 `z = Σ A_j·sin(2π·f_j·p + k_j·x + m_j·y + φ_j)`，f_j seeded 整数 → 时间周期；顶点色按高度插值 palette，attribute needsUpdate；固定俯视机位
3. **Geometry**：InstancedMesh(~140 个 icosahedron/torus, MeshStandardMaterial)；实例 i：`angle_i = 2π·n_i·p`（n_i 整数 1..3）、`y = base + B_i·sin(2π·m_i·p + φ_i)`（m_i 整数）；palette[0] 做背景色，静态 AmbientLight + DirectionalLight

## 导出管线

**主路径 WebCodecs → MP4**：
- codec 候选依次试 `avc1.640033`（High@L5.1，覆盖 ≤4K）、`avc1.640064`（L6.0，8K 自定义）、`avc1.4d0033`、`avc1.42003e`，`isConfigSupported` 裁决；`configure` 仍需 try/catch（Safari 可能误报）
- 独立导出 renderer（全尺寸，不复用预览 canvas），场景 `buildScene` 再实例化一份
- `totalFrames = T*fps`（恒整数）；逐帧：`live.update(i/fps)` → `render` → `new VideoFrame(canvas, {timestamp: Math.round(i*1e6/fps), duration})` → `encoder.encode(frame, {keyFrame: i % (2*fps) === 0})` → **`frame.close()`（4K 必须立即关，否则 ~33MB/帧内存爆炸）** → 队列背压 `encodeQueueSize > 4` await → 每 3 帧 `setTimeout(0)` 让出主线程
- abort：直接 `encoder.close()` 不 flush 不 finalize
- 收尾：`flush → close → muxer.finalize()` → `Blob([muxer.target.buffer], {type:"video/mp4"})` → 下载 `live-wallpaper-{seed}-{W}x{H}.mp4`

**Fallback MediaRecorder**（无 VideoEncoder/编码不支持/旧 Safari）：
- `canvas.captureStream(fps)` + mimeType 候选 `["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm", "video/mp4"]`，下载扩展名按实际 mimeType
- 实时录制 T 秒（`setAnimationLoop` 内 `update(elapsed % T)`），timeslice 250ms

**海报 PNG**：一次性 renderer → `update(0)` → toBlob PNG。

**预览/导出关系**：不共享不缩放，各自 buildScene；导出前 `setAnimationLoop(null)` 暂停预览（GPU 争用），结束后恢复；导出 renderer 用毕 dispose。

## 关键坑

1. WebGL canvas 读取（VideoFrame/toBlob/captureStream）必须 `preserveDrawingBuffer: true`
2. three r152+ 保持默认 ColorManagement + SRGBColorSpace，勿设 legacy outputEncoding；`alpha:false`
3. H.264 要求偶数宽高：MP4 路径自定义奇数尺寸需向下取偶（UI 提示），否则落 WebM
4. WebCodecs 无 B 帧，chunk 到达序 = 显示序，直接按序 addVideoChunk，勿重排
5. 第 0 帧必为 keyFrame（closed GOP → 循环 seek 回 0 帧无缝）；~2s GOP
6. 时间戳微秒、`Math.round(i * 1e6 / fps)` 防漂移；muxer 传 frameRate
7. 导出确定性：`update(t)` 只吃显式参数，绝不在内部读时钟
8. 9 个 messages 缺一个该 locale 构建期 next-intl 报错
9. 临时验证脚本用 .mjs 文件（PowerShell 内联 node -e 转义易错）

## 实施顺序

1. `npm install -E mp4-muxer@5.2.2`
2. `src/lib/live-wallpaper-scenes.ts`（先打通预览）
3. `src/lib/live-wallpaper-export.ts`（WebCodecs → fallback → poster）
4. `page.tsx` + `layout.tsx`
5. 9 个 messages + scenes.ts + 两个生成脚本
6. 验证清单

## 验证

1. `npx tsc --noEmit`、`npm run lint`
2. dev server：`/{en,zh,ja,ko,ru,es}/tools/live-wallpaper-generator` 200、预览动画、3 场景切换、seed 可复现、de/fr/pt 英文兜底
3. 导出冒烟（Chrome）：1080p/10s/30fps → MP4 时长恰 10.0s、连播两遍循环处无跳变、取消后可再导出
4. 4K 压测 3840×2160：内存无持续攀升（验证 frame.close()）
5. Fallback：禁用 VideoEncoder（或 Firefox）→ WebM 可播放
6. 海报 PNG 下载
7. `npm run build`：无构建/水合错误；构建输出确认 three/mp4-muxer 仅在该工具页异步 chunk，未进公共包
