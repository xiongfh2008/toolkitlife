import Link from "next/link";
import { ToolCTA } from "@/components/BlogLayout";
import type { BlogContent } from "./index";

export const content: BlogContent = {
  en: (
    <>
      <aside aria-label="Summary" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> Paste a JSON sample into a converter and get ready-to-use types: TypeScript interfaces, Go structs, Java POJOs, Python dataclasses, Kotlin data classes, C# classes or Rust serde structs. ToolkitLife&apos;s JSON-to-code tools run entirely in your browser — nothing is uploaded — and handle nested objects, arrays with mixed shapes, and optional vs. nullable fields. Always review the generated optional fields before shipping.</p>
      </aside>

      <section>
        <h2>Why Convert JSON to Code?</h2>
        <p>Every API integration starts with the same chore: a JSON response lands in your lap and you need typed structures around it. Hand-writing them is slow and error-prone — miss one field and your compiler or runtime finds out at the worst possible time. And when the API evolves, hand-maintained models drift from reality.</p>
        <p>A converter solves both problems: it reads the actual sample you give it and emits idiomatic type declarations for your language, so your models match real payloads from day one and can be regenerated whenever the API changes.</p>
      </section>

      <section>
        <h2>What a Good Converter Detects</h2>
        <p><strong>Nested objects become named types.</strong> A <code>user.address.city</code> structure produces a separate <code>Address</code> type instead of one unreadable inline blob, and shared shapes are reused by name.</p>
        <p><strong>Arrays merge their shapes.</strong> Real-world arrays are messy: not every object carries every key. A good converter unions the keys across all items and marks fields that are missing in some entries as optional — so your types stay honest about what the API actually returns.</p>
        <p><strong>Optional vs. nullable are kept apart.</strong> A key that is sometimes absent is not the same as a key that is present but <code>null</code>. These map to different constructs in every language (<code>?</code> vs. <code>T | null</code> in TypeScript, pointers vs. zero values in Go, <code>Option&lt;T&gt;</code> in Rust), and the generated code preserves the distinction.</p>
        <p><strong>Depth is bounded.</strong> Pathologically deep JSON produces unreadable output, so generation stops at a sane depth and falls back to generic maps — a deliberate trade of completeness for usability.</p>
      </section>

      <section>
        <h2>Pick Your Language</h2>
        <p>All seven converters share the same inference engine, so the same sample produces consistent output everywhere:</p>
        <ul>
          <li><strong>TypeScript</strong> — nested <code>interface</code>s, <code>?</code> for optional fields, union types for nullables. Strict-mode friendly: <Link href="/tools/json-to-typescript" className="text-blue-400 hover:text-blue-300">JSON to TypeScript</Link>.</li>
          <li><strong>Go</strong> — structs with <code>json</code> tags, pointers for nullable fields so unmarshal can represent &quot;absent&quot;: <Link href="/tools/json-to-go" className="text-blue-400 hover:text-blue-300">JSON to Go struct</Link>.</li>
          <li><strong>Java</strong> — POJOs with getters and setters, ready for Jackson or Gson: <Link href="/tools/json-to-java" className="text-blue-400 hover:text-blue-300">JSON to Java POJO</Link>.</li>
          <li><strong>Python</strong> — <code>@dataclass</code> definitions with type hints: <Link href="/tools/json-to-python" className="text-blue-400 hover:text-blue-300">JSON to Python dataclass</Link>.</li>
          <li><strong>Kotlin</strong> — data classes with nullable types as <code>T?</code>: <Link href="/tools/json-to-kotlin" className="text-blue-400 hover:text-blue-300">JSON to Kotlin data class</Link>.</li>
          <li><strong>C#</strong> — property classes for System.Text.Json or Newtonsoft: <Link href="/tools/json-to-csharp" className="text-blue-400 hover:text-blue-300">JSON to C# class</Link>.</li>
          <li><strong>Rust</strong> — serde-compatible structs with <code>Option&lt;T&gt;</code>: <Link href="/tools/json-to-rust" className="text-blue-400 hover:text-blue-300">JSON to Rust serde struct</Link>.</li>
        </ul>
        <ToolCTA name="JSON to TypeScript Converter" href="/tools/json-to-typescript" description="Paste a JSON sample, get nested TypeScript interfaces with optional and nullable fields handled correctly. Runs entirely in your browser — free and private." />
      </section>

      <section>
        <h2>Convert in Three Steps</h2>
        <p><strong>1. Paste a representative sample.</strong> The output is only as accurate as the input: include the items with missing fields, the nulls, the nested lists — not just the happy path.</p>
        <p><strong>2. Name the root type.</strong> Rename <code>Root</code> to something meaningful (<code>User</code>, <code>OrderResponse</code>) before copying; nested types are named automatically from their keys.</p>
        <p><strong>3. Copy and review.</strong> Scan the optional and nullable markers first — they are where converters and APIs disagree most — then paste into your project.</p>
      </section>

      <section>
        <h2>Tips for Cleaner Generated Types</h2>
        <p><strong>Feed it the weird cases.</strong> If one array item lacks a field, convert a sample that includes that item — otherwise the field comes out required and your parser will crash on it later.</p>
        <p><strong>Regenerate when the API changes.</strong> Treat the generated types as build artifacts: cheap to recreate, never hand-edited.</p>
        <p><strong>Deeply nested payloads: consider maps.</strong> If the API returns an arbitrary-keyed dictionary, a generated <code>Record&lt;string, T&gt;</code>-style map is more honest than twenty one-shot interfaces.</p>
        <p><strong>Nothing leaves your machine.</strong> Every converter on ToolkitLife parses and generates inside your browser tab. That matters when the JSON contains customer data, tokens, or anything confidential — there is no server to leak it to.</p>
      </section>
    </>
  ),

  zh: (
    <>
      <aside aria-label="摘要" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>太长不看：</strong>把 JSON 示例粘贴进转换器，即可得到可直接使用的类型定义：TypeScript interface、Go struct、Java POJO、Python dataclass、Kotlin data class、C# 类或 Rust serde struct。ToolkitLife 的 JSON 转代码工具完全在浏览器内运行——数据不上传——能正确处理嵌套对象、形状不一致的数组、可选与可空字段。上线前请务必复核生成的可选字段。</p>
      </aside>

      <section>
        <h2>为什么要把 JSON 转成代码</h2>
        <p>每次对接 API 都从同一件苦差事开始：一份 JSON 响应摆在面前，你要为它写出类型结构。手写既慢又容易出错——漏掉一个字段，编译器或运行时就会在最糟糕的时刻告诉你。而且 API 一旦演进，手工维护的模型就会和现实脱节。</p>
        <p>转换器同时解决这两个问题：它读取你提供的真实示例，输出符合各语言习惯的类型声明——模型从第一天起就和真实负载一致，API 变更后也能随时重新生成。</p>
      </section>

      <section>
        <h2>好的转换器能识别什么</h2>
        <p><strong>嵌套对象生成具名类型。</strong><code>user.address.city</code> 这种结构会产出独立的 <code>Address</code> 类型，而不是一团难以阅读的内联定义，相同结构还会按名字复用。</p>
        <p><strong>数组做形状合并。</strong>真实世界的数组很乱：并非每个对象都带齐所有键。好的转换器会对数组内所有条目的键取并集，把部分条目缺失的字段标记为可选——类型如实反映 API 的真实返回。</p>
        <p><strong>可选与可空分开处理。</strong>「有时不出现」的键和「出现但为 null」的键不是一回事。它们在每个语言里对应不同构造（TypeScript 的 <code>?</code> 与 <code>T | null</code>、Go 的指针与零值、Rust 的 <code>Option&lt;T&gt;</code>），生成的代码保留这一区分。</p>
        <p><strong>深度有上限。</strong>病态深层嵌套的 JSON 只会产出不可读的输出，因此生成到合理深度即回退为通用 Map——用完整性换可读性的有意取舍。</p>
      </section>

      <section>
        <h2>选择你的语言</h2>
        <p>七个转换器共用同一套类型推断引擎，同一样例在各语言输出保持一致：</p>
        <ul>
          <li><strong>TypeScript</strong>——嵌套 <code>interface</code>，可选字段用 <code>?</code>，可空用联合类型，严格模式友好：<Link href="/tools/json-to-typescript" className="text-blue-400 hover:text-blue-300">JSON 转 TypeScript</Link>。</li>
          <li><strong>Go</strong>——带 <code>json</code> tag 的 struct，可空字段用指针以便反序列化表达「缺失」：<Link href="/tools/json-to-go" className="text-blue-400 hover:text-blue-300">JSON 转 Go struct</Link>。</li>
          <li><strong>Java</strong>——带 getter/setter 的 POJO，可直接配合 Jackson 或 Gson：<Link href="/tools/json-to-java" className="text-blue-400 hover:text-blue-300">JSON 转 Java POJO</Link>。</li>
          <li><strong>Python</strong>——带类型注解的 <code>@dataclass</code>：<Link href="/tools/json-to-python" className="text-blue-400 hover:text-blue-300">JSON 转 Python dataclass</Link>。</li>
          <li><strong>Kotlin</strong>——data class，可空类型用 <code>T?</code>：<Link href="/tools/json-to-kotlin" className="text-blue-400 hover:text-blue-300">JSON 转 Kotlin data class</Link>。</li>
          <li><strong>C#</strong>——属性类，适配 System.Text.Json 或 Newtonsoft：<Link href="/tools/json-to-csharp" className="text-blue-400 hover:text-blue-300">JSON 转 C# 类</Link>。</li>
          <li><strong>Rust</strong>——兼容 serde 的 struct，可空用 <code>Option&lt;T&gt;</code>：<Link href="/tools/json-to-rust" className="text-blue-400 hover:text-blue-300">JSON 转 Rust serde struct</Link>。</li>
        </ul>
        <ToolCTA name="JSON 转 TypeScript 转换器" href="/tools/json-to-typescript" description="粘贴 JSON 示例，生成嵌套 TypeScript interface，正确处理可选与可空字段。完全在浏览器中运行——免费且私密。" />
      </section>

      <section>
        <h2>三步完成转换</h2>
        <p><strong>1. 粘贴有代表性的示例。</strong>输出再准也只取决于输入：把缺字段的条目、null、嵌套列表都放进来，别只给理想路径。</p>
        <p><strong>2. 给根类型命名。</strong>复制前把 <code>Root</code> 改成有意义的名字（<code>User</code>、<code>OrderResponse</code>）；嵌套类型会按键名自动命名。</p>
        <p><strong>3. 复制并复核。</strong>先看可选与可空标记——转换器和 API 最容易在这里产生分歧——再粘贴进项目。</p>
      </section>

      <section>
        <h2>让生成类型更干净的几个技巧</h2>
        <p><strong>喂给转换器那些「奇怪」的样例。</strong>如果某个数组条目缺字段，就转换包含该条目的样例——否则字段会被当成必需，解析时迟早出事。</p>
        <p><strong>API 变了就重新生成。</strong>把生成类型当作构建产物：重建成本低，永远不要手改。</p>
        <p><strong>深层嵌套的负载考虑用 Map。</strong>如果 API 返回任意键的字典，生成 <code>Record&lt;string, T&gt;</code> 风格的映射，比二十个一次性的 interface 更诚实。</p>
        <p><strong>数据不出你的电脑。</strong>ToolkitLife 的每个转换器都在你的浏览器标签页内完成解析和生成。当 JSON 里包含客户数据、令牌或任何机密信息时，这一点很重要——根本没有可以泄露数据的服务器。</p>
      </section>
    </>
  ),

  ja: (
    <>
      <aside aria-label="要約" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> JSON サンプルを変換ツールに貼り付けるだけで、すぐ使える型定義が得られます。TypeScript の interface、Go の struct、Java の POJO、Python の dataclass、Kotlin の data class、C# のクラス、Rust の serde struct に対応。ToolkitLife の JSON→コード変換ツールは完全にブラウザ内で動作し、データは一切送信されません。ネストしたオブジェクト、形の不揃いな配列、省略可能フィールドと null 許容フィールドも正しく処理します。公開前に生成されたオプショナル字段の確認を忘れずに。</p>
      </aside>

      <section>
        <h2>JSON をコードに変換する理由</h2>
        <p>API 連携はいつも同じ作業から始まります。JSON レスポンスが手元に届き、それに型付きの構造を定義する必要がある。手書きは時間がかかりミスもしやすく、1 つでもフィールドを書き漏らせば、コンパイラやランタイムが最悪のタイミングで教えてくれます。さらに API が進化すれば、手作業で維持したモデルは現実から乖離していきます。</p>
        <p>変換ツールはこの 2 つの問題を同時に解決します。渡された実際のサンプルを読み取り、各言語の慣習に沿った型宣言を生成するので、モデルは初日から実際のペイロードと一致し、API が変わればいつでも再生成できます。</p>
      </section>

      <section>
        <h2>良い変換ツールが検出できるもの</h2>
        <p><strong>ネストしたオブジェクトは名前付き型に。</strong><code>user.address.city</code> のような構造は、読みにくいインライン定義ではなく独立した <code>Address</code> 型として出力され、同じ形は名前で再利用されます。</p>
        <p><strong>配列は形状をマージ。</strong>実世界の配列は不揃いです。すべてのオブジェクトがすべてのキーを持つとは限らない。良い変換ツールは配列内の全要素のキーの和集合を取り、一部に存在しないフィールドをオプショナルとしてマークします。型が API の実際の返却値に正直になります。</p>
        <p><strong>オプショナルと null 許容は区別。</strong>「キーが時々存在しない」ことと「キーは存在するが null」ことは別物です。これは各言語で異なる構文に対応します（TypeScript の <code>?</code> と <code>T | null</code>、Go のポインタとゼロ値、Rust の <code>Option&lt;T&gt;</code>）。生成コードはこの区別を保持します。</p>
        <p><strong>深さには上限。</strong>極端に深い JSON は読めない出力になるため、妥当な深さで生成を打ち切り汎用 Map にフォールバックします。完全性より可読性を優る、意図的なトレードオフです。</p>
      </section>

      <section>
        <h2>言語を選ぶ</h2>
        <p>7 つの変換ツールは同じ型推論エンジンを共有しているため、同じサンプルから一貫した出力が得られます。</p>
        <ul>
          <li><strong>TypeScript</strong> — ネストした <code>interface</code>、オプショナルは <code>?</code>、null 許容はユニオン型。strict モード対応：<Link href="/tools/json-to-typescript" className="text-blue-400 hover:text-blue-300">JSON to TypeScript</Link>。</li>
          <li><strong>Go</strong> — <code>json</code> タグ付き struct、null 許容はポインタで「欠損」を表現：<Link href="/tools/json-to-go" className="text-blue-400 hover:text-blue-300">JSON to Go struct</Link>。</li>
          <li><strong>Java</strong> — getter/setter 付き POJO、Jackson や Gson ですぐ使える：<Link href="/tools/json-to-java" className="text-blue-400 hover:text-blue-300">JSON to Java POJO</Link>。</li>
          <li><strong>Python</strong> — 型ヒント付き <code>@dataclass</code>：<Link href="/tools/json-to-python" className="text-blue-400 hover:text-blue-300">JSON to Python dataclass</Link>。</li>
          <li><strong>Kotlin</strong> — data class、null 許容は <code>T?</code>：<Link href="/tools/json-to-kotlin" className="text-blue-400 hover:text-blue-300">JSON to Kotlin data class</Link>。</li>
          <li><strong>C#</strong> — System.Text.Json / Newtonsoft 対応のプロパティクラス：<Link href="/tools/json-to-csharp" className="text-blue-400 hover:text-blue-300">JSON to C# class</Link>。</li>
          <li><strong>Rust</strong> — serde 対応 struct、null 許容は <code>Option&lt;T&gt;</code>：<Link href="/tools/json-to-rust" className="text-blue-400 hover:text-blue-300">JSON to Rust serde struct</Link>。</li>
        </ul>
        <ToolCTA name="JSON to TypeScript 変換ツール" href="/tools/json-to-typescript" description="JSON サンプルを貼り付けるだけで、オプショナルと null 許容を正しく処理したネストした TypeScript interface を生成。完全にブラウザ内で動作——無料かつプライベート。" />
      </section>

      <section>
        <h2>3 ステップで変換</h2>
        <p><strong>1. 代表的なサンプルを貼り付ける。</strong>出力の精度は入力次第です。フィールドが欠けた要素、null、ネストしたリストも含めましょう。理想系だけでは不十分です。</p>
        <p><strong>2. ルート型に名前を付ける。</strong>コピーする前に <code>Root</code> を意味のある名前（<code>User</code>、<code>OrderResponse</code>）に変更します。ネストした型はキー名から自動で命名されます。</p>
        <p><strong>3. コピーして確認。</strong>まずオプショナルと null 許容のマーカーを確認します。ここが変換ツールと API の見解が最も分かれる場所です。その後プロジェクトに貼り付けます。</p>
      </section>

      <section>
        <h2>生成される型をきれいにするコツ</h2>
        <p><strong>例外的なケースも入力する。</strong>ある配列要素にフィールドが欠けているなら、その要素を含むサンプルを変換しましょう。そうしないと必須扱いになり、後でパースが壊れます。</p>
        <p><strong>API が変わったら再生成。</strong>生成された型はビルド成果物として扱い、手で編集せず安く再生成します。</p>
        <p><strong>深くネストしたペイロードは Map を検討。</strong>任意キーの辞書を返す API には、20 個の使い捨て interface より <code>Record&lt;string, T&gt;</code> 風のマップの方が誠実です。</p>
        <p><strong>データは端末から出ません。</strong>ToolkitLife の変換ツールはすべて、ブラウザタブ内でパースと生成を行います。JSON に顧客データやトークンなど機密情報が含まれていても安心です。漏えい先のサーバーが存在しません。</p>
      </section>
    </>
  ),

  ko: (
    <>
      <aside aria-label="요약" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> JSON 샘플을 변환기에 붙여넣으면 바로 쓸 수 있는 타입 정의가 나옵니다. TypeScript interface, Go struct, Java POJO, Python dataclass, Kotlin data class, C# 클래스, Rust serde struct를 지원합니다. ToolkitLife의 JSON→코드 변환 도구는 전부 브라우저 안에서만 동작하며 데이터를 전송하지 않습니다. 중첩 객체, 모양이 일관되지 않은 배열, 선택적 필드와 null 허용 필드를 올바르게 처리합니다. 배포 전에 생성된 선택적 필드를 꼭 검토하세요.</p>
      </aside>

      <section>
        <h2>JSON을 코드로 변환하는 이유</h2>
        <p>모든 API 연동은 같은 노동에서 시작합니다. JSON 응답이 눈앞에 놓이고, 그에 맞는 타입 구조를 정의해야 합니다. 손으로 쓰면 느리고 실수하기 쉽습니다. 필드를 하나만 빠뜨려도 컴파일러나 런타임이 최악의 순간에 알려줍니다. 게다가 API가 진화하면 손으로 관리하던 모델은 현실과 어긋납니다.</p>
        <p>변환기는 이 두 문제를 동시에 해결합니다. 제공된 실제 샘플을 읽어 각 언어의 관용에 맞는 타입 선언을 내보내므로, 모델이 첫날부터 실제 페이로드와 일치하고 API가 바뀌면 언제든 재생성할 수 있습니다.</p>
      </section>

      <section>
        <h2>좋은 변환기가 감지하는 것</h2>
        <p><strong>중첩 객체는 이름 있는 타입으로.</strong><code>user.address.city</code> 같은 구조는 읽기 어려운 인라인 덩어리가 아니라 별개의 <code>Address</code> 타입으로 출력되고, 같은 모양은 이름으로 재사용됩니다.</p>
        <p><strong>배열은 모양을 병합.</strong>실제 세계의 배열은 지저분합니다. 모든 객체가 모든 키를 갖지는 않죠. 좋은 변환기는 배열의 모든 항목에 걸친 키의 합집합을 구하고, 일부 항목에 없는 필드를 선택적으로 표시합니다. 타입이 API의 실제 응답에 정직해집니다.</p>
        <p><strong>선택적과 null 허용은 구분.</strong>「키가 가끔 없음」과「키는 있지만 null」은 다른 이야기입니다. 이는 각 언어에서 다른 구문으로 대응됩니다(TypeScript의 <code>?</code>와 <code>T | null</code>, Go의 포인터와 영값, Rust의 <code>Option&lt;T&gt;</code>). 생성된 코드는 이 구분을 유지합니다.</p>
        <p><strong>깊이에는 상한.</strong>병적으로 깊은 JSON은 읽을 수 없는 출력을 낳으므로 합리적인 깊이에서 생성을 멈추고 범용 Map으로 폴백합니다. 완전성보다 가독성을 택하는 의도된 절충입니다.</p>
      </section>

      <section>
        <h2>언어 선택하기</h2>
        <p>7개 변환기는 같은 타입 추론 엔진을 공유하므로, 같은 샘플이 어디서나 일관된 출력을 냅니다.</p>
        <ul>
          <li><strong>TypeScript</strong> — 중첩 <code>interface</code>, 선택적 필드는 <code>?</code>, null 허용은 유니온 타입. strict 모드 친화적: <Link href="/tools/json-to-typescript" className="text-blue-400 hover:text-blue-300">JSON to TypeScript</Link>.</li>
          <li><strong>Go</strong> — <code>json</code> 태그가 붙은 struct, null 허용은 포인터로 「부재」를 표현: <Link href="/tools/json-to-go" className="text-blue-400 hover:text-blue-300">JSON to Go struct</Link>.</li>
          <li><strong>Java</strong> — getter/setter가 있는 POJO, Jackson·Gson과 바로 호환: <Link href="/tools/json-to-java" className="text-blue-400 hover:text-blue-300">JSON to Java POJO</Link>.</li>
          <li><strong>Python</strong> — 타입 힌트가 있는 <code>@dataclass</code>: <Link href="/tools/json-to-python" className="text-blue-400 hover:text-blue-300">JSON to Python dataclass</Link>.</li>
          <li><strong>Kotlin</strong> — data class, null 허용은 <code>T?</code>: <Link href="/tools/json-to-kotlin" className="text-blue-400 hover:text-blue-300">JSON to Kotlin data class</Link>.</li>
          <li><strong>C#</strong> — System.Text.Json·Newtonsoft용 프로퍼티 클래스: <Link href="/tools/json-to-csharp" className="text-blue-400 hover:text-blue-300">JSON to C# class</Link>.</li>
          <li><strong>Rust</strong> — serde 호환 struct, null 허용은 <code>Option&lt;T&gt;</code>: <Link href="/tools/json-to-rust" className="text-blue-400 hover:text-blue-300">JSON to Rust serde struct</Link>.</li>
        </ul>
        <ToolCTA name="JSON to TypeScript 변환기" href="/tools/json-to-typescript" description="JSON 샘플을 붙여넣으면 선택적·null 허용 필드를 올바르게 처리한 중첩 TypeScript interface를 생성. 브라우저에서 전부 동작——무료이며 프라이빗합니다." />
      </section>

      <section>
        <h2>3단계로 변환하기</h2>
        <p><strong>1. 대표성 있는 샘플을 붙여넣기.</strong>출력의 정확도는 입력이 결정합니다. 필드가 빠진 항목, null, 중첩 리스트까지 포함하세요. 행복 경로만으로는 부족합니다.</p>
        <p><strong>2. 루트 타입에 이름 붙이기.</strong>복사하기 전에 <code>Root</code>를 의미 있는 이름(<code>User</code>, <code>OrderResponse</code>)으로 바꾸세요. 중첩 타입은 키 이름에서 자동으로 명명됩니다.</p>
        <p><strong>3. 복사하고 검토.</strong>선택적·null 허용 표시를 먼저 훑어보세요. 변환기와 API의 판단이 가장 많이 갈리는 지점입니다. 그다음 프로젝트에 붙여넣습니다.</p>
      </section>

      <section>
        <h2>생성 타입을 더 깔끔하게 만드는 팁</h2>
        <p><strong>이상한 케이스도 입력에 넣기.</strong>어떤 배열 항목에 필드가 없다면 그 항목이 포함된 샘플을 변환하세요. 그러지 않으면 필수로 나와 나중에 파서가 깨집니다.</p>
        <p><strong>API가 바뀌면 재생성.</strong>생성된 타입은 빌드 산출물로 취급하세요. 다시 만드는 비용은 싸고, 손으로 고치지 않습니다.</p>
        <p><strong>깊게 중첩된 페이로드는 Map 고려.</strong>임의 키의 사전을 반환하는 API라면 스무 개의 일회용 interface보다 <code>Record&lt;string, T&gt;</code> 스타일 맵이 더 정직합니다.</p>
        <p><strong>데이터는 기기를 떠나지 않습니다.</strong>ToolkitLife의 모든 변환기는 브라우저 탭 안에서 파싱과 생성을 수행합니다. JSON에 고객 데이터나 토큰 같은 기밀 정보가 있어도 안심할 수 있습니다. 유출될 서버 자체가 없으니까요.</p>
      </section>
    </>
  ),

  faqs: {
    en: [
      { question: "Is it safe to paste API responses or customer data into a JSON converter?", answer: "Yes, when the tool runs entirely client-side. ToolkitLife's converters parse the JSON and generate code inside your browser tab with no network requests and no storage, so sensitive payloads never leave your machine." },
      { question: "How are arrays with inconsistent fields handled?", answer: "The converter merges the shapes of all objects in an array: it takes the union of keys and marks any field that is missing from some items as optional, so the generated type reflects what the API actually returns." },
      { question: "What is the difference between optional and nullable fields?", answer: "Optional means the key may be absent entirely; nullable means the key is present but can be null. They map to different constructs — e.g. ? versus T | null in TypeScript, pointers versus zero values in Go, Option<T> in Rust — and the converter preserves the distinction." },
      { question: "Is there a size or depth limit for the input JSON?", answer: "Large samples of several megabytes are fine because parsing happens locally. Extremely deep nesting is capped at a fixed depth: generation falls back to generic map types there to keep the output readable." },
    ],
    zh: [
      { question: "把 API 响应或客户数据粘贴进 JSON 转换器安全吗？", answer: "安全——前提是工具完全在客户端运行。ToolkitLife 的转换器在你的浏览器标签页内完成解析和代码生成，没有网络请求、没有存储，敏感数据不会离开你的电脑。" },
      { question: "字段不一致的数组是如何处理的？", answer: "转换器会合并数组内所有对象的形状：对键取并集，并把部分条目缺失的字段标记为可选，生成的类型如实反映 API 的真实返回。" },
      { question: "可选字段和可空字段有什么区别？", answer: "可选指键可能完全不出现；可空指键存在但值可以是 null。二者在各语言中对应不同构造——如 TypeScript 的 ? 与 T | null、Go 的指针与零值、Rust 的 Option<T>——转换器会保留这一区分。" },
      { question: "输入的 JSON 有大小或深度限制吗？", answer: "几 MB 的大样例没有问题，因为解析在本地完成。极端深层嵌套会在固定深度截断：该处回退为通用 Map 类型，以保证输出可读。" },
    ],
    ja: [
      { question: "API レスポンスや顧客データを JSON 変換ツールに貼り付けても安全ですか？", answer: "はい。ツールが完全にクライアントサイドで動作している場合は安全です。ToolkitLife の変換ツールはブラウザタブ内でパースとコード生成を行い、ネットワーク要求も保存もないため、機密性の高いペイロードが端末の外に出ることはありません。" },
      { question: "フィールドが不揃いな配列はどのように処理されますか？", answer: "変換ツールは配列内の全オブジェクトの形状をマージします。キーの和集合を取り、一部の要素に存在しないフィールドはオプショナルとして出力されるため、生成された型は API の実際の返却値を正しく反映します。" },
      { question: "オプショナルフィールドと null 許容フィールドの違いは？", answer: "オプショナルはキー自体が存在しない可能性があること、null 許容はキーは存在するが null になり得ることを意味します。TypeScript の ? と T | null、Go のポインタとゼロ値、Rust の Option<T> のように各言語で異なる構文に対応し、変換ツールはこの区別を保持します。" },
      { question: "入力 JSON にサイズや深さの制限はありますか？", answer: "数 MB の大きなサンプルでも問題ありません。パースはローカルで行われるためです。極端に深いネストは固定の深さで打ち切り、そこでは汎用の Map 型にフォールバックして出力の可読性を保ちます。" },
    ],
    ko: [
      { question: "API 응답이나 고객 데이터를 JSON 변환기에 붙여넣어도 안전한가요?", answer: "네. 도구가 완전히 클라이언트 사이드에서 동작한다면 안전합니다. ToolkitLife의 변환기는 브라우저 탭 안에서 파싱과 코드 생성을 수행하며 네트워크 요청도 저장도 없으므로, 민감한 페이로드는 기기를 떠나지 않습니다." },
      { question: "필드가 일관되지 않은 배열은 어떻게 처리되나요?", answer: "변환기는 배열 내 모든 객체의 모양을 병합합니다. 키의 합집합을 구하고 일부 항목에 없는 필드는 선택적으로 표시하여, 생성된 타입이 API의 실제 응답을 정확히 반영하도록 합니다." },
      { question: "선택적 필드와 null 허용 필드의 차이는 무엇인가요?", answer: "선택적은 키 자체가 없을 수 있다는 뜻이고, null 허용은 키는 있지만 null일 수 있다는 뜻입니다. TypeScript의 ? 와 T | null, Go의 포인터와 영값, Rust의 Option<T>처럼 각 언어에서 다른 구문으로 대응되며, 변환기는 이 구분을 유지합니다." },
      { question: "입력 JSON에 크기나 깊이 제한이 있나요?", answer: "파싱이 로컬에서 이루어지므로 수 MB의 큰 샘플도 문제없습니다. 극단적으로 깊은 중첩은 고정 깊이에서 잘리고, 해당 지점에서는 범용 Map 타입으로 폴백하여 출력의 가독성을 유지합니다." },
    ],
  },
};
