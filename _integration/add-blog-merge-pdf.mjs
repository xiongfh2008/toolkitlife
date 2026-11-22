// Removes the abandoned compress-images slug, adds blogPosts["how-to-merge-pdf-files"] meta to all locales.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const STALE = "how-to-compress-images-without-losing-quality";
const SLUG = "how-to-merge-pdf-files";

const COPY = {
  en: {
    title: "How to Merge PDF Files Online for Free — Combine Multiple PDFs Into One (2026 Guide)",
    description: "Learn how to merge PDF files online for free: combine multiple PDFs into one document, reorder pages before merging, merge scanned documents, receipts or statements on Windows, Mac, iPhone and Android. No watermark, no signup, no file size limit, and no upload — everything runs in your browser.",
  },
  zh: {
    title: "如何免费在线合并 PDF：把多个 PDF 合并成一个文件（2026 指南）",
    description: "手把手教你在线免费合并 PDF：把多个 PDF 文件合并成一个文档、合并前调整页面顺序、合并扫描件/收据/银行流水，Windows、Mac、iPhone、安卓通用。无水印、无需注册、无文件大小限制、文件不上传——全程在浏览器本地完成。",
  },
  ja: {
    title: "PDF を無料でオンライン結合する方法——複数の PDF を1つにまとめる（2026ガイド）",
    description: "オンラインで無料の PDF 結合を解説：複数の PDF を1つの文書に結合、結合前のページ順序変更、スキャン書類・領収書・銀行明細の結合、Windows・Mac・iPhone・Android 対応。透かしなし、登録不要、サイズ制限なし、アップロードなし——すべてブラウザ内で完結。",
  },
  ko: {
    title: "무료 온라인 PDF 병합 방법 — 여러 PDF를 하나로 합치기 (2026 가이드)",
    description: "온라인에서 무료로 PDF를 병합하는 법: 여러 PDF 파일을 하나의 문서로 결합, 병합 전 페이지 순서 변경, 스캔 문서·영수증·은행 명세서 병합, Windows·Mac·iPhone·Android 지원. 워터마크 없음, 가입 없음, 크기 제한 없음, 업로드 없음 — 모두 브라우저에서 처리.",
  },
  ru: {
    title: "Как объединить PDF файлы онлайн бесплатно — несколько PDF в один (гайд 2026)",
    description: "Как бесплатно объединить PDF онлайн: соединить несколько PDF в один документ, изменить порядок страниц перед объединением, объединить сканы, чеки или выписки на Windows, Mac, iPhone и Android. Без водяных знаков, без регистрации, без лимитов, без загрузки на сервер — всё в вашем браузере.",
  },
  es: {
    title: "Cómo combinar archivos PDF online gratis — unir varios PDF en uno (guía 2026)",
    description: "Aprende a combinar PDF online gratis: unir varios PDF en un solo documento, reordenar páginas antes de combinar, fusionar documentos escaneados, recibos o extractos en Windows, Mac, iPhone y Android. Sin marca de agua, sin registro, sin límites de tamaño y sin subidas — todo en tu navegador.",
  },
  de: {
    title: "PDF-Dateien kostenlos online zusammenfügen — mehrere PDFs zu einem verbinden (Anleitung 2026)",
    description: "So fügen Sie PDFs kostenlos online zusammen: mehrere PDF-Dateien zu einem Dokument verbinden, Seiten vor dem Zusammenfügen sortieren, Scans, Belege oder Kontoauszüge auf Windows, Mac, iPhone und Android zusammenführen. Ohne Wasserzeichen, ohne Anmeldung, ohne Größenlimits und ohne Upload — alles im Browser.",
  },
  fr: {
    title: "Comment fusionner des fichiers PDF en ligne gratuitement — regrouper plusieurs PDF en un (guide 2026)",
    description: "Apprenez à fusionner des PDF en ligne gratuitement : regrouper plusieurs fichiers PDF en un seul document, réorganiser les pages avant la fusion, assembler des scans, reçus ou relevés sur Windows, Mac, iPhone et Android. Sans filigrane, sans inscription, sans limite de taille et sans téléversement — tout dans votre navigateur.",
  },
  pt: {
    title: "Como juntar arquivos PDF online grátis — combinar vários PDFs em um (guia 2026)",
    description: "Aprenda a combinar PDF online grátis: unir vários arquivos PDF em um único documento, reordenar páginas antes de combinar, juntar documentos escaneados, recibos ou extratos no Windows, Mac, iPhone e Android. Sem marca d'água, sem cadastro, sem limite de tamanho e sem upload — tudo no seu navegador.",
  },
};

for (const [locale, copy] of Object.entries(COPY)) {
  const file = path.join(ROOT, "messages", `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  if (data.blogPosts && data.blogPosts[STALE]) {
    delete data.blogPosts[STALE];
  }
  data.blogPosts = data.blogPosts || {};
  data.blogPosts[SLUG] = copy;
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log(`${locale}: ${STALE} removed, ${SLUG} added`);
}
console.log("OK");
