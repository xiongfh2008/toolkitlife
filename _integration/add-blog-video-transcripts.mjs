// Adds blogPosts["how-to-extract-video-transcripts"] {title, description} to all locale files.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd());

const COPY = {
  en: {
    title: "How to Extract Video Transcripts from YouTube, Bilibili, Vimeo, Dailymotion & TED (Free, 2026 Guide)",
    description: "Turn any video into searchable text in under a minute. Platform-by-platform guide to extracting transcripts from YouTube, Bilibili (SESSDATA required), Vimeo, Dailymotion and TED — with timestamps, SRT/VTT download, troubleshooting, and 7 practical ways to use transcripts.",
  },
  zh: {
    title: "如何提取 YouTube、B 站、Vimeo、Dailymotion 与 TED 视频的文字稿（2026 免费指南）",
    description: "一分钟内把任意视频变成可检索的文本。逐平台讲解提取 YouTube、B 站（需 SESSDATA）、Vimeo、Dailymotion 和 TED 字幕的完整方法——含时间戳、SRT/VTT 下载、常见问题排查与 7 种文字稿实用玩法。",
  },
  ja: {
    title: "YouTube・Bilibili・Vimeo・Dailymotion・TED から動画の文字起こしを抽出する方法（2026年無料ガイド）",
    description: "どんな動画でも1分以内に検索可能なテキストに。YouTube、Bilibili（SESSDATA が必要）、Vimeo、Dailymotion、TED から字幕を抽出する方法をプラットフォーム別に解説——タイムスタンプ、SRT/VTT ダウンロード、トラブルシューティング、文字起こしの7つの活用法まで。",
  },
  ko: {
    title: "YouTube, Bilibili, Vimeo, Dailymotion, TED 영상 스크립트 추출 방법 (2026 무료 가이드)",
    description: "어떤 영상이든 1분 안에 검색 가능한 텍스트로. YouTube, Bilibili(SESSDATA 필요), Vimeo, Dailymotion, TED에서 자막을 추출하는 플랫폼별 완전 가이드 — 타임스탬프, SRT/VTT 다운로드, 문제 해결, 스크립트 활용 7가지까지.",
  },
  ru: {
    title: "Как извлечь транскрипт видео с YouTube, Bilibili, Vimeo, Dailymotion и TED (бесплатный гайд 2026)",
    description: "Превратите любое видео в доступный для поиска текст менее чем за минуту. Пошаговое руководство по извлечению субтитров с YouTube, Bilibili (требуется SESSDATA), Vimeo, Dailymotion и TED — с таймкодами, скачиванием SRT/VTT, решением проблем и 7 способами использовать транскрипты.",
  },
  es: {
    title: "Cómo extraer transcripciones de vídeos de YouTube, Bilibili, Vimeo, Dailymotion y TED (guía gratuita 2026)",
    description: "Convierte cualquier vídeo en texto buscable en menos de un minuto. Guía plataforma por plataforma para extraer subtítulos de YouTube, Bilibili (requiere SESSDATA), Vimeo, Dailymotion y TED — con marcas de tiempo, descarga en SRT/VTT, solución de problemas y 7 usos prácticos de las transcripciones.",
  },
  de: {
    title: "Video-Transkripte von YouTube, Bilibili, Vimeo, Dailymotion & TED extrahieren (kostenloser Guide 2026)",
    description: "Verwandle jedes Video in weniger als einer Minute in durchsuchbaren Text. Plattform-für-Plattform-Anleitung zum Extrahieren von Untertiteln von YouTube, Bilibili (SESSDATA erforderlich), Vimeo, Dailymotion und TED — mit Zeitstempeln, SRT/VTT-Download, Fehlerbehebung und 7 praktischen Verwendungszwecken.",
  },
  fr: {
    title: "Comment extraire la transcription de vidéos YouTube, Bilibili, Vimeo, Dailymotion et TED (guide gratuit 2026)",
    description: "Transformez n'importe quelle vidéo en texte consultable en moins d'une minute. Guide plateforme par plateforme pour extraire les sous-titres de YouTube, Bilibili (SESSDATA requis), Vimeo, Dailymotion et TED — avec horodatage, téléchargement SRT/VTT, dépannage et 7 utilisations pratiques des transcriptions.",
  },
  pt: {
    title: "Como extrair transcrições de vídeos do YouTube, Bilibili, Vimeo, Dailymotion e TED (guia gratuito 2026)",
    description: "Transforme qualquer vídeo em texto pesquisável em menos de um minuto. Guia plataforma por plataforma para extrair legendas de YouTube, Bilibili (requer SESSDATA), Vimeo, Dailymotion e TED — com marcações de tempo, download em SRT/VTT, solução de problemas e 7 usos práticos de transcrições.",
  },
};

for (const [locale, copy] of Object.entries(COPY)) {
  const file = path.join(ROOT, "messages", `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  data.blogPosts = data.blogPosts || {};
  data.blogPosts["how-to-extract-video-transcripts"] = copy;
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log(`${locale}: blog post meta added`);
}
console.log("OK");
