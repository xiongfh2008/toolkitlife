// Adds the `promoBanner` message namespace (close button label + banner alt
// text) to every locale file.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd());

const COPY = {
  en: { alt: "WallHaze — free wallpapers for desktop, tablet and mobile", close: "Close ad" },
  zh: { alt: "WallHaze — 免费下载桌面、平板和手机壁纸", close: "关闭广告" },
  ja: { alt: "WallHaze — デスクトップ・タブレット・スマホ向けの無料壁紙", close: "広告を閉じる" },
  ko: { alt: "WallHaze — 데스크톱, 태블릿, 모바일용 무료 배경화면", close: "광고 닫기" },
  ru: { alt: "WallHaze — бесплатные обои для компьютера, планшета и телефона", close: "Закрыть рекламу" },
  es: { alt: "WallHaze — fondos de pantalla gratis para escritorio, tablet y móvil", close: "Cerrar anuncio" },
  de: { alt: "WallHaze — kostenlose Hintergrundbilder für Desktop, Tablet und Smartphone", close: "Anzeige schließen" },
  fr: { alt: "WallHaze — fonds d'écran gratuits pour ordinateur, tablette et mobile", close: "Fermer l'annonce" },
  pt: { alt: "WallHaze — papéis de parede grátis para desktop, tablet e celular", close: "Fechar anúncio" },
};

for (const [locale, copy] of Object.entries(COPY)) {
  const file = path.join(ROOT, "messages", `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  data.promoBanner = copy;
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log(`${locale}: promoBanner added`);
}
console.log("OK");
