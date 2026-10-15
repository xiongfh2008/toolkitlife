// video-transcript 平台扩展：更新 9 个语言文件的文案（新增 Vimeo / Dailymotion / TED）
import fs from "node:fs";

const LOCALES = ["en", "zh", "ja", "ko", "ru", "es", "de", "fr", "pt"];

const T = {
  en: {
    mdDesc: "Paste a YouTube, Bilibili, Vimeo, Dailymotion or TED link to extract a timestamped transcript for free. Copy or export as TXT.",
    desc: "Paste a YouTube, Bilibili, Vimeo, Dailymotion or TED link to instantly extract the full timestamped transcript. Copy everything or download as a TXT file.",
    whatIs: "This tool fetches official or auto-generated subtitles from YouTube, Bilibili, Vimeo, Dailymotion and TED links and converts them into a clean, timestamped text transcript. No video download required, all done online.",
    howTo0: "Paste a video link from YouTube, Bilibili, Vimeo, Dailymotion or TED into the input box.",
    faq0: "YouTube, Bilibili (including b23.tv short links and plain BV IDs), Vimeo, Dailymotion and TED Talks.",
    supported: "Supports YouTube, Bilibili (b23.tv / BV IDs), Vimeo, Dailymotion and TED Talks",
    urlPlaceholder: "Paste a video link, e.g. https://www.youtube.com/watch?v=... or https://www.bilibili.com/video/BV...",
    unsupported: "Unsupported link. Supported platforms: YouTube, Bilibili, Vimeo, Dailymotion and TED.",
    noSubtitle: "No captions are available for this video (Vimeo and Dailymotion videos need uploader-provided captions). For Bilibili videos, paste SESSDATA in the advanced options and retry.",
  },
  zh: {
    mdDesc: "粘贴 YouTube、Bilibili、Vimeo、Dailymotion 或 TED 视频链接，免费在线提取带时间戳的视频文案与字幕，支持复制与导出 TXT。",
    desc: "粘贴 YouTube、B站、Vimeo、Dailymotion 或 TED 视频链接，秒级提取带时间戳的完整文案。支持复制全文与导出 TXT 文件。",
    whatIs: "本工具可从 YouTube、Bilibili、Vimeo、Dailymotion 与 TED 视频链接中抓取官方字幕或自动字幕，生成带时间戳的纯文本文案。无需下载视频，全程在线完成。",
    howTo0: "把 YouTube、B站、Vimeo、Dailymotion 或 TED 的视频链接粘贴到输入框。",
    faq0: "支持 YouTube、Bilibili（含 b23.tv 短链与纯 BV 号）、Vimeo、Dailymotion 与 TED 演讲。",
    supported: "支持 YouTube、Bilibili（b23.tv 短链 / BV 号）、Vimeo、Dailymotion、TED 演讲",
    urlPlaceholder: "粘贴视频链接，例如 https://www.youtube.com/watch?v=... 或 https://www.bilibili.com/video/BV...",
    unsupported: "暂不支持的链接。目前支持 YouTube、Bilibili、Vimeo、Dailymotion 与 TED。",
    noSubtitle: "该视频没有可用字幕（Vimeo、Dailymotion 需视频自带字幕）。B站视频可在高级选项中填写 SESSDATA 后重试。",
  },
  ja: {
    mdDesc: "YouTube、Bilibili、Vimeo、Dailymotion、TED の動画リンクを貼り付けて、タイムスタンプ付きの文字起こしを無料で抽出。コピー・TXT 出力に対応。",
    desc: "YouTube、Bilibili、Vimeo、Dailymotion、TED の動画リンクを貼り付けるだけで、タイムスタンプ付きの全文を瞬時に抽出。全文コピーと TXT ダウンロードに対応。",
    whatIs: "本ツールは YouTube、Bilibili、Vimeo、Dailymotion、TED の動画リンクから公式字幕や自動字幕を取得し、タイムスタンプ付きのテキスト文字起こしを生成します。動画のダウンロードは不要で、すべてオンラインで完結します。",
    howTo0: "YouTube、Bilibili、Vimeo、Dailymotion、TED の動画リンクを入力欄に貼り付けます。",
    faq0: "YouTube、Bilibili（b23.tv 短縮リンク・BV ID 含む）、Vimeo、Dailymotion、TED トークに対応しています。",
    supported: "YouTube、Bilibili（b23.tv / BV ID）、Vimeo、Dailymotion、TED トークに対応",
    urlPlaceholder: "動画リンクを貼り付けてください。例：https://www.youtube.com/watch?v=... または https://www.bilibili.com/video/BV...",
    unsupported: "対応していないリンクです。現在 YouTube、Bilibili、Vimeo、Dailymotion、TED に対応しています。",
    noSubtitle: "この動画には利用可能な字幕がありません（Vimeo・Dailymotion は動画に字幕が必要です）。Bilibili の動画は詳細オプションで SESSDATA を入力してから再試行してください。",
  },
  ko: {
    mdDesc: "YouTube, Bilibili, Vimeo, Dailymotion, TED 영상 링크를 붙여넣어 타임스탬프가 포함된 자막 대본을 무료로 추출하세요. 복사 및 TXT 내보내기 지원.",
    desc: "YouTube, Bilibili, Vimeo, Dailymotion, TED 영상 링크를 붙여넣으면 타임스탬프가 포함된 전체 대본을 즉시 추출합니다. 전체 복사 및 TXT 다운로드를 지원합니다.",
    whatIs: "이 도구는 YouTube, Bilibili, Vimeo, Dailymotion, TED 영상 링크에서 공식 자막 또는 자동 생성 자막을 가져와 타임스탬프가 포함된 텍스트 대본으로 변환합니다. 영상 다운로드 없이 모두 온라인에서 처리됩니다.",
    howTo0: "YouTube, Bilibili, Vimeo, Dailymotion, TED 영상 링크를 입력란에 붙여넣습니다.",
    faq0: "YouTube, Bilibili(b23.tv 단축 링크 및 BV ID 포함), Vimeo, Dailymotion, TED 강연을 지원합니다.",
    supported: "YouTube, Bilibili(b23.tv / BV ID), Vimeo, Dailymotion, TED 강연 지원",
    urlPlaceholder: "영상 링크를 붙여넣으세요. 예: https://www.youtube.com/watch?v=... 또는 https://www.bilibili.com/video/BV...",
    unsupported: "지원되지 않는 링크입니다. 현재 YouTube, Bilibili, Vimeo, Dailymotion, TED를 지원합니다.",
    noSubtitle: "이 영상에는 사용 가능한 자막이 없습니다(Vimeo·Dailymotion은 영상 자체에 자막이 필요합니다). Bilibili 영상은 고급 옵션에서 SESSDATA를 입력한 후 다시 시도하세요.",
  },
  ru: {
    mdDesc: "Вставьте ссылку на видео YouTube, Bilibili, Vimeo, Dailymotion или TED и бесплатно извлеките текст с таймкодами. Копирование и экспорт в TXT.",
    desc: "Вставьте ссылку на видео YouTube, Bilibili, Vimeo, Dailymotion или TED и мгновенно получите полный текст с таймкодами. Копирование и скачивание в TXT.",
    whatIs: "Этот инструмент получает официальные или автоматически созданные субтитры по ссылкам на видео YouTube, Bilibili, Vimeo, Dailymotion и TED и преобразует их в чистый текст с таймкодами. Без скачивания видео, всё онлайн.",
    howTo0: "Вставьте ссылку на видео YouTube, Bilibili, Vimeo, Dailymotion или TED в поле ввода.",
    faq0: "Поддерживаются YouTube, Bilibili (включая короткие ссылки b23.tv и BV ID), Vimeo, Dailymotion и TED Talks.",
    supported: "Поддержка YouTube, Bilibili (b23.tv / BV ID), Vimeo, Dailymotion и TED Talks",
    urlPlaceholder: "Вставьте ссылку на видео, например https://www.youtube.com/watch?v=... или https://www.bilibili.com/video/BV...",
    unsupported: "Неподдерживаемая ссылка. Поддерживаются YouTube, Bilibili, Vimeo, Dailymotion и TED.",
    noSubtitle: "У этого видео нет доступных субтитров (для Vimeo и Dailymotion субтитры должны быть у самого видео). Для Bilibili вставьте SESSDATA в дополнительных параметрах и повторите попытку.",
  },
  es: {
    mdDesc: "Pega un enlace de YouTube, Bilibili, Vimeo, Dailymotion o TED y extrae gratis una transcripción con marcas de tiempo. Copia o exporta en TXT.",
    desc: "Pega un enlace de YouTube, Bilibili, Vimeo, Dailymotion o TED para extraer al instante la transcripción completa con marcas de tiempo. Copia todo o descarga como archivo TXT.",
    whatIs: "Esta herramienta obtiene subtítulos oficiales o generados automáticamente de enlaces de YouTube, Bilibili, Vimeo, Dailymotion y TED, y los convierte en una transcripción limpia con marcas de tiempo. Sin descargar videos, todo en línea.",
    howTo0: "Pega un enlace de video de YouTube, Bilibili, Vimeo, Dailymotion o TED en el cuadro de entrada.",
    faq0: "Compatible con YouTube, Bilibili (incluidos enlaces cortos b23.tv e IDs BV), Vimeo, Dailymotion y TED Talks.",
    supported: "Compatible con YouTube, Bilibili (b23.tv / IDs BV), Vimeo, Dailymotion y TED Talks",
    urlPlaceholder: "Pega un enlace de video, p. ej. https://www.youtube.com/watch?v=... o https://www.bilibili.com/video/BV...",
    unsupported: "Enlace no compatible. Plataformas admitidas: YouTube, Bilibili, Vimeo, Dailymotion y TED.",
    noSubtitle: "Este video no tiene subtítulos disponibles (Vimeo y Dailymotion requieren subtítulos del propio video). Para videos de Bilibili, pega SESSDATA en las opciones avanzadas y reintenta.",
  },
  de: {
    mdDesc: "Füge einen YouTube-, Bilibili-, Vimeo-, Dailymotion- oder TED-Link ein und extrahiere kostenlos ein Transkript mit Zeitstempeln. Kopieren oder als TXT exportieren.",
    desc: "Füge einen YouTube-, Bilibili-, Vimeo-, Dailymotion- oder TED-Link ein, um sofort das vollständige Transkript mit Zeitstempeln zu extrahieren. Alles kopieren oder als TXT-Datei herunterladen.",
    whatIs: "Dieses Tool ruft offizielle oder automatisch erzeugte Untertitel von YouTube-, Bilibili-, Vimeo-, Dailymotion- und TED-Links ab und wandelt sie in ein sauberes, mit Zeitstempeln versehenes Transkript um. Kein Video-Download nötig, alles online.",
    howTo0: "Füge einen Videolink von YouTube, Bilibili, Vimeo, Dailymotion oder TED in das Eingabefeld ein.",
    faq0: "Unterstützt werden YouTube, Bilibili (einschließlich b23.tv-Kurzlinks und BV-IDs), Vimeo, Dailymotion und TED Talks.",
    supported: "Unterstützt YouTube, Bilibili (b23.tv / BV-IDs), Vimeo, Dailymotion und TED Talks",
    urlPlaceholder: "Videolink einfügen, z. B. https://www.youtube.com/watch?v=... oder https://www.bilibili.com/video/BV...",
    unsupported: "Nicht unterstützter Link. Unterstützte Plattformen: YouTube, Bilibili, Vimeo, Dailymotion und TED.",
    noSubtitle: "Für dieses Video sind keine Untertitel verfügbar (Vimeo und Dailymotion benötigen vom Uploader bereitgestellte Untertitel). Für Bilibili-Videos SESSDATA in den erweiterten Optionen einfügen und erneut versuchen.",
  },
  fr: {
    mdDesc: "Collez un lien YouTube, Bilibili, Vimeo, Dailymotion ou TED et extrayez gratuitement une transcription horodatée. Copiez ou exportez en TXT.",
    desc: "Collez un lien YouTube, Bilibili, Vimeo, Dailymotion ou TED pour extraire instantanément la transcription complète horodatée. Copiez tout ou téléchargez en fichier TXT.",
    whatIs: "Cet outil récupère les sous-titres officiels ou générés automatiquement depuis les liens YouTube, Bilibili, Vimeo, Dailymotion et TED, puis les convertit en une transcription texte propre et horodatée. Sans téléchargement de vidéo, tout en ligne.",
    howTo0: "Collez un lien vidéo YouTube, Bilibili, Vimeo, Dailymotion ou TED dans le champ de saisie.",
    faq0: "Compatible avec YouTube, Bilibili (liens courts b23.tv et ID BV inclus), Vimeo, Dailymotion et TED Talks.",
    supported: "Compatible avec YouTube, Bilibili (b23.tv / ID BV), Vimeo, Dailymotion et TED Talks",
    urlPlaceholder: "Collez un lien vidéo, p. ex. https://www.youtube.com/watch?v=... ou https://www.bilibili.com/video/BV...",
    unsupported: "Lien non pris en charge. Plateformes prises en charge : YouTube, Bilibili, Vimeo, Dailymotion et TED.",
    noSubtitle: "Aucun sous-titre disponible pour cette vidéo (Vimeo et Dailymotion nécessitent des sous-titres fournis avec la vidéo). Pour les vidéos Bilibili, collez SESSDATA dans les options avancées et réessayez.",
  },
  pt: {
    mdDesc: "Cole um link do YouTube, Bilibili, Vimeo, Dailymotion ou TED e extraia gratuitamente uma transcrição com marcações de tempo. Copie ou exporte em TXT.",
    desc: "Cole um link do YouTube, Bilibili, Vimeo, Dailymotion ou TED para extrair instantaneamente a transcrição completa com marcações de tempo. Copie tudo ou baixe como arquivo TXT.",
    whatIs: "Esta ferramenta busca legendas oficiais ou geradas automaticamente de links do YouTube, Bilibili, Vimeo, Dailymotion e TED e as converte em uma transcrição de texto limpa com marcações de tempo. Sem download de vídeo, tudo online.",
    howTo0: "Cole um link de vídeo do YouTube, Bilibili, Vimeo, Dailymotion ou TED no campo de entrada.",
    faq0: "Compatível com YouTube, Bilibili (incluindo links curtos b23.tv e IDs BV), Vimeo, Dailymotion e TED Talks.",
    supported: "Compatível com YouTube, Bilibili (b23.tv / IDs BV), Vimeo, Dailymotion e TED Talks",
    urlPlaceholder: "Cole um link de vídeo, ex.: https://www.youtube.com/watch?v=... ou https://www.bilibili.com/video/BV...",
    unsupported: "Link não compatível. Plataformas suportadas: YouTube, Bilibili, Vimeo, Dailymotion e TED.",
    noSubtitle: "Este vídeo não tem legendas disponíveis (Vimeo e Dailymotion exigem legendas do próprio vídeo). Para vídeos do Bilibili, cole o SESSDATA nas opções avançadas e tente novamente.",
  },
};

for (const locale of LOCALES) {
  const p = new URL(`../messages/${locale}.json`, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
  const m = JSON.parse(fs.readFileSync(p, "utf8"));
  const vt = m.tools?.["video-transcript"];
  if (!vt) { console.log(`${locale}: NO video-transcript block, SKIP`); continue; }
  const t = T[locale];

  vt.metadata.description = t.mdDesc;
  vt.description = t.desc;
  vt.guide.whatIs.body[0] = t.whatIs;
  vt.guide.howTo.items[0] = t.howTo0;

  // faqs[0] 应为“支持哪些平台”
  const q = vt.faqs?.[0]?.question ?? "";
  if (/platform|平台|プラットフォーム|플랫폼|платформ|plataformas|Plattformen|plateformes/i.test(q)) {
    vt.faqs[0].answer = t.faq0;
  } else {
    console.log(`${locale}: faqs[0] question mismatch ("${q}"), faq NOT updated`);
  }

  vt.labels.supported = t.supported;
  vt.labels.urlPlaceholder = t.urlPlaceholder;
  vt.errors.unsupported = t.unsupported;
  vt.errors.noSubtitle = t.noSubtitle;

  fs.writeFileSync(p, JSON.stringify(m, null, 2) + "\n");
  console.log(`${locale}: OK`);
}
process.exit(0);
