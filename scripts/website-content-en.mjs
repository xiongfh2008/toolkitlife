export default {
  "xml-sitemap": {
    home: {
      name: "XML Sitemap Generator",
      description: "Generate an XML sitemap for your website instantly.",
      category: "Marketing",
      icon: "🗺️",
    },
    tool: {
      metadata: {
        title: "XML Sitemap Generator",
        description: "Create a standard XML sitemap for your website in seconds",
        category: "Marketing",
      },
      keywords: [
        "xml sitemap generator",
        "sitemap generator",
        "generate sitemap",
        "seo sitemap",
        "sitemap.xml",
        "website sitemap",
        "sitemap creator",
        "sitemap tool",
      ],
      labels: {
        websiteUrl: "Website URL",
        paths: "Page Paths (one per line)",
        changefreq: "Change Frequency",
        priority: "Priority",
        results: "Sitemap Output",
      },
      placeholders: {
        websiteUrl: "https://example.com",
        paths: "/\n/about\n/contact\n/blog",
      },
      buttons: {
        generate: "Generate Sitemap",
        clear: "Clear",
        download: "Download XML",
        copy: "Copy XML",
      },
      options: {
        always: "Always",
        hourly: "Hourly",
        daily: "Daily",
        weekly: "Weekly",
        monthly: "Monthly",
        yearly: "Yearly",
        never: "Never",
      },
      messages: {
        empty: "Enter at least one page path.",
        invalidUrl: "Please enter a valid website URL.",
        placeholder: "Your generated sitemap will appear here.",
      },
      faqs: [
        {
          question: "What is an XML sitemap?",
          answer: "An XML sitemap is a file that lists the important pages of your website so search engines can find and crawl them more efficiently.",
        },
        {
          question: "How often should I update my sitemap?",
          answer: "Update your sitemap whenever you add, remove, or change important pages. Most sites set the change frequency to weekly or monthly.",
        },
        {
          question: "Where should I upload the sitemap?",
          answer: "Upload sitemap.xml to the root of your website and submit it in Google Search Console or Bing Webmaster Tools.",
        },
        {
          question: "What priority should I use?",
          answer: "Priority ranges from 0.0 to 1.0 and tells search engines which pages are more important. Use 1.0 only for your homepage and key landing pages.",
        },
      ],
      relatedTools: [
        { name: "Robots.txt Generator", href: "/tools/robots-txt-generator" },
        { name: "Meta Tag Generator", href: "/tools/meta-tag-generator" },
        { name: "URL Slug Generator", href: "/tools/url-slug-generator" },
        { name: "Keyword Position Checker", href: "/tools/keyword-position" },
      ],
      guide: {
        intro: {
          title: "What is an XML Sitemap Generator?",
          paragraphs: [
            "An XML sitemap generator creates a sitemap.xml file that lists the URLs of your website, helping search engines discover and index your pages.",
          ],
        },
        sections: [
          {
            title: "How to use it",
            paragraphs: [
              "Enter your website URL, list the page paths (one per line), choose a change frequency and priority, then click Generate Sitemap.",
            ],
            items: [
              "Paths can be absolute (/about) or relative (about).",
              "The lastmod date is set to today automatically.",
              "Download the XML file and upload it to your site root.",
            ],
          },
          {
            title: "Tips",
            paragraphs: [
              "Keep your sitemap under 50,000 URLs. For large sites, split it into multiple sitemaps.",
            ],
          },
        ],
      },
    },
  },
  "adsense-calculator": {
    home: {
      name: "Adsense Calculator",
      description: "Estimate your Google AdSense earnings.",
      category: "Marketing",
      icon: "💰",
    },
    tool: {
      metadata: {
        title: "Adsense Calculator",
        description: "Estimate your Google AdSense revenue based on traffic and ad metrics",
        category: "Marketing",
      },
      keywords: [
        "adsense calculator",
        "adsense earnings calculator",
        "google adsense revenue",
        "adsense income calculator",
        "cpm calculator",
        "adsense rpm",
        "ad revenue calculator",
        "earnings calculator",
      ],
      labels: {
        dailyPageviews: "Daily Pageviews",
        adsPerPage: "Ads per Page",
        ctr: "CTR (%)",
        cpc: "CPC ($)",
        daily: "Estimated Daily Earnings",
        monthly: "Estimated Monthly Earnings",
        yearly: "Estimated Yearly Earnings",
      },
      messages: {
        disclaimer:
          "Estimates only. Real earnings depend on niche, location, season, ad quality and many other factors.",
      },
      faqs: [
        {
          question: "How is AdSense revenue calculated?",
          answer:
            "Earnings are roughly pageviews × ads per page × click-through rate (CTR) × cost per click (CPC). This tool uses that formula to give an estimate.",
        },
        {
          question: "What is a good CTR for AdSense?",
          answer: "A CTR between 1% and 3% is typical for display ads. High-quality, well-placed ads can perform better.",
        },
        {
          question: "What is CPC and what affects it?",
          answer: "CPC is the amount paid per click. It varies by niche, user location, season and advertiser competition.",
        },
        {
          question: "Why are the numbers only estimates?",
          answer:
            "Real earnings depend on many factors this calculator cannot know, such as traffic sources, ad quality and user behavior.",
        },
      ],
      relatedTools: [
        { name: "Revenue Calculator", href: "/tools/revenue-calculator" },
        { name: "Profit Margin Calculator", href: "/tools/profit-margin-calculator" },
        { name: "Percentage Calculator", href: "/tools/percentage-calculator" },
        { name: "Keyword Density Checker", href: "/tools/keyword-density" },
      ],
      guide: {
        intro: {
          title: "What is an AdSense Calculator?",
          paragraphs: [
            "An AdSense calculator estimates how much money your website can earn from Google AdSense based on your traffic and ad settings.",
          ],
        },
        sections: [
          {
            title: "How to use it",
            paragraphs: [
              "Enter your daily pageviews, the average number of ads per page, your click-through rate and cost per click. The daily, monthly and yearly estimates update instantly.",
            ],
            items: [
              "CTR is the percentage of ad impressions that get clicked.",
              "CPC is the average amount you earn per click.",
              "Use realistic values from your AdSense dashboard for better estimates.",
            ],
          },
          {
            title: "Tips",
            paragraphs: [
              "Experiment with different inputs to see how traffic and engagement affect revenue.",
            ],
          },
        ],
      },
    },
  },
  "url-opener": {
    home: {
      name: "URL Opener",
      description: "Open multiple URLs at once in new tabs.",
      category: "Marketing",
      icon: "🔗",
    },
    tool: {
      metadata: {
        title: "URL Opener",
        description: "Open multiple URLs at once in new browser tabs",
        category: "Marketing",
      },
      keywords: [
        "url opener",
        "open multiple urls",
        "bulk url opener",
        "open urls at once",
        "multi url opener",
        "url opener tool",
        "open many urls",
        "link opener",
      ],
      labels: {
        urls: "URLs (one per line or comma separated)",
      },
      placeholders: {
        urls: "https://example.com\nhttps://example.com/about",
      },
      buttons: {
        open: "Open All URLs",
        clear: "Clear",
      },
      messages: {
        empty: "Enter at least one URL.",
        popupBlocked:
          "Your browser blocked some pop-ups. Allow pop-ups for this site and try again.",
      },
      status: {
        pending: "Pending",
        opened: "Opened",
        blocked: "Blocked",
      },
      faqs: [
        {
          question: "Why does my browser block the tabs?",
          answer:
            "Browsers block pop-ups triggered outside of a user gesture. If this happens, allow pop-ups for this site in your browser settings and try again.",
        },
        {
          question: "Can I open URLs without http://?",
          answer:
            "Yes. The tool automatically adds https:// to URLs that don't include a protocol.",
        },
        {
          question: "How many URLs can I open?",
          answer: "You can open as many as you like, but very large lists may be limited by your browser.",
        },
      ],
      relatedTools: [
        { name: "URL Shortener", href: "/tools/url-shortener" },
        { name: "URL Slug Generator", href: "/tools/url-slug-generator" },
        { name: "Keyword Position Checker", href: "/tools/keyword-position" },
        { name: "Whois Lookup", href: "/tools/whois-lookup" },
      ],
      guide: {
        intro: {
          title: "What is a URL Opener?",
          paragraphs: [
            "A URL opener lets you open many links at the same time in new tabs, saving you from copying and pasting each one individually.",
          ],
        },
        sections: [
          {
            title: "How to use it",
            paragraphs: [
              "Paste your list of URLs (one per line or separated by commas), then click Open All URLs. Each URL opens in a new tab.",
            ],
            items: [
              "Duplicates are removed automatically.",
              "If the browser blocks tabs, allow pop-ups for this site.",
            ],
          },
          {
            title: "Tips",
            paragraphs: [
              "Use this tool to check multiple pages of your site, open a batch of references, or test links quickly.",
            ],
          },
        ],
      },
    },
  },
  "html-viewer": {
    home: {
      name: "HTML Viewer",
      description: "View and preview HTML code in real time.",
      category: "Developer",
      icon: "🖥️",
    },
    tool: {
      metadata: {
        title: "HTML Viewer",
        description: "View and preview HTML code in real time with syntax highlighting",
        category: "Developer",
      },
      keywords: [
        "html viewer",
        "html preview",
        "html renderer",
        "online html viewer",
        "html code viewer",
        "preview html",
        "html sandbox",
        "view html online",
      ],
      labels: {
        html: "HTML Code",
      },
      tabs: {
        preview: "Preview",
        source: "Source",
      },
      buttons: {
        clear: "Clear",
        copy: "Copy HTML",
      },
      faqs: [
        {
          question: "Does the preview run scripts?",
          answer:
            "The preview renders in a sandboxed iframe, so scripts are not executed for safety. Static HTML, CSS and inline styles work fully.",
        },
        {
          question: "Is my HTML sent anywhere?",
          answer: "No. Everything runs in your browser — your code never leaves your device.",
        },
        {
          question: "Can I copy the rendered output?",
          answer: "Use the Source tab to copy your HTML code, or the preview to check the visual result.",
        },
      ],
      relatedTools: [
        { name: "Markdown Preview", href: "/tools/markdown-preview" },
        { name: "HTML Minifier", href: "/tools/html-minifier" },
        { name: "HTML Encoder", href: "/tools/html-entity-encoder" },
        { name: "HTML to Image", href: "/tools/html-to-image" },
      ],
      guide: {
        intro: {
          title: "What is an HTML Viewer?",
          paragraphs: [
            "An HTML viewer renders your HTML code in real time so you can see the visual result while you edit.",
          ],
        },
        sections: [
          {
            title: "How to use it",
            paragraphs: [
              "Type or paste HTML into the editor on the left. The preview on the right updates automatically. Switch between Preview and Source tabs to inspect the rendered page or the code.",
            ],
            items: [
              "The preview supports HTML, CSS and inline styles.",
              "External resources are blocked for safety.",
            ],
          },
          {
            title: "Tips",
            paragraphs: [
              "Use it to prototype a small page, debug layout issues, or check how an email template looks.",
            ],
          },
        ],
      },
    },
  },
  "mobile-friendly-test": {
    home: {
      name: "Mobile Friendly Test",
      description: "Check if your website is mobile-friendly.",
      category: "Marketing",
      icon: "📱",
    },
    tool: {
      metadata: {
        title: "Mobile Friendly Test",
        description: "Check if your website is optimized for mobile devices",
        category: "Marketing",
      },
      keywords: [
        "mobile friendly test",
        "mobile friendly checker",
        "responsive test",
        "mobile usability",
        "mobile seo",
        "mobile friendly check",
        "responsive checker",
        "mobile test",
      ],
      labels: {
        url: "Page URL",
        score: "Mobile Friendliness Score",
        pass: "Pass",
        fail: "Fail",
      },
      placeholders: {
        url: "https://example.com",
      },
      buttons: {
        check: "Check URL",
        checking: "Checking...",
      },
      messages: {
        empty: "Enter a URL to check.",
        fetchFailed:
          "Could not fetch the page. The site may block automated requests or the URL may be invalid.",
        viewportPass: "The page has a viewport meta tag set to device-width.",
        viewportFail: "The page is missing a proper viewport meta tag.",
        titlePass: "The page has a title tag.",
        titleFail: "The page has no title tag.",
        descriptionPass: "The page has a meta description.",
        descriptionFail: "The page has no meta description.",
        responsivePass: "The page uses responsive CSS (media queries detected).",
        responsiveFail: "No media queries found — the layout may not adapt to small screens.",
        fontSizePass: "Legible font sizes (12px+) were detected in the CSS.",
        fontSizeFail: "Font sizes are not clearly set; text may be hard to read on mobile.",
        disclaimer:
          "This is a lightweight heuristic check based on the page HTML. For a full analysis, use Google's official Mobile-Friendly Test.",
      },
      faqs: [
        {
          question: "How does the mobile friendly test work?",
          answer:
            "The tool fetches the page HTML and checks for common mobile optimizations: viewport meta tag, title, description, responsive CSS and font sizes.",
        },
        {
          question: "What is a viewport meta tag?",
          answer:
            "A viewport meta tag like width=device-width tells mobile browsers to render the page at the device width instead of a desktop width.",
        },
        {
          question: "Is this as accurate as Google's test?",
          answer:
            "No. This is a quick heuristic check. Google's Mobile-Friendly Test renders the page and provides a more complete evaluation.",
        },
      ],
      relatedTools: [
        { name: "Meta Tags Analyzer", href: "/tools/meta-tags-analyzer" },
        { name: "HTML Viewer", href: "/tools/html-viewer" },
        { name: "XML Sitemap Generator", href: "/tools/xml-sitemap" },
        { name: "Image Web Optimizer", href: "/tools/image-web-optimizer" },
      ],
      guide: {
        intro: {
          title: "What is a Mobile Friendly Test?",
          paragraphs: [
            "A mobile friendly test checks whether your website works well on phones and tablets, which is important for both user experience and Google's mobile-first indexing.",
          ],
        },
        sections: [
          {
            title: "How to use it",
            paragraphs: [
              "Enter the URL of the page you want to check and click Check URL. The tool fetches the page and shows a score with the checks it performed.",
            ],
            items: [
              "The score is based on the checks below it.",
              "Fix failing checks to improve your mobile experience.",
            ],
          },
          {
            title: "Tips",
            paragraphs: [
              "Start with the viewport meta tag — it is the most important single fix for mobile rendering.",
            ],
          },
        ],
      },
    },
  },
};
