// One-off generator: life-scene tool-data JSON (part 8: 2 tools).
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const LOCALES = ["en", "zh", "ja", "ko", "ru"];
const CAT = {
  en: "Life Tools",
  zh: "生活工具",
  ja: "生活ツール",
  ko: "생활 도구",
  ru: "Повседневные инструменты",
};

function build(entry) {
  const out = { slug: entry.slug, icon: entry.icon, home: {}, tools: {} };
  for (const loc of LOCALES) {
    const h = entry.home[loc];
    const t = entry.tools[loc];
    out.home[loc] = { name: h.name, description: h.description, category: CAT[loc] };
    out.tools[loc] = {
      metadata: { title: t.metaTitle, description: t.metaDesc },
      title: t.title,
      description: t.description,
      category: CAT[loc],
      keywords: t.keywords,
      faqs: t.faqs,
      relatedTools: t.related.map((r) => ({ name: r.name[loc], href: r.href })),
      labels: t.labels,
      buttons: t.buttons,
      ...(t.errors ? { errors: t.errors } : {}),
    };
  }
  return out;
}

const TOOLS = [
  {
    slug: "web-shortcut",
    icon: "🔗",
    home: {
      en: { name: "Web Shortcut Maker", description: "Generate a .url shortcut file for any website." },
      zh: { name: "网址快捷方式", description: "为任意网址生成 .url 快捷方式文件。" },
      ja: { name: "ウェブショートカット", description: "任意のURLから .url ショートカットを生成します。" },
      ko: { name: "웹 바로가기", description: "원하는 URL의 .url 바로가기 파일을 생성합니다." },
      ru: { name: "Ярлык сайта", description: "Создайте файл-ярлык .url для любого сайта." },
    },
    tools: {
      en: {
        metaTitle: "Web Shortcut Maker - Generate .url Files Online",
        metaDesc: "Free online .url shortcut generator. Turn any URL into a Windows internet shortcut file with an optional icon. Runs in your browser.",
        title: "Web Shortcut Maker",
        description: "Enter a website URL (and optionally a name and icon) to generate a .url internet shortcut file for Windows.",
        keywords: ["web shortcut", "url shortcut", "create shortcut", "internet shortcut", ".url file", "desktop shortcut"],
        faqs: [
          { q: "Where can I use the .url file?", a: "Windows recognizes .url files as internet shortcuts — put them on your desktop or in a folder and double-click to open the site." },
          { q: "Can I add a custom icon?", a: "Yes — enter a local .ico/.png path, or a web URL to an icon file, and it will be attached to the shortcut." },
        ],
        related: [
          { name: { en: "URL Opener", zh: "批量打开网址", ja: "一括URL表示", ko: "URL 일괄 열기", ru: "Открыть URL" }, href: "/tools/url-opener" },
          { name: { en: "URL Shortener", zh: "短链接生成", ja: "短縮URL", ko: "단축 URL", ru: "Короткие ссылки" }, href: "/tools/url-shortener" },
          { name: { en: "QR Code Generator", zh: "二维码生成", ja: "QRコード生成", ko: "QR 코드 생성", ru: "Генератор QR" }, href: "/tools/qr-code-generator" },
        ],
        labels: {
          name: "Shortcut name",
          namePlaceholder: "My Website (optional)",
          url: "Website URL",
          icon: "Icon (optional)",
          iconPlaceholder: "Path or URL to an .ico/.png icon",
        },
        buttons: { download: "Download .url" },
      },
      zh: {
        metaTitle: "网址快捷方式 - 在线生成 .url 文件",
        metaDesc: "免费在线网址快捷方式生成器，将任意网址转换为 Windows 网络快捷方式文件，可附带图标。全程在浏览器本地完成。",
        title: "网址快捷方式",
        description: "输入网址（可选名称与图标），生成 Windows 的 .url 网络快捷方式文件。",
        keywords: ["网址快捷方式", "url快捷方式", "生成快捷方式", "网络快捷方式", "url文件", "桌面快捷方式"],
        faqs: [
          { q: ".url 文件在哪里用？", a: "Windows 将 .url 识别为网络快捷方式，放到桌面或文件夹里双击即可打开网站。" },
          { q: "可以加自定义图标吗？", a: "可以。输入本地 .ico/.png 路径或图标的网络地址即可附加到快捷方式。" },
        ],
        related: [
          { name: { en: "URL Opener", zh: "批量打开网址", ja: "一括URL表示", ko: "URL 일괄 열기", ru: "Открыть URL" }, href: "/tools/url-opener" },
          { name: { en: "URL Shortener", zh: "短链接生成", ja: "短縮URL", ko: "단축 URL", ru: "Короткие ссылки" }, href: "/tools/url-shortener" },
          { name: { en: "QR Code Generator", zh: "二维码生成", ja: "QRコード生成", ko: "QR 코드 생성", ru: "Генератор QR" }, href: "/tools/qr-code-generator" },
        ],
        labels: {
          name: "快捷方式名称",
          namePlaceholder: "我的网站（可选）",
          url: "网站地址",
          icon: "图标（可选）",
          iconPlaceholder: ".ico/.png 图标的路径或网址",
        },
        buttons: { download: "下载 .url" },
      },
      ja: {
        metaTitle: "ウェブショートカット - オンラインで .url を生成",
        metaDesc: "任意のURLをWindowsのインターネットショートカット（.url）にする無料ツール。アイコンも設定可能。ブラウザ内で完結。",
        title: "ウェブショートカット",
        description: "URL（任意で名前とアイコン）を入力して、Windows用の .url ネットショートカットファイルを生成します。",
        keywords: ["ウェブショートカット", "urlショートカット", "ショートカット作成", "インターネットショートカット", "urlファイル", "デスクトップショートカット"],
        faqs: [
          { q: ".url ファイルはどこで使えますか？", a: "Windowsは .url をネットショートカットとして認識します。デスクトップに置いてダブルクリックでサイトを開けます。" },
          { q: "カスタムアイコンを設定できますか？", a: "はい。ローカルの .ico/.png パスか、アイコンファイルのURLを入力するとショートカットに付きます。" },
        ],
        related: [
          { name: { en: "URL Opener", zh: "批量打开网址", ja: "一括URL表示", ko: "URL 일괄 열기", ru: "Открыть URL" }, href: "/tools/url-opener" },
          { name: { en: "URL Shortener", zh: "短链接生成", ja: "短縮URL", ko: "단축 URL", ru: "Короткие ссылки" }, href: "/tools/url-shortener" },
          { name: { en: "QR Code Generator", zh: "二维码生成", ja: "QRコード生成", ko: "QR 코드 생성", ru: "Генератор QR" }, href: "/tools/qr-code-generator" },
        ],
        labels: {
          name: "ショートカット名",
          namePlaceholder: "マイサイト（任意）",
          url: "ウェブサイトURL",
          icon: "アイコン（任意）",
          iconPlaceholder: ".ico/.png アイコンのパスまたはURL",
        },
        buttons: { download: ".url をダウンロード" },
      },
      ko: {
        metaTitle: "웹 바로가기 - 온라인 .url 파일 생성",
        metaDesc: "원하는 URL을 Windows 인터넷 바로가기(.url) 파일로 만드는 무료 도구입니다. 아이콘 설정도 가능하며 브라우저에서 완료됩니다.",
        title: "웹 바로가기",
        description: "웹사이트 URL(선택적으로 이름과 아이콘)을 입력해 Windows용 .url 인터넷 바로가기 파일을 생성합니다.",
        keywords: ["웹 바로가기", "url 바로가기", "바로가기 만들기", "인터넷 바로가기", "url 파일", "바탕화면 바로가기"],
        faqs: [
          { q: ".url 파일은 어디에 사용하나요?", a: "Windows는 .url을 인터넷 바로가기로 인식합니다. 바탕화면에 두고 더블클릭하면 사이트가 열립니다." },
          { q: "커스텀 아이콘을 넣을 수 있나요?", a: "네. 로컬 .ico/.png 경로 또는 아이콘 파일의 URL을 입력하면 바로가기에 첨부됩니다." },
        ],
        related: [
          { name: { en: "URL Opener", zh: "批量打开网址", ja: "一括URL表示", ko: "URL 일괄 열기", ru: "Открыть URL" }, href: "/tools/url-opener" },
          { name: { en: "URL Shortener", zh: "短链接生成", ja: "短縮URL", ko: "단축 URL", ru: "Короткие ссылки" }, href: "/tools/url-shortener" },
          { name: { en: "QR Code Generator", zh: "二维码生成", ja: "QRコード生成", ko: "QR 코드 생성", ru: "Генератор QR" }, href: "/tools/qr-code-generator" },
        ],
        labels: {
          name: "바로가기 이름",
          namePlaceholder: "내 웹사이트 (선택)",
          url: "웹사이트 URL",
          icon: "아이콘 (선택)",
          iconPlaceholder: ".ico/.png 아이콘 경로 또는 URL",
        },
        buttons: { download: ".url 다운로드" },
      },
      ru: {
        metaTitle: "Ярлык сайта - создать файл .url онлайн",
        metaDesc: "Бесплатный онлайн-генератор ярлыков .url. Превратите любой URL в интернет-ярлык Windows с необязательной иконкой. Всё в браузере.",
        title: "Ярлык сайта",
        description: "Введите URL сайта (и при желании имя и иконку), чтобы создать интернет-ярлык Windows в формате .url.",
        keywords: ["ярлык сайта", "ярлык url", "создать ярлык", "интернет-ярлык", "файл .url", "ярлык на рабочий стол"],
        faqs: [
          { q: "Где использовать файл .url?", a: "Windows распознаёт .url как интернет-ярлык — поместите его на рабочий стол или в папку и откройте двойным кликом." },
          { q: "Можно добавить свою иконку?", a: "Да — укажите локальный путь к .ico/.png или веб-адрес файла иконки, и она прикрепится к ярлыку." },
        ],
        related: [
          { name: { en: "URL Opener", zh: "批量打开网址", ja: "一括URL表示", ko: "URL 일괄 열기", ru: "Открыть URL" }, href: "/tools/url-opener" },
          { name: { en: "URL Shortener", zh: "短链接生成", ja: "短縮URL", ko: "단축 URL", ru: "Короткие ссылки" }, href: "/tools/url-shortener" },
          { name: { en: "QR Code Generator", zh: "二维码生成", ja: "QRコード生成", ko: "QR 코드 생성", ru: "Генератор QR" }, href: "/tools/qr-code-generator" },
        ],
        labels: {
          name: "Имя ярлыка",
          namePlaceholder: "Мой сайт (необязательно)",
          url: "URL сайта",
          icon: "Иконка (необязательно)",
          iconPlaceholder: "Путь или URL иконки .ico/.png",
        },
        buttons: { download: "Скачать .url" },
      },
    },
  },
  {
    slug: "zip-viewer",
    icon: "🗜️",
    home: {
      en: { name: "ZIP Viewer", description: "List files inside a ZIP archive without extracting." },
      zh: { name: "ZIP 文件查看", description: "不解压即可查看 ZIP 包内文件列表。" },
      ja: { name: "ZIPビューア", description: "解凍せずにZIP内のファイル一覧を表示します。" },
      ko: { name: "ZIP 뷰어", description: "압축 해제 없이 ZIP 내부 파일 목록을 확인합니다." },
      ru: { name: "Просмотр ZIP", description: "Просматривайте файлы внутри ZIP без распаковки." },
    },
    tools: {
      en: {
        metaTitle: "ZIP Viewer - List Archive Contents Online",
        metaDesc: "Free online ZIP viewer. Upload a ZIP file and see every file inside it with its size — no extraction needed. Runs entirely in your browser.",
        title: "ZIP Viewer",
        description: "Upload a ZIP archive to instantly list every file inside, with sizes, without extracting or uploading anything to a server.",
        keywords: ["zip viewer", "list zip contents", "view zip file", "zip file reader", "archive viewer", "zip contents"],
        faqs: [
          { q: "Is my ZIP uploaded to a server?", a: "No. The archive is parsed entirely in your browser with JSZip, so the file never leaves your device." },
          { q: "Can I extract files?", a: "This tool only lists contents. For extraction, use a local archive manager." },
        ],
        related: [
          { name: { en: "File Converter", zh: "文件转换", ja: "ファイル変換", ko: "파일 변환", ru: "Конвертер файлов" }, href: "/tools/document-converter" },
          { name: { en: "File Size Checker", zh: "文件大小", ja: "ファイルサイズ", ko: "파일 크기", ru: "Размер файла" }, href: "/tools/image-file-size" },
          { name: { en: "Image Compressor", zh: "图片压缩", ja: "画像圧縮", ko: "이미지 압축", ru: "Сжатие изображений" }, href: "/tools/image-compressor" },
        ],
        labels: {
          invalid: "This doesn't look like a valid ZIP file.",
          loading: "Reading archive…",
          count: "{count, plural, one {# file} other {# files}}",
        },
        buttons: { choose: "Choose ZIP File" },
      },
      zh: {
        metaTitle: "ZIP 文件查看 - 在线查看压缩包内容",
        metaDesc: "免费在线 ZIP 查看器，上传 ZIP 文件即可查看包内所有文件及其大小，无需解压。全程在浏览器本地完成。",
        title: "ZIP 文件查看",
        description: "上传 ZIP 压缩包，立即列出包内所有文件及大小，无需解压，也不会向服务器上传任何内容。",
        keywords: ["zip查看", "查看压缩包", "zip文件列表", "zip读取", "压缩包查看", "zip内容"],
        faqs: [
          { q: "ZIP 会上传到服务器吗？", a: "不会。压缩包完全在浏览器中通过 JSZip 解析，文件不会离开你的设备。" },
          { q: "可以解压文件吗？", a: "本工具只提供列表查看，解压请使用本地压缩软件。" },
        ],
        related: [
          { name: { en: "File Converter", zh: "文件转换", ja: "ファイル変換", ko: "파일 변환", ru: "Конвертер файлов" }, href: "/tools/document-converter" },
          { name: { en: "File Size Checker", zh: "文件大小", ja: "ファイルサイズ", ko: "파일 크기", ru: "Размер файла" }, href: "/tools/image-file-size" },
          { name: { en: "Image Compressor", zh: "图片压缩", ja: "画像圧縮", ko: "이미지 압축", ru: "Сжатие изображений" }, href: "/tools/image-compressor" },
        ],
        labels: {
          invalid: "这不是有效的 ZIP 文件。",
          loading: "正在读取压缩包…",
          count: "共 {count, plural, =1 {1 个} other {# 个}}文件",
        },
        buttons: { choose: "选择 ZIP 文件" },
      },
      ja: {
        metaTitle: "ZIPビューア - オンラインで内容を一覧表示",
        metaDesc: "ZIPファイルをアップロードすると、解凍せずに内部の全ファイルとサイズを確認できる無料ツール。ブラウザ内で完結。",
        title: "ZIPビューア",
        description: "ZIPファイルをアップロードすると、解凍せずに内部の全ファイルとサイズを即座に一覧表示します。",
        keywords: ["zipビューア", "zip内容一覧", "zipを表示", "zip読み取り", "アーカイブ表示", "zipファイル"],
        faqs: [
          { q: "ZIPはサーバーに送信されますか？", a: "いいえ。JSZipでブラウザ内だけで解析するため、ファイルは端末の外に出ません。" },
          { q: "解凍はできますか？", a: "このツールは一覧表示のみです。解凍はローカルのアーカイバをご利用ください。" },
        ],
        related: [
          { name: { en: "File Converter", zh: "文件转换", ja: "ファイル変換", ko: "파일 변환", ru: "Конвертер файлов" }, href: "/tools/document-converter" },
          { name: { en: "File Size Checker", zh: "文件大小", ja: "ファイルサイズ", ko: "파일 크기", ru: "Размер файла" }, href: "/tools/image-file-size" },
          { name: { en: "Image Compressor", zh: "图片压缩", ja: "画像圧縮", ko: "이미지 압축", ru: "Сжатие изображений" }, href: "/tools/image-compressor" },
        ],
        labels: {
          invalid: "有効なZIPファイルではありません。",
          loading: "アーカイブを読み込み中…",
          count: "全 {count, plural, =1 {1 ファイル} other {# ファイル}}",
        },
        buttons: { choose: "ZIPファイルを選択" },
      },
      ko: {
        metaTitle: "ZIP 뷰어 - 온라인 압축 파일 내용 보기",
        metaDesc: "ZIP 파일을 업로드하면 압축 해제 없이 내부의 모든 파일과 크기를 확인할 수 있는 무료 도구입니다. 브라우저에서 완료됩니다.",
        title: "ZIP 뷰어",
        description: "ZIP 압축 파일을 업로드하면 압축 해제 없이 내부의 모든 파일과 크기를 즉시 나열합니다.",
        keywords: ["zip 뷰어", "zip 내용 보기", "zip 파일 목록", "zip 읽기", "압축 파일 보기", "zip 내용"],
        faqs: [
          { q: "ZIP이 서버로 업로드되나요?", a: "아니요. JSZip으로 브라우저 안에서만 파싱하므로 파일이 기기를 떠나지 않습니다." },
          { q: "압축을 풀 수 있나요?", a: "이 도구는 목록만 제공합니다. 해제는 로컬 압축 프로그램을 사용하세요." },
        ],
        related: [
          { name: { en: "File Converter", zh: "文件转换", ja: "ファイル変換", ko: "파일 변환", ru: "Конвертер файлов" }, href: "/tools/document-converter" },
          { name: { en: "File Size Checker", zh: "文件大小", ja: "ファイルサイズ", ko: "파일 크기", ru: "Размер файла" }, href: "/tools/image-file-size" },
          { name: { en: "Image Compressor", zh: "图片压缩", ja: "画像圧縮", ko: "이미지 압축", ru: "Сжатие изображений" }, href: "/tools/image-compressor" },
        ],
        labels: {
          invalid: "유효한 ZIP 파일이 아닙니다.",
          loading: "압축 파일을 읽는 중…",
          count: "총 {count, plural, =1 {1개} other {#개}} 파일",
        },
        buttons: { choose: "ZIP 파일 선택" },
      },
      ru: {
        metaTitle: "Просмотр ZIP - список содержимого архива онлайн",
        metaDesc: "Бесплатный онлайн-просмотрщик ZIP. Загрузите ZIP и увидите все файлы внутри с размерами — без распаковки. Всё в браузере.",
        title: "Просмотр ZIP",
        description: "Загрузите ZIP-архив, чтобы мгновенно увидеть все файлы внутри с размерами — без распаковки и загрузки на сервер.",
        keywords: ["просмотр zip", "список файлов zip", "открыть zip", "чтение zip", "просмотр архива", "содержимое zip"],
        faqs: [
          { q: "ZIP загружается на сервер?", a: "Нет. Архив разбирается прямо в браузере с помощью JSZip, файл не покидает ваше устройство." },
          { q: "Можно ли извлечь файлы?", a: "Этот инструмент только показывает содержимое. Для извлечения используйте локальный архиватор." },
        ],
        related: [
          { name: { en: "File Converter", zh: "文件转换", ja: "ファイル変換", ko: "파일 변환", ru: "Конвертер файлов" }, href: "/tools/document-converter" },
          { name: { en: "File Size Checker", zh: "文件大小", ja: "ファイルサイズ", ko: "파일 크기", ru: "Размер файла" }, href: "/tools/image-file-size" },
          { name: { en: "Image Compressor", zh: "图片压缩", ja: "画像圧縮", ko: "이미지 압축", ru: "Сжатие изображений" }, href: "/tools/image-compressor" },
        ],
        labels: {
          invalid: "Похоже, это не ZIP-файл.",
          loading: "Чтение архива…",
          count: "{count, plural, one {# файл} few {# файла} other {# файлов}}",
        },
        buttons: { choose: "Выбрать ZIP" },
      },
    },
  },
];

const dir = join(process.cwd(), "scripts", "tool-data");
for (const entry of TOOLS) {
  writeFileSync(join(dir, `${entry.slug}.json`), JSON.stringify(build(entry), null, 2) + "\n", "utf8");
  console.log(`wrote ${entry.slug}.json`);
}
