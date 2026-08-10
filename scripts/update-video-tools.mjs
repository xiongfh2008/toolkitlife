// One-off: inject 4 video tool translations into all locale files.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const messagesDir = join(__dirname, "..", "messages");

const LANGS = ["en", "zh", "ja", "ko"];

const homeNames = {
  "video-trimmer": { en: "Video Trimmer", zh: "视频裁剪工具", ja: "動画トリマー", ko: "영상 자르기" },
  "video-joiner": { en: "Video Joiner", zh: "视频合并工具", ja: "動画結合ツール", ko: "영상 합치기" },
  "video-speed-changer": { en: "Video Speed Changer", zh: "视频变速工具", ja: "動画速度変更", ko: "영상 배속 변경" },
  "video-subtitle-burner": { en: "Subtitle Burner", zh: "字幕烧录工具", ja: "字幕焼き込み", ko: "자막 입히기" },
};
const homeDesc = {
  "video-trimmer": {
    en: "Trim video clips online — lossless fast cut or precise re-encode. Free & private.",
    zh: "快速剪切视频片段，无损或精确重编码，免费在线使用。",
    ja: "動画の不要な部分をカット。無劣化の高速カットまたは高精度リエンコードに対応。",
    ko: "영상 클립을 잘라내는 무료 도구. 무손실 빠른 컷 또는 정밀 재인코딩 지원.",
  },
  "video-joiner": {
    en: "Merge multiple videos into one in order. Free & private.",
    zh: "将多个视频按顺序无缝合并为一个视频，免费在线使用。",
    ja: "複数の動画を順番に1つに結合。無料・ブラウザ内で処理。",
    ko: "여러 영상을 순서대로 하나로 병합. 무료, 브라우저에서 처리.",
  },
  "video-speed-changer": {
    en: "Change video playback speed (0.25x–4x) online. Free & private.",
    zh: "在线调整视频播放速度（0.25x–4x），保留音调不变，免费使用。",
    ja: "動画の再生速度をオンラインで変更（0.25倍〜4倍）。音程はそのまま。",
    ko: "영상 재생 속도를 온라인으로 변경(0.25x~4x). 음높이는 유지됩니다.",
  },
  "video-subtitle-burner": {
    en: "Burn SRT/ASS/VTT subtitles into your video. Free & private.",
    zh: "将 SRT/ASS 字幕烧录到视频画面，支持自定义字体，免费在线使用。",
    ja: "SRT/ASS字幕を動画に焼き込む無料ツール。カスタムフォントも対応。",
    ko: "SRT/ASS 자막을 영상에 입히는 무료 도구. 사용자 글꼴 지원.",
  },
};
const icons = {
  "video-trimmer": "✂️",
  "video-joiner": "🎬",
  "video-speed-changer": "⏩",
  "video-subtitle-burner": "💬",
};
const CAT = { en: "Video Tools", zh: "视频工具", ja: "動画ツール", ko: "영상 도구" };

const D = {
  "video-trimmer": {
    zh: {
      title: "视频裁剪工具",
      metaDesc: "免费在线剪切视频片段：选择起止时间，无损快速剪切或精确重编码，输出 MP4。全程浏览器本地处理、不上传。",
      desc: "上传视频，拖拽选择起止时间，快速无损剪切或精确重编码输出 MP4 片段。所有处理都在浏览器本地完成，视频不会上传。",
      keywords: ["视频裁剪", "视频剪切", "剪切视频", "视频截取", "视频片段", "掐头去尾", "trim video", "cut video"],
      whatIs: "本工具让你拖拽选择视频的起止时间，一键剪切出想要的片段。提供两种模式：无损快剪（流拷贝，秒级完成）和精确重编码（逐帧精确）。处理全部在浏览器本地完成。",
      howTo: ["上传一个视频（拖放或点击选择）。", "拖动开始/结束滑块选择要保留的区间。", "选择剪切模式，点击\u201c剪切视频\u201d，完成后下载 MP4。"],
      tips: ["快速（无损）模式不重新编码，速度极快，适合快速切取较长时间段。", "精确模式重新编码，切点精确到帧，适合需要精确对齐的场景。", "如需删除中间一段，可先剪切两段，再用视频合并工具拼接。"],
      faqs: [
        ["快速（无损）和精确（重编码）有什么区别？", "快速模式使用流拷贝，不重新编码，速度极快但切点可能不完全精确到帧；精确模式重新编码，切点精确但耗时较长。"],
        ["支持哪些视频格式？", "支持 MP4、WebM、MOV 等浏览器可读取的视频格式。"],
        ["我的视频会被上传吗？", "不会。所有处理都在浏览器本地完成，视频不会离开你的设备。"],
        ["无损剪切后为什么文件大小变化不大？", "因为无损模式只做流拷贝、不重新压缩，体积与源片接近；精确模式会重新压缩，体积通常更小。"],
      ],
      labels: {
        dropPrompt: "拖放视频到此处，或点击上传", start: "开始时间", end: "结束时间", mode: "剪切模式",
        modeFast: "快速（无损）", modePrecise: "精确（重编码）",
        modeFastHint: "流拷贝不重新编码，速度极快，切点可能不完全精确", modePreciseHint: "重新编码，切点精确到帧，速度较慢",
        selected: "已选区间 {start} – {end}（时长 {duration}）", resultSize: "视频大小：{size}",
      },
      buttons: { cut: "剪切视频", download: "下载视频", newVideo: "新建视频" },
      progress: { title: "正在剪切视频", keepOpen: "处理完全在您的浏览器中进行，请保持页面打开。" },
      errors: { failed: "剪切失败，请重试。", emptyOutput: "生成结果为空，请调整参数后重试。" },
    },
    en: {
      title: "Video Trimmer",
      metaDesc: "Free online video trimmer: pick start/end times, cut losslessly or re-encode precisely, output MP4. All processing happens in your browser.",
      desc: "Upload a video, drag to choose the start and end times, and cut out the clip you want — fast lossless trim or precise re-encode. Everything runs locally in your browser.",
      keywords: ["video trimmer", "cut video", "trim video", "video cutter", "clip video", "video segment", "crop video"],
      whatIs: "This tool lets you pick the start and end times of a video and cut out the clip you need in one click. Two modes are available: lossless fast trim (stream copy, done in seconds) and precise re-encode (frame-accurate). Everything runs locally in your browser.",
      howTo: ["Upload a video (drag & drop or click).", "Drag the start/end sliders to select the segment you want to keep.", "Choose a mode, click \u201cCut Video\u201d and download the MP4 when done."],
      tips: ["Fast (lossless) mode does not re-encode, so it is very fast — great for grabbing long segments.", "Precise mode re-encodes for frame-accurate cut points.", "To remove a middle section, cut two parts first, then join them with the Video Joiner."],
      faqs: [
        ["What is the difference between fast (lossless) and precise (re-encode)?", "Fast mode uses stream copy without re-encoding, so it is very fast but cut points may not be frame-exact. Precise mode re-encodes for frame-accurate cuts at the cost of speed."],
        ["Which video formats are supported?", "MP4, WebM, MOV and other formats the browser can read."],
        ["Are my videos uploaded?", "No. All processing happens locally in your browser; your video never leaves your device."],
        ["Why is the file size almost unchanged after a lossless cut?", "Because lossless mode only copies streams without recompressing, so the size stays close to the source. Precise mode recompresses and is usually smaller."],
      ],
      labels: {
        dropPrompt: "Drag & drop a video here, or click to upload", start: "Start time", end: "End time", mode: "Cut mode",
        modeFast: "Fast (lossless)", modePrecise: "Precise (re-encode)",
        modeFastHint: "Stream copy, no re-encode — very fast, cut may not be frame-exact", modePreciseHint: "Re-encodes for frame-accurate cuts, slower",
        selected: "Selected {start} – {end} (duration {duration})", resultSize: "Video size: {size}",
      },
      buttons: { cut: "Cut Video", download: "Download", newVideo: "New Video" },
      progress: { title: "Cutting video", keepOpen: "Processing happens entirely in your browser. Keep this tab open." },
      errors: { failed: "Cut failed. Please try again.", emptyOutput: "The generated file is empty. Please adjust the settings and try again." },
    },
    ja: {
      title: "動画トリマー",
      metaDesc: "動画の開始・終了時間を選んでカット。無劣化の高速カットまたは高精度リエンコードでMP4を出力。処理はすべてブラウザ内で完結。",
      desc: "動画をアップロードし、開始・終了時間をドラッグで選択。無劣化の高速カットか高精度リエンコードでMP4を出力します。処理はすべてブラウザ内で行われ、アップロードはされません。",
      keywords: ["動画カット", "動画トリミング", "動画切り取り", "動画編集", "クリップ切り出し", "動画の一部分", "cut video"],
      whatIs: "動画の開始・終了時間をドラッグで選び、ワンクリックで必要な部分を切り出せるツールです。無劣化の高速カット（ストリームコピー）と高精度リエンコードの2モードを用意。処理はすべてブラウザ内で完結します。",
      howTo: ["動画をアップロード（ドラッグ＆ドロップまたはクリック）。", "開始・終了スライダーで残したい範囲を選択。", "モードを選んで\u201c動画をカット\u201dをクリックし、完了したらMP4をダウンロード。"],
      tips: ["高速（無劣化）モードは再エンコードしないため非常に速く、長い区間の切り出しに最適です。", "高精度モードは再エンコードするため、フレーム単位で正確にカットできます。", "途中の一部分を削除したい場合は、2つの部分をカットしてから動画結合ツールでつなぎます。"],
      faqs: [
        ["高速（無劣化）と高精度（再エンコード）の違いは？", "高速モードはストリームコピーで再エンコードしないため速いですが、カット位置がフレーム単位で正確でない場合があります。高精度モードは再エンコードするため正確ですが時間がかかります。"],
        ["対応している動画形式は？", "MP4、WebM、MOVなどブラウザで読み取れる形式に対応しています。"],
        ["動画はアップロードされますか？", "いいえ。すべての処理はブラウザ内で行われ、動画がデバイスの外に出ることはありません。"],
        ["無劣化カット後もファイルサイズがほぼ変わらないのはなぜ？", "無劣化モードは再圧縮せずストリームをコピーするだけのため、サイズは元動画に近くなります。高精度モードは再圧縮するため通常は小さくなります。"],
      ],
      labels: {
        dropPrompt: "ここに動画をドラッグ＆ドロップ、またはクリックしてアップロード", start: "開始時間", end: "終了時間", mode: "カットモード",
        modeFast: "高速（無劣化）", modePrecise: "高精度（再エンコード）",
        modeFastHint: "ストリームコピーで再エンコードなし。非常に高速、フレーム単位でない場合あり", modePreciseHint: "再エンコードでフレーム単位の正確なカット。低速",
        selected: "選択範囲 {start} – {end}（長さ {duration}）", resultSize: "動画サイズ：{size}",
      },
      buttons: { cut: "動画をカット", download: "ダウンロード", newVideo: "新しい動画" },
      progress: { title: "動画をカット中", keepOpen: "処理はすべてブラウザ内で行われます。タブを開いたままにしてください。" },
      errors: { failed: "カットに失敗しました。もう一度お試しください。", emptyOutput: "生成結果が空です。設定を調整してもう一度お試しください。" },
    },
    ko: {
      title: "영상 자르기",
      metaDesc: "영상의 시작·종료 시간을 선택해 자르는 무료 도구. 무손실 빠른 컷 또는 정밀 재인코딩으로 MP4 출력. 모든 처리는 브라우저에서 완료됩니다.",
      desc: "영상을 업로드하고 시작·종료 시간을 드래그로 선택하세요. 무손실 빠른 컷 또는 정밀 재인코딩으로 MP4를 출력합니다. 모든 처리는 브라우저에서 로컬로 진행되며 업로드되지 않습니다.",
      keywords: ["영상 자르기", "영상 편집", "동영상 자르기", "영상 컷", "클립 자르기", "영상 부분", "cut video"],
      whatIs: "영상의 시작·종료 시간을 드래그로 선택해 원하는 부분을 한 번에 잘라내는 도구입니다. 무손실 빠른 컷(스트림 복사)과 정밀 재인코딩 두 가지 모드를 제공합니다. 모든 처리는 브라우저에서 로컬로 이루어집니다.",
      howTo: ["영상을 업로드합니다(드래그 앤 드롭 또는 클릭).", "시작/종료 슬라이더로 남길 구간을 선택합니다.", "모드를 선택하고 \u201c영상 자르기\u201d를 클릭한 뒤 완료되면 MP4를 다운로드합니다."],
      tips: ["빠른(무손실) 모드는 재인코딩하지 않아 매우 빠르며, 긴 구간을 자를 때 좋습니다.", "정밀 모드는 재인코딩하므로 프레임 단위로 정확하게 자를 수 있습니다.", "중간 구간을 삭제하려면 두 부분을 각각 자른 뒤 영상 합치기 도구로 이어 붙이세요."],
      faqs: [
        ["빠른(무손실)과 정밀(재인코딩)의 차이는?", "빠른 모드는 스트림 복사로 재인코딩하지 않아 빠르지만 프레임 단위로 정확하지 않을 수 있습니다. 정밀 모드는 재인코딩하므로 정확하지만 시간이 걸립니다."],
        ["어떤 영상 형식을 지원하나요?", "MP4, WebM, MOV 등 브라우저에서 읽을 수 있는 형식을 지원합니다."],
        ["영상이 업로드되나요?", "아니요. 모든 처리는 브라우저에서 로컬로 진행되며 영상이 기기를 벗어나지 않습니다."],
        ["무손실 컷 후에도 파일 크기가 거의 그대로인 이유는?", "무손실 모드는 재압축 없이 스트림만 복사하므로 크기가 원본에 가깝습니다. 정밀 모드는 재압축하므로 보통 더 작아집니다."],
      ],
      labels: {
        dropPrompt: "영상을 여기에 드래그 앤 드롭하거나 클릭하여 업로드", start: "시작 시간", end: "종료 시간", mode: "자르기 모드",
        modeFast: "빠른 (무손실)", modePrecise: "정밀 (재인코딩)",
        modeFastHint: "스트림 복사, 재인코딩 없음 — 매우 빠름, 프레임 단위로 정확하지 않을 수 있음", modePreciseHint: "프레임 단위로 정확한 컷을 위해 재인코딩, 느림",
        selected: "선택 구간 {start} – {end} (길이 {duration})", resultSize: "영상 크기: {size}",
      },
      buttons: { cut: "영상 자르기", download: "다운로드", newVideo: "새 영상" },
      progress: { title: "영상 자르는 중", keepOpen: "처리는 전적으로 브라우저에서 진행됩니다. 탭을 열어 두세요." },
      errors: { failed: "자르기에 실패했습니다. 다시 시도해 주세요.", emptyOutput: "생성된 파일이 비어 있습니다. 설정을 조정한 후 다시 시도하세요." },
    },
  },

  "video-joiner": {
    zh: {
      title: "视频合并工具",
      metaDesc: "免费在线将多个视频按顺序无缝合并为一个 MP4。同参数视频无损快速合并，全程浏览器本地处理、不上传。",
      desc: "上传多个视频，拖动调整顺序，一键合并为一个 MP4 视频。编码一致的视频可无损快速合并，所有处理在浏览器本地完成。",
      keywords: ["视频合并", "视频拼接", "合并视频", "拼接视频", "视频连接", "多视频合成", "join video", "merge video"],
      whatIs: "本工具把多个视频按顺序拼接为一个 MP4。当视频编码、分辨率一致时使用流拷贝无损合并（速度快、不损失质量）；不一致时自动降级为重新编码合并。",
      howTo: ["上传两个或更多视频（可多选，或多次添加）。", "用上下按钮调整合并顺序，移除不需要的片段。", "点击\u201c合并视频\u201d，完成后下载合并后的 MP4。"],
      tips: ["相同编码和分辨率（如同一软件导出的片段）的视频合并最快、画质无损。", "不同编码的视频会自动走重新编码路径，画质会轻微损失。", "所有处理都在浏览器本地完成，视频不会上传。"],
      faqs: [
        ["合并会重新编码吗？", "编码和参数一致的视频使用流拷贝无损合并（快）；不一致时自动降级为重新编码合并。"],
        ["支持哪些视频格式？", "支持 MP4、WebM、MOV 等浏览器可读取的视频格式。"],
        ["为什么我的合并失败了？", "通常是视频编码/分辨率不一致导致，重新编码路径会自动尝试。建议尽量使用相同参数导出的视频。"],
        ["我的视频会被上传吗？", "不会。所有处理都在浏览器本地完成。"],
      ],
      labels: {
        dropPrompt: "拖放视频到此处，或点击上传", dropHint: "可多选，按添加顺序合并", addMore: "继续添加", remove: "移除",
        moveUp: "上移", moveDown: "下移", joinHint: "提示：编码和分辨率一致的视频合并最快最清晰（无损流拷贝）。", resultSize: "视频大小：{size}",
      },
      buttons: { join: "合并视频", download: "下载视频", newVideo: "新建视频" },
      progress: { title: "正在合并视频", keepOpen: "处理完全在您的浏览器中进行，请保持页面打开。" },
      errors: { failed: "合并失败，请重试。", emptyOutput: "生成结果为空，请调整参数后重试。" },
    },
    en: {
      title: "Video Joiner",
      metaDesc: "Free online tool to merge multiple videos into one MP4 in order. Lossless fast join for matching videos, all processing in your browser.",
      desc: "Upload multiple videos, reorder them with the up/down buttons, and merge them into one MP4 in one click. Matching videos join losslessly; all processing happens locally.",
      keywords: ["video joiner", "merge video", "join video", "combine video", "video merger", "concatenate video"],
      whatIs: "This tool joins multiple videos into one MP4 in the order you set. When codecs and resolution match, it merges with a lossless stream copy (fast, no quality loss); otherwise it automatically falls back to re-encoding.",
      howTo: ["Upload two or more videos (multi-select or add repeatedly).", "Reorder clips with the up/down buttons and remove any you don't need.", "Click \u201cJoin Videos\u201d and download the merged MP4 when done."],
      tips: ["Videos with the same codec and resolution (e.g. clips exported from the same app) join fastest with no quality loss.", "Videos with different codecs automatically take the re-encode path with a small quality loss.", "All processing happens in your browser — nothing is uploaded."],
      faqs: [
        ["Does joining re-encode my videos?", "Videos with matching codecs and parameters are joined losslessly via stream copy (fast). If they differ, it automatically falls back to re-encoding."],
        ["Which video formats are supported?", "MP4, WebM, MOV and other formats the browser can read."],
        ["Why did my merge fail?", "It is usually caused by mismatched codecs/resolutions; the re-encode path is tried automatically. We recommend using videos exported with the same settings."],
        ["Are my videos uploaded?", "No. All processing happens locally in your browser."],
      ],
      labels: {
        dropPrompt: "Drag & drop videos here, or click to upload", dropHint: "Multiple selection supported — merged in order added", addMore: "Add more", remove: "Remove",
        moveUp: "Move up", moveDown: "Move down", joinHint: "Tip: videos with matching codec and resolution join fastest with lossless quality.", resultSize: "Video size: {size}",
      },
      buttons: { join: "Join Videos", download: "Download", newVideo: "New Video" },
      progress: { title: "Joining videos", keepOpen: "Processing happens entirely in your browser. Keep this tab open." },
      errors: { failed: "Join failed. Please try again.", emptyOutput: "The generated file is empty. Please adjust the settings and try again." },
    },
    ja: {
      title: "動画結合ツール",
      metaDesc: "複数の動画を順番に1つのMP4へ結合する無料ツール。同一仕様の動画は無劣化で高速結合。処理はすべてブラウザ内で完結。",
      desc: "複数の動画をアップロードし、上下ボタンで順番を調整して1つのMP4に結合します。仕様が一致する動画は無劣化で結合。すべてブラウザ内で処理されます。",
      keywords: ["動画結合", "動画連結", "動画を結合", "動画を連結", "複数動画合成", "join video", "merge video"],
      whatIs: "複数の動画を指定した順番で1つのMP4に結合するツールです。コーデックと解像度が一致する場合は無劣化のストリームコピーで高速結合し、一致しない場合は自動的に再エンコードに切り替えます。",
      howTo: ["動画を2つ以上アップロード（複数選択または繰り返し追加）。", "上下ボタンで順番を調整し、不要なクリップを削除。", "\u201c動画を結合\u201dをクリックし、完了したら結合後のMP4をダウンロード。"],
      tips: ["同じコーデック・解像度の動画（同じアプリで書き出したクリップなど）は、最も速く画質を落とさず結合できます。", "コーデックが異なる動画は自動的に再エンコード経路になり、画質がわずかに劣化します。", "すべての処理はブラウザ内で行われ、動画はアップロードされません。"],
      faqs: [
        ["結合時に再エンコードされますか？", "コーデックとパラメータが一致する動画はストリームコピーで無劣化結合（高速）。一致しない場合は自動的に再エンコードに切り替わります。"],
        ["対応している動画形式は？", "MP4、WebM、MOVなどブラウザで読み取れる形式に対応しています。"],
        ["結合に失敗するのはなぜ？", "コーデックや解像度の不一致が主な原因です。再エンコード経路が自動的に試行されるため、同じ設定で書き出した動画を使うことを推奨します。"],
        ["動画はアップロードされますか？", "いいえ。すべての処理はブラウザ内で行われます。"],
      ],
      labels: {
        dropPrompt: "ここに動画をドラッグ＆ドロップ、またはクリックしてアップロード", dropHint: "複数選択可 — 追加した順に結合されます", addMore: "さらに追加", remove: "削除",
        moveUp: "上へ", moveDown: "下へ", joinHint: "ヒント：コーデックと解像度が一致する動画は、最も速く画質を落とさず結合できます。", resultSize: "動画サイズ：{size}",
      },
      buttons: { join: "動画を結合", download: "ダウンロード", newVideo: "新しい動画" },
      progress: { title: "動画を結合中", keepOpen: "処理はすべてブラウザ内で行われます。タブを開いたままにしてください。" },
      errors: { failed: "結合に失敗しました。もう一度お試しください。", emptyOutput: "生成結果が空です。設定を調整してもう一度お試しください。" },
    },
    ko: {
      title: "영상 합치기",
      metaDesc: "여러 영상을 순서대로 하나의 MP4로 병합하는 무료 도구. 동일 사양 영상은 무손실 고속 병합. 모든 처리는 브라우저에서 완료됩니다.",
      desc: "영상을 여러 개 업로드하고 위/아래 버튼으로 순서를 조정해 하나의 MP4로 병합하세요. 사양이 같은 영상은 무손실로 병합됩니다. 모든 처리는 브라우저에서 로컬로 진행됩니다.",
      keywords: ["영상 합치기", "영상 병합", "동영상 합치기", "영상 이어붙이기", "영상 연결", "merge video"],
      whatIs: "여러 영상을 지정한 순서대로 하나의 MP4로 병합하는 도구입니다. 코덱과 해상도가 일치하면 무손실 스트림 복사로 고속 병합하고, 다르면 자동으로 재인코딩 경로로 전환합니다.",
      howTo: ["영상을 2개 이상 업로드합니다(다중 선택 또는 반복 추가).", "위/아래 버튼으로 순서를 조정하고 불필요한 클립을 제거합니다.", "\u201c영상 병합\u201d을 클릭하고 완료되면 병합된 MP4를 다운로드합니다."],
      tips: ["같은 코덱과 해상도의 영상(같은 앱에서 내보낸 클립 등)은 가장 빠르고 화질 손실 없이 병합됩니다.", "코덱이 다른 영상은 자동으로 재인코딩 경로를 거치며 화질이 약간 저하됩니다.", "모든 처리는 브라우저에서 로컬로 진행되며 영상이 업로드되지 않습니다."],
      faqs: [
        ["병합 시 재인코딩되나요?", "코덱과 매개변수가 일치하는 영상은 스트림 복사로 무손실 병합(고속)됩니다. 다르면 자동으로 재인코딩 경로로 전환됩니다."],
        ["어떤 영상 형식을 지원하나요?", "MP4, WebM, MOV 등 브라우저에서 읽을 수 있는 형식을 지원합니다."],
        ["병합이 실패하는 이유는?", "코덱/해상도 불일치가 주된 원인이며 재인코딩 경로가 자동으로 시도됩니다. 같은 설정으로 내보낸 영상을 권장합니다."],
        ["영상이 업로드되나요?", "아니요. 모든 처리는 브라우저에서 로컬로 진행됩니다."],
      ],
      labels: {
        dropPrompt: "영상을 여기에 드래그 앤 드롭하거나 클릭하여 업로드", dropHint: "다중 선택 가능 — 추가한 순서대로 병합됩니다", addMore: "더 추가", remove: "제거",
        moveUp: "위로", moveDown: "아래로", joinHint: "팁: 코덱과 해상도가 같은 영상은 가장 빠르고 무손실로 병합됩니다.", resultSize: "영상 크기: {size}",
      },
      buttons: { join: "영상 병합", download: "다운로드", newVideo: "새 영상" },
      progress: { title: "영상 병합 중", keepOpen: "처리는 전적으로 브라우저에서 진행됩니다. 탭을 열어 두세요." },
      errors: { failed: "병합에 실패했습니다. 다시 시도해 주세요.", emptyOutput: "생성된 파일이 비어 있습니다. 설정을 조정한 후 다시 시도하세요." },
    },
  },

  "video-speed-changer": {
    zh: {
      title: "视频变速工具",
      metaDesc: "免费在线调整视频播放速度（0.25x–4x），加速减速均保持音调不变，输出 MP4。全程浏览器本地处理、不上传。",
      desc: "上传视频，选择或拖动速度（0.25x–4x），一键生成变速视频。音频通过 atempo 处理，音调保持不变。所有处理在浏览器本地完成。",
      keywords: ["视频变速", "视频加速", "视频减速", "调整速度", "倍速播放", "慢放", "快进", "speed up video"],
      whatIs: "本工具调整视频播放速度：加速到 4 倍、减速到 0.25 倍都可以。音频使用 atempo 滤镜变速，音调保持不变，不会出现\u201c加速后声音变尖\u201d的问题。",
      howTo: ["上传一个视频（拖放或点击选择）。", "拖动滑块或点击预设按钮选择速度（0.25x–4x）。", "点击\u201c调整速度\u201d，完成后下载变速后的视频。"],
      tips: ["加速后视频时长约为原来的 1/速度倍；减速同理。", "音频会自动与画面同步变速，且音调保持不变。", "处理完全在浏览器本地进行，视频不会上传。"],
      faqs: [
        ["为什么加速后声音不会变尖？", "音频使用 atempo 滤镜变速，变速的同时保持音调（音高）不变。"],
        ["支持多快的加速和多慢的减速？", "支持 0.25 倍到 4 倍。"],
        ["我的视频会被上传吗？", "不会。所有处理都在浏览器本地完成。"],
      ],
      labels: {
        dropPrompt: "拖放视频到此处，或点击上传", speed: "播放速度",
        fasterHint: "加速后画面与声音同步变快，音调保持不变", slowerHint: "减速后画面与声音同步变慢，音调保持不变",
        resultSize: "视频大小：{size}",
      },
      buttons: { change: "调整速度", download: "下载视频", newVideo: "新建视频" },
      progress: { title: "正在调整速度", keepOpen: "处理完全在您的浏览器中进行，请保持页面打开。" },
      errors: { failed: "变速失败，请重试。", emptyOutput: "生成结果为空，请调整参数后重试。" },
    },
    en: {
      title: "Video Speed Changer",
      metaDesc: "Free online tool to change video playback speed from 0.25x to 4x while keeping the audio pitch unchanged. All processing in your browser.",
      desc: "Upload a video, pick or drag a speed (0.25x–4x), and generate a speed-changed video in one click. Audio is processed with atempo so the pitch stays the same. Everything runs locally.",
      keywords: ["video speed changer", "speed up video", "slow down video", "video speed", "change playback speed", "fast forward", "slow motion"],
      whatIs: "This tool changes the playback speed of a video — speed it up to 4x or slow it down to 0.25x. The audio is processed with the atempo filter, so the pitch stays the same instead of going squeaky.",
      howTo: ["Upload a video (drag & drop or click).", "Drag the slider or tap a preset to choose the speed (0.25x–4x).", "Click \u201cChange Speed\u201d and download the result when done."],
      tips: ["After speeding up, the duration is about 1/speed of the original; the same applies when slowing down.", "Audio stays in sync with the picture and the pitch is preserved.", "Processing happens entirely in your browser; the video is never uploaded."],
      faqs: [
        ["Why doesn't the audio sound chipmunk-y after speeding up?", "The audio is processed with the atempo filter, which changes speed while preserving the pitch."],
        ["How fast or slow can I go?", "From 0.25x to 4x."],
        ["Are my videos uploaded?", "No. All processing happens locally in your browser."],
      ],
      labels: {
        dropPrompt: "Drag & drop a video here, or click to upload", speed: "Playback speed",
        fasterHint: "Picture and audio speed up together, pitch is preserved", slowerHint: "Picture and audio slow down together, pitch is preserved",
        resultSize: "Video size: {size}",
      },
      buttons: { change: "Change Speed", download: "Download", newVideo: "New Video" },
      progress: { title: "Changing speed", keepOpen: "Processing happens entirely in your browser. Keep this tab open." },
      errors: { failed: "Speed change failed. Please try again.", emptyOutput: "The generated file is empty. Please adjust the settings and try again." },
    },
    ja: {
      title: "動画速度変更",
      metaDesc: "動画の再生速度を0.25倍〜4倍に変更できる無料ツール。音程はそのまま維持してMP4を出力。処理はすべてブラウザ内で完結。",
      desc: "動画をアップロードし、速度（0.25倍〜4倍）を選んでワンクリックで変更。オーディオはatempoフィルタで処理され、音程が維持されます。すべてブラウザ内で処理されます。",
      keywords: ["動画速度変更", "動画を加速", "動画をスロー", "再生速度変更", "倍速", "スローモーション", "早送り", "video speed"],
      whatIs: "動画の再生速度を変更するツールです。最大4倍の加速、0.25倍までのスローに対応。オーディオはatempoフィルタで処理されるため、音程が維持され\u201c早送りで声が甲高くなる\u201d問題はありません。",
      howTo: ["動画をアップロード（ドラッグ＆ドロップまたはクリック）。", "スライダーまたはプリセットボタンで速度（0.25倍〜4倍）を選択。", "\u201c速度を変更\u201dをクリックし、完了したら結果をダウンロード。"],
      tips: ["加速後は元の約1/速度の長さになります。減速も同様です。", "音声は画面と同期して変速され、音程も維持されます。", "処理はすべてブラウザ内で行われ、動画はアップロードされません。"],
      faqs: [
        ["加速しても音程が変わらないのはなぜ？", "オーディオはatempoフィルタで処理され、速度を変えながら音程（ピッチ）を維持するためです。"],
        ["どこまで加速・減速できますか？", "0.25倍から4倍まで対応しています。"],
        ["動画はアップロードされますか？", "いいえ。すべての処理はブラウザ内で行われます。"],
      ],
      labels: {
        dropPrompt: "ここに動画をドラッグ＆ドロップ、またはクリックしてアップロード", speed: "再生速度",
        fasterHint: "加速後は映像と音声が同期して速くなり、音程は維持されます", slowerHint: "減速後は映像と音声が同期して遅くなり、音程は維持されます",
        resultSize: "動画サイズ：{size}",
      },
      buttons: { change: "速度を変更", download: "ダウンロード", newVideo: "新しい動画" },
      progress: { title: "速度を変更中", keepOpen: "処理はすべてブラウザ内で行われます。タブを開いたままにしてください。" },
      errors: { failed: "速度変更に失敗しました。もう一度お試しください。", emptyOutput: "生成結果が空です。設定を調整してもう一度お試しください。" },
    },
    ko: {
      title: "영상 배속 변경",
      metaDesc: "영상 재생 속도를 0.25x~4x로 변경하는 무료 도구. 음높이를 유지한 채 MP4를 출력. 모든 처리는 브라우저에서 완료됩니다.",
      desc: "영상을 업로드하고 속도(0.25x~4x)를 골라 한 번에 변경하세요. 오디오는 atempo 필터로 처리되어 음높이가 유지됩니다. 모든 처리는 브라우저에서 로컬로 진행됩니다.",
      keywords: ["영상 배속", "영상 빨리 감기", "영상 느리게", "재생 속도 변경", "배속 재생", "슬로우 모션", "빨리 감기", "video speed"],
      whatIs: "영상 재생 속도를 변경하는 도구입니다. 최대 4배 빠르게, 0.25배까지 느리게 할 수 있습니다. 오디오는 atempo 필터로 처리되어 음높이가 유지됩니다.",
      howTo: ["영상을 업로드합니다(드래그 앤 드롭 또는 클릭).", "슬라이더 또는 프리셋 버튼으로 속도(0.25x~4x)를 선택합니다.", "\u201c배속 변경\u201d을 클릭하고 완료되면 결과를 다운로드합니다."],
      tips: ["빨라지면 길이가 원본의 약 1/속도가 됩니다. 느려지는 경우도 마찬가지입니다.", "오디오는 화면과 동기화되어 변속되며 음높이도 유지됩니다.", "처리는 전적으로 브라우저에서 진행되며 영상이 업로드되지 않습니다."],
      faqs: [
        ["빨라져도 음높이가 변하지 않는 이유는?", "오디오가 atempo 필터로 처리되어 속도를 바꾸면서도 음높이(피치)가 유지되기 때문입니다."],
        ["얼마나 빠르게/느리게 할 수 있나요?", "0.25배에서 4배까지 지원합니다."],
        ["영상이 업로드되나요?", "아니요. 모든 처리는 브라우저에서 로컬로 진행됩니다."],
      ],
      labels: {
        dropPrompt: "영상을 여기에 드래그 앤 드롭하거나 클릭하여 업로드", speed: "재생 속도",
        fasterHint: "빨라지면 화면과 음성이 함께 빨라지고 음높이는 유지됩니다", slowerHint: "느려지면 화면과 음성이 함께 느려지고 음높이는 유지됩니다",
        resultSize: "영상 크기: {size}",
      },
      buttons: { change: "배속 변경", download: "다운로드", newVideo: "새 영상" },
      progress: { title: "배속 변경 중", keepOpen: "처리는 전적으로 브라우저에서 진행됩니다. 탭을 열어 두세요." },
      errors: { failed: "배속 변경에 실패했습니다. 다시 시도해 주세요.", emptyOutput: "생성된 파일이 비어 있습니다. 설정을 조정한 후 다시 시도하세요." },
    },
  },

  "video-subtitle-burner": {
    zh: {
      title: "字幕烧录工具",
      metaDesc: "免费在线将 SRT/ASS/VTT 字幕烧录进视频画面，支持自定义字体（中文等）。全程浏览器本地处理、不上传。",
      desc: "上传视频和字幕文件（SRT/ASS/VTT），一键把字幕烧录到画面中，可选用自定义字体。所有处理在浏览器本地完成，视频不会上传。",
      keywords: ["字幕烧录", "字幕嵌入", "字幕合成", "视频字幕", "硬字幕", "srt转视频", "烧字幕", "burn subtitle"],
      whatIs: "本工具把 SRT/ASS/VTT 字幕直接烧录（合成）进视频画面，任何播放器都能看到字幕，无需外挂字幕文件。默认使用 DejaVu Sans 字体；中文字幕建议上传中文字体以获得正确显示。",
      howTo: ["上传一个视频（拖放或点击选择）。", "添加字幕文件（SRT / ASS / VTT），可选上传字体（TTF / OTF）。", "点击\u201c烧录字幕\u201d，完成后下载带字幕的视频。"],
      tips: ["烧录后字幕是画面的一部分，任何播放器、任何平台都能显示。", "默认字体不含中文字形，中文/日文/韩文字幕请上传对应字体（如思源黑体 TTF）。", "视频会重新编码为 H.264，音频保持原样复制，画质损失很小。"],
      faqs: [
        ["烧录字幕和软字幕有什么区别？", "烧录（硬字幕）直接把字幕合成进画面，任何播放器都能看到；软字幕是独立字幕轨道，需要播放器支持。"],
        ["支持哪些字幕格式？", "支持 SRT、ASS、VTT（WebVTT）。"],
        ["为什么中文字幕显示为方框？", "默认字体 DejaVu Sans 不含中文字形，请上传支持中文的字体（如思源黑体 TTF）。"],
        ["我的视频和字幕会被上传吗？", "不会。所有处理都在浏览器本地完成。"],
        ["烧录会损失画质吗？", "视频会重新编码为 H.264，音频保持不变（复制），画质损失很小。"],
      ],
      labels: {
        dropPrompt: "拖放视频到此处，或点击上传", subtitle: "字幕文件",
        subtitleAdd: "点击添加字幕（SRT / ASS / VTT）", subtitleHint: "字幕将烧录进画面，播放器无需加载字幕",
        font: "字体（可选）", fontAdd: "点击添加字体（TTF / OTF）", fontHint: "默认使用 DejaVu Sans；中文等语言请上传对应字体",
        remove: "移除", resultSize: "视频大小：{size}",
      },
      buttons: { burn: "烧录字幕", download: "下载视频", newVideo: "新建视频" },
      progress: { title: "正在烧录字幕", keepOpen: "处理完全在您的浏览器中进行，请保持页面打开。" },
      errors: { failed: "烧录失败，请重试。", emptyOutput: "生成结果为空，请调整参数后重试。", fontDownload: "默认字体下载失败，请检查网络后重试，或上传自定义字体。" },
    },
    en: {
      title: "Subtitle Burner",
      metaDesc: "Free online tool to burn SRT/ASS/VTT subtitles into your video, with optional custom font support. All processing in your browser.",
      desc: "Upload a video and a subtitle file (SRT/ASS/VTT) to burn the subtitles directly into the picture. A custom font is optional. Everything runs locally — nothing is uploaded.",
      keywords: ["subtitle burner", "burn subtitles", "hardcode subtitles", "embed subtitles", "srt to video", "video subtitles"],
      whatIs: "This tool burns (composites) SRT/ASS/VTT subtitles directly into the video picture, so any player can show them without an external subtitle file. It uses DejaVu Sans by default; for Chinese subtitles we recommend uploading a font that supports CJK glyphs.",
      howTo: ["Upload a video (drag & drop or click).", "Add a subtitle file (SRT / ASS / VTT), and optionally a font (TTF / OTF).", "Click \u201cBurn Subtitles\u201d and download the subtitled video when done."],
      tips: ["Burned subtitles are part of the picture — they display in any player on any platform.", "The default font has no CJK glyphs; for Chinese/Japanese/Korean subtitles upload a matching font (e.g. Noto Sans CJK TTF).", "The video is re-encoded to H.264 while the audio is copied as-is, so quality loss is minimal."],
      faqs: [
        ["What is the difference between burned and soft subtitles?", "Burned (hard) subtitles are composited into the picture so any player shows them. Soft subtitles are a separate track that requires player support."],
        ["Which subtitle formats are supported?", "SRT, ASS and VTT (WebVTT)."],
        ["Why do my Chinese subtitles show as boxes?", "The default DejaVu Sans font has no CJK glyphs. Please upload a font that supports Chinese (e.g. Noto Sans CJK TTF)."],
        ["Are my video and subtitles uploaded?", "No. All processing happens locally in your browser."],
        ["Does burning reduce quality?", "The video is re-encoded to H.264 while the audio is copied unchanged, so quality loss is minimal."],
      ],
      labels: {
        dropPrompt: "Drag & drop a video here, or click to upload", subtitle: "Subtitle file",
        subtitleAdd: "Click to add subtitles (SRT / ASS / VTT)", subtitleHint: "Subtitles are burned into the picture — no player support needed",
        font: "Font (optional)", fontAdd: "Click to add a font (TTF / OTF)", fontHint: "Defaults to DejaVu Sans; upload a matching font for CJK subtitles",
        remove: "Remove", resultSize: "Video size: {size}",
      },
      buttons: { burn: "Burn Subtitles", download: "Download", newVideo: "New Video" },
      progress: { title: "Burning subtitles", keepOpen: "Processing happens entirely in your browser. Keep this tab open." },
      errors: { failed: "Burn failed. Please try again.", emptyOutput: "The generated file is empty. Please adjust the settings and try again.", fontDownload: "Failed to download the default font. Check your network and try again, or upload a custom font." },
    },
    ja: {
      title: "字幕焼き込み",
      metaDesc: "SRT/ASS/VTT字幕を動画に焼き込む無料ツール。カスタムフォント対応。処理はすべてブラウザ内で完結。",
      desc: "動画と字幕ファイル（SRT/ASS/VTT）をアップロードして、字幕を画面に直接焼き込みます。カスタムフォントも選択可能。すべてブラウザ内で処理され、アップロードはされません。",
      keywords: ["字幕焼き込み", "字幕を埋め込む", "字幕合成", "動画字幕", "ハード字幕", "srt", "burn subtitle"],
      whatIs: "SRT/ASS/VTT字幕を動画の画面に直接焼き込む（合成する）ツールです。どのプレイヤーでも字幕が表示され、外部字幕ファイルが不要になります。デフォルトはDejaVu Sansフォント。日本語などの字幕は対応フォントのアップロードを推奨します。",
      howTo: ["動画をアップロード（ドラッグ＆ドロップまたはクリック）。", "字幕ファイル（SRT / ASS / VTT）を追加し、必要に応じてフォント（TTF / OTF）も追加。", "\u201c字幕を焼き込み\u201dをクリックし、完了したら字幕付き動画をダウンロード。"],
      tips: ["焼き込んだ字幕は画面の一部になり、どのプレイヤー・どのプラットフォームでも表示されます。", "デフォルトフォントにはCJK字形がありません。日本語などの字幕は対応フォントをアップロードしてください。", "動画はH.264に再エンコードされますが、音声はそのままコピーされるため画質の劣化は最小限です。"],
      faqs: [
        ["焼き込み字幕とソフト字幕の違いは？", "焼き込み（ハード字幕）は字幕を画面に直接合成するため、どのプレイヤーでも表示されます。ソフト字幕は別トラックのためプレイヤーの対応が必要です。"],
        ["対応している字幕形式は？", "SRT、ASS、VTT（WebVTT）に対応しています。"],
        ["日本語の字幕が四角く表示されるのはなぜ？", "デフォルトのDejaVu SansフォントにはCJK字形がないためです。日本語に対応したフォントをアップロードしてください。"],
        ["動画と字幕はアップロードされますか？", "いいえ。すべての処理はブラウザ内で行われます。"],
        ["焼き込みで画質は劣化しますか？", "動画はH.264に再エンコードされますが、音声はそのままコピーされるため劣化は最小限です。"],
      ],
      labels: {
        dropPrompt: "ここに動画をドラッグ＆ドロップ、またはクリックしてアップロード", subtitle: "字幕ファイル",
        subtitleAdd: "クリックして字幕を追加（SRT / ASS / VTT）", subtitleHint: "字幕は画面に焼き込まれます — プレイヤーの対応は不要",
        font: "フォント（任意）", fontAdd: "クリックしてフォントを追加（TTF / OTF）", fontHint: "デフォルトはDejaVu Sans。日本語などの字幕は対応フォントを",
        remove: "削除", resultSize: "動画サイズ：{size}",
      },
      buttons: { burn: "字幕を焼き込み", download: "ダウンロード", newVideo: "新しい動画" },
      progress: { title: "字幕を焼き込み中", keepOpen: "処理はすべてブラウザ内で行われます。タブを開いたままにしてください。" },
      errors: { failed: "焼き込みに失敗しました。もう一度お試しください。", emptyOutput: "生成結果が空です。設定を調整してもう一度お試しください。", fontDownload: "デフォルトフォントのダウンロードに失敗しました。ネットワークを確認するか、カスタムフォントをアップロードしてください。" },
    },
    ko: {
      title: "자막 입히기",
      metaDesc: "SRT/ASS/VTT 자막을 영상에 입히는 무료 도구. 사용자 글꼴 지원. 모든 처리는 브라우저에서 완료됩니다.",
      desc: "영상과 자막 파일(SRT/ASS/VTT)을 업로드해 자막을 화면에 직접 입히세요. 사용자 글꼴도 선택할 수 있습니다. 모든 처리는 브라우저에서 로컬로 진행되며 업로드되지 않습니다.",
      keywords: ["자막 입히기", "자막 합성", "영상 자막", "하드 자막", "srt 영상", "자막 변환", "burn subtitle"],
      whatIs: "SRT/ASS/VTT 자막을 영상 화면에 직접 입히는(합성하는) 도구입니다. 어떤 플레이어에서도 자막이 표시되며 외부 자막 파일이 필요 없습니다. 기본 글꼴은 DejaVu Sans이며, 한글/중국어 등은 해당 글꼴 업로드를 권장합니다.",
      howTo: ["영상을 업로드합니다(드래그 앤 드롭 또는 클릭).", "자막 파일(SRT / ASS / VTT)을 추가하고, 필요 시 글꼴(TTF / OTF)도 추가합니다.", "\u201c자막 입히기\u201d를 클릭하고 완료되면 자막이 입혀진 영상을 다운로드합니다."],
      tips: ["입힌 자막은 화면의 일부가 되어 어떤 플레이어·플랫폼에서도 표시됩니다.", "기본 글꼴에는 CJK 자형이 없습니다. 한글/중국어/일본어 자막은 해당 글꼴을 업로드하세요.", "영상은 H.264로 재인코딩되지만 오디오는 그대로 복사되어 화질 저하가 최소화됩니다."],
      faqs: [
        ["하드 자막과 소프트 자막의 차이는?", "하드 자막은 화면에 직접 합성되어 어떤 플레이어에서도 표시됩니다. 소프트 자막은 별도 트랙이라 플레이어 지원이 필요합니다."],
        ["어떤 자막 형식을 지원하나요?", "SRT, ASS, VTT(WebVTT)를 지원합니다."],
        ["한글 자막이 네모로 표시되는 이유는?", "기본 DejaVu Sans 글꼴에 CJK 자형이 없기 때문입니다. 한글을 지원하는 글꼴을 업로드하세요."],
        ["영상과 자막이 업로드되나요?", "아니요. 모든 처리는 브라우저에서 로컬로 진행됩니다."],
        ["자막을 입히면 화질이 저하되나요?", "영상은 H.264로 재인코딩되지만 오디오는 그대로 복사되어 저하가 최소화됩니다."],
      ],
      labels: {
        dropPrompt: "영상을 여기에 드래그 앤 드롭하거나 클릭하여 업로드", subtitle: "자막 파일",
        subtitleAdd: "클릭하여 자막 추가 (SRT / ASS / VTT)", subtitleHint: "자막이 화면에 입혀집니다 — 플레이어 지원 불필요",
        font: "글꼴 (선택)", fontAdd: "클릭하여 글꼴 추가 (TTF / OTF)", fontHint: "기본값 DejaVu Sans; 한글 등은 해당 글꼴 업로드",
        remove: "제거", resultSize: "영상 크기: {size}",
      },
      buttons: { burn: "자막 입히기", download: "다운로드", newVideo: "새 영상" },
      progress: { title: "자막 입히는 중", keepOpen: "처리는 전적으로 브라우저에서 진행됩니다. 탭을 열어 두세요." },
      errors: { failed: "자막 입히기에 실패했습니다. 다시 시도해 주세요.", emptyOutput: "생성된 파일이 비어 있습니다. 설정을 조정한 후 다시 시도하세요.", fontDownload: "기본 글꼴 다운로드에 실패했습니다. 네트워크를 확인하거나 사용자 글꼴을 업로드하세요." },
    },
  },
};

function buildGuide(lang, slug, d) {
  const title = d.title;
  return {
    whatIs: {
      title:
        lang === "zh" ? `什么是${title}？` : lang === "ja" ? `${title}とは？` : lang === "ko" ? `${title}란?` : `What is a ${title}?`,
      body: [d.whatIs],
    },
    howTo: {
      title: lang === "zh" ? "如何使用" : lang === "ja" ? "使い方" : lang === "ko" ? "사용 방법" : "How to use",
      intro: lang === "zh" ? "三步完成：" : lang === "ja" ? "3ステップで完了：" : lang === "ko" ? "3단계로 완료:" : "Done in three steps:",
      items: d.howTo,
    },
    tips: {
      title: lang === "zh" ? "小提示" : lang === "ja" ? "ヒント" : lang === "ko" ? "팁" : "Tips",
      items: d.tips,
    },
  };
}

function buildFaqs(lang, d) {
  return d.faqs.map(([q, a]) => ({ question: q, answer: a }));
}

function buildTool(lang, slug) {
  const d = D[slug][lang];
  const title = d.title;
  const others = Object.keys(D).filter((s) => s !== slug);
  const relatedTools = others.map((s) => ({
    name: homeNames[s][lang],
    href: `/tools/${s}`,
  }));
  return {
    metadata: { title: `${title} - ${lang === "zh" ? "免费在线工具" : lang === "ja" ? "無料オンラインツール" : lang === "ko" ? "무료 온라인 도구" : "Free Online Tool"}`, description: d.metaDesc },
    title,
    description: d.desc,
    category: CAT[lang],
    keywords: d.keywords,
    guide: buildGuide(lang, slug, d),
    faqs: buildFaqs(lang, d),
    relatedTools,
    labels: d.labels,
    buttons: d.buttons,
    progress: d.progress,
    errors: d.errors,
  };
}

for (const lang of LANGS) {
  const file = join(messagesDir, `${lang}.json`);
  const data = JSON.parse(readFileSync(file, "utf8"));
  for (const slug of Object.keys(D)) {
    data.home.tools[slug] = {
      name: homeNames[slug][lang],
      description: homeDesc[slug][lang],
      category: CAT[lang],
      icon: icons[slug],
    };
    data.tools[slug] = buildTool(lang, slug);
  }
  if (typeof data.home.heroBadge === "string" && data.home.heroBadge.includes("209")) {
    data.home.heroBadge = data.home.heroBadge.replace("209", "213");
  }
  writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log(`updated ${lang}`);
}
