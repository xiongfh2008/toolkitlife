export default {
  "xml-sitemap": {
    home: {
      name: "XMLサイトマップ生成",
      description: "WebサイトのXMLサイトマップを即座に生成。",
      category: "マーケティング",
      icon: "🗺️",
    },
    tool: {
      metadata: {
        title: "XMLサイトマップ生成ツール",
        description: "Webサイトの標準XMLサイトマップを数秒で作成",
        category: "マーケティング",
      },
      keywords: [
        "xmlサイトマップ生成",
        "サイトマップ生成",
        "sitemap 生成",
        "seo サイトマップ",
        "sitemap.xml",
        "サイトマップ作成",
        "サイトマップツール",
      ],
      labels: {
        websiteUrl: "WebサイトURL",
        paths: "ページパス（1行に1つ）",
        changefreq: "更新頻度",
        priority: "優先度",
        results: "サイトマップ出力",
      },
      placeholders: {
        websiteUrl: "https://example.com",
        paths: "/\n/about\n/contact\n/blog",
      },
      buttons: {
        generate: "サイトマップを生成",
        clear: "クリア",
        download: "XMLをダウンロード",
        copy: "XMLをコピー",
      },
      options: {
        always: "常に",
        hourly: "毎時",
        daily: "毎日",
        weekly: "毎週",
        monthly: "毎月",
        yearly: "毎年",
        never: "なし",
      },
      messages: {
        empty: "ページパスを1つ以上入力してください。",
        invalidUrl: "有効なWebサイトURLを入力してください。",
        placeholder: "生成されたサイトマップがここに表示されます。",
      },
      faqs: [
        {
          question: "XMLサイトマップとは？",
          answer:
            "XMLサイトマップはWebサイトの重要なページを列挙するファイルで、検索エンジンがページを効率的に発見・クロールできるようにします。",
        },
        {
          question: "どのくらいの頻度で更新すべき？",
          answer: "重要なページを追加・削除・変更した際に更新します。多くのサイトでは毎週または毎月に設定します。",
        },
        {
          question: "どこにアップロードすればよい？",
          answer:
            "sitemap.xmlをサイトのルートにアップロードし、Google Search ConsoleやBing Webmaster Toolsで提出します。",
        },
        {
          question: "優先度はどの値を設定すべき？",
          answer:
            "優先度は0.0〜1.0で、検索エンジンにページの重要度を伝えます。ホームページや主要ランディングページのみ1.0を使用します。",
        },
      ],
      relatedTools: [
        { name: "Robots.txt生成", href: "/tools/robots-txt-generator" },
        { name: "メタタグ生成", href: "/tools/meta-tag-generator" },
        { name: "URLスラッグ生成", href: "/tools/url-slug-generator" },
        { name: "キーワード順位チェック", href: "/tools/keyword-position" },
      ],
      guide: {
        intro: {
          title: "XMLサイトマップ生成ツールとは？",
          paragraphs: [
            "XMLサイトマップ生成ツールは、WebサイトのURLを列挙したsitemap.xmlを作成し、検索エンジンによるページの発見とインデックスを支援します。",
          ],
        },
        sections: [
          {
            title: "使い方",
            paragraphs: [
              "WebサイトURLを入力し、ページパスを1行ずつ記入、更新頻度と優先度を選んで「サイトマップを生成」をクリックします。",
            ],
            items: [
              "パスは絶対パス（/about）または相対パス（about）に対応。",
              "lastmodは自動的に今日の日付になります。",
              "XMLファイルをダウンロードしてサイトのルートにアップロード。",
            ],
          },
          {
            title: "ヒント",
            paragraphs: [
              "サイトマップは50,000 URL以下に保ちましょう。大規模サイトでは複数に分割します。",
            ],
          },
        ],
      },
    },
  },
  "adsense-calculator": {
    home: {
      name: "AdSense収入計算機",
      description: "Google AdSenseの収益を推定。",
      category: "マーケティング",
      icon: "💰",
    },
    tool: {
      metadata: {
        title: "AdSense収入計算ツール",
        description: "トラフィックと広告指標からGoogle AdSense収益を推定",
        category: "マーケティング",
      },
      keywords: [
        "adsense計算機",
        "adsense収入計算",
        "google adsense収益",
        "広告収入計算",
        "cpm計算",
        "adsense rpm",
        "収益計算ツール",
      ],
      labels: {
        dailyPageviews: "1日のページビュー",
        adsPerPage: "1ページあたりの広告数",
        ctr: "CTR（%）",
        cpc: "CPC（$）",
        daily: "推定1日収入",
        monthly: "推定月収",
        yearly: "推定年収",
      },
      messages: {
        disclaimer:
          "あくまで推定です。実際の収益はニッチ、地域、季節、広告品質など様々な要因に左右されます。",
      },
      faqs: [
        {
          question: "AdSense収入はどう計算される？",
          answer:
            "収入はおおよそ ページビュー × 1ページあたりの広告数 × CTR × CPC で計算されます。本ツールはこの式で推定します。",
        },
        {
          question: "適切なCTRは？",
          answer: "ディスプレイ広告では1%〜3%が一般的です。質の高い適切な配置の広告はより良い結果になります。",
        },
        {
          question: "CPCとは？何に影響される？",
          answer:
            "CPCは1クリックあたりの収入で、ニッチ、ユーザーの地域、季節、広告主の競争によって変わります。",
        },
        {
          question: "なぜ推定値なの？",
          answer:
            "実際の収入はトラフィックソース、広告品質、ユーザー行動など、計算機では把握できない要因に依存します。",
        },
      ],
      relatedTools: [
        { name: "売上計算機", href: "/tools/revenue-calculator" },
        { name: "利益率計算", href: "/tools/profit-margin-calculator" },
        { name: "パーセント計算", href: "/tools/percentage-calculator" },
        { name: "キーワード密度チェック", href: "/tools/keyword-density" },
      ],
      guide: {
        intro: {
          title: "AdSense計算ツールとは？",
          paragraphs: [
            "AdSense計算ツールは、トラフィックと広告設定からWebサイトがGoogle AdSenseで稼げる金額を推定します。",
          ],
        },
        sections: [
          {
            title: "使い方",
            paragraphs: [
              "1日のページビュー、1ページあたりの広告数、CTR、CPCを入力すると、日・月・年の推定が即座に更新されます。",
            ],
            items: [
              "CTRは広告表示のうちクリックされた割合。",
              "CPCは1クリックあたりの平均収入。",
              "AdSenseダッシュボードの実績値を使うとより正確。",
            ],
          },
          {
            title: "ヒント",
            paragraphs: [
              "入力値を変えて、トラフィックとエンゲージメントが収入にどう影響するか確認しましょう。",
            ],
          },
        ],
      },
    },
  },
  "url-opener": {
    home: {
      name: "URL一括オープナー",
      description: "複数のURLを一度に新しいタブで開く。",
      category: "マーケティング",
      icon: "🔗",
    },
    tool: {
      metadata: {
        title: "URL一括オープナー",
        description: "複数のURLを一度に新しいブラウザタブで開く",
        category: "マーケティング",
      },
      keywords: [
        "url一括オープン",
        "複数urlを開く",
        "一括urlオープナー",
        "urlまとめて開く",
        "複数リンクを開く",
      ],
      labels: {
        urls: "URL（1行に1つ、またはカンマ区切り）",
      },
      placeholders: {
        urls: "https://example.com\nhttps://example.com/about",
      },
      buttons: {
        open: "すべてのURLを開く",
        clear: "クリア",
      },
      messages: {
        empty: "URLを1つ以上入力してください。",
        popupBlocked:
          "ブラウザが一部のポップアップをブロックしました。このサイトのポップアップを許可して再試行してください。",
      },
      status: {
        pending: "待機中",
        opened: "開きました",
        blocked: "ブロック",
      },
      faqs: [
        {
          question: "ブラウザにタブをブロックされるのはなぜ？",
          answer:
            "ブラウザはユーザー操作以外で開かれるポップアップをブロックします。この場合はサイトのポップアップ許可を設定して再試行してください。",
        },
        {
          question: "http://なしでも開ける？",
          answer: "はい。プロトコルがないURLには自動的にhttps://を追加します。",
        },
        {
          question: "一度にいくつ開ける？",
          answer: "数に制限はありませんが、大量のリストはブラウザの制限を受ける場合があります。",
        },
      ],
      relatedTools: [
        { name: "URL短縮", href: "/tools/url-shortener" },
        { name: "URLスラッグ生成", href: "/tools/url-slug-generator" },
        { name: "キーワード順位チェック", href: "/tools/keyword-position" },
        { name: "ドメインWhois", href: "/tools/whois-lookup" },
      ],
      guide: {
        intro: {
          title: "URLオープナーとは？",
          paragraphs: [
            "URLオープナーは多くのリンクを一度に新しいタブで開き、1つずつコピー＆ペーストする手間を省きます。",
          ],
        },
        sections: [
          {
            title: "使い方",
            paragraphs: [
              "URLのリスト（1行に1つまたはカンマ区切り）を貼り付け、「すべてのURLを開く」をクリックすると各URLが新しいタブで開きます。",
            ],
            items: [
              "重複URLは自動的に除外されます。",
              "タブがブロックされたらポップアップを許可してください。",
            ],
          },
          {
            title: "ヒント",
            paragraphs: [
              "サイトの複数ページ確認、資料の一括参照、リンクの快速テストに便利です。",
            ],
          },
        ],
      },
    },
  },
  "html-viewer": {
    home: {
      name: "HTMLビューア",
      description: "HTMLコードをリアルタイムで表示・プレビュー。",
      category: "開発者",
      icon: "🖥️",
    },
    tool: {
      metadata: {
        title: "HTMLビューア",
        description: "HTMLコードをリアルタイムで表示・プレビュー",
        category: "開発者",
      },
      keywords: [
        "htmlビューア",
        "htmlプレビュー",
        "html表示",
        "オンラインhtmlビューア",
        "htmlコード表示",
        "htmlプレビュー確認",
        "htmlサンドボックス",
      ],
      labels: {
        html: "HTMLコード",
      },
      tabs: {
        preview: "プレビュー",
        source: "ソース",
      },
      buttons: {
        clear: "クリア",
        copy: "HTMLをコピー",
      },
      faqs: [
        {
          question: "プレビューでスクリプトは実行される？",
          answer:
            "プレビューはサンドボックス化されたiframeでレンダリングされるため、安全のためスクリプトは実行されません。静的HTML・CSS・インラインスタイルは完全に動作します。",
        },
        {
          question: "HTMLは外部に送信される？",
          answer: "いいえ。すべてブラウザ内で動作し、コードがデバイス外に出ることはありません。",
        },
        {
          question: "レンダリング結果をコピーできる？",
          answer: "ソースタブでHTMLコードをコピーし、プレビューで見た目を確認できます。",
        },
      ],
      relatedTools: [
        { name: "Markdownプレビュー", href: "/tools/markdown-preview" },
        { name: "HTMLミニファイ", href: "/tools/html-minifier" },
        { name: "HTMLエンティティ変換", href: "/tools/html-entity-encoder" },
        { name: "HTML画像変換", href: "/tools/html-to-image" },
      ],
      guide: {
        intro: {
          title: "HTMLビューアとは？",
          paragraphs: [
            "HTMLビューアはHTMLコードをリアルタイムにレンダリングし、編集しながら視覚結果を確認できます。",
          ],
        },
        sections: [
          {
            title: "使い方",
            paragraphs: [
              "左のエディタにHTMLを入力または貼り付けると、右のプレビューが自動更新されます。「プレビュー」「ソース」タブを切り替えて表示を確認できます。",
            ],
            items: [
              "HTML・CSS・インラインスタイルに対応。",
              "安全のため外部リソースはブロックされます。",
            ],
          },
          {
            title: "ヒント",
            paragraphs: [
              "小規模ページのプロトタイプ、レイアウトのデバッグ、メールテンプレートの確認に便利です。",
            ],
          },
        ],
      },
    },
  },
  "mobile-friendly-test": {
    home: {
      name: "モバイルフレンドリーテスト",
      description: "Webサイトがモバイル対応かチェック。",
      category: "マーケティング",
      icon: "📱",
    },
    tool: {
      metadata: {
        title: "モバイルフレンドリーテスト",
        description: "Webサイトがモバイル向けに最適化されているかチェック",
        category: "マーケティング",
      },
      keywords: [
        "モバイルフレンドリーテスト",
        "モバイル対応チェック",
        "レスポンシブテスト",
        "モバイルユーザビリティ",
        "モバイルseo",
        "レスポンシブチェック",
      ],
      labels: {
        url: "ページURL",
        score: "モバイル対応スコア",
        pass: "合格",
        fail: "不合格",
      },
      placeholders: {
        url: "https://example.com",
      },
      buttons: {
        check: "URLをチェック",
        checking: "チェック中...",
      },
      messages: {
        empty: "チェックするURLを入力してください。",
        fetchFailed: "ページを取得できませんでした。サイトが自動リクエストをブロックしているか、URLが無効です。",
        viewportPass: "ページにdevice-widthのviewportメタタグがあります。",
        viewportFail: "ページに適切なviewportメタタグがありません。",
        titlePass: "ページにtitleタグがあります。",
        titleFail: "ページにtitleタグがありません。",
        descriptionPass: "ページにmeta descriptionがあります。",
        descriptionFail: "ページにmeta descriptionがありません。",
        responsivePass: "レスポンシブCSS（メディアクエリ）が使われています。",
        responsiveFail: "メディアクエリが見つかりません。小さい画面に適応しない可能性があります。",
        fontSizePass: "読みやすいフォントサイズ（12px以上）が検出されました。",
        fontSizeFail: "フォントサイズが明確に設定されていません。モバイルで読みにくい可能性があります。",
        disclaimer:
          "これはページHTMLに基づく軽量なヒューリスティックチェックです。完全な分析はGoogle公式のMobile-Friendly Testをご利用ください。",
      },
      faqs: [
        {
          question: "モバイルフレンドリーテストはどう動く？",
          answer:
            "ページHTMLを取得し、viewportタグ、title、description、レスポンシブCSS、フォントサイズなどのモバイル最適化項目をチェックします。",
        },
        {
          question: "viewportメタタグとは？",
          answer:
            "width=device-widthのようなviewportタグは、モバイルブラウザにデスクトップ幅ではなくデバイス幅でページを描画するよう指示します。",
        },
        {
          question: "Googleのテストと同じくらい正確？",
          answer:
            "違います。これは高速なヒューリスティックチェックです。GoogleのMobile-Friendly Testはページをレンダリングし、より完全な評価を提供します。",
        },
      ],
      relatedTools: [
        { name: "メタタグ分析", href: "/tools/meta-tags-analyzer" },
        { name: "HTMLビューア", href: "/tools/html-viewer" },
        { name: "XMLサイトマップ生成", href: "/tools/xml-sitemap" },
        { name: "Web画像最適化", href: "/tools/image-web-optimizer" },
      ],
      guide: {
        intro: {
          title: "モバイルフレンドリーテストとは？",
          paragraphs: [
            "モバイルフレンドリーテストは、Webサイトがスマートフォンやタブレットでうまく機能するかをチェックします。ユーザー体験とGoogleのモバイルファーストインデックスにとって重要です。",
          ],
        },
        sections: [
          {
            title: "使い方",
            paragraphs: [
              "チェックしたいページのURLを入力し「URLをチェック」をクリック。ツールがページを取得し、スコアと実施したチェック項目を表示します。",
            ],
            items: [
              "スコアは以下のチェック項目に基づきます。",
              "不合格項目を修正してモバイル体験を改善しましょう。",
            ],
          },
          {
            title: "ヒント",
            paragraphs: [
              "まずviewportメタタグから始めましょう。モバイル描画の最重要修正ポイントです。",
            ],
          },
        ],
      },
    },
  },
};
