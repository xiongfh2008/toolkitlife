export default {
  "what-is-my-browser": {
    home: {
      name: "ブラウザ情報検出",
      description: "ブラウザ・OS・IPアドレスを検出。",
      category: "Tracking",
      icon: "🌐",
    },
    tool: {
      metadata: {
        title: "ブラウザ情報検出",
        description: "ブラウザ名・バージョン・OS・IPアドレスを検出",
        category: "Tracking",
      },
      keywords: [
        "自分のブラウザ",
        "ブラウザ検出",
        "ブラウザバージョン",
        "ブラウザ判定",
        "user agent",
        "ブラウザ os",
        "使用中ブラウザ",
      ],
      labels: {
        browser: "ブラウザ",
        version: "バージョン",
        engine: "エンジン",
        os: "OS",
        screen: "画面解像度",
        colorDepth: "色深度",
        language: "言語",
        languages: "言語リスト",
        timezone: "タイムゾーン",
        ipAddress: "IPアドレス",
        cookies: "Cookie有効",
        online: "オンライン",
        userAgent: "User Agent文字列",
      },
      buttons: {
        refresh: "更新",
        copy: "コピー",
      },
      messages: {
        ipFailed: "検出できません",
        yes: "はい",
        no: "いいえ",
      },
      faqs: [
        {
          question: "どうやってブラウザを検出するの？",
          answer: "ブラウザのUser-Agent文字列と、どのWebサイトでも取得できるJavaScript APIを読み取ります。",
        },
        {
          question: "データは外部に送信される？",
          answer: "いいえ。すべてブラウザ内で検出されます。公的IPのみ公共IPサービスに問い合わせます。",
        },
        {
          question: "ブラウザ情報は何に使われるの？",
          answer: "Webサイトは互換機能の提供にブラウザ検出を利用し、開発者はUser-Agentでサイトのテスト・デバッグを行います。",
        },
      ],
      relatedTools: [
        { name: "IPアドレス検索", href: "/tools/ip-lookup" },
        { name: "GEO IPロケーター", href: "/tools/geo-ip-locator" },
        { name: "タイピングテスト", href: "/tools/typing-speed-test" },
        { name: "IP検索", href: "/tools/ip-lookup" },
      ],
      guide: {
        intro: {
          title: "ブラウザ情報検出とは？",
          paragraphs: [
            "このツールはブラウザ名・バージョン・レンダリングエンジン・OS・画面解像度・言語・タイムゾーン・公的IPアドレスを検出します。",
          ],
        },
        sections: [
          {
            title: "使い方",
            paragraphs: [
              "ページを開くと自動的に検出されます。設定変更後は更新をクリックして再検出できます。",
            ],
            items: [
              "User-Agent文字列は下部に表示され、開発者向けです。",
              "バグ報告の際はUser-Agentをコピーして添付できます。",
            ],
          },
          {
            title: "ヒント",
            paragraphs: [
              "VPNを使用している場合、表示されるIPは実際の位置ではなくVPNプロバイダーのものになることがあります。",
            ],
          },
        ],
      },
    },
  },
  "geo-ip-locator": {
    home: {
      name: "GEO IPロケーター",
      description: "任意のIPアドレスの位置情報を検索。",
      category: "Tracking",
      icon: "📍",
    },
    tool: {
      metadata: {
        title: "GEO IPロケーター",
        description: "任意のIPアドレスの地理位置・ISP・組織を検索",
        category: "Tracking",
      },
      keywords: [
        "geo ipロケーター",
        "ip位置情報",
        "ipジオロケーション",
        "ip位置検索",
        "ipアドレス位置",
        "ipトラッカー",
        "ip位置特定",
      ],
      labels: {
        ip: "IPアドレス",
        continent: "大陸",
        country: "国",
        region: "地域",
        city: "都市",
        coordinates: "座標",
        isp: "ISP",
        organization: "組織",
        asn: "ASN",
        timezone: "タイムゾーン",
        type: "IP種別",
        myIp: "自分のIPアドレスを使用",
      },
      buttons: {
        lookUp: "検索",
        loading: "検索中...",
      },
      messages: {
        errorInvalid: "有効なIPv4アドレスを入力してください。",
        errorNotFound: "このIPの位置データが見つかりません。",
        errorGeneric: "検索に失敗しました。もう一度お試しください。",
      },
      faqs: [
        {
          question: "IP位置情報の精度は？",
          answer: "通常は都市または地域レベルまで特定できます。正確な住所までは特定できません。",
        },
        {
          question: "IP位置情報は間違うことがある？",
          answer: "はい。VPN・プロキシ・携帯キャリアにより、実際とは異なる場所に表示されることがあります。",
        },
        {
          question: "ASNとは？",
          answer: "自律システム番号はIPブロックを所有するネットワーク（ISPやホスティング会社）を識別します。",
        },
      ],
      relatedTools: [
        { name: "IPアドレス検索", href: "/tools/ip-lookup" },
        { name: "Whois検索", href: "/tools/whois-lookup" },
        { name: "ドメインホスティング検出", href: "/tools/domain-hosting" },
        { name: "ブラウザ情報検出", href: "/tools/what-is-my-browser" },
      ],
      guide: {
        intro: {
          title: "GEO IPロケーターとは？",
          paragraphs: [
            "GEO IPロケーターは任意のIPアドレスのおおよその地理位置と、ISP・ネットワーク情報を検索します。",
          ],
        },
        sections: [
          {
            title: "使い方",
            paragraphs: [
              "IPv4アドレスを入力して検索、または「自分のIPアドレスを使用」で自身の公的IPを検索します。",
            ],
            items: [
              "結果に大陸・国・都市・座標が表示されます。",
              "ISPとASNがIPの所有ネットワークを示します。",
            ],
          },
          {
            title: "ヒント",
            paragraphs: [
              "訪問者やトラフィックの地域確認、不審なIPの検証に利用できます。",
            ],
          },
        ],
      },
    },
  },
  "redirect-checker": {
    home: {
      name: "リダイレクトチェッカー",
      description: "URLのリダイレクトと最終宛先を確認。",
      category: "Tracking",
      icon: "🔀",
    },
    tool: {
      metadata: {
        title: "リダイレクトチェッカー",
        description: "URLがどこへリダイレクトするかと最終ステータスコードを確認",
        category: "Tracking",
      },
      keywords: [
        "リダイレクトチェック",
        "urlリダイレクト",
        "301リダイレクト",
        "リダイレクトチェーン",
        "リンクリダイレクト",
        "リダイレクトテスト",
      ],
      labels: {
        url: "URL",
        originalUrl: "元のURL",
        finalUrl: "最終URL",
        statusCode: "ステータスコード",
        hasRedirect: "このURLは別のアドレスにリダイレクトします",
        noRedirect: "このURLは直接読み込まれます",
      },
      buttons: {
        check: "確認",
        checking: "確認中...",
      },
      messages: {
        empty: "確認するURLを入力してください。",
        fetchFailed: "URLを取得できませんでした。サイトが自動リクエストをブロックしているか、URLが無効です。",
        disclaimer: "これはプロキシ経由の軽量チェックです。完全なリダイレクトチェーンはサーバーサイドのツールをご利用ください。",
      },
      faqs: [
        {
          question: "301リダイレクトとは？",
          answer: "301リダイレクトは旧URLを新しいURLへ恒久的に転送し、ページが移動したことをブラウザと検索エンジンに伝えます。",
        },
        {
          question: "なぜリダイレクトを確認するの？",
          answer: "壊れたリダイレクトや長すぎるチェーンはサイトを遅くし、SEOにも悪影響です。定期的な確認でリンクを健全に保てます。",
        },
        {
          question: "注目すべきステータスコードは？",
          answer: "200は正常、301/302はリダイレクト、404は未検出、403/500はエラーです。",
        },
      ],
      relatedTools: [
        { name: "サイト稼働チェック", href: "/tools/is-it-down" },
        { name: "URL一括オープナー", href: "/tools/url-opener" },
        { name: "URLスラッグ生成", href: "/tools/url-slug-generator" },
        { name: "モバイルフレンドリーテスト", href: "/tools/mobile-friendly-test" },
      ],
      guide: {
        intro: {
          title: "リダイレクトチェッカーとは？",
          paragraphs: [
            "リダイレクトチェッカーはURLが別のアドレスへリダイレクトするかをテストし、最終宛先とステータスコードを表示します。",
          ],
        },
        sections: [
          {
            title: "使い方",
            paragraphs: [
              "URLを入力して確認をクリック。ツールがプロキシ経由でURLを取得し、最終URLと元のURLを比較します。",
            ],
            items: [
              "最終URLが異なればリダイレクトされています。",
              "ステータスコードで正常(200)か移動(301/302)かが分かります。",
            ],
          },
          {
            title: "ヒント",
            paragraphs: [
              "ページ移動後はSEO価値を保つため、旧URLに301リダイレクトを設定しましょう。",
            ],
          },
        ],
      },
    },
  },
  "is-it-down": {
    home: {
      name: "サイト稼働チェック",
      description: "Webサイトがダウンしているか確認。",
      category: "Tracking",
      icon: "🛡️",
    },
    tool: {
      metadata: {
        title: "サイト稼働チェック",
        description: "Webサイトが全員にダウンしているか、自分だけか確認",
        category: "Tracking",
      },
      keywords: [
        "サイトダウン",
        "サイト稼働確認",
        "webサイト状態",
        "サイトステータス",
        "uptimeチェック",
        "ダウン検出",
      ],
      labels: {
        url: "URL",
        status: "ステータスコード",
        responseTime: "応答時間",
      },
      buttons: {
        check: "確認",
        checking: "確認中...",
      },
      messages: {
        empty: "確認するURLを入力してください。",
        online: "稼働中です！",
        offline: "ダウンしている可能性があります",
        disclaimer: "プロキシ経由で到達性を確認しています。ローカルネットワークの問題で自分だけ見えない場合や、他の地域では稼働している場合があります。",
      },
      faqs: [
        {
          question: "どうやってダウンを確認するの？",
          answer: "公開プロキシ経由でサイトにリクエストします。成功すれば到達可能、失敗すればダウンの可能性があります。",
        },
        {
          question: "なぜ「可能性があります」なの？",
          answer: "自動リクエストをブロックするサイトや地域差があります。強いシグナルですが保証ではありません。",
        },
        {
          question: "サイトがダウンの場合どうする？",
          answer: "ホスティングのステータスページを確認し、DNS変更を調べ、続く場合はサポートに連絡してください。",
        },
      ],
      relatedTools: [
        { name: "リダイレクトチェッカー", href: "/tools/redirect-checker" },
        { name: "ドメインホスティング検出", href: "/tools/domain-hosting" },
        { name: "Whois検索", href: "/tools/whois-lookup" },
        { name: "タイピングテスト", href: "/tools/typing-speed-test" },
      ],
      guide: {
        intro: {
          title: "サイト稼働チェックとは？",
          paragraphs: [
            "サイト稼働チェックはWebサイトが現在到達可能かを確認し、障害が全員に影響しているのか自分だけなのかを判断するのに役立ちます。",
          ],
        },
        sections: [
          {
            title: "使い方",
            paragraphs: [
              "URLを入力して確認をクリック。ツールがプロキシ経由でサイトにリクエストし、応答したかどうかを表示します。",
            ],
            items: [
              "成功応答はサイトが稼働中であることを示します。",
              "ステータスコードと応答時間が参考表示されます。",
            ],
          },
          {
            title: "ヒント",
            paragraphs: [
              "ここでは稼働しているのに自分だけ見えない場合、原因はネットワーク、DNSキャッシュ、ローカルファイアウォールにある可能性が高いです。",
            ],
          },
        ],
      },
    },
  },
  "domain-age": {
    home: {
      name: "ドメイン年齢チェッカー",
      description: "ドメインの年齢を確認。",
      category: "Domain",
      icon: "⏳",
    },
    tool: {
      metadata: {
        title: "ドメイン年齢チェッカー",
        description: "ドメインの登録日と年齢を確認",
        category: "Domain",
      },
      keywords: [
        "ドメイン年齢",
        "ドメイン年齢チェック",
        "ドメイン登録日",
        "ドメイン年齢確認",
        "ドメイン登録日時",
        "whois年齢",
      ],
      labels: {
        domain: "ドメイン",
        registrationDate: "登録日",
        expiryDate: "有効期限",
        updatedDate: "最終更新",
        status: "ステータス",
        years: "{n}年",
        months: "{n}ヶ月",
        days: "{n}日",
      },
      buttons: {
        check: "確認",
        checking: "確認中...",
      },
      messages: {
        errorEmpty: "ドメイン名を入力してください。",
        errorInvalid: "有効なドメイン名を入力してください。",
        errorNotFound: "このドメインの登録データが見つかりません。",
        errorGeneric: "確認に失敗しました。もう一度お試しください。",
        noRegistration: "このドメインの登録日が見つかりません。",
      },
      faqs: [
        {
          question: "ドメイン年齢が重要なのはなぜ？",
          answer: "古いドメインは検索エンジンやユーザーから信頼されやすく、歴史のあるドメインは既存の実績を持っています。",
        },
        {
          question: "データはどこから来るの？",
          answer: "従来のWHOISに代わる現代の標準である公開RDAPレジストリデータを読み取ります。",
        },
        {
          question: "登録日は隠されることがある？",
          answer: "ほとんどのレジストリは登録日を公開します。プライバシー保護は通常、連絡先情報のみを隠します。",
        },
      ],
      relatedTools: [
        { name: "Whois検索", href: "/tools/whois-lookup" },
        { name: "ドメインホスティング検出", href: "/tools/domain-hosting" },
        { name: "GEO IPロケーター", href: "/tools/geo-ip-locator" },
        { name: "IPアドレス検索", href: "/tools/ip-lookup" },
      ],
      guide: {
        intro: {
          title: "ドメイン年齢チェッカーとは？",
          paragraphs: [
            "ドメイン年齢チェッカーはドメインがいつ登録されたかを表示し、年・月・日で年齢を計算します。",
          ],
        },
        sections: [
          {
            title: "使い方",
            paragraphs: [
              "ドメイン名（http://やwwwなし）を入力して確認をクリック。登録・有効期限・更新日が表示されます。",
            ],
            items: [
              "年齢は登録日から計算されます。",
              "有効期限と更新日は取得できた場合に表示されます。",
            ],
          },
          {
            title: "ヒント",
            paragraphs: [
              "サイトの履歴評価やドメイン購入の判断に活用できます。",
            ],
          },
        ],
      },
    },
  },
  "domain-hosting": {
    home: {
      name: "ドメインホスティング検出",
      description: "ドメインがどこにホストされているか確認。",
      category: "Domain",
      icon: "🏢",
    },
    tool: {
      metadata: {
        title: "ドメインホスティング検出",
        description: "ドメインが利用しているホスティング業者とネットワークを確認",
        category: "Domain",
      },
      keywords: [
        "ドメインホスティング",
        "サイトのホスト確認",
        "ホスティング業者検索",
        "ウェブホスト検索",
        "サイトの置き場所",
        "ホスティングチェック",
      ],
      labels: {
        domain: "ドメイン",
        ipAddress: "IPアドレス",
        host: "ホスティング業者",
        organization: "組織",
        asn: "ASN",
        country: "国",
        city: "都市",
      },
      buttons: {
        check: "確認",
        checking: "確認中...",
      },
      messages: {
        errorEmpty: "ドメイン名を入力してください。",
        errorInvalid: "有効なドメイン名を入力してください。",
        errorNoARecord: "このドメインのAレコードが見つかりません。まだホストに接続されていない可能性があります。",
        errorGeneric: "確認に失敗しました。もう一度お試しください。",
      },
      faqs: [
        {
          question: "ホスティングはどう検出するの？",
          answer: "ドメインのAレコードをIPアドレスに解決し、そのIPのネットワーク所有者を検索してホスティング業者を特定します。",
        },
        {
          question: "CDNを使っている場合は？",
          answer: "CDNが前面にある場合、IPはオリジンサーバーではなくCDN（Cloudflareなど）のものになります。ツールはCDNをホストとして表示します。",
        },
        {
          question: "ASNとは？",
          answer: "自律システム番号はネットワークの固有識別子で、通常はISP・ホスティング業者・CDNを示します。",
        },
      ],
      relatedTools: [
        { name: "Whois検索", href: "/tools/whois-lookup" },
        { name: "ドメイン年齢チェッカー", href: "/tools/domain-age" },
        { name: "IPアドレス検索", href: "/tools/ip-lookup" },
        { name: "サイト稼働チェック", href: "/tools/is-it-down" },
      ],
      guide: {
        intro: {
          title: "ドメインホスティング検出とは？",
          paragraphs: [
            "ドメインホスティング検出は、IPアドレスを解決してネットワーク所有者を調べることで、Webサイトがどのホスティング業者・ネットワークで稼働しているかを明らかにします。",
          ],
        },
        sections: [
          {
            title: "使い方",
            paragraphs: [
              "ドメインを入力して確認をクリック。Aレコードを解決し、そのIPのISPと組織を検索します。",
            ],
            items: [
              "結果にIPアドレスとネットワーク所有者が表示されます。",
              "ASNがホスティング業者やCDNを示します。",
            ],
          },
          {
            title: "ヒント",
            paragraphs: [
              "競合サイトのホスティング業者を知ると、性能オプションの比較に役立ちます。",
            ],
          },
        ],
      },
    },
  },
};
