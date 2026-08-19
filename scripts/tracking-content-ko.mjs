export default {
  "what-is-my-browser": {
    home: {
      name: "브라우저 정보 확인",
      description: "브라우저, OS, IP 주소를 감지합니다.",
      category: "Tracking",
      icon: "🌐",
    },
    tool: {
      metadata: {
        title: "브라우저 정보 확인",
        description: "브라우저 이름, 버전, OS, IP 주소 감지",
        category: "Tracking",
      },
      keywords: [
        "내 브라우저",
        "브라우저 감지",
        "브라우저 버전",
        "브라우저 확인",
        "user agent",
        "브라우저 os",
        "무슨 브라우저",
      ],
      labels: {
        browser: "브라우저",
        version: "버전",
        engine: "엔진",
        os: "운영체제",
        screen: "화면 해상도",
        colorDepth: "색심도",
        language: "언어",
        languages: "언어 목록",
        timezone: "시간대",
        ipAddress: "IP 주소",
        cookies: "쿠키 활성화",
        online: "온라인",
        userAgent: "User Agent 문자열",
      },
      buttons: {
        refresh: "새로고침",
        copy: "복사",
      },
      messages: {
        ipFailed: "감지할 수 없음",
        yes: "예",
        no: "아니요",
      },
      faqs: [
        {
          question: "브라우저를 어떻게 감지하나요?",
          answer: "브라우저의 User-Agent 문자열과 모든 웹사이트가 접근 가능한 JavaScript API를 읽습니다.",
        },
        {
          question: "데이터가 외부로 전송되나요?",
          answer: "아니요. 모든 것이 브라우저에서 감지됩니다. 공인 IP만 공용 IP 서비스에 요청합니다.",
        },
        {
          question: "브라우저 정보가 왜 중요한가요?",
          answer: "웹사이트는 호환 기능 제공에 브라우저 감지를 사용하고, 개발자는 User-Agent로 사이트를 테스트·디버깅합니다.",
        },
      ],
      relatedTools: [
        { name: "IP 주소 조회", href: "/tools/ip-lookup" },
        { name: "GEO IP 로케이터", href: "/tools/geo-ip-locator" },
        { name: "타이핑 속도 테스트", href: "/tools/typing-speed-test" },
        { name: "IP 조회", href: "/tools/ip-lookup" },
      ],
      guide: {
        intro: {
          title: "브라우저 정보 확인이란?",
          paragraphs: [
            "이 도구는 브라우저 이름, 버전, 렌더링 엔진, OS, 화면 해상도, 언어, 시간대, 공인 IP 주소를 감지합니다.",
          ],
        },
        sections: [
          {
            title: "사용 방법",
            paragraphs: [
              "페이지를 열면 자동으로 감지됩니다. 설정을 변경한 후 새로고침을 눌러 다시 감지하세요.",
            ],
            items: [
              "User-Agent 문자열은 하단에 표시되며 개발자용입니다.",
              "버그를 신고할 때 User-Agent를 복사해 첨부하세요.",
            ],
          },
          {
            title: "팁",
            paragraphs: [
              "VPN을 사용하면 표시되는 IP가 실제 위치가 아닌 VPN 제공자의 것일 수 있습니다.",
            ],
          },
        ],
      },
    },
  },
  "geo-ip-locator": {
    home: {
      name: "GEO IP 로케이터",
      description: "IP 주소의 지리적 위치를 찾습니다.",
      category: "Tracking",
      icon: "📍",
    },
    tool: {
      metadata: {
        title: "GEO IP 로케이터",
        description: "IP 주소의 지리적 위치, ISP, 조직 정보 검색",
        category: "Tracking",
      },
      keywords: [
        "geo ip 로케이터",
        "ip 위치",
        "ip 지리정보",
        "ip 위치 조회",
        "ip 주소 위치",
        "ip 추적",
        "ip 위치 확인",
      ],
      labels: {
        ip: "IP 주소",
        continent: "대륙",
        country: "국가",
        region: "지역",
        city: "도시",
        coordinates: "좌표",
        isp: "ISP",
        organization: "조직",
        asn: "ASN",
        timezone: "시간대",
        type: "IP 유형",
        myIp: "내 IP 주소 사용",
      },
      buttons: {
        lookUp: "조회",
        loading: "조회 중...",
      },
      messages: {
        errorInvalid: "유효한 IPv4 주소를 입력하세요.",
        errorNotFound: "이 IP의 위치 데이터를 찾을 수 없습니다.",
        errorGeneric: "조회에 실패했습니다. 다시 시도하세요.",
      },
      faqs: [
        {
          question: "IP 지리정보는 얼마나 정확한가요?",
          answer: "IP 지리정보는 보통 도시 또는 지역 수준까지 식별합니다. 정확한 주소까지는 아닙니다.",
        },
        {
          question: "IP 위치가 틀릴 수 있나요?",
          answer: "네. VPN, 프록시, 이동통신사 때문에 실제와 다른 위치로 표시될 수 있습니다.",
        },
        {
          question: "ASN이란 무엇인가요?",
          answer: "자율 시스템 번호는 IP 블록을 소유한 네트워크(보통 ISP 또는 호스팅 업체)를 식별합니다.",
        },
      ],
      relatedTools: [
        { name: "IP 주소 조회", href: "/tools/ip-lookup" },
        { name: "Whois 조회", href: "/tools/whois-lookup" },
        { name: "도메인 호스팅 확인", href: "/tools/domain-hosting" },
        { name: "브라우저 정보 확인", href: "/tools/what-is-my-browser" },
      ],
      guide: {
        intro: {
          title: "GEO IP 로케이터란?",
          paragraphs: [
            "GEO IP 로케이터는 IP 주소의 대략적인 지리적 위치와 ISP, 네트워크 정보를 찾습니다.",
          ],
        },
        sections: [
          {
            title: "사용 방법",
            paragraphs: [
              "IPv4 주소를 입력하고 조회를 클릭하거나, '내 IP 주소 사용'으로 자신의 공인 IP를 조회하세요.",
            ],
            items: [
              "결과에 대륙, 국가, 도시, 좌표가 표시됩니다.",
              "ISP와 ASN이 IP를 소유한 네트워크를 식별합니다.",
            ],
          },
          {
            title: "팁",
            paragraphs: [
              "방문자나 트래픽의 지역 확인, 의심스러운 IP 검증에 활용하세요.",
            ],
          },
        ],
      },
    },
  },
  "redirect-checker": {
    home: {
      name: "리디렉션 확인",
      description: "URL 리디렉션과 최종 목적지를 확인합니다.",
      category: "Tracking",
      icon: "🔀",
    },
    tool: {
      metadata: {
        title: "리디렉션 확인",
        description: "URL이 어디로 리디렉션되는지와 최종 상태 코드 확인",
        category: "Tracking",
      },
      keywords: [
        "리디렉션 확인",
        "url 리디렉션",
        "301 리디렉션",
        "리디렉션 체인",
        "링크 리디렉션",
        "리디렉션 테스트",
      ],
      labels: {
        url: "URL",
        originalUrl: "원본 URL",
        finalUrl: "최종 URL",
        statusCode: "상태 코드",
        hasRedirect: "이 URL은 다른 주소로 리디렉션됩니다",
        noRedirect: "이 URL은 직접 로드됩니다",
      },
      buttons: {
        check: "확인",
        checking: "확인 중...",
      },
      messages: {
        empty: "확인할 URL을 입력하세요.",
        fetchFailed: "URL을 가져올 수 없습니다. 사이트가 자동 요청을 차단했거나 URL이 유효하지 않습니다.",
        disclaimer: "프록시를 통한 가벼운 검사입니다. 전체 리디렉션 체인은 서버 측 도구를 이용하세요.",
      },
      faqs: [
        {
          question: "301 리디렉션이란?",
          answer: "301 리디렉션은 이전 URL을 새 URL로 영구적으로 전환해 페이지가 이동했음을 브라우저와 검색 엔진에 알립니다.",
        },
        {
          question: "리디렉션을 왜 확인해야 하나요?",
          answer: "끊긴 리디렉션이나 긴 체인은 사이트를 느리게 만들고 SEO에 나쁩니다. 정기 확인으로 링크를 건강하게 유지하세요.",
        },
        {
          question: "어떤 상태 코드가 중요한가요?",
          answer: "200은 정상, 301/302는 리디렉션, 404는 없음, 403/500은 오류를 의미합니다.",
        },
      ],
      relatedTools: [
        { name: "사이트 다운 확인", href: "/tools/is-it-down" },
        { name: "URL 일괄 열기", href: "/tools/url-opener" },
        { name: "URL 슬러그 생성기", href: "/tools/url-slug-generator" },
        { name: "모바일 친화성 테스트", href: "/tools/mobile-friendly-test" },
      ],
      guide: {
        intro: {
          title: "리디렉션 확인이란?",
          paragraphs: [
            "리디렉션 확인 도구는 URL이 다른 주소로 리디렉션되는지 테스트하고 최종 목적지와 상태 코드를 보여줍니다.",
          ],
        },
        sections: [
          {
            title: "사용 방법",
            paragraphs: [
              "URL을 입력하고 확인을 클릭하세요. 도구가 프록시를 통해 URL을 가져와 최종 URL과 원본을 비교합니다.",
            ],
            items: [
              "최종 URL이 다르면 리디렉션되고 있는 것입니다.",
              "상태 코드로 정상(200)인지 이동(301/302)인지 알 수 있습니다.",
            ],
          },
          {
            title: "팁",
            paragraphs: [
              "페이지 이동 후 SEO 가치를 유지하려면 이전 URL에 301 리디렉션을 설정하세요.",
            ],
          },
        ],
      },
    },
  },
  "is-it-down": {
    home: {
      name: "사이트 다운 확인",
      description: "웹사이트가 다운됐는지 확인합니다.",
      category: "Tracking",
      icon: "🛡️",
    },
    tool: {
      metadata: {
        title: "사이트 다운 확인",
        description: "웹사이트가 모두에게 다운됐는지, 나만 안 되는지 확인",
        category: "Tracking",
      },
      keywords: [
        "사이트 다운",
        "웹사이트 다운 확인",
        "사이트 상태",
        "uptime 확인",
        "웹사이트 상태 확인",
        "다운 감지",
      ],
      labels: {
        url: "URL",
        status: "상태 코드",
        responseTime: "응답 시간",
      },
      buttons: {
        check: "확인",
        checking: "확인 중...",
      },
      messages: {
        empty: "확인할 URL을 입력하세요.",
        online: "정상 작동 중!",
        offline: "다운됐을 수 있습니다",
        disclaimer: "프록시를 통한 접근성 확인입니다. 로컬 네트워크 문제로 나만 안 보이거나 다른 지역에서는 정상일 수 있습니다.",
      },
      faqs: [
        {
          question: "사이트 다운을 어떻게 확인하나요?",
          answer: "공용 프록시를 통해 사이트에 요청합니다. 성공하면 접근 가능, 실패하면 다운됐을 수 있습니다.",
        },
        {
          question: "왜 '다운됐을 수 있습니다'라고 하나요?",
          answer: "일부 사이트는 자동 요청을 차단하고 지역별 장애도 다릅니다. 강한 신호이지만 보장은 아닙니다.",
        },
        {
          question: "사이트가 다운되면 어떻게 해야 하나요?",
          answer: "호스팅 업체의 상태 페이지를 확인하고 DNS 변경을 살펴보며, 지속되면 지원팀에 문의하세요.",
        },
      ],
      relatedTools: [
        { name: "리디렉션 확인", href: "/tools/redirect-checker" },
        { name: "도메인 호스팅 확인", href: "/tools/domain-hosting" },
        { name: "Whois 조회", href: "/tools/whois-lookup" },
        { name: "타이핑 속도 테스트", href: "/tools/typing-speed-test" },
      ],
      guide: {
        intro: {
          title: "사이트 다운 확인이란?",
          paragraphs: [
            "사이트 다운 확인은 웹사이트가 현재 접근 가능한지 확인하여, 장애가 모두에게 영향을 주는지 나만 해당인지 판단하는 데 도움을 줍니다.",
          ],
        },
        sections: [
          {
            title: "사용 방법",
            paragraphs: [
              "URL을 입력하고 확인을 클릭하세요. 도구가 프록시를 통해 사이트에 요청하고 응답 여부를 표시합니다.",
            ],
            items: [
              "성공 응답은 사이트가 정상임을 의미합니다.",
              "상태 코드와 응답 시간이 참고로 표시됩니다.",
            ],
          },
          {
            title: "팁",
            paragraphs: [
              "여기서는 정상인데 나만 안 보인다면 네트워크, DNS 캐시, 로컬 방화벽 문제일 가능성이 높습니다.",
            ],
          },
        ],
      },
    },
  },
  "domain-age": {
    home: {
      name: "도메인 연령 확인",
      description: "도메인의 연령을 확인합니다.",
      category: "Domain",
      icon: "⏳",
    },
    tool: {
      metadata: {
        title: "도메인 연령 확인",
        description: "도메인의 등록일과 연령 확인",
        category: "Domain",
      },
      keywords: [
        "도메인 연령",
        "도메인 연령 확인",
        "도메인 등록일",
        "도메인 나이",
        "도메인 등록 날짜",
        "whois 연령",
      ],
      labels: {
        domain: "도메인",
        registrationDate: "등록일",
        expiryDate: "만료일",
        updatedDate: "최근 업데이트",
        status: "상태",
        years: "{n}년",
        months: "{n}개월",
        days: "{n}일",
      },
      buttons: {
        check: "확인",
        checking: "확인 중...",
      },
      messages: {
        errorEmpty: "도메인 이름을 입력하세요.",
        errorInvalid: "유효한 도메인 이름을 입력하세요.",
        errorNotFound: "이 도메인의 등록 데이터를 찾을 수 없습니다.",
        errorGeneric: "확인에 실패했습니다. 다시 시도하세요.",
        noRegistration: "이 도메인의 등록일을 찾을 수 없습니다.",
      },
      faqs: [
        {
          question: "도메인 연령이 왜 중요한가요?",
          answer: "오래된 도메인은 검색 엔진과 사용자에게 더 신뢰받는 경향이 있으며, 오래된 도메인은 기존 이력이 있을 수 있습니다.",
        },
        {
          question: "데이터는 어디서 오나요?",
          answer: "기존 WHOIS를 대체한 현대 표준인 공개 RDAP 레지스트리 데이터를 읽습니다.",
        },
        {
          question: "등록일이 숨겨질 수 있나요?",
          answer: "대부분의 레지스트리는 등록일을 공개합니다. 개인정보 보호는 보통 연락처만 숨깁니다.",
        },
      ],
      relatedTools: [
        { name: "Whois 조회", href: "/tools/whois-lookup" },
        { name: "도메인 호스팅 확인", href: "/tools/domain-hosting" },
        { name: "GEO IP 로케이터", href: "/tools/geo-ip-locator" },
        { name: "IP 주소 조회", href: "/tools/ip-lookup" },
      ],
      guide: {
        intro: {
          title: "도메인 연령 확인이란?",
          paragraphs: [
            "도메인 연령 확인은 도메인이 언제 등록되었는지 보여주고 연·월·일로 연령을 계산합니다.",
          ],
        },
        sections: [
          {
            title: "사용 방법",
            paragraphs: [
              "도메인 이름(http:// 또는 www 없이)을 입력하고 확인을 클릭하세요. 등록·만료·업데이트 날짜가 표시됩니다.",
            ],
            items: [
              "연령은 등록일 기준으로 계산됩니다.",
              "만료일과 업데이트일은 있을 때 표시됩니다.",
            ],
          },
          {
            title: "팁",
            paragraphs: [
              "사이트의 이력을 평가하거나 도메인 구매를 결정할 때 활용하세요.",
            ],
          },
        ],
      },
    },
  },
  "domain-hosting": {
    home: {
      name: "도메인 호스팅 확인",
      description: "도메인이 어디에 호스팅되어 있는지 확인합니다.",
      category: "Domain",
      icon: "🏢",
    },
    tool: {
      metadata: {
        title: "도메인 호스팅 확인",
        description: "도메인이 사용하는 호스팅 업체와 네트워크 확인",
        category: "Domain",
      },
      keywords: [
        "도메인 호스팅 확인",
        "웹사이트 호스팅 확인",
        "호스팅 업체 찾기",
        "웹 호스트 검색",
        "사이트가 호스팅된 곳",
        "호스팅 확인",
      ],
      labels: {
        domain: "도메인",
        ipAddress: "IP 주소",
        host: "호스팅 업체",
        organization: "조직",
        asn: "ASN",
        country: "국가",
        city: "도시",
      },
      buttons: {
        check: "확인",
        checking: "확인 중...",
      },
      messages: {
        errorEmpty: "도메인 이름을 입력하세요.",
        errorInvalid: "유효한 도메인 이름을 입력하세요.",
        errorNoARecord: "이 도메인의 A 레코드를 찾을 수 없습니다. 아직 호스트에 연결되지 않았을 수 있습니다.",
        errorGeneric: "확인에 실패했습니다. 다시 시도하세요.",
      },
      faqs: [
        {
          question: "호스팅은 어떻게 감지하나요?",
          answer: "도메인의 A 레코드를 IP 주소로 변환한 뒤, 해당 IP의 네트워크 소유자를 조회해 호스팅 업체를 파악합니다.",
        },
        {
          question: "CDN을 사용하면 어떻게 되나요?",
          answer: "CDN이 앞에 있으면 IP는 원본 서버가 아닌 CDN(예: Cloudflare)의 것입니다. 도구는 CDN을 호스트로 표시합니다.",
        },
        {
          question: "ASN이란 무엇인가요?",
          answer: "자율 시스템 번호는 네트워크의 고유 식별자로, 보통 ISP·호스팅 업체·CDN입니다.",
        },
      ],
      relatedTools: [
        { name: "Whois 조회", href: "/tools/whois-lookup" },
        { name: "도메인 연령 확인", href: "/tools/domain-age" },
        { name: "IP 주소 조회", href: "/tools/ip-lookup" },
        { name: "사이트 다운 확인", href: "/tools/is-it-down" },
      ],
      guide: {
        intro: {
          title: "도메인 호스팅 확인이란?",
          paragraphs: [
            "도메인 호스팅 확인은 IP 주소를 변환하고 네트워크 소유자를 조회하여 웹사이트가 어떤 호스팅 업체·네트워크에서 운영되는지 밝힙니다.",
          ],
        },
        sections: [
          {
            title: "사용 방법",
            paragraphs: [
              "도메인을 입력하고 확인을 클릭하세요. A 레코드를 변환한 뒤 해당 IP의 ISP와 조직을 조회합니다.",
            ],
            items: [
              "결과에 IP 주소와 네트워크 소유자가 표시됩니다.",
              "ASN이 호스팅 업체 또는 CDN을 식별합니다.",
            ],
          },
          {
            title: "팁",
            paragraphs: [
              "경쟁 사이트의 호스팅 업체를 알면 성능 옵션 비교에 도움이 됩니다.",
            ],
          },
        ],
      },
    },
  },
};
