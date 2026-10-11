import fs from "fs";

const entries = {
  en: {
    title: "How to Convert JSON to TypeScript, Go, Java & More (Free, 2026 Guide)",
    description: "Turn any JSON sample into TypeScript interfaces, Go structs, Java POJOs, Python dataclasses, Kotlin data classes, C# classes or Rust serde structs — free in your browser, nothing uploaded. Plus how the converters handle nested objects, mixed-shape arrays, and optional vs. nullable fields.",
  },
  zh: {
    title: "JSON 转 TypeScript、Go、Java 等代码（免费，2026 指南）",
    description: "把任意 JSON 示例转换为 TypeScript interface、Go struct、Java POJO、Python dataclass、Kotlin data class、C# 类或 Rust serde struct——浏览器内免费完成，数据不上传。附嵌套对象、混合形状数组、可选与可空字段的处理说明。",
  },
  ja: {
    title: "JSON を TypeScript・Go・Java などに変換する方法（無料、2026年版ガイド）",
    description: "JSON サンプルから TypeScript の interface、Go の struct、Java の POJO、Python の dataclass、Kotlin の data class、C# のクラス、Rust の serde struct を生成。ブラウザ内で無料、データ送信なし。ネストしたオブジェクトや不揃いな配列、オプショナルと null 許容の処理も解説。",
  },
  ko: {
    title: "JSON을 TypeScript·Go·Java 코드로 변환하는 방법 (무료, 2026 가이드)",
    description: "JSON 샘플을 TypeScript interface, Go struct, Java POJO, Python dataclass, Kotlin data class, C# 클래스, Rust serde struct로 변환하세요. 브라우저에서 무료로, 데이터 전송 없음. 중첩 객체, 모양이 섞인 배열, 선택적·null 허용 필드 처리법도 함께 설명합니다.",
  },
  ru: {
    title: "Как конвертировать JSON в код TypeScript, Go, Java и других (бесплатно, гайд 2026)",
    description: "Превратите любой JSON-пример в интерфейсы TypeScript, структуры Go, POJO Java, dataclass Python, data class Kotlin, классы C# или serde-структуры Rust — бесплатно в браузере, данные никуда не отправляются. Плюс как обрабатываются вложенные объекты, массивы с разными формами, опциональные и nullable-поля.",
  },
  es: {
    title: "Cómo convertir JSON a código TypeScript, Go, Java y más (gratis, guía 2026)",
    description: "Convierte cualquier muestra JSON en interfaces de TypeScript, structs de Go, POJOs de Java, dataclasses de Python, data classes de Kotlin, clases de C# o structs serde de Rust — gratis en tu navegador, sin subir nada. Incluye cómo se manejan objetos anidados, arrays de formas mixtas y campos opcionales vs. nullables.",
  },
  de: {
    title: "How to Convert JSON to TypeScript, Go, Java & More (Free, 2026 Guide)",
    description: "Turn any JSON sample into TypeScript interfaces, Go structs, Java POJOs, Python dataclasses, Kotlin data classes, C# classes or Rust serde structs — free in your browser, nothing uploaded. Plus how the converters handle nested objects, mixed-shape arrays, and optional vs. nullable fields.",
  },
  fr: {
    title: "How to Convert JSON to TypeScript, Go, Java & More (Free, 2026 Guide)",
    description: "Turn any JSON sample into TypeScript interfaces, Go structs, Java POJOs, Python dataclasses, Kotlin data classes, C# classes or Rust serde structs — free in your browser, nothing uploaded. Plus how the converters handle nested objects, mixed-shape arrays, and optional vs. nullable fields.",
  },
  pt: {
    title: "How to Convert JSON to TypeScript, Go, Java & More (Free, 2026 Guide)",
    description: "Turn any JSON sample into TypeScript interfaces, Go structs, Java POJOs, Python dataclasses, Kotlin data classes, C# classes or Rust serde structs — free in your browser, nothing uploaded. Plus how the converters handle nested objects, mixed-shape arrays, and optional vs. nullable fields.",
  },
};

const ANCHOR = '"how-to-upscale-images": {';

for (const [locale, e] of Object.entries(entries)) {
  const p = `messages/${locale}.json`;
  let s = fs.readFileSync(p, "utf8");
  if (s.includes('"json-to-code"')) {
    console.log(`${locale}: already present, skipped`);
    continue;
  }
  const a = s.indexOf(ANCHOR);
  if (a < 0) throw new Error(`${locale}: anchor not found`);
  // find end of the anchor entry (the closing '}' of the object at depth: "    }")
  const end = s.indexOf("\n    }", a);
  if (end < 0) throw new Error(`${locale}: entry end not found`);
  const insertAt = end + "\n    }".length;
  const block =
    `,\n    "json-to-code": {\n      "title": ${JSON.stringify(e.title)},\n      "description": ${JSON.stringify(e.description)}\n    }`;
  s = s.slice(0, insertAt) + block + s.slice(insertAt);
  JSON.parse(s); // validate before writing
  fs.writeFileSync(p, s);
  console.log(`${locale}: inserted json-to-code`);
}
console.log("done");
