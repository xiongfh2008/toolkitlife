// One-off migration: updates tools.address-generator messages in all 9 locale
// files for the dual-mode (simulated / real) integration. Run once:
//   node scripts/address-i18n-update.mjs
// de/fr/pt intentionally receive the English fallback text — they are not
// published locales yet and all their tool content is English fallback.
import fs from "fs";

const en = {
  description:
    "Generate realistic random addresses for 20+ countries — browser-side simulated data for tests and demos, or real source-backed address data when the site has it enabled. Street, city, region, postcode and coordinates.",
  metadata: {
    title: "Global Address Generator - Free Online Tool",
    description:
      "Generate random addresses for 20+ countries: simulated test data in your browser, or real source-backed addresses (street/premise level) from open data when enabled. Batch generation, copy, TXT/CSV export.",
  },
  labels: {
    mode: "Generation mode",
    modeSimulated: "Simulated addresses",
    modeReal: "Real address data",
    modeSimulatedHint:
      "Generated locally in your browser with Faker. For testing and demos only — these addresses are not guaranteed to exist in the real world.",
    modeRealHint:
      "Addresses with real data provenance (street or premise level) served from a self-hosted open-data address service.",
    district: "District / County",
    postcode: "Postcode",
    residential: "Residential addresses only",
    displayLanguage: "Display language",
    displayOriginal: "Original address",
    precision: "Address precision",
    precisionStreet: "Street level",
    precisionPremise: "Premise (house number)",
    precisionSubpremise: "Premise with unit",
    source: "Data source",
    residentialBadge: "Residential",
    notProvided: "Not provided",
    coordsNote:
      "Coordinates are approximate positions within about 5 km of the city centre — they indicate the general area, not an exact doorstep.",
  },
  errors: {
    realUnavailable:
      "The real-address service is temporarily unavailable. Please try again later.",
    noCoverage:
      "No address data is available for the selected area yet. Try a wider area or another region.",
    rateLimited: "Too many requests. Please wait a moment and try again.",
    invalidRequest: "The request was invalid. Please check your filters.",
    exhausted:
      "The selected area has fewer addresses than requested — showing all that are available.",
    optionsUnavailable: "Could not load the area list. Please try again.",
  },
  modesSection: {
    title: "Two generation modes",
    items: [
      "Simulated addresses — built locally in your browser with @faker-js/faker on top of a table of real major cities. Street names are fictional; city, region, postcode and coordinates follow real cities. Use them for tests, forms and demos where the address itself does not need to exist.",
      "Real address data (optional, server-side) — when the site has deployed the open-data Address service, this mode returns actual source-backed addresses with their precision (street or premise level), coordinates and data sources. Real addresses are not guaranteed to be deliverable, habitable, or tied to any verified identity.",
    ],
  },
  whatIsExtra:
    "When the site has deployed the optional real-address service, a second mode returns real, source-backed addresses with their precision and data sources.",
  newFaqs: [
    {
      question:
        "What is the difference between simulated and real address data?",
      answer:
        "Simulated addresses are generated in your browser: street names are fictional (Faker), while city, region, postcode and coordinates come from a table of real major cities. Real address data, when enabled by the site, comes from a self-hosted open-data address service and carries source, precision and coordinate information for each address.",
    },
    {
      question: "Are the real addresses deliverable or verified?",
      answer:
        "No. A real-source address means the street or premise exists in open data sources — it is not a guarantee that mail can be delivered, that the building is habitable, or that the address is associated with any person. Synthetic person profiles are never included with ToolkitLife results.",
    },
  ],
};

const zh = {
  description:
    "为 20+ 国家生成逼真的随机地址——浏览器本地模拟数据适用于测试和演示；站点启用后还可获取带来源的真实地址数据。包含街道、城市、州省、邮编和坐标。",
  metadata: {
    title: "全球地址生成器 - 免费在线工具",
    description:
      "为 20+ 国家生成随机地址：浏览器本地模拟测试数据，或（站点启用后）来自开放数据、带来源与精度的真实地址。支持批量生成、复制与 TXT/CSV 导出。",
  },
  labels: {
    mode: "生成模式",
    modeSimulated: "模拟地址",
    modeReal: "真实地址数据",
    modeSimulatedHint:
      "由 Faker 在浏览器本地生成，仅适用于测试或演示，不保证现实中存在。",
    modeRealHint:
      "来自自建开放数据地址服务的实际来源地址（街道级或门牌级）。",
    district: "区/县",
    postcode: "邮政编码",
    residential: "仅住宅地址",
    displayLanguage: "显示语言",
    displayOriginal: "原始地址",
    precision: "地址精度",
    precisionStreet: "街道级",
    precisionPremise: "门牌级",
    precisionSubpremise: "门牌级（含单元）",
    source: "数据来源",
    residentialBadge: "住宅",
    notProvided: "未提供",
    coordsNote:
      "坐标为城市中心约 5 公里范围内的近似位置，仅表示大致区域，并非精确门牌坐标。",
  },
  errors: {
    realUnavailable: "真实地址服务暂时不可用，请稍后重试。",
    noCoverage: "所选范围暂无可用地址数据，请扩大范围或更换地区。",
    rateLimited: "请求过于频繁，请稍候再试。",
    invalidRequest: "请求参数无效，请检查筛选条件。",
    exhausted: "所选范围内可用地址不足，已返回实际数量。",
    optionsUnavailable: "地区列表加载失败，请重试。",
  },
  modesSection: {
    title: "两种生成模式",
    items: [
      "模拟地址——在浏览器本地由 @faker-js/faker 基于真实大城市表生成。街道名为虚构，城市、州省、邮编和坐标遵循真实城市。适用于地址本身无需真实存在的测试、表单和演示。",
      "真实地址数据（可选，需服务端部署）——当站点部署了开放数据 Address 服务后，该模式返回带数据来源、地址精度（街道级或门牌级）和坐标的真实来源地址。真实地址不代表可投递、可居住，也不与任何已验证的个人身份关联。",
    ],
  },
  whatIsExtra:
    "站点部署可选的真实地址服务后，第二种模式会返回带精度与数据来源的真实来源地址。",
  newFaqs: [
    {
      question: "模拟地址和真实地址数据有什么区别？",
      answer:
        "模拟地址在浏览器中生成：街道名为虚构（Faker），城市、州省、邮编和坐标来自真实大城市数据表。真实地址数据（站点启用后）来自自建开放数据地址服务，每条地址附带来源、精度和坐标信息。",
    },
    {
      question: "真实地址可以投递或已验证吗？",
      answer:
        "不能。真实来源地址表示该街道/门牌存在于开放数据源中，不代表邮件可投递、建筑可居住，也不与任何个人身份关联。ToolkitLife 的结果不包含任何合成人物资料。",
    },
  ],
};

const ja = {
  description:
    "20+ か国のリアルなランダム住所を生成——ブラウザ内シミュレーションはテスト・デモ向け。サイト有効化時は出典付きの実在住所データも取得できます。街道・市区町村・都道府県・郵便番号・座標を含みます。",
  metadata: {
    title: "グローバル住所ジェネレーター - 無料オンラインツール",
    description:
      "20+ か国のランダム住所を生成：ブラウザ内シミュレーション、または（サイト有効化時）出典・精度付きの実在住所データ。一括生成、コピー、TXT/CSV エクスポートに対応。",
  },
  labels: {
    mode: "生成モード",
    modeSimulated: "シミュレーション住所",
    modeReal: "実在住所データ",
    modeSimulatedHint:
      "Faker によりブラウザ内で生成します。テスト・デモ専用で、実在するとは限りません。",
    modeRealHint:
      "オープンデータの住所サービスから提供される、出典付きの実在住所（街道レベルまたは番地レベル）。",
    district: "区・郡",
    postcode: "郵便番号",
    residential: "住宅のみ",
    displayLanguage: "表示言語",
    displayOriginal: "原文の住所",
    precision: "住所の精度",
    precisionStreet: "街道レベル",
    precisionPremise: "番地レベル",
    precisionSubpremise: "番地レベル（部屋番号付き）",
    source: "データソース",
    residentialBadge: "住宅",
    notProvided: "提供なし",
    coordsNote:
      "座標は市中心から約 5 km 以内の近似位置であり、おおよそのエリアを示すものであり、正確な位置ではありません。",
  },
  errors: {
    realUnavailable:
      "実在住所サービスは一時的に利用できません。後ほど再度お試しください。",
    noCoverage:
      "選択した範囲にはまだ住所データがありません。範囲を広げるか、別の地域をお試しください。",
    rateLimited:
      "リクエストが集中しています。しばらく待ってから再度お試しください。",
    invalidRequest: "リクエストが無効です。フィルターをご確認ください。",
    exhausted:
      "選択範囲の住所が不足しているため、実際に取得できる分のみ表示しています。",
    optionsUnavailable: "地域リストの読み込みに失敗しました。もう一度お試しください。",
  },
  modesSection: {
    title: "2 つの生成モード",
    items: [
      "シミュレーション住所 — ブラウザ内で @faker-js/faker と実在都市テーブルを基に生成します。通称名は架空ですが、市区町村・郵便番号・座標は実在都市に準拠します。住所の実在性が不要なテストやデモに最適です。",
      "実在住所データ（オプション・サーバー側）— サイトがオープンデータ住所サービスをデプロイしている場合、出典・精度（街道/番地レベル）・座標付きの実在住所を返します。実在住所は郵便配達可能・入居可能・本人確認済みを意味しません。",
    ],
  },
  whatIsExtra:
    "サイトがオプションの実在住所サービスをデプロイしている場合、第 2 のモードで精度と出典付きの実在住所を取得できます。",
  newFaqs: [
    {
      question: "シミュレーション住所と実在住所データの違いは？",
      answer:
        "シミュレーション住所はブラウザ内で生成されます（通称名は架空、市区町村等は実在都市準拠）。実在住所データはサイト有効化後、オープンデータサービスから取得され、各住所に出典・精度・座標が付きます。",
    },
    {
      question: "実在住所は配達可能・検証済みですか？",
      answer:
        "いいえ。出典付き住所はオープンデータに街路・番地が存在することを示すだけで、郵便配達・居住可能性・人物との関連を保証しません。ToolkitLife の結果に架空の人物プロフィールは含まれません。",
    },
  ],
};

const ko = {
  description:
    "20+ 개국의 사실적인 랜덤 주소 생성——브라우저 내 가상 데이터는 테스트·데모용이며, 사이트 활성화 시 출처 기반의 실제 주소 데이터도 제공됩니다. 거리·도시·지역·우편번호·좌표 포함.",
  metadata: {
    title: "글로벌 주소 생성기 - 무료 온라인 도구",
    description:
      "20+ 개국 랜덤 주소 생성: 브라우저 내 가상 테스트 데이터 또는 (사이트 활성화 시) 출처와 정확도가 있는 실제 주소. 대량 생성, 복사, TXT/CSV 내보내기 지원.",
  },
  labels: {
    mode: "생성 모드",
    modeSimulated: "가상 주소",
    modeReal: "실제 주소 데이터",
    modeSimulatedHint:
      "Faker로 브라우저에서 로컬 생성됩니다. 테스트 및 데모 전용이며 실제 존재를 보장하지 않습니다.",
    modeRealHint:
      "자체 호스팅 오픈데이터 주소 서비스에서 제공하는 출처 기반의 실제 주소(가로수준 또는 번지수준)입니다.",
    district: "구/군",
    postcode: "우편번호",
    residential: "주거 주소만",
    displayLanguage: "표시 언어",
    displayOriginal: "원본 주소",
    precision: "주소 정확도",
    precisionStreet: "거리 수준",
    precisionPremise: "번지 수준",
    precisionSubpremise: "번지 수준(호실 포함)",
    source: "데이터 출처",
    residentialBadge: "주거",
    notProvided: "제공 안 됨",
    coordsNote:
      "좌표는 도심 중심으로부터 약 5km 이내의 근사 위치로, 대략적인 지역만 나타내며 정확한 위치가 아닙니다.",
  },
  errors: {
    realUnavailable:
      "실제 주소 서비스를 일시적으로 사용할 수 없습니다. 나중에 다시 시도해 주세요.",
    noCoverage:
      "선택한 범위에 아직 주소 데이터가 없습니다. 범위를 넓히거나 다른 지역을 선택해 보세요.",
    rateLimited: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
    invalidRequest: "요청이 잘못되었습니다. 필터를 확인해 주세요.",
    exhausted:
      "선택한 범위에 요청한 수보다 적은 주소가 있어 실제 반환 가능한 수만 표시합니다.",
    optionsUnavailable: "지역 목록을 불러오지 못했습니다. 다시 시도해 주세요.",
  },
  modesSection: {
    title: "2 가지 생성 모드",
    items: [
      "가상 주소 — 브라우저에서 @faker-js/faker와 실제 도시 테이블을 기반으로 생성됩니다. 거리 이름은 가상이지만 도시·지역·우편번호·좌표는 실제 도시를 따릅니다. 주소의 실존이 필요 없는 테스트·데모에 적합합니다.",
      "실제 주소 데이터(선택적·서버 측) — 사이트가 오픈데이터 주소 서비스를 배포한 경우, 출처·정확도(거리/번지 수준)·좌표가 포함된 실제 주소를 반환합니다. 실제 주소가 배달 가능·거주 가능·신원 확인됨을 의미하지 않습니다.",
    ],
  },
  whatIsExtra:
    "사이트가 선택적 실제 주소 서비스를 배포한 경우, 두 번째 모드로 정확도와 출처가 포함된 실제 주소를 얻을 수 있습니다.",
  newFaqs: [
    {
      question: "가상 주소와 실제 주소 데이터의 차이는 무엇인가요?",
      answer:
        "가상 주소는 브라우저에서 생성됩니다(거리 이름은 가상, 도시·지역 등은 실제 도시 기반). 실제 주소 데이터는 사이트가 활성화된 경우 오픈데이터 서비스에서 가져오며, 각 주소에 출처·정확도·좌표가 포함됩니다.",
    },
    {
      question: "실제 주소는 배달 가능하거나 검증되었나요?",
      answer:
        "아니요. 출처 기반 주소는 공개 데이터에 거리·번지가 존재함을 나타낼 뿐, 우편 배달·거주 가능성·특정 인물과의 연관성을 보장하지 않습니다. ToolkitLife 결과에는 가상 인물 정보가 포함되지 않습니다.",
    },
  ],
};

const ru = {
  description:
    "Генерация реалистичных случайных адресов для 20+ стран——смоделированные данные в браузере для тестов и демонстраций; после включения на сайте доступны реальные адресные данные с указанием источника. Улица, город, регион, индекс и координаты.",
  metadata: {
    title: "Глобальный генератор адресов - Бесплатный онлайн-инструмент",
    description:
      "Генерация случайных адресов для 20+ стран: смоделированные тестовые данные в браузере или (при включении) реальные адреса из открытых данных с источником и точностью. Пакетная генерация, копирование, экспорт TXT/CSV.",
  },
  labels: {
    mode: "Режим генерации",
    modeSimulated: "Смоделированные адреса",
    modeReal: "Реальные адресные данные",
    modeSimulatedHint:
      "Генерируются локально в браузере с помощью Faker. Только для тестов и демонстраций — существование адресов в реальности не гарантируется.",
    modeRealHint:
      "Адреса с реальным источником данных (уличный или домовой уровень) из самостоятельно размещённой службы открытых данных.",
    district: "Район",
    postcode: "Почтовый индекс",
    residential: "Только жилые адреса",
    displayLanguage: "Язык отображения",
    displayOriginal: "Исходный адрес",
    precision: "Точность адреса",
    precisionStreet: "Уличный уровень",
    precisionPremise: "Домовой уровень",
    precisionSubpremise: "Домовой уровень (с помещением)",
    source: "Источник данных",
    residentialBadge: "Жилой",
    notProvided: "Не предоставлено",
    coordsNote:
      "Координаты — приблизительное положение в радиусе около 5 км от центра города: они обозначают общий район, а не точную точку.",
  },
  errors: {
    realUnavailable:
      "Служба реальных адресов временно недоступна. Повторите попытку позже.",
    noCoverage:
      "Для выбранного диапазона пока нет адресных данных. Расширьте область или выберите другой регион.",
    rateLimited:
      "Слишком много запросов. Пожалуйста, подождите и повторите попытку.",
    invalidRequest: "Некорректный запрос. Проверьте условия фильтрации.",
    exhausted:
      "В выбранном диапазоне меньше адресов, чем запрошено, — показаны все доступные.",
    optionsUnavailable: "Не удалось загрузить список регионов. Повторите попытку.",
  },
  modesSection: {
    title: "Два режима генерации",
    items: [
      "Смоделированные адреса — создаются локально в браузере с помощью @faker-js/faker на основе таблицы реальных крупных городов. Названия улиц вымышленные, но город, регион, индекс и координаты соответствуют реальным городам. Подходят для тестов, форм и демонстраций, где реальное существование адреса не требуется.",
      "Реальные адресные данные (опционально, на стороне сервера) — если на сайте развёрнута служба открытых данных Address, этот режим возвращает адреса с реальным источником, точностью (уличный или домовой уровень) и координатами. Реальный адрес не означает возможность доставки, пригодность для проживания или связь с подтверждённой личностью.",
    ],
  },
  whatIsExtra:
    "После развёртывания опциональной службы реальных адресов второй режим возвращает адреса с реальным источником, точностью и данными о происхождении.",
  newFaqs: [
    {
      question:
        "В чём разница между смоделированными и реальными адресными данными?",
      answer:
        "Смоделированные адреса создаются в браузере: названия улиц вымышленные (Faker), а город, регион, индекс и координаты берутся из таблицы реальных крупных городов. Реальные адресные данные (после включения на сайте) поступают из самостоятельно размещённой службы открытых данных; каждый адрес сопровождается источником, точностью и координатами.",
    },
    {
      question: "Реальные адреса пригодны для доставки или проверены?",
      answer:
        "Нет. Адрес с реальным источником означает лишь, что улица или дом существуют в открытых данных. Это не гарантия доставки почты, пригодности здания для проживания или связи с каким-либо лицом. Результаты ToolkitLife не содержат синтетических данных о людях.",
    },
  ],
};

const es = {
  description:
    "Genera direcciones aleatorias realistas para más de 20 países——datos simulados en el navegador para pruebas y demos; cuando el sitio lo tiene activado, también puedes obtener datos de direcciones reales con su fuente. Calle, ciudad, región, código postal y coordenadas.",
  metadata: {
    title: "Generador global de direcciones - Herramienta online gratuita",
    description:
      "Genera direcciones aleatorias para más de 20 países: datos de prueba simulados en tu navegador o (si está activado) direcciones reales de datos abiertos con fuente y precisión. Generación por lotes, copia y exportación TXT/CSV.",
  },
  labels: {
    mode: "Modo de generación",
    modeSimulated: "Direcciones simuladas",
    modeReal: "Datos de direcciones reales",
    modeSimulatedHint:
      "Generadas localmente en tu navegador con Faker. Solo para pruebas y demostraciones: no se garantiza que existan en el mundo real.",
    modeRealHint:
      "Direcciones con procedencia real (a nivel de calle o de portal) de un servicio de direcciones de datos abiertos autoalojado.",
    district: "Distrito / Municipio",
    postcode: "Código postal",
    residential: "Solo direcciones residenciales",
    displayLanguage: "Idioma de visualización",
    displayOriginal: "Dirección original",
    precision: "Precisión de la dirección",
    precisionStreet: "Nivel de calle",
    precisionPremise: "Nivel de portal",
    precisionSubpremise: "Portal con unidad",
    source: "Fuente de datos",
    residentialBadge: "Residencial",
    notProvided: "No disponible",
    coordsNote:
      "Las coordenadas son posiciones aproximadas en un radio de unos 5 km del centro de la ciudad: indican la zona general, no la puerta exacta.",
  },
  errors: {
    realUnavailable:
      "El servicio de direcciones reales no está disponible temporalmente. Inténtalo más tarde.",
    noCoverage:
      "Aún no hay datos de direcciones para el área seleccionada. Amplía la zona o elige otra región.",
    rateLimited: "Demasiadas solicitudes. Espera un momento e inténtalo de nuevo.",
    invalidRequest: "La solicitud no es válida. Revisa los filtros.",
    exhausted:
      "El área seleccionada tiene menos direcciones de las solicitadas: se muestran todas las disponibles.",
    optionsUnavailable: "No se pudo cargar la lista de áreas. Inténtalo de nuevo.",
  },
  modesSection: {
    title: "Dos modos de generación",
    items: [
      "Direcciones simuladas — se generan localmente en tu navegador con @faker-js/faker sobre una tabla de ciudades reales. Los nombres de calles son ficticios; ciudad, región, código postal y coordenadas siguen ciudades reales. Útiles para pruebas, formularios y demos donde la dirección no necesita existir.",
      "Datos de direcciones reales (opcional, en el servidor) — cuando el sitio ha desplegado el servicio Address de datos abiertos, este modo devuelve direcciones con procedencia real, su precisión (calle o portal), coordenadas y fuentes de datos. Una dirección real no garantiza que sea entregable, habitable ni esté asociada a una identidad verificada.",
    ],
  },
  whatIsExtra:
    "Cuando el sitio ha desplegado el servicio opcional de direcciones reales, un segundo modo devuelve direcciones reales con su precisión y fuentes de datos.",
  newFaqs: [
    {
      question:
        "¿En qué se diferencian las direcciones simuladas y los datos reales?",
      answer:
        "Las direcciones simuladas se generan en el navegador: los nombres de calles son ficticios (Faker), mientras que ciudad, región, código postal y coordenadas provienen de una tabla de ciudades reales. Los datos reales (cuando el sitio los activa) provienen de un servicio autoalojado de datos abiertos; cada dirección incluye fuente, precisión y coordenadas.",
    },
    {
      question: "¿Las direcciones reales son entregables o verificadas?",
      answer:
        "No. Que una dirección tenga fuente real significa que la calle o el portal existe en fuentes de datos abiertos; no garantiza que el correo pueda entregarse, que el edificio sea habitable ni que esté asociada a alguna persona. Los resultados de ToolkitLife nunca incluyen perfiles de personas sintéticas.",
    },
  ],
};

const BY_LOCALE = {
  en, zh, ja, ko, ru, es,
  de: en, fr: en, pt: en, // unpublished locales serve English fallback
};

for (const [loc, pack] of Object.entries(BY_LOCALE)) {
  const p = `messages/${loc}.json`;
  const m = JSON.parse(fs.readFileSync(p, "utf8"));
  const ag = m.tools?.["address-generator"];
  if (!ag) throw new Error(`${loc}: tools.address-generator missing`);

  ag.description = pack.description;
  ag.metadata = pack.metadata;

  ag.labels = { ...ag.labels, ...pack.labels };
  ag.errors = { ...ag.errors, ...pack.errors };

  // Guide: add modes section (renderer order: whatIs, modes, howTo, tips)
  // and append the real-mode sentence to whatIs.
  ag.guide.modes = pack.modesSection;
  if (Array.isArray(ag.guide.whatIs?.body)) {
    ag.guide.whatIs.body = [...ag.guide.whatIs.body, pack.whatIsExtra];
  }

  // FAQs: insert the two new ones before the last ("Can I use these addresses
  // for shipping?" stays last as the closing caveat).
  const existing = ag.faqs ?? [];
  const shippingIdx = existing.findIndex((f) =>
    /shipping/i.test(f.question)
  );
  if (shippingIdx === -1) {
    ag.faqs = [...existing, ...pack.newFaqs];
  } else {
    ag.faqs = [
      ...existing.slice(0, shippingIdx),
      ...pack.newFaqs,
      ...existing.slice(shippingIdx),
    ];
  }

  fs.writeFileSync(p, JSON.stringify(m, null, 2) + "\n");
  console.log(`${loc}: address-generator updated`);
}
