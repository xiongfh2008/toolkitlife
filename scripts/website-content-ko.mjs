export default {
  "xml-sitemap": {
    home: {
      name: "XML 사이트맵 생성기",
      description: "웹사이트용 XML 사이트맵을 즉시 생성합니다.",
      category: "마케팅",
      icon: "🗺️",
    },
    tool: {
      metadata: {
        title: "XML 사이트맵 생성기",
        description: "몇 초 만에 웹사이트용 표준 XML 사이트맵 생성",
        category: "마케팅",
      },
      keywords: [
        "xml 사이트맵 생성",
        "사이트맵 생성기",
        "sitemap 생성",
        "seo 사이트맵",
        "sitemap.xml",
        "웹사이트 사이트맵",
        "사이트맵 도구",
      ],
      labels: {
        websiteUrl: "웹사이트 URL",
        paths: "페이지 경로 (줄마다 하나)",
        changefreq: "변경 빈도",
        priority: "우선순위",
        results: "사이트맵 출력",
      },
      placeholders: {
        websiteUrl: "https://example.com",
        paths: "/\n/about\n/contact\n/blog",
      },
      buttons: {
        generate: "사이트맵 생성",
        clear: "지우기",
        download: "XML 다운로드",
        copy: "XML 복사",
      },
      options: {
        always: "항상",
        hourly: "매시간",
        daily: "매일",
        weekly: "매주",
        monthly: "매월",
        yearly: "매년",
        never: "없음",
      },
      messages: {
        empty: "페이지 경로를 하나 이상 입력하세요.",
        invalidUrl: "유효한 웹사이트 URL을 입력하세요.",
        placeholder: "생성된 사이트맵이 여기에 표시됩니다.",
      },
      faqs: [
        {
          question: "XML 사이트맵이란?",
          answer:
            "XML 사이트맵은 웹사이트의 중요한 페이지를 나열한 파일로, 검색 엔진이 페이지를 효율적으로 발견하고 크롤링할 수 있게 합니다.",
        },
        {
          question: "얼마나 자주 업데이트해야 하나요?",
          answer:
            "중요한 페이지를 추가·삭제·변경할 때마다 업데이트하세요. 대부분의 사이트는 주간 또는 월간으로 설정합니다.",
        },
        {
          question: "사이트맵을 어디에 올려야 하나요?",
          answer:
            "sitemap.xml을 웹사이트 루트에 업로드하고 Google Search Console이나 Bing Webmaster Tools에 제출하세요.",
        },
        {
          question: "우선순위는 어떻게 설정하나요?",
          answer:
            "우선순위는 0.0~1.0 범위로 검색 엔진에 페이지 중요도를 알려줍니다. 홈페이지와 주요 랜딩 페이지에만 1.0을 사용하세요.",
        },
      ],
      relatedTools: [
        { name: "Robots.txt 생성기", href: "/tools/robots-txt-generator" },
        { name: "메타 태그 생성기", href: "/tools/meta-tag-generator" },
        { name: "URL 슬러그 생성기", href: "/tools/url-slug-generator" },
        { name: "키워드 순위 조회", href: "/tools/keyword-position" },
      ],
      guide: {
        intro: {
          title: "XML 사이트맵 생성기란?",
          paragraphs: [
            "XML 사이트맵 생성기는 웹사이트의 URL을 나열한 sitemap.xml 파일을 만들어 검색 엔진이 페이지를 발견하고 색인하도록 돕습니다.",
          ],
        },
        sections: [
          {
            title: "사용 방법",
            paragraphs: [
              "웹사이트 URL을 입력하고 페이지 경로를 줄마다 적고, 변경 빈도와 우선순위를 선택한 뒤 사이트맵 생성을 클릭하세요.",
            ],
            items: [
              "경로는 절대경로(/about) 또는 상대경로(about) 모두 가능합니다.",
              "lastmod 날짜는 자동으로 오늘로 설정됩니다.",
              "XML 파일을 다운로드해 사이트 루트에 업로드하세요.",
            ],
          },
          {
            title: "팁",
            paragraphs: [
              "사이트맵은 50,000개 URL 미만으로 유지하세요. 대형 사이트는 여러 개로 분할하세요.",
            ],
          },
        ],
      },
    },
  },
  "adsense-calculator": {
    home: {
      name: "AdSense 수입 계산기",
      description: "Google AdSense 수익을 예측합니다.",
      category: "마케팅",
      icon: "💰",
    },
    tool: {
      metadata: {
        title: "AdSense 수입 계산기",
        description: "트래픽과 광고 지표를 기반으로 Google AdSense 수익 예측",
        category: "마케팅",
      },
      keywords: [
        "adsense 계산기",
        "adsense 수입 계산",
        "google adsense 수익",
        "광고 수익 계산",
        "cpm 계산기",
        "adsense rpm",
        "수익 계산기",
      ],
      labels: {
        dailyPageviews: "일일 페이지뷰",
        adsPerPage: "페이지당 광고 수",
        ctr: "CTR (%)",
        cpc: "CPC ($)",
        daily: "예상 일일 수입",
        monthly: "예상 월 수입",
        yearly: "예상 연 수입",
      },
      messages: {
        disclaimer:
          "추정치일 뿐입니다. 실제 수입은 니치, 지역, 계절, 광고 품질 등 여러 요인에 따라 달라집니다.",
      },
      faqs: [
        {
          question: "AdSense 수익은 어떻게 계산되나요?",
          answer:
            "수익은 대략 페이지뷰 × 페이지당 광고 수 × CTR × CPC로 계산됩니다. 이 도구는 해당 공식을 사용해 추정합니다.",
        },
        {
          question: "적절한 CTR은?",
          answer: "디스플레이 광고의 일반적인 CTR은 1%~3%입니다. 품질이 높고 배치가 좋은 광고는 더 좋은 성과를 냅니다.",
        },
        {
          question: "CPC란 무엇이며 무엇에 영향을 받나요?",
          answer:
            "CPC는 클릭당 지급액으로, 니치, 사용자 지역, 계절, 광고주 경쟁에 따라 달라집니다.",
        },
        {
          question: "왜 추정치인가요?",
          answer:
            "실제 수입은 트래픽 소스, 광고 품질, 사용자 행동 등 계산기가 알 수 없는 요소에 의존합니다.",
        },
      ],
      relatedTools: [
        { name: "매출 계산기", href: "/tools/revenue-calculator" },
        { name: "이익률 계산기", href: "/tools/profit-margin-calculator" },
        { name: "백분율 계산기", href: "/tools/percentage-calculator" },
        { name: "키워드 밀도 검사", href: "/tools/keyword-density" },
      ],
      guide: {
        intro: {
          title: "AdSense 계산기란?",
          paragraphs: [
            "AdSense 계산기는 트래픽과 광고 설정을 바탕으로 웹사이트가 Google AdSense로 벌 수 있는 금액을 추정합니다.",
          ],
        },
        sections: [
          {
            title: "사용 방법",
            paragraphs: [
              "일일 페이지뷰, 페이지당 평균 광고 수, CTR, CPC를 입력하면 일·월·연 추정치가 즉시 업데이트됩니다.",
            ],
            items: [
              "CTR은 광고 노출 중 클릭된 비율입니다.",
              "CPC는 클릭당 평균 수입입니다.",
              "AdSense 대시보드의 실제 값으로 입력하면 더 정확합니다.",
            ],
          },
          {
            title: "팁",
            paragraphs: [
              "입력 값을 바꿔가며 트래픽과 참여도가 수익에 미치는 영향을 확인해 보세요.",
            ],
          },
        ],
      },
    },
  },
  "url-opener": {
    home: {
      name: "URL 일괄 열기",
      description: "여러 URL을 한 번에 새 탭에서 엽니다.",
      category: "마케팅",
      icon: "🔗",
    },
    tool: {
      metadata: {
        title: "URL 일괄 열기",
        description: "여러 URL을 한 번에 새 브라우저 탭에서 열기",
        category: "마케팅",
      },
      keywords: [
        "url 일괄 열기",
        "여러 url 열기",
        "대량 url 열기",
        "url 동시에 열기",
        "여러 링크 열기",
      ],
      labels: {
        urls: "URL (줄마다 하나 또는 쉼표 구분)",
      },
      placeholders: {
        urls: "https://example.com\nhttps://example.com/about",
      },
      buttons: {
        open: "모든 URL 열기",
        clear: "지우기",
      },
      messages: {
        empty: "URL을 하나 이상 입력하세요.",
        popupBlocked: "브라우저가 일부 팝업을 차단했습니다. 이 사이트의 팝업을 허용한 후 다시 시도하세요.",
      },
      status: {
        pending: "대기 중",
        opened: "열림",
        blocked: "차단됨",
      },
      faqs: [
        {
          question: "브라우저가 탭을 차단하는 이유는?",
          answer:
            "브라우저는 사용자 동작 외에 열리는 팝업을 차단합니다. 이 경우 브라우저 설정에서 이 사이트의 팝업을 허용하고 다시 시도하세요.",
        },
        {
          question: "http:// 없이도 열 수 있나요?",
          answer: "네. 프로토콜이 없는 URL에는 자동으로 https://가 추가됩니다.",
        },
        {
          question: "한 번에 몇 개까지 열 수 있나요?",
          answer: "제한은 없지만, 매우 큰 목록은 브라우저 제한을 받을 수 있습니다.",
        },
      ],
      relatedTools: [
        { name: "URL 단축", href: "/tools/url-shortener" },
        { name: "URL 슬러그 생성기", href: "/tools/url-slug-generator" },
        { name: "키워드 순위 조회", href: "/tools/keyword-position" },
        { name: "도메인 Whois 조회", href: "/tools/whois-lookup" },
      ],
      guide: {
        intro: {
          title: "URL 오프너란?",
          paragraphs: [
            "URL 오프너는 여러 링크를 한 번에 새 탭으로 열어 하나씩 복사·붙여넣기하는 번거로움을 없애줍니다.",
          ],
        },
        sections: [
          {
            title: "사용 방법",
            paragraphs: [
              "URL 목록(줄마다 하나 또는 쉼표 구분)을 붙여넣고 '모든 URL 열기'를 클릭하면 각 URL이 새 탭에서 열립니다.",
            ],
            items: [
              "중복 URL은 자동으로 제거됩니다.",
              "탭이 차단되면 이 사이트의 팝업을 허용하세요.",
            ],
          },
          {
            title: "팁",
            paragraphs: [
              "사이트의 여러 페이지 확인, 자료 일괄 참조, 링크 빠른 테스트에 유용합니다.",
            ],
          },
        ],
      },
    },
  },
  "html-viewer": {
    home: {
      name: "HTML 뷰어",
      description: "HTML 코드를 실시간으로 보고 미리 봅니다.",
      category: "개발자",
      icon: "🖥️",
    },
    tool: {
      metadata: {
        title: "HTML 뷰어",
        description: "HTML 코드를 실시간으로 보고 미리 보기",
        category: "개발자",
      },
      keywords: [
        "html 뷰어",
        "html 미리보기",
        "html 렌더링",
        "온라인 html 뷰어",
        "html 코드 보기",
        "html 미리보기 확인",
        "html 샌드박스",
      ],
      labels: {
        html: "HTML 코드",
      },
      tabs: {
        preview: "미리보기",
        source: "소스",
      },
      buttons: {
        clear: "지우기",
        copy: "HTML 복사",
      },
      faqs: [
        {
          question: "미리보기에서 스크립트가 실행되나요?",
          answer:
            "미리보기는 샌드박스 iframe에서 렌더링되어 안전을 위해 스크립트는 실행되지 않습니다. 정적 HTML, CSS, 인라인 스타일은 완전히 동작합니다.",
        },
        {
          question: "HTML이 외부로 전송되나요?",
          answer: "아니요. 모든 것이 브라우저에서 실행되며 코드가 기기를 벗어나지 않습니다.",
        },
        {
          question: "렌더링 결과를 복사할 수 있나요?",
          answer: "소스 탭에서 HTML 코드를 복사하고, 미리보기에서 시각적 결과를 확인하세요.",
        },
      ],
      relatedTools: [
        { name: "Markdown 미리보기", href: "/tools/markdown-preview" },
        { name: "HTML 압축", href: "/tools/html-minifier" },
        { name: "HTML 엔티티 변환", href: "/tools/html-entity-encoder" },
        { name: "HTML 이미지 변환", href: "/tools/html-to-image" },
      ],
      guide: {
        intro: {
          title: "HTML 뷰어란?",
          paragraphs: [
            "HTML 뷰어는 HTML 코드를 실시간으로 렌더링하여 편집하면서 시각적 결과를 확인할 수 있게 합니다.",
          ],
        },
        sections: [
          {
            title: "사용 방법",
            paragraphs: [
              "왼쪽 편집기에 HTML을 입력하거나 붙여넣으면 오른쪽 미리보기가 자동으로 업데이트됩니다. '미리보기'와 '소스' 탭을 전환해 확인하세요.",
            ],
            items: [
              "HTML, CSS, 인라인 스타일을 지원합니다.",
              "안전을 위해 외부 리소스는 차단됩니다.",
            ],
          },
          {
            title: "팁",
            paragraphs: [
              "소규모 페이지 프로토타입, 레이아웃 디버깅, 이메일 템플릿 확인에 유용합니다.",
            ],
          },
        ],
      },
    },
  },
  "mobile-friendly-test": {
    home: {
      name: "모바일 친화성 테스트",
      description: "웹사이트가 모바일 친화적인지 확인합니다.",
      category: "마케팅",
      icon: "📱",
    },
    tool: {
      metadata: {
        title: "모바일 친화성 테스트",
        description: "웹사이트가 모바일 기기에 최적화되어 있는지 확인",
        category: "마케팅",
      },
      keywords: [
        "모바일 친화성 테스트",
        "모바일 호환성 확인",
        "반응형 테스트",
        "모바일 사용성",
        "모바일 seo",
        "모바일 친화성 확인",
      ],
      labels: {
        url: "페이지 URL",
        score: "모바일 친화성 점수",
        pass: "통과",
        fail: "실패",
      },
      placeholders: {
        url: "https://example.com",
      },
      buttons: {
        check: "URL 확인",
        checking: "확인 중...",
      },
      messages: {
        empty: "확인할 URL을 입력하세요.",
        fetchFailed: "페이지를 가져올 수 없습니다. 사이트가 자동 요청을 차단했거나 URL이 유효하지 않을 수 있습니다.",
        viewportPass: "페이지에 device-width viewport 메타 태그가 있습니다.",
        viewportFail: "페이지에 적절한 viewport 메타 태그가 없습니다.",
        titlePass: "페이지에 title 태그가 있습니다.",
        titleFail: "페이지에 title 태그가 없습니다.",
        descriptionPass: "페이지에 meta description이 있습니다.",
        descriptionFail: "페이지에 meta description이 없습니다.",
        responsivePass: "반응형 CSS(미디어 쿼리)가 사용되고 있습니다.",
        responsiveFail: "미디어 쿼리를 찾을 수 없습니다. 작은 화면에 적응하지 못할 수 있습니다.",
        fontSizePass: "읽기 쉬운 글꼴 크기(12px 이상)가 감지되었습니다.",
        fontSizeFail: "글꼴 크기가 명확하게 설정되지 않아 모바일에서 읽기 어려울 수 있습니다.",
        disclaimer:
          "페이지 HTML 기반의 가벼운 휴리스틱 검사입니다. 전체 분석은 Google 공식 Mobile-Friendly Test를 이용하세요.",
      },
      faqs: [
        {
          question: "모바일 친화성 테스트는 어떻게 동작하나요?",
          answer:
            "페이지 HTML을 가져와 viewport 메타 태그, title, description, 반응형 CSS, 글꼴 크기 등 모바일 최적화 항목을 확인합니다.",
        },
        {
          question: "viewport 메타 태그란?",
          answer:
            "width=device-width 같은 viewport 태그는 모바일 브라우저가 데스크톱 폭이 아닌 기기 폭으로 페이지를 렌더링하도록 지시합니다.",
        },
        {
          question: "Google의 테스트와 같은 정확도인가요?",
          answer:
            "아니요. 빠른 휴리스틱 검사입니다. Google의 Mobile-Friendly Test는 페이지를 렌더링하고 더 완전한 평가를 제공합니다.",
        },
      ],
      relatedTools: [
        { name: "메타 태그 분석기", href: "/tools/meta-tags-analyzer" },
        { name: "HTML 뷰어", href: "/tools/html-viewer" },
        { name: "XML 사이트맵 생성기", href: "/tools/xml-sitemap" },
        { name: "웹 이미지 최적화", href: "/tools/image-web-optimizer" },
      ],
      guide: {
        intro: {
          title: "모바일 친화성 테스트란?",
          paragraphs: [
            "모바일 친화성 테스트는 웹사이트가 스마트폰과 태블릿에서 잘 작동하는지 확인합니다. 사용자 경험과 Google의 모바일 우선 인덱싱에 중요합니다.",
          ],
        },
        sections: [
          {
            title: "사용 방법",
            paragraphs: [
              "확인할 페이지의 URL을 입력하고 'URL 확인'을 클릭하세요. 도구가 페이지를 가져와 점수와 확인 항목을 보여줍니다.",
            ],
            items: [
              "점수는 아래 확인 항목을 기반으로 합니다.",
              "실패한 항목을 수정해 모바일 경험을 개선하세요.",
            ],
          },
          {
            title: "팁",
            paragraphs: [
              "viewport 메타 태그부터 시작하세요. 모바일 렌더링에서 가장 중요한 단일 수정 항목입니다.",
            ],
          },
        ],
      },
    },
  },
};
