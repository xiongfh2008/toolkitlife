// One-off generator: life-scene tool-data JSON (part 7: 3 tools).
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
    slug: "bank-card-validate",
    icon: "💳",
    home: {
      en: { name: "Card Number Check", description: "Validate a bank card number with the Luhn algorithm." },
      zh: { name: "银行卡校验", description: "使用 Luhn 算法校验银行卡号。" },
      ja: { name: "カード番号チェック", description: "Luhnアルゴリズムでカード番号を検証します。" },
      ko: { name: "카드 번호 검증", description: "Luhn 알고리즘으로 카드 번호를 검증합니다." },
      ru: { name: "Проверка номера карты", description: "Проверьте номер банковской карты алгоритмом Луна." },
    },
    tools: {
      en: {
        metaTitle: "Card Number Check - Validate with Luhn Online",
        metaDesc: "Free online bank card number validator using the Luhn algorithm. Check whether a card number passes the checksum. Runs in your browser.",
        title: "Card Number Check",
        description: "Enter a card number to check whether it passes the Luhn checksum — the same check used by payment networks to catch typos.",
        keywords: ["card number check", "luhn algorithm", "validate card number", "credit card check", "card validator", "luhn check"],
        faqs: [
          { q: "What is the Luhn algorithm?", a: "A simple checksum formula used by payment cards to catch mistyped digits. It validates the number's structure, not whether the card exists." },
          { q: "Is my card number stored?", a: "No. Everything is processed locally in your browser; nothing is sent or saved." },
        ],
        related: [
          { name: { en: "Random Password Generator", zh: "随机密码", ja: "ランダムパスワード", ko: "랜덤 비밀번호", ru: "Генератор паролей" }, href: "/tools/password-generator" },
          { name: { en: "Hash Generator", zh: "哈希生成", ja: "ハッシュ生成", ko: "해시 생성", ru: "Генератор хэша" }, href: "/tools/hash-generator" },
          { name: { en: "QR Code Generator", zh: "二维码生成", ja: "QRコード生成", ko: "QR 코드 생성", ru: "Генератор QR" }, href: "/tools/qr-code-generator" },
        ],
        labels: {
          placeholder: "Enter card number (spaces allowed)",
          valid: "This number passes the Luhn check",
          invalid: "This number fails the Luhn check",
          luhnNote: "Luhn only verifies the checksum — it does not confirm the card exists.",
        },
        buttons: { validate: "Validate" },
      },
      zh: {
        metaTitle: "银行卡校验 - Luhn 算法在线校验",
        metaDesc: "免费在线银行卡号校验工具，使用 Luhn 算法检测卡号是否符合校验规则。全程在浏览器本地完成。",
        title: "银行卡校验",
        description: "输入卡号，检测它是否通过 Luhn 校验和——这是支付网络用于发现输入错误的方法。",
        keywords: ["银行卡校验", "luhn算法", "卡号校验", "信用卡校验", "银行卡验证", "luhn校验"],
        faqs: [
          { q: "什么是 Luhn 算法？", a: "支付卡用于发现数字输入错误的简单校验和公式。它只验证号码结构，不验证卡是否存在。" },
          { q: "卡号会被保存吗？", a: "不会。所有处理都在浏览器本地完成，不会发送或保存任何数据。" },
        ],
        related: [
          { name: { en: "Random Password Generator", zh: "随机密码", ja: "ランダムパスワード", ko: "랜덤 비밀번호", ru: "Генератор паролей" }, href: "/tools/password-generator" },
          { name: { en: "Hash Generator", zh: "哈希生成", ja: "ハッシュ生成", ko: "해시 생성", ru: "Генератор хэша" }, href: "/tools/hash-generator" },
          { name: { en: "QR Code Generator", zh: "二维码生成", ja: "QRコード生成", ko: "QR 코드 생성", ru: "Генератор QR" }, href: "/tools/qr-code-generator" },
        ],
        labels: {
          placeholder: "输入银行卡号（可含空格）",
          valid: "该号码通过 Luhn 校验",
          invalid: "该号码未通过 Luhn 校验",
          luhnNote: "Luhn 只校验校验和，不能确认卡真实存在。",
        },
        buttons: { validate: "校验" },
      },
      ja: {
        metaTitle: "カード番号チェック - Luhnでオンライン検証",
        metaDesc: "Luhnアルゴリズムでカード番号のチェックサムを検証する無料ツール。ブラウザ内で完結。",
        title: "カード番号チェック",
        description: "カード番号を入力してLuhnチェックサムを通過するか確認します。入力ミスを見つける決済ネットワークと同じ方法です。",
        keywords: ["カード番号チェック", "luhnアルゴリズム", "カード検証", "クレジットカードチェック", "luhnチェック", "番号検証"],
        faqs: [
          { q: "Luhnアルゴリズムとは？", a: "誤入力を見つけるための簡易チェックサム方式です。番号の構造を検証するだけで、カードの存在は確認しません。" },
          { q: "番号は保存されますか？", a: "いいえ。すべてブラウザ内で処理され、送信・保存はされません。" },
        ],
        related: [
          { name: { en: "Random Password Generator", zh: "随机密码", ja: "ランダムパスワード", ko: "랜덤 비밀번호", ru: "Генератор паролей" }, href: "/tools/password-generator" },
          { name: { en: "Hash Generator", zh: "哈希生成", ja: "ハッシュ生成", ko: "해시 생성", ru: "Генератор хэша" }, href: "/tools/hash-generator" },
          { name: { en: "QR Code Generator", zh: "二维码生成", ja: "QRコード生成", ko: "QR 코드 생성", ru: "Генератор QR" }, href: "/tools/qr-code-generator" },
        ],
        labels: {
          placeholder: "カード番号を入力（スペース可）",
          valid: "この番号はLuhnチェックを通過します",
          invalid: "この番号はLuhnチェックを通過しません",
          luhnNote: "Luhnはチェックサムのみ検証し、カードの存在は確認しません。",
        },
        buttons: { validate: "検証" },
      },
      ko: {
        metaTitle: "카드 번호 검증 - Luhn 알고리즘 온라인",
        metaDesc: "Luhn 알고리즘으로 카드 번호 체크섬을 검증하는 무료 도구입니다. 브라우저에서 완료됩니다.",
        title: "카드 번호 검증",
        description: "카드 번호를 입력해 Luhn 체크섬을 통과하는지 확인합니다. 오타를 찾는 결제망과 동일한 방식입니다.",
        keywords: ["카드 번호 검증", "luhn 알고리즘", "카드 검증", "신용카드 확인", "luhn 체크", "번호 검증"],
        faqs: [
          { q: "Luhn 알고리즘이란 무엇인가요?", a: "오타를 찾기 위한 간단한 체크섬 공식입니다. 번호의 구조만 검증하며 카드 존재 여부는 확인하지 않습니다." },
          { q: "카드 번호가 저장되나요?", a: "아니요. 모든 처리는 브라우저에서 로컬로 진행되며 전송되거나 저장되지 않습니다." },
        ],
        related: [
          { name: { en: "Random Password Generator", zh: "随机密码", ja: "ランダムパスワード", ko: "랜덤 비밀번호", ru: "Генератор паролей" }, href: "/tools/password-generator" },
          { name: { en: "Hash Generator", zh: "哈希生成", ja: "ハッシュ生成", ko: "해시 생성", ru: "Генератор хэша" }, href: "/tools/hash-generator" },
          { name: { en: "QR Code Generator", zh: "二维码生成", ja: "QRコード生成", ko: "QR 코드 생성", ru: "Генератор QR" }, href: "/tools/qr-code-generator" },
        ],
        labels: {
          placeholder: "카드 번호 입력 (공백 허용)",
          valid: "이 번호는 Luhn 검증을 통과합니다",
          invalid: "이 번호는 Luhn 검증을 통과하지 못합니다",
          luhnNote: "Luhn은 체크섬만 검증하며 카드 존재 여부는 확인하지 않습니다.",
        },
        buttons: { validate: "검증" },
      },
      ru: {
        metaTitle: "Проверка номера карты - Luhn онлайн",
        metaDesc: "Бесплатный онлайн-валидатор номера карты по алгоритму Луна. Проверьте, проходит ли номер контрольную сумму. Всё в браузере.",
        title: "Проверка номера карты",
        description: "Введите номер карты и проверьте, проходит ли он контрольную сумму Луна — ту же проверку, что используют платёжные сети.",
        keywords: ["проверка номера карты", "алгоритм луна", "валидация карты", "проверка карты", "luhn", "контрольная сумма карты"],
        faqs: [
          { q: "Что такое алгоритм Луна?", a: "Простая контрольная сумма, которой платёжные карты ловят опечатки. Она проверяет структуру номера, а не существование карты." },
          { q: "Номер карты сохраняется?", a: "Нет. Всё обрабатывается локально в браузере; ничего не отправляется и не сохраняется." },
        ],
        related: [
          { name: { en: "Random Password Generator", zh: "随机密码", ja: "ランダムパスワード", ko: "랜덤 비밀번호", ru: "Генератор паролей" }, href: "/tools/password-generator" },
          { name: { en: "Hash Generator", zh: "哈希生成", ja: "ハッシュ生成", ko: "해시 생성", ru: "Генератор хэша" }, href: "/tools/hash-generator" },
          { name: { en: "QR Code Generator", zh: "二维码生成", ja: "QRコード生成", ko: "QR 코드 생성", ru: "Генератор QR" }, href: "/tools/qr-code-generator" },
        ],
        labels: {
          placeholder: "Введите номер карты (можно с пробелами)",
          valid: "Номер проходит проверку Луна",
          invalid: "Номер не проходит проверку Луна",
          luhnNote: "Лун проверяет только контрольную сумму — существование карты он не подтверждает.",
        },
        buttons: { validate: "Проверить" },
      },
    },
  },
  {
    slug: "text-reader",
    icon: "📖",
    home: {
      en: { name: "Text Reader", description: "Paste text and read it in a large comfortable layout." },
      zh: { name: "文本阅读", description: "粘贴文本，以大字舒适排版阅读。" },
      ja: { name: "テキストリーダー", description: "テキストを貼り付けて快適な大文字で読みます。" },
      ko: { name: "텍스트 리더", description: "텍스트를 붙여넣어 큰 글씨로 편하게 읽습니다." },
      ru: { name: "Читалка текста", description: "Вставьте текст и читайте его в крупном удобном формате." },
    },
    tools: {
      en: {
        metaTitle: "Text Reader - Comfortable Large-Text Reading",
        metaDesc: "Free online text reader. Paste any text and read it in a clean, large, comfortable layout with adjustable font size and line height. Runs in your browser.",
        title: "Text Reader",
        description: "Paste any text and switch to reading mode: a clean layout with adjustable font size and line height for comfortable reading.",
        keywords: ["text reader", "large text reading", "reading mode", "comfortable reading", "text viewer", "read mode"],
        faqs: [
          { q: "Can I adjust the text size?", a: "Yes — font size from 12px to 40px and line height from 1.2 to 2.6 are both adjustable with sliders." },
          { q: "Is my text stored anywhere?", a: "No. Everything stays in your browser tab; nothing is uploaded or saved." },
        ],
        related: [
          { name: { en: "Text to Speech", zh: "文字转语音", ja: "テキスト読み上げ", ko: "텍스트 음성 변환", ru: "Текст в речь" }, href: "/tools/text-to-speech" },
          { name: { en: "Word Counter", zh: "字数统计", ja: "単語数カウント", ko: "단어 수 세기", ru: "Счётчик слов" }, href: "/tools/word-counter" },
          { name: { en: "Reverse Text", zh: "文字倒序", ja: "テキスト反転", ko: "텍스트 뒤집기", ru: "Переворот текста" }, href: "/tools/reverse-text" },
        ],
        labels: {
          placeholder: "Paste or type your text here…",
          fontSize: "Font size",
          lineHeight: "Line height",
          empty: "Paste some text to start reading",
        },
        buttons: { read: "Start Reading", hide: "Back to Editor" },
      },
      zh: {
        metaTitle: "文本阅读 - 大字舒适排版阅读",
        metaDesc: "免费在线文本阅读器，粘贴任意文本即可进入干净大字阅读模式，支持调节字号与行距。全程在浏览器本地完成。",
        title: "文本阅读",
        description: "粘贴任意文本，切换到阅读模式：干净的排版，可调节字号与行距，阅读更舒适。",
        keywords: ["文本阅读", "大字阅读", "阅读模式", "舒适阅读", "文本查看", "阅读器"],
        faqs: [
          { q: "可以调节文字大小吗？", a: "可以。字号可在 12px 到 40px、行距在 1.2 到 2.6 之间用滑块调节。" },
          { q: "文本会被保存吗？", a: "不会。一切都在浏览器标签页内完成，不会上传或保存。" },
        ],
        related: [
          { name: { en: "Text to Speech", zh: "文字转语音", ja: "テキスト読み上げ", ko: "텍스트 음성 변환", ru: "Текст в речь" }, href: "/tools/text-to-speech" },
          { name: { en: "Word Counter", zh: "字数统计", ja: "単語数カウント", ko: "단어 수 세기", ru: "Счётчик слов" }, href: "/tools/word-counter" },
          { name: { en: "Reverse Text", zh: "文字倒序", ja: "テキスト反転", ko: "텍스트 뒤집기", ru: "Переворот текста" }, href: "/tools/reverse-text" },
        ],
        labels: {
          placeholder: "在此粘贴或输入文本…",
          fontSize: "字号",
          lineHeight: "行距",
          empty: "粘贴一些文本即可开始阅读",
        },
        buttons: { read: "开始阅读", hide: "返回编辑" },
      },
      ja: {
        metaTitle: "テキストリーダー - 快適な大文字リーディング",
        metaDesc: "テキストを貼り付けて、文字サイズと行間を調整できるクリーンな大文字レイアウトで読む無料ツール。ブラウザ内で完結。",
        title: "テキストリーダー",
        description: "任意のテキストを貼り付けて読み取りモードへ。文字サイズと行間を調整できる快適なレイアウトです。",
        keywords: ["テキストリーダー", "大文字リーディング", "読み取りモード", "快適な読書", "テキストビューア", "リードモード"],
        faqs: [
          { q: "文字サイズは変更できますか？", a: "はい。文字サイズ12〜40px、行間1.2〜2.6をスライダーで調整できます。" },
          { q: "テキストは保存されますか？", a: "いいえ。ブラウザのタブ内で完結し、アップロードや保存はされません。" },
        ],
        related: [
          { name: { en: "Text to Speech", zh: "文字转语音", ja: "テキスト読み上げ", ko: "텍스트 음성 변환", ru: "Текст в речь" }, href: "/tools/text-to-speech" },
          { name: { en: "Word Counter", zh: "字数统计", ja: "単語数カウント", ko: "단어 수 세기", ru: "Счётчик слов" }, href: "/tools/word-counter" },
          { name: { en: "Reverse Text", zh: "文字倒序", ja: "テキスト反転", ko: "텍스트 뒤집기", ru: "Переворот текста" }, href: "/tools/reverse-text" },
        ],
        labels: {
          placeholder: "ここにテキストを貼り付け…",
          fontSize: "文字サイズ",
          lineHeight: "行間",
          empty: "テキストを貼り付けて読み始めましょう",
        },
        buttons: { read: "読み始める", hide: "編集に戻る" },
      },
      ko: {
        metaTitle: "텍스트 리더 - 큰 글씨로 편하게 읽기",
        metaDesc: "텍스트를 붙여넣고 글꼴 크기와 줄 간격을 조절하며 큰 글씨로 읽는 무료 도구입니다. 브라우저에서 완료됩니다.",
        title: "텍스트 리더",
        description: "원하는 텍스트를 붙여넣고 읽기 모드로 전환하세요. 글꼴 크기와 줄 간격을 조정할 수 있는 깔끔한 레이아웃입니다.",
        keywords: ["텍스트 리더", "큰 글씨 읽기", "읽기 모드", "편안한 읽기", "텍스트 뷰어", "리더 모드"],
        faqs: [
          { q: "글자 크기를 조절할 수 있나요?", a: "네. 글꼴 크기 12~40px, 줄 간격 1.2~2.6을 슬라이더로 조절할 수 있습니다." },
          { q: "텍스트가 저장되나요?", a: "아니요. 브라우저 탭 안에서만 처리되며 업로드되거나 저장되지 않습니다." },
        ],
        related: [
          { name: { en: "Text to Speech", zh: "文字转语音", ja: "テキスト読み上げ", ko: "텍스트 음성 변환", ru: "Текст в речь" }, href: "/tools/text-to-speech" },
          { name: { en: "Word Counter", zh: "字数统计", ja: "単語数カウント", ko: "단어 수 세기", ru: "Счётчик слов" }, href: "/tools/word-counter" },
          { name: { en: "Reverse Text", zh: "文字倒序", ja: "テキスト反転", ko: "텍스트 뒤집기", ru: "Переворот текста" }, href: "/tools/reverse-text" },
        ],
        labels: {
          placeholder: "여기에 텍스트를 붙여넣으세요…",
          fontSize: "글꼴 크기",
          lineHeight: "줄 간격",
          empty: "텍스트를 붙여넣으면 읽기를 시작합니다",
        },
        buttons: { read: "읽기 시작", hide: "편집으로 돌아가기" },
      },
      ru: {
        metaTitle: "Читалка текста - удобное чтение крупным шрифтом",
        metaDesc: "Бесплатная онлайн-читалка. Вставьте любой текст и читайте его в чистом крупном формате с настраиваемым шрифтом и интервалом. Всё в браузере.",
        title: "Читалка текста",
        description: "Вставьте любой текст и включите режим чтения: чистый макет с настраиваемым размером шрифта и межстрочным интервалом.",
        keywords: ["читалка текста", "крупный текст", "режим чтения", "удобное чтение", "просмотр текста", "режим читателя"],
        faqs: [
          { q: "Можно ли менять размер текста?", a: "Да — размер шрифта от 12 до 40px и интервал от 1.2 до 2.6 настраиваются ползунками." },
          { q: "Текст где-то сохраняется?", a: "Нет. Всё остаётся в вашей вкладке; ничего не загружается и не сохраняется." },
        ],
        related: [
          { name: { en: "Text to Speech", zh: "文字转语音", ja: "テキスト読み上げ", ko: "텍스트 음성 변환", ru: "Текст в речь" }, href: "/tools/text-to-speech" },
          { name: { en: "Word Counter", zh: "字数统计", ja: "単語数カウント", ko: "단어 수 세기", ru: "Счётчик слов" }, href: "/tools/word-counter" },
          { name: { en: "Reverse Text", zh: "文字倒序", ja: "テキスト反転", ko: "텍스트 뒤집기", ru: "Переворот текста" }, href: "/tools/reverse-text" },
        ],
        labels: {
          placeholder: "Вставьте или введите текст здесь…",
          fontSize: "Размер шрифта",
          lineHeight: "Интервал",
          empty: "Вставьте текст, чтобы начать чтение",
        },
        buttons: { read: "Читать", hide: "Вернуться к редактору" },
      },
    },
  },
  {
    slug: "vcf-generator",
    icon: "📇",
    home: {
      en: { name: "VCF Generator", description: "Turn a name+phone list into a contacts VCF file." },
      zh: { name: "通讯录生成", description: "将姓名+手机号列表生成通讯录 VCF 文件。" },
      ja: { name: "VCF生成", description: "名前と電話番号のリストから連絡先VCFを生成。" },
      ko: { name: "VCF 생성", description: "이름+전화번호 목록을 연락처 VCF 파일로 변환합니다." },
      ru: { name: "Генератор VCF", description: "Превратите список имён и номеров в файл контактов VCF." },
    },
    tools: {
      en: {
        metaTitle: "VCF Generator - Create Contacts File Online",
        metaDesc: "Free online VCF generator. Paste a name and phone number list to create a .vcf contacts file you can import to your phone. Runs in your browser.",
        title: "VCF Generator",
        description: "Paste a list of names and phone numbers, one per line, and download a .vcf file that imports directly into your phone's contacts app.",
        keywords: ["vcf generator", "vcard generator", "contacts file", "import contacts", "vcf file", "phone contacts"],
        faqs: [
          { q: "How do I import the file?", a: "Download the .vcf, then open it from your phone's file manager — your contacts app will offer to import it." },
          { q: "What formats are accepted?", a: "Each line should be: name then phone number, separated by a tab, comma, or semicolon." },
        ],
        related: [
          { name: { en: "QR Code Generator", zh: "二维码生成", ja: "QRコード生成", ko: "QR 코드 생성", ru: "Генератор QR" }, href: "/tools/qr-code-generator" },
          { name: { en: "Card Number Check", zh: "银行卡校验", ja: "カード番号チェック", ko: "카드 번호 검증", ru: "Проверка карты" }, href: "/tools/bank-card-validate" },
          { name: { en: "Text to Image", zh: "文字转图片", ja: "テキストを画像に", ko: "텍스트를 이미지로", ru: "Текст в картинку" }, href: "/tools/text-to-image" },
        ],
        labels: {
          placeholder: "Name, phone number — one per line\nJohn, 13800138000",
          noContact: "No valid contacts found. Check the format.",
          parsed: "{count, plural, one {# contact} other {# contacts}} ready",
        },
        buttons: { download: "Download VCF" },
      },
      zh: {
        metaTitle: "通讯录生成 - 在线生成 VCF 通讯录文件",
        metaDesc: "免费在线 VCF 生成器，粘贴姓名与手机号列表即可生成 .vcf 通讯录文件，直接导入手机。全程在浏览器本地完成。",
        title: "通讯录生成",
        description: "粘贴姓名与手机号列表（每行一个），下载 .vcf 文件即可直接导入手机通讯录。",
        keywords: ["vcf生成", "通讯录生成", "vcard生成", "导入通讯录", "vcf文件", "手机通讯录"],
        faqs: [
          { q: "如何导入文件？", a: "下载 .vcf 后，用手机的文件管理器打开它，通讯录应用会提示导入。" },
          { q: "支持什么格式？", a: "每行格式：姓名加手机号，用 Tab、逗号或分号分隔。" },
        ],
        related: [
          { name: { en: "QR Code Generator", zh: "二维码生成", ja: "QRコード生成", ko: "QR 코드 생성", ru: "Генератор QR" }, href: "/tools/qr-code-generator" },
          { name: { en: "Card Number Check", zh: "银行卡校验", ja: "カード番号チェック", ko: "카드 번호 검증", ru: "Проверка карты" }, href: "/tools/bank-card-validate" },
          { name: { en: "Text to Image", zh: "文字转图片", ja: "テキストを画像に", ko: "텍스트를 이미지로", ru: "Текст в картинку" }, href: "/tools/text-to-image" },
        ],
        labels: {
          placeholder: "姓名, 手机号 —— 每行一个\n张三, 13800138000",
          noContact: "未找到有效联系人，请检查格式。",
          parsed: "已解析 {count, plural, =1 {1 个} other {# 个}}联系人",
        },
        buttons: { download: "下载 VCF" },
      },
      ja: {
        metaTitle: "VCF生成 - オンラインで連絡先ファイルを作成",
        metaDesc: "名前と電話番号のリストから .vcf 連絡先ファイルを作成する無料ツール。スマホにそのまま取り込めます。ブラウザ内で完結。",
        title: "VCF生成",
        description: "名前と電話番号のリスト（1行1件）を貼り付けると、スマホの連絡先アプリに直接取り込める .vcf ファイルをダウンロードできます。",
        keywords: ["vcf生成", "vcard生成", "連絡先ファイル", "連絡先インポート", "vcfファイル", "アドレス帳"],
        faqs: [
          { q: "どうやって取り込みますか？", a: ".vcf をダウンロードし、スマホのファイル管理アプリから開くと連絡先アプリがインポートを提案します。" },
          { q: "対応フォーマットは？", a: "各行は「名前、電話番号」をタブ、カンマ、セミコロンで区切ります。" },
        ],
        related: [
          { name: { en: "QR Code Generator", zh: "二维码生成", ja: "QRコード生成", ko: "QR 코드 생성", ru: "Генератор QR" }, href: "/tools/qr-code-generator" },
          { name: { en: "Card Number Check", zh: "银行卡校验", ja: "カード番号チェック", ko: "카드 번호 검증", ru: "Проверка карты" }, href: "/tools/bank-card-validate" },
          { name: { en: "Text to Image", zh: "文字转图片", ja: "テキストを画像に", ko: "텍스트를 이미지로", ru: "Текст в картинку" }, href: "/tools/text-to-image" },
        ],
        labels: {
          placeholder: "名前, 電話番号 — 1行1件\n山田太郎, 09012345678",
          noContact: "有効な連絡先が見つかりません。形式を確認してください。",
          parsed: "{count, plural, =1 {1件} other {#件}}の連絡先を準備",
        },
        buttons: { download: "VCFをダウンロード" },
      },
      ko: {
        metaTitle: "VCF 생성 - 온라인 연락처 파일 만들기",
        metaDesc: "이름과 전화번호 목록으로 .vcf 연락처 파일을 만드는 무료 도구입니다. 휴대폰에 바로 가져올 수 있으며 브라우저에서 완료됩니다.",
        title: "VCF 생성",
        description: "이름과 전화번호 목록(한 줄에 하나)을 붙여넣으면 휴대폰 연락처 앱에 바로 가져올 수 있는 .vcf 파일을 다운로드합니다.",
        keywords: ["vcf 생성", "vcard 생성", "연락처 파일", "연락처 가져오기", "vcf 파일", "전화번호부"],
        faqs: [
          { q: "파일은 어떻게 가져오나요?", a: ".vcf를 다운로드한 뒤 휴대폰 파일 관리자에서 열면 연락처 앱이 가져오기를 제안합니다." },
          { q: "어떤 형식을 지원하나요?", a: "각 줄은 이름과 전화번호를 탭, 쉼표, 세미콜론으로 구분합니다." },
        ],
        related: [
          { name: { en: "QR Code Generator", zh: "二维码生成", ja: "QRコード生成", ko: "QR 코드 생성", ru: "Генератор QR" }, href: "/tools/qr-code-generator" },
          { name: { en: "Card Number Check", zh: "银行卡校验", ja: "カード番号チェック", ko: "카드 번호 검증", ru: "Проверка карты" }, href: "/tools/bank-card-validate" },
          { name: { en: "Text to Image", zh: "文字转图片", ja: "テキストを画像に", ko: "텍스트를 이미지로", ru: "Текст в картинку" }, href: "/tools/text-to-image" },
        ],
        labels: {
          placeholder: "이름, 전화번호 — 한 줄에 하나\n홍길동, 01012345678",
          noContact: "유효한 연락처를 찾을 수 없습니다. 형식을 확인하세요.",
          parsed: "{count, plural, =1 {1개} other {#개}} 연락처 준비됨",
        },
        buttons: { download: "VCF 다운로드" },
      },
      ru: {
        metaTitle: "Генератор VCF - создать файл контактов онлайн",
        metaDesc: "Бесплатный онлайн-генератор VCF. Вставьте список имён и номеров, чтобы создать файл .vcf для импорта в телефон. Всё в браузере.",
        title: "Генератор VCF",
        description: "Вставьте список имён и номеров телефонов (по одному на строку) и скачайте файл .vcf, который импортируется прямо в контакты телефона.",
        keywords: ["генератор vcf", "генератор vcard", "файл контактов", "импорт контактов", "vcf файл", "контакты телефона"],
        faqs: [
          { q: "Как импортировать файл?", a: "Скачайте .vcf и откройте его в файловом менеджере телефона — приложение контактов предложит импорт." },
          { q: "Какие форматы принимаются?", a: "Каждая строка: имя и номер, разделённые табуляцией, запятой или точкой с запятой." },
        ],
        related: [
          { name: { en: "QR Code Generator", zh: "二维码生成", ja: "QRコード生成", ko: "QR 코드 생성", ru: "Генератор QR" }, href: "/tools/qr-code-generator" },
          { name: { en: "Card Number Check", zh: "银行卡校验", ja: "カード番号チェック", ko: "카드 번호 검증", ru: "Проверка карты" }, href: "/tools/bank-card-validate" },
          { name: { en: "Text to Image", zh: "文字转图片", ja: "テキストを画像に", ko: "텍스트를 이미지로", ru: "Текст в картинку" }, href: "/tools/text-to-image" },
        ],
        labels: {
          placeholder: "Имя, номер — по одному на строку\nИван, 79101234567",
          noContact: "Действительные контакты не найдены. Проверьте формат.",
          parsed: "{count, plural, one {# контакт} few {# контакта} other {# контактов}} готово",
        },
        buttons: { download: "Скачать VCF" },
      },
    },
  },
];

const dir = join(process.cwd(), "scripts", "tool-data");
for (const entry of TOOLS) {
  writeFileSync(join(dir, `${entry.slug}.json`), JSON.stringify(build(entry), null, 2) + "\n", "utf8");
  console.log(`wrote ${entry.slug}.json`);
}
