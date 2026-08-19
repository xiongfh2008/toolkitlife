import fs from "fs";
import path from "path";

const root = process.cwd();
const LOCALES = ["en", "zh", "ja", "ko"];

/**
 * Translation content for the 4 SEO tools (reference: freetoolkithub.com keyword/website categories).
 * Structure mirrors existing entries: home.tools.<slug> + tools.<slug>.
 */
const CONTENT = {
  en: {
    "keyword-density": {
      home: {
        name: "Keyword Density Checker",
        description: "Analyze keyword frequency and density in your content.",
        category: "Marketing",
        icon: "📊",
      },
      tool: {
        metadata: {
          title: "Keyword Density Checker",
          description: "Analyze keyword frequency and density in your content",
          category: "Marketing",
        },
        keywords: [
          "keyword density checker",
          "keyword density analysis",
          "keyword frequency checker",
          "keyword density calculator",
          "check keyword density",
          "keyword density tool",
          "content keyword analysis",
          "seo keyword density",
        ],
        labels: {
          content: "Enter Your Content",
          minLength: "Min Word Length",
          showTop: "Show Top",
          totalWords: "Total Words",
          uniqueWords: "Unique Words",
          topDensity: "Top Density",
          results: "Keyword Density Results",
          word: "Keyword",
          count: "Count",
          density: "Density",
        },
        placeholders: {
          content: "Paste or type your content here...",
        },
        buttons: {
          analyze: "Analyze Keyword Density",
          clear: "Clear",
        },
        options: {
          top10: "Top 10",
          top20: "Top 20",
          top50: "Top 50",
        },
        messages: {
          empty: "Enter some content to analyze.",
        },
        csv: {
          word: "Keyword",
          count: "Count",
          density: "Density",
        },
        faqs: [
          {
            question: "What is keyword density?",
            answer:
              "Keyword density is the percentage of times a keyword or phrase appears in your content compared to the total number of words. It is calculated as (keyword occurrences \u00f7 total words) \u00d7 100.",
          },
          {
            question: "What is a good keyword density?",
            answer:
              "A keyword density between 1% and 3% is generally considered optimal for SEO. Going much higher can look like keyword stuffing, which search engines may penalize.",
          },
          {
            question: "How is the density calculated in this tool?",
            answer:
              "The tool counts every word in your content, then divides the occurrences of each keyword by the total word count and multiplies by 100. You can set a minimum word length to ignore very short words.",
          },
          {
            question: "Why should I check keyword density?",
            answer:
              "Checking keyword density helps you confirm your primary keywords appear frequently enough for search engines to understand your topic, without overusing them. It also helps you spot underused secondary keywords.",
          },
          {
            question: "Is my content sent to a server?",
            answer:
              "No. All analysis happens locally in your browser. Your content never leaves your device.",
          },
        ],
        relatedTools: [
          { name: "Word Counter", href: "/tools/word-counter" },
          { name: "Character Counter", href: "/tools/character-counter" },
          { name: "Meta Tag Generator", href: "/tools/meta-tag-generator" },
          { name: "Keyword Position Checker", href: "/tools/keyword-position" },
        ],
        guide: {
          intro: {
            title: "What is a Keyword Density Checker?",
            paragraphs: [
              "A keyword density checker is a free online tool that analyzes how often specific words or phrases appear in your content. It shows each keyword's count, frequency, and percentage of the total text so you can optimize your writing for search engines without keyword stuffing.",
            ],
          },
          sections: [
            {
              title: "How to use it",
              paragraphs: [
                "Paste or type your content into the text area, set a minimum word length to filter out short filler words, choose how many top keywords to show, and click Analyze.",
              ],
              items: [
                "Review the total and unique word counts for an overview of your content size.",
                "Check each keyword's count and density percentage in the results table.",
                "Aim for a density of 1% to 3% for your main keywords.",
              ],
            },
            {
              title: "Tips for better SEO",
              paragraphs: [
                "Use your primary keyword in the title, headings, and first paragraph, then repeat it naturally throughout the body. Use this tool to verify you are not overusing it.",
              ],
              items: [
                "Target a density of 1% to 3% for primary keywords.",
                "Use related synonyms and long-tail variants for secondary keywords.",
                "Keep the writing natural for readers first, search engines second.",
              ],
            },
          ],
        },
      },
    },
    "meta-tags-analyzer": {
      home: {
        name: "Meta Tags Analyzer",
        description: "Analyze existing meta tags of any URL.",
        category: "Marketing",
        icon: "🏷",
      },
      tool: {
        metadata: {
          title: "Meta Tags Analyzer",
          description: "Analyze the meta tags of any URL and get SEO suggestions",
          category: "Marketing",
        },
        keywords: [
          "meta tags analyzer",
          "meta tag checker",
          "analyze meta tags",
          "meta description checker",
          "seo meta tags",
          "meta tags of url",
          "og tag analyzer",
          "check website meta tags",
        ],
        labels: {
          urlMode: "By URL",
          htmlMode: "Paste HTML",
          url: "Page URL",
          html: "HTML Source",
        },
        placeholders: {
          html: "Paste the HTML source of a page here...",
        },
        buttons: {
          analyze: "Analyze Meta Tags",
          loading: "Analyzing...",
        },
        messages: {
          fetchFailed:
            "Could not fetch the page. The site may block automated requests. Try the Paste HTML mode instead.",
          proxyNote:
            "Pages are fetched through a public CORS proxy because browsers cannot read cross-origin pages directly.",
          noTags: "No recognizable meta tags were found.",
        },
        faqs: [
          {
            question: "What is a meta tags analyzer?",
            answer:
              "A meta tags analyzer reads the title, meta description, keywords, Open Graph, Twitter Card, and other tags of a web page. It shows you what search engines and social networks see, and warns about missing or malformed tags.",
          },
          {
            question: "Which meta tags does it check?",
            answer:
              "It checks the title, meta description, keywords, robots, canonical link, H1, and social tags including Open Graph (og:title, og:description, og:image) and Twitter Cards.",
          },
          {
            question: "Why can't it fetch some URLs?",
            answer:
              "Browsers block cross-origin requests, so the page is fetched through a public proxy. Some sites block proxy requests or require JavaScript, which prevents fetching. In that case, use the Paste HTML mode.",
          },
          {
            question: "Is my data stored?",
            answer:
              "No. The page content is fetched and analyzed in your browser session only. Nothing is uploaded to our servers.",
          },
          {
            question: "What makes good meta tags?",
            answer:
              "A title under 60 characters, a meta description under 160 characters, an accurate H1, a canonical URL, and Open Graph and Twitter Card tags for social sharing. The analyzer warns you when these are missing or too long.",
          },
        ],
        relatedTools: [
          { name: "Meta Tag Generator", href: "/tools/meta-tag-generator" },
          { name: "Robots.txt Generator", href: "/tools/robots-txt-generator" },
          { name: "Open Graph Preview", href: "/tools/og-preview" },
          { name: "Keyword Density Checker", href: "/tools/keyword-density" },
        ],
        guide: {
          intro: {
            title: "What is a Meta Tags Analyzer?",
            paragraphs: [
              "A meta tags analyzer is a free online tool that fetches a web page and extracts all of its meta tags. It helps you audit how your page appears in search engine results and social media previews, and flags issues that can hurt your click-through rate.",
            ],
          },
          sections: [
            {
              title: "How to use it",
              paragraphs: [
                "Enter a page URL and click Analyze Meta Tags. The tool fetches the page through a proxy and lists every meta tag it finds.",
              ],
              items: [
                "Check that the title is under 60 characters.",
                "Check that the meta description is under 160 characters.",
                "Make sure Open Graph and Twitter Card tags are present for social sharing.",
              ],
            },
            {
              title: "Troubleshooting",
              paragraphs: [
                "If a URL cannot be fetched, copy the page's HTML source and switch to the Paste HTML mode. This works for any page, including private or dynamic ones.",
              ],
            },
          ],
        },
      },
    },
    "long-tail-keywords": {
      home: {
        name: "Long Tail Keyword Tool",
        description: "Generate long-tail keyword suggestions for your topic.",
        category: "Marketing",
        icon: "🔎",
      },
      tool: {
        metadata: {
          title: "Long Tail Keyword Tool",
          description: "Generate long-tail keyword suggestions for your topic",
          category: "Marketing",
        },
        keywords: [
          "long tail keywords",
          "long tail keyword generator",
          "keyword suggestions",
          "long tail keywords tool",
          "keyword ideas",
          "seo keyword generator",
          "keyword combinations",
          "long tail seo",
        ],
        labels: {
          seed: "Seed Keyword",
          country: "Country / Language",
          category: "Category",
          results: "Long-Tail Keyword Suggestions",
        },
        placeholders: {
          seed: "e.g. coffee maker, yoga mat...",
        },
        options: {
          global: "Global",
          us: "USA (English)",
          uk: "UK (English)",
          in: "India (English)",
          au: "Australia (English)",
          ca: "Canada (English)",
          general: "General",
          howTo: "How To",
          best: "Best / Top",
          buy: "Buy / Purchase",
          reviews: "Reviews",
          nearMe: "Near Me",
          question: "Questions",
        },
        buttons: {
          generate: "Generate Long-Tail Keywords",
          copy: "Copy",
          copied: "Copied",
        },
        faqs: [
          {
            question: "What are long-tail keywords?",
            answer:
              "Long-tail keywords are longer, more specific search phrases, such as 'best budget coffee maker for camping' instead of 'coffee maker'. They usually have lower search volume but much higher conversion intent.",
          },
          {
            question: "How does this tool generate keywords?",
            answer:
              "It combines your seed keyword with prefixes and suffixes such as 'best', 'how to', 'reviews', and location words, then generates combinations like 'how to use a french press' or 'best espresso machine reviews'.",
          },
          {
            question: "Why are long-tail keywords important for SEO?",
            answer:
              "They face less competition, are easier to rank for, and attract visitors who are closer to making a purchase or finding a specific answer.",
          },
          {
            question: "How many keywords can I generate?",
            answer:
              "The tool generates up to 60 suggestions per seed keyword, including country-specific and question-based variants. You can copy individual keywords or the whole list.",
          },
        ],
        relatedTools: [
          { name: "Keyword Density Checker", href: "/tools/keyword-density" },
          { name: "Keyword Position Checker", href: "/tools/keyword-position" },
          { name: "Meta Tag Generator", href: "/tools/meta-tag-generator" },
          { name: "Word Counter", href: "/tools/word-counter" },
        ],
        guide: {
          intro: {
            title: "What is a Long Tail Keyword Tool?",
            paragraphs: [
              "A long-tail keyword tool is a free generator that turns one seed keyword into dozens of longer, specific search phrases. It is a fast way to build keyword lists for blog posts, product pages, and SEO campaigns.",
            ],
          },
          sections: [
            {
              title: "How to use it",
              paragraphs: [
                "Enter a seed keyword, pick a target country or language, choose a category such as How To or Best / Top, and click Generate.",
              ],
              items: [
                "Use question keywords ('what is', 'how to') for informational content.",
                "Use 'best', 'reviews', and 'buy' keywords for commercial pages.",
                "Use 'near me' and country variants for local SEO.",
              ],
            },
            {
              title: "Tips",
              paragraphs: [
                "Start with a broad seed keyword and let the tool expand it. Then filter the list to the phrases that match your audience's intent.",
              ],
            },
          ],
        },
      },
    },
    "keyword-position": {
      home: {
        name: "Keyword Position Checker",
        description: "Check where your keywords rank in search engines.",
        category: "Marketing",
        icon: "🎯",
      },
      tool: {
        metadata: {
          title: "Keyword Position Checker",
          description: "Check where your keywords rank in search engines",
          category: "Marketing",
        },
        keywords: [
          "keyword position checker",
          "keyword rank checker",
          "check keyword position",
          "keyword ranking tool",
          "serp position checker",
          "keyword rank tracking",
          "position checker seo",
          "check ranking position",
        ],
        labels: {
          domain: "Your Website URL",
          keywords: "Keywords to Check (one per line)",
          results: "Position Results",
          keyword: "Keyword",
          position: "Position",
          url: "Matching URL",
          notFound: "Not in top 50",
        },
        placeholders: {
          keywords: "coffee maker\nbest espresso machine\nfrench press",
        },
        buttons: {
          check: "Check Keyword Positions",
          checking: "Checking...",
        },
        messages: {
          disclaimer:
            "This tool checks Bing organic results in your browser. Positions are estimates and may not match Google. For accurate rankings, use Google Search Console or a professional SEO tool.",
          partial:
            "Some keywords could not be checked or were not found in the top 50 results.",
        },
        faqs: [
          {
            question: "How does the keyword position checker work?",
            answer:
              "For each keyword, the tool fetches the search engine results page through a proxy, parses the organic results, and finds the position where your domain appears.",
          },
          {
            question: "Which search engine does it check?",
            answer:
              "It checks Bing organic results. Browsers block direct requests to Google, so Bing is used as a reliable, accessible estimate of your ranking position.",
          },
          {
            question: "Why do positions differ between search engines?",
            answer:
              "Google and Bing use different ranking algorithms and indexes, so the same keyword can rank differently. The tool marks results as estimates for this reason.",
          },
          {
            question: "How many keywords can I check at once?",
            answer:
              "You can check any number of keywords, one per line. Larger lists take longer because each keyword requires a separate search request.",
          },
        ],
        relatedTools: [
          { name: "Keyword Density Checker", href: "/tools/keyword-density" },
          { name: "Long Tail Keyword Tool", href: "/tools/long-tail-keywords" },
          { name: "Meta Tag Generator", href: "/tools/meta-tag-generator" },
          { name: "Domain Whois Lookup", href: "/tools/whois-lookup" },
        ],
        guide: {
          intro: {
            title: "What is a Keyword Position Checker?",
            paragraphs: [
              "A keyword position checker (or rank checker) shows where your website appears in search engine results for specific keywords. It helps you monitor your SEO progress without paying for expensive rank tracking software.",
            ],
          },
          sections: [
            {
              title: "How to use it",
              paragraphs: [
                "Enter your website URL and a list of keywords (one per line), then click Check Keyword Positions. The tool shows the position of each keyword and the matching result URL.",
              ],
              items: [
                "Positions 1 to 10 are the most valuable for organic traffic.",
                "Keywords not found in the top 50 are shown as 'Not in top 50'.",
                "Run the check regularly to track ranking changes over time.",
              ],
            },
            {
              title: "Tips",
              paragraphs: [
                "Check keywords that already bring you traffic to understand your baseline, then focus on keywords in positions 11 to 30, which are easiest to push into the top 10.",
              ],
            },
          ],
        },
      },
    },
  },
  zh: {
    "keyword-density": {
      home: {
        name: "关键词密度检测器",
        description: "分析内容中的关键词频率和密度。",
        category: "营销",
        icon: "📊",
      },
      tool: {
        metadata: {
          title: "关键词密度检测器",
          description: "分析内容中的关键词频率和密度",
          category: "营销",
        },
        keywords: [
          "关键词密度检测",
          "关键词密度分析",
          "关键词频率检测",
          "关键词密度计算器",
          "检查关键词密度",
          "关键词密度工具",
          "内容关键词分析",
          "seo关键词密度",
        ],
        labels: {
          content: "输入内容",
          minLength: "最短词长",
          showTop: "显示前",
          totalWords: "总词数",
          uniqueWords: "不重复词数",
          topDensity: "最高密度",
          results: "关键词密度结果",
          word: "关键词",
          count: "次数",
          density: "密度",
        },
        placeholders: {
          content: "在此粘贴或输入内容...",
        },
        buttons: {
          analyze: "分析关键词密度",
          clear: "清空",
        },
        options: {
          top10: "前 10 个",
          top20: "前 20 个",
          top50: "前 50 个",
        },
        messages: {
          empty: "请输入要分析的内容。",
        },
        csv: {
          word: "关键词",
          count: "次数",
          density: "密度",
        },
        faqs: [
          {
            question: "什么是关键词密度？",
            answer:
              "关键词密度是指某个关键词在内容中出现的次数占总词数的百分比。计算公式为（关键词出现次数 ÷ 总词数）× 100。",
          },
          {
            question: "多少关键词密度比较合适？",
            answer:
              "一般来说 1% 到 3% 的关键词密度对 SEO 较为理想。过高会被搜索引擎视为关键词堆砌而受到惩罚。",
          },
          {
            question: "这个工具如何计算密度？",
            answer:
              "工具会统计内容中的每个词，再用每个关键词的出现次数除以总词数并乘以 100。你可以设置最短词长来忽略过短的词。",
          },
          {
            question: "为什么要检查关键词密度？",
            answer:
              "检查关键词密度可以帮助你确认主关键词出现的频率是否足够让搜索引擎理解主题，同时又不会过度使用。",
          },
          {
            question: "我的内容会被上传到服务器吗？",
            answer: "不会。所有分析都在浏览器本地完成，你的内容不会离开你的设备。",
          },
        ],
        relatedTools: [
          { name: "字数统计器", href: "/tools/word-counter" },
          { name: "字符计数器", href: "/tools/character-counter" },
          { name: "Meta 标签生成器", href: "/tools/meta-tag-generator" },
          { name: "关键词排名查询", href: "/tools/keyword-position" },
        ],
        guide: {
          intro: {
            title: "什么是关键词密度检测器？",
            paragraphs: [
              "关键词密度检测器是一款免费在线工具，用于分析特定词或短语在内容中出现的频率。它会显示每个关键词的次数、频率和占全文的百分比，帮助你在不堆砌关键词的前提下优化写作。",
            ],
          },
          sections: [
            {
              title: "使用方法",
              paragraphs: [
                "在文本框粘贴或输入内容，设置最短词长以过滤短小的填充词，选择要显示的关键词数量，然后点击分析。",
              ],
              items: [
                "通过总词数和不重复词数了解内容规模。",
                "在结果表格中查看每个关键词的次数和密度百分比。",
                "主关键词密度尽量控制在 1% 到 3%。",
              ],
            },
            {
              title: "SEO 优化建议",
              paragraphs: [
                "在标题、标题标签和首段中使用主关键词，然后在正文中自然重复。使用本工具确认没有过度使用。",
              ],
              items: [
                "主关键词密度控制在 1% 到 3%。",
                "次关键词使用相关同义词和长尾变体。",
                "优先保证内容自然可读，其次才是搜索引擎。",
              ],
            },
          ],
        },
      },
    },
    "meta-tags-analyzer": {
      home: {
        name: "Meta 标签分析器",
        description: "分析任意网址的 Meta 标签。",
        category: "营销",
        icon: "🏷",
      },
      tool: {
        metadata: {
          title: "Meta 标签分析器",
          description: "分析任意网址的 Meta 标签并获取 SEO 建议",
          category: "营销",
        },
        keywords: [
          "meta标签分析",
          "meta标签检查",
          "分析meta标签",
          "meta描述检查",
          "seo meta标签",
          "网址meta标签",
          "og标签分析",
          "检查网站meta标签",
        ],
        labels: {
          urlMode: "按网址",
          htmlMode: "粘贴 HTML",
          url: "页面网址",
          html: "HTML 源码",
        },
        placeholders: {
          html: "在此粘贴页面的 HTML 源码...",
        },
        buttons: {
          analyze: "分析 Meta 标签",
          loading: "分析中...",
        },
        messages: {
          fetchFailed:
            "无法获取该页面，网站可能屏蔽了自动请求。请改用「粘贴 HTML」模式。",
          proxyNote:
            "由于浏览器无法直接读取跨域页面，页面通过公共 CORS 代理获取。",
          noTags: "未找到可识别的 Meta 标签。",
        },
        faqs: [
          {
            question: "什么是 Meta 标签分析器？",
            answer:
              "Meta 标签分析器会读取网页的标题、描述、关键词、Open Graph、Twitter Card 等标签，展示搜索引擎和社交平台看到的内容，并提示缺失或格式错误的标签。",
          },
          {
            question: "它会检查哪些标签？",
            answer:
              "它会检查标题、Meta 描述、关键词、robots、canonical 链接、H1，以及 Open Graph（og:title、og:description、og:image）和 Twitter Card 等社交标签。",
          },
          {
            question: "为什么有些网址无法获取？",
            answer:
              "浏览器会阻止跨域请求，因此页面通过公共代理获取。部分网站会屏蔽代理请求或依赖 JavaScript，导致无法获取，此时请使用「粘贴 HTML」模式。",
          },
          {
            question: "我的数据会被存储吗？",
            answer: "不会。页面内容仅在你的浏览器会话中被获取和分析，不会上传到我们的服务器。",
          },
          {
            question: "什么样的 Meta 标签算好？",
            answer:
              "标题不超过 60 个字符、Meta 描述不超过 160 个字符、H1 准确、有 canonical 链接，并包含用于社交分享的 Open Graph 和 Twitter Card 标签。分析器会在缺失或过长时给出提示。",
          },
        ],
        relatedTools: [
          { name: "Meta 标签生成器", href: "/tools/meta-tag-generator" },
          { name: "Robots.txt 生成器", href: "/tools/robots-txt-generator" },
          { name: "Open Graph 预览", href: "/tools/og-preview" },
          { name: "关键词密度检测器", href: "/tools/keyword-density" },
        ],
        guide: {
          intro: {
            title: "什么是 Meta 标签分析器？",
            paragraphs: [
              "Meta 标签分析器是一款免费在线工具，会获取网页并提取其所有 Meta 标签。它帮助你检查页面在搜索结果和社交预览中的展示效果，并指出可能影响点击率的问题。",
            ],
          },
          sections: [
            {
              title: "使用方法",
              paragraphs: [
                "输入页面网址并点击「分析 Meta 标签」，工具会通过代理获取页面并列出找到的每个标签。",
              ],
              items: [
                "检查标题是否在 60 个字符以内。",
                "检查 Meta 描述是否在 160 个字符以内。",
                "确保包含 Open Graph 和 Twitter Card 标签用于社交分享。",
              ],
            },
            {
              title: "故障排查",
              paragraphs: [
                "如果无法获取网址，可以复制页面的 HTML 源码并切换到「粘贴 HTML」模式。此方式适用于包括私有或动态页面在内的任何页面。",
              ],
            },
          ],
        },
      },
    },
    "long-tail-keywords": {
      home: {
        name: "长尾关键词工具",
        description: "为你的主题生成长尾关键词建议。",
        category: "营销",
        icon: "🔎",
      },
      tool: {
        metadata: {
          title: "长尾关键词工具",
          description: "为你的主题生成长尾关键词建议",
          category: "营销",
        },
        keywords: [
          "长尾关键词",
          "长尾关键词生成器",
          "关键词建议",
          "长尾关键词工具",
          "关键词创意",
          "seo关键词生成",
          "关键词组合",
          "长尾seo",
        ],
        labels: {
          seed: "种子关键词",
          country: "国家 / 语言",
          category: "类别",
          results: "长尾关键词建议",
        },
        placeholders: {
          seed: "例如：咖啡机、瑜伽垫...",
        },
        options: {
          global: "全球",
          us: "美国（英语）",
          uk: "英国（英语）",
          in: "印度（英语）",
          au: "澳大利亚（英语）",
          ca: "加拿大（英语）",
          general: "通用",
          howTo: "如何做",
          best: "最佳 / 顶级",
          buy: "购买",
          reviews: "评测",
          nearMe: "附近",
          question: "问题",
        },
        buttons: {
          generate: "生成长尾关键词",
          copy: "复制",
          copied: "已复制",
        },
        faqs: [
          {
            question: "什么是长尾关键词？",
            answer:
              "长尾关键词是更长、更具体的搜索短语，例如「露营用最佳平价咖啡机」而不是「咖啡机」。它们搜索量较低，但转化意图更高。",
          },
          {
            question: "这个工具如何生成关键词？",
            answer:
              "它会将你的种子关键词与「最佳」「如何」「评测」等前缀后缀组合，生成类似「如何使用法压壶」或「最佳意式咖啡机评测」的组合。",
          },
          {
            question: "为什么长尾关键词对 SEO 很重要？",
            answer:
              "长尾关键词竞争较小、更容易排名，并且能吸引更接近购买决策或寻找具体答案的用户。",
          },
          {
            question: "一次可以生成多少关键词？",
            answer:
              "每个种子关键词最多生成 60 条建议，包括地区和国家变体。你可以单独复制或整份复制。",
          },
        ],
        relatedTools: [
          { name: "关键词密度检测器", href: "/tools/keyword-density" },
          { name: "关键词排名查询", href: "/tools/keyword-position" },
          { name: "Meta 标签生成器", href: "/tools/meta-tag-generator" },
          { name: "字数统计器", href: "/tools/word-counter" },
        ],
        guide: {
          intro: {
            title: "什么是长尾关键词工具？",
            paragraphs: [
              "长尾关键词工具是一款免费生成器，能把一个种子关键词扩展成几十个更长、更具体的搜索短语，是快速构建博客文章、产品页面和 SEO 关键词列表的便捷方式。",
            ],
          },
          sections: [
            {
              title: "使用方法",
              paragraphs: [
                "输入种子关键词，选择目标国家或语言，选择「如何做」或「最佳 / 顶级」等类别，然后点击生成。",
              ],
              items: [
                "使用「是什么」「如何做」等问题型关键词撰写科普内容。",
                "使用「最佳」「评测」「购买」关键词制作商业页面。",
                "使用「附近」和国家变体做本地 SEO。",
              ],
            },
            {
              title: "提示",
              paragraphs: [
                "从一个宽泛的种子关键词开始，让工具扩展它，再筛选出符合用户意图的短语。",
              ],
            },
          ],
        },
      },
    },
    "keyword-position": {
      home: {
        name: "关键词排名查询",
        description: "查询你的关键词在搜索引擎中的排名。",
        category: "营销",
        icon: "🎯",
      },
      tool: {
        metadata: {
          title: "关键词排名查询",
          description: "查询你的关键词在搜索引擎中的排名",
          category: "营销",
        },
        keywords: [
          "关键词排名查询",
          "关键词排名检查",
          "查询关键词排名",
          "关键词排名工具",
          "serp排名查询",
          "关键词排名跟踪",
          "排名查询seo",
          "检查排名位置",
        ],
        labels: {
          domain: "你的网站网址",
          keywords: "要查询的关键词（每行一个）",
          results: "排名结果",
          keyword: "关键词",
          position: "排名",
          url: "匹配网址",
          notFound: "未进前 50",
        },
        placeholders: {
          keywords: "咖啡机\n最佳意式咖啡机\n法压壶",
        },
        buttons: {
          check: "查询关键词排名",
          checking: "查询中...",
        },
        messages: {
          disclaimer:
            "本工具在你的浏览器中查询 Bing 自然搜索结果，排名为估算值，可能与 Google 不同。如需精确排名，请使用 Google Search Console 或专业 SEO 工具。",
          partial: "部分关键词无法查询或未出现在前 50 名结果中。",
        },
        faqs: [
          {
            question: "关键词排名查询如何工作？",
            answer:
              "对于每个关键词，工具通过代理获取搜索结果页面，解析自然结果，并找出你的域名出现的位置。",
          },
          {
            question: "它查询哪个搜索引擎？",
            answer:
              "它查询 Bing 的自然搜索结果。浏览器会阻止直接请求 Google，因此使用 Bing 作为可靠的排名估算来源。",
          },
          {
            question: "为什么不同搜索引擎的排名不同？",
            answer:
              "Google 和 Bing 使用不同的排名算法和索引，因此同一关键词的排名可能不同。工具因此将结果标记为估算值。",
          },
          {
            question: "一次可以查询多少关键词？",
            answer:
              "可以每行一个地查询任意数量的关键词。关键词越多耗时越长，因为每个关键词都需要单独发起搜索请求。",
          },
        ],
        relatedTools: [
          { name: "关键词密度检测器", href: "/tools/keyword-density" },
          { name: "长尾关键词工具", href: "/tools/long-tail-keywords" },
          { name: "Meta 标签生成器", href: "/tools/meta-tag-generator" },
          { name: "域名 Whois 查询", href: "/tools/whois-lookup" },
        ],
        guide: {
          intro: {
            title: "什么是关键词排名查询？",
            paragraphs: [
              "关键词排名查询（或排名检查器）可以显示你的网站针对特定关键词出现在搜索结果中的位置，帮助你无需购买昂贵的排名跟踪软件即可监控 SEO 进展。",
            ],
          },
          sections: [
            {
              title: "使用方法",
              paragraphs: [
                "输入你的网站网址和关键词列表（每行一个），然后点击「查询关键词排名」。工具会显示每个关键词的排名和匹配的结果网址。",
              ],
              items: [
                "第 1 到 10 名对自然流量最有价值。",
                "未进入前 50 的关键词显示为「未进前 50」。",
                "定期查询以跟踪排名变化。",
              ],
            },
            {
              title: "提示",
              paragraphs: [
                "先查询已带来流量的关键词了解基线，然后重点关注 11 到 30 名的关键词，它们最容易进入前十。",
              ],
            },
          ],
        },
      },
    },
  },
  ja: {
    "keyword-density": {
      home: {
        name: "キーワード密度チェッカー",
        description: "コンテンツ内のキーワード頻度と密度を分析します。",
        category: "マーケティング",
        icon: "📊",
      },
      tool: {
        metadata: {
          title: "キーワード密度チェッカー",
          description: "コンテンツ内のキーワード頻度と密度を分析",
          category: "マーケティング",
        },
        keywords: [
          "キーワード密度チェッカー",
          "キーワード密度分析",
          "キーワード頻度チェック",
          "キーワード密度計算",
          "キーワード密度確認",
          "キーワード密度ツール",
          "コンテンツキーワード分析",
          "seoキーワード密度",
        ],
        labels: {
          content: "コンテンツを入力",
          minLength: "最小単語数",
          showTop: "上位表示",
          totalWords: "総単語数",
          uniqueWords: "ユニーク単語数",
          topDensity: "最高密度",
          results: "キーワード密度の結果",
          word: "キーワード",
          count: "回数",
          density: "密度",
        },
        placeholders: {
          content: "ここにコンテンツを貼り付けるか入力...",
        },
        buttons: {
          analyze: "キーワード密度を分析",
          clear: "クリア",
        },
        options: {
          top10: "上位 10",
          top20: "上位 20",
          top50: "上位 50",
        },
        messages: {
          empty: "分析するコンテンツを入力してください。",
        },
        csv: {
          word: "キーワード",
          count: "回数",
          density: "密度",
        },
        faqs: [
          {
            question: "キーワード密度とは何ですか？",
            answer:
              "キーワード密度とは、特定のキーワードがコンテンツ内に出現する回数を総単語数で割った割合です。（キーワード出現回数 ÷ 総単語数）× 100 で計算します。",
          },
          {
            question: "適切なキーワード密度は？",
            answer:
              "一般的に 1%〜3% が SEO で適切とされています。それ以上はキーワードの詰め込みと見なされ、ペナルティを受ける可能性があります。",
          },
          {
            question: "このツールでの密度の計算方法は？",
            answer:
              "コンテンツ内の全単語を数え、各キーワードの出現回数を総単語数で割って 100 を掛けます。最小単語数を設定して短すぎる単語を除外できます。",
          },
          {
            question: "キーワード密度を確認する理由は？",
            answer:
              "メインキーワードが検索エンジンにテーマを理解させるのに十分な頻度で使われているか、過剰でないかを確認できます。",
          },
          {
            question: "コンテンツはサーバーに送信されますか？",
            answer: "いいえ。すべての分析はブラウザ内で行われ、コンテンツがデバイス外に出ることはありません。",
          },
        ],
        relatedTools: [
          { name: "文字数カウントツール", href: "/tools/word-counter" },
          { name: "文字数カウンター", href: "/tools/character-counter" },
          { name: "メタタグ生成ツール", href: "/tools/meta-tag-generator" },
          { name: "キーワード順位チェッカー", href: "/tools/keyword-position" },
        ],
        guide: {
          intro: {
            title: "キーワード密度チェッカーとは？",
            paragraphs: [
              "キーワード密度チェッカーは、特定の単語やフレーズがコンテンツ内にどれだけ出現しているかを分析する無料オンラインツールです。各キーワードの回数・頻度・割合を表示し、詰め込みすぎずにSEO対策を行うのに役立ちます。",
            ],
          },
          sections: [
            {
              title: "使い方",
              paragraphs: [
                "テキストエリアにコンテンツを貼り付け、最小単語数を設定して短い語を除外し、表示するキーワード数を選んで「分析」をクリックします。",
              ],
              items: [
                "総単語数とユニーク単語数でコンテンツ規模を把握。",
                "結果表で各キーワードの回数と密度を確認。",
                "メインキーワードの密度は 1%〜3% を目安に。",
              ],
            },
            {
              title: "SEOのコツ",
              paragraphs: [
                "タイトル・見出し・冒頭でメインキーワードを使い、本文で自然に繰り返します。本ツールで過剰になっていないか確認しましょう。",
              ],
              items: [
                "メインキーワードの密度は 1%〜3% に。",
                "サブキーワードには類義語やロングテールを使う。",
                "読者ファーストの自然な文章を心がける。",
              ],
            },
          ],
        },
      },
    },
    "meta-tags-analyzer": {
      home: {
        name: "メタタグ分析ツール",
        description: "任意のURLのメタタグを分析します。",
        category: "マーケティング",
        icon: "🏷",
      },
      tool: {
        metadata: {
          title: "メタタグ分析ツール",
          description: "任意のURLのメタタグを分析しSEOの提案を取得",
          category: "マーケティング",
        },
        keywords: [
          "メタタグ分析",
          "メタタグチェッカー",
          "メタタグを分析",
          "メタディスクリプションチェック",
          "seoメタタグ",
          "urlのメタタグ",
          "ogタグ分析",
          "サイトのメタタグ確認",
        ],
        labels: {
          urlMode: "URLで",
          htmlMode: "HTMLを貼り付け",
          url: "ページURL",
          html: "HTMLソース",
        },
        placeholders: {
          html: "ここにページのHTMLソースを貼り付け...",
        },
        buttons: {
          analyze: "メタタグを分析",
          loading: "分析中...",
        },
        messages: {
          fetchFailed:
            "ページを取得できませんでした。サイトが自動アクセスをブロックしている可能性があります。「HTMLを貼り付け」モードをお試しください。",
          proxyNote:
            "ブラウザはクロスオリジンのページを直接読めないため、パブリックCORSプロキシ経由で取得しています。",
          noTags: "認識できるメタタグが見つかりませんでした。",
        },
        faqs: [
          {
            question: "メタタグ分析ツールとは？",
            answer:
              "Webページのタイトル、メタディスクリプション、キーワード、Open Graph、Twitter Cardなどのタグを読み取り、検索エンジンやSNSにどう見えるかを表示し、欠落や不正なタグを警告します。",
          },
          {
            question: "どのタグをチェックしますか？",
            answer:
              "タイトル、メタディスクリプション、キーワード、robots、canonicalリンク、H1、Open Graph（og:title、og:description、og:image）やTwitter Cardなどのソーシャルタグをチェックします。",
          },
          {
            question: "取得できないURLがあるのはなぜ？",
            answer:
              "ブラウザはクロスオリジンリクエストをブロックするため、ページはプロキシ経由で取得します。一部サイトはプロキシをブロックしたりJavaScriptを必要としたりするため取得できません。その場合は「HTMLを貼り付け」モードを使ってください。",
          },
          {
            question: "データは保存されますか？",
            answer: "いいえ。ページの取得と分析はブラウザセッション内でのみ行われ、当社サーバーへは一切アップロードされません。",
          },
          {
            question: "良いメタタグとは？",
            answer:
              "60文字以内のタイトル、160文字以内のメタディスクリプション、正確なH1、canonical URL、そしてSNS共有用のOpen GraphとTwitter Cardタグです。分析ツールが欠落や長さの問題を警告します。",
          },
        ],
        relatedTools: [
          { name: "メタタグ生成ツール", href: "/tools/meta-tag-generator" },
          { name: "Robots.txt生成ツール", href: "/tools/robots-txt-generator" },
          { name: "Open Graphプレビュー", href: "/tools/og-preview" },
          { name: "キーワード密度チェッカー", href: "/tools/keyword-density" },
        ],
        guide: {
          intro: {
            title: "メタタグ分析ツールとは？",
            paragraphs: [
              "メタタグ分析ツールは、Webページを取得してすべてのメタタグを抽出する無料ツールです。検索結果やSNSプレビューでの見え方を監査し、クリック率を下げる問題を検出します。",
            ],
          },
          sections: [
            {
              title: "使い方",
              paragraphs: [
                "ページURLを入力して「メタタグを分析」をクリックします。プロキシ経由でページを取得し、見つかったメタタグを一覧表示します。",
              ],
              items: [
                "タイトルが60文字以内か確認。",
                "メタディスクリプションが160文字以内か確認。",
                "SNS共有用のOpen GraphとTwitter Cardタグがあるか確認。",
              ],
            },
            {
              title: "トラブルシューティング",
              paragraphs: [
                "URLを取得できない場合は、ページのHTMLソースをコピーして「HTMLを貼り付け」モードに切り替えてください。プライベートなページや動的ページにも対応します。",
              ],
            },
          ],
        },
      },
    },
    "long-tail-keywords": {
      home: {
        name: "ロングテールキーワードツール",
        description: "テーマに合わせたロングテールキーワードの提案を生成します。",
        category: "マーケティング",
        icon: "🔎",
      },
      tool: {
        metadata: {
          title: "ロングテールキーワードツール",
          description: "テーマに合わせたロングテールキーワードの提案を生成",
          category: "マーケティング",
        },
        keywords: [
          "ロングテールキーワード",
          "ロングテールキーワード生成",
          "キーワード提案",
          "ロングテールキーワードツール",
          "キーワードアイデア",
          "seoキーワード生成",
          "キーワード組み合わせ",
          "ロングテールseo",
        ],
        labels: {
          seed: "シードキーワード",
          country: "国 / 言語",
          category: "カテゴリ",
          results: "ロングテールキーワードの提案",
        },
        placeholders: {
          seed: "例：コーヒーメーカー、ヨガマット...",
        },
        options: {
          global: "グローバル",
          us: "米国（英語）",
          uk: "英国（英語）",
          in: "インド（英語）",
          au: "オーストラリア（英語）",
          ca: "カナダ（英語）",
          general: "一般",
          howTo: "How To",
          best: "Best / Top",
          buy: "購入",
          reviews: "レビュー",
          nearMe: "近くで",
          question: "質問",
        },
        buttons: {
          generate: "ロングテールキーワードを生成",
          copy: "コピー",
          copied: "コピー済み",
        },
        faqs: [
          {
            question: "ロングテールキーワードとは？",
            answer:
              "「コーヒーメーカー」ではなく「キャンプ用おすすめ格安コーヒーメーカー」のような、より長く具体的な検索フレーズです。検索量は少なめですが、コンバージョン意図が高いのが特徴です。",
          },
          {
            question: "このツールの生成方法は？",
            answer:
              "シードキーワードに「ベスト」「方法」「レビュー」などの接頭辞・接尾辞を組み合わせて、「フレンチプレスの使い方」や「おすすめエスプレッソマシンのレビュー」のようなフレーズを生成します。",
          },
          {
            question: "なぜロングテールキーワードがSEOで重要？",
            answer:
              "競争が少なくランキングが取りやすく、購入に近い、または具体的な答えを探しているユーザーを集客できます。",
          },
          {
            question: "一度に何個生成できますか？",
            answer:
              "シードキーワード1つにつき最大60件の提案を生成します。国別や質問型のバリエーションも含まれます。個別コピーも一括コピーも可能です。",
          },
        ],
        relatedTools: [
          { name: "キーワード密度チェッカー", href: "/tools/keyword-density" },
          { name: "キーワード順位チェッカー", href: "/tools/keyword-position" },
          { name: "メタタグ生成ツール", href: "/tools/meta-tag-generator" },
          { name: "文字数カウントツール", href: "/tools/word-counter" },
        ],
        guide: {
          intro: {
            title: "ロングテールキーワードツールとは？",
            paragraphs: [
              "1つのシードキーワードを数十の長く具体的な検索フレーズに展開できる無料ジェネレーターです。ブログ記事や商品ページ、SEOキャンペーンのキーワードリスト作成に最適です。",
            ],
          },
          sections: [
            {
              title: "使い方",
              paragraphs: [
                "シードキーワードを入力し、対象国や言語を選び、「How To」や「Best / Top」などのカテゴリを選択して「生成」をクリックします。",
              ],
              items: [
                "情報発信コンテンツには「とは」「方法」系の質問型キーワード。",
                "商用ページには「ベスト」「レビュー」「購入」系。",
                "ローカルSEOには「近く」や国別バリエーション。",
              ],
            },
            {
              title: "コツ",
              paragraphs: [
                "広めのシードキーワードから始めてツールで展開し、ユーザーの意図に合うフレーズに絞り込みましょう。",
              ],
            },
          ],
        },
      },
    },
    "keyword-position": {
      home: {
        name: "キーワード順位チェッカー",
        description: "検索エンジンでのキーワード順位を確認します。",
        category: "マーケティング",
        icon: "🎯",
      },
      tool: {
        metadata: {
          title: "キーワード順位チェッカー",
          description: "検索エンジンでのキーワード順位を確認",
          category: "マーケティング",
        },
        keywords: [
          "キーワード順位チェッカー",
          "キーワード順位確認",
          "順位チェック",
          "キーワードランキングツール",
          "serp順位チェック",
          "キーワード順位追跡",
          "順位チェックseo",
          "検索順位確認",
        ],
        labels: {
          domain: "あなたのWebサイトURL",
          keywords: "確認するキーワード（1行に1つ）",
          results: "順位の結果",
          keyword: "キーワード",
          position: "順位",
          url: "一致したURL",
          notFound: "上位50位圏外",
        },
        placeholders: {
          keywords: "コーヒーメーカー\nおすすめエスプレッソマシン\nフレンチプレス",
        },
        buttons: {
          check: "キーワード順位をチェック",
          checking: "確認中...",
        },
        messages: {
          disclaimer:
            "このツールはブラウザ内でBingのオーガニック検索結果を確認します。順位は推定値であり、Googleとは異なる場合があります。正確な順位はGoogle Search Consoleや専門のSEOツールをご利用ください。",
          partial: "一部のキーワードは確認できないか、上位50位に見つかりませんでした。",
        },
        faqs: [
          {
            question: "キーワード順位チェッカーの仕組みは？",
            answer:
              "各キーワードについて、プロキシ経由で検索結果ページを取得し、オーガニック結果を解析して、あなたのドメインが出現する位置を特定します。",
          },
          {
            question: "どの検索エンジンをチェックしますか？",
            answer:
              "Bingのオーガニック検索結果を確認します。ブラウザはGoogleへの直接リクエストをブロックするため、信頼できる代替としてBingを使用しています。",
          },
          {
            question: "検索エンジンによって順位が異なるのはなぜ？",
            answer:
              "GoogleとBingは異なるランキングアルゴリズムとインデックスを持つため、同じキーワードでも順位が変わります。そのため本ツールでは推定値として表示しています。",
          },
          {
            question: "一度にいくつのキーワードを確認できますか？",
            answer:
              "1行に1つずつ、何個でも確認できます。各キーワードに個別の検索リクエストが必要なため、リストが長いほど時間がかかります。",
          },
        ],
        relatedTools: [
          { name: "キーワード密度チェッカー", href: "/tools/keyword-density" },
          { name: "ロングテールキーワードツール", href: "/tools/long-tail-keywords" },
          { name: "メタタグ生成ツール", href: "/tools/meta-tag-generator" },
          { name: "ドメイン Whois 検索", href: "/tools/whois-lookup" },
        ],
        guide: {
          intro: {
            title: "キーワード順位チェッカーとは？",
            paragraphs: [
              "キーワード順位チェッカー（ランクチェッカー）は、特定キーワードで自社サイトが検索結果のどの位置に表示されるかを表示します。高価なランキング追跡ソフトを使わずにSEOの進捗を監視できます。",
            ],
          },
          sections: [
            {
              title: "使い方",
              paragraphs: [
                "WebサイトURLとキーワードのリスト（1行に1つ）を入力し、「キーワード順位をチェック」をクリックします。各キーワードの順位と一致したURLが表示されます。",
              ],
              items: [
                "1〜10位はオーガニックトラフィックで最も価値が高い。",
                "上位50位に見つからない場合は「上位50位圏外」と表示。",
                "定期的にチェックして順位の推移を追跡。",
              ],
            },
            {
              title: "コツ",
              paragraphs: [
                "すでにトラフィックを集めているキーワードでベースラインを把握し、次に11〜30位のキーワードに注力するとトップ10入りしやすくなります。",
              ],
            },
          ],
        },
      },
    },
  },
  ko: {
    "keyword-density": {
      home: {
        name: "키워드 밀도 체커",
        description: "콘텐츠의 키워드 빈도와 밀도를 분석합니다.",
        category: "마케팅",
        icon: "📊",
      },
      tool: {
        metadata: {
          title: "키워드 밀도 체커",
          description: "콘텐츠의 키워드 빈도와 밀도를 분석",
          category: "마케팅",
        },
        keywords: [
          "키워드 밀도 체커",
          "키워드 밀도 분석",
          "키워드 빈도 확인",
          "키워드 밀도 계산",
          "키워드 밀도 확인",
          "키워드 밀도 도구",
          "콘텐츠 키워드 분석",
          "seo 키워드 밀도",
        ],
        labels: {
          content: "콘텐츠 입력",
          minLength: "최소 단어 길이",
          showTop: "상위 표시",
          totalWords: "총 단어 수",
          uniqueWords: "고유 단어 수",
          topDensity: "최고 밀도",
          results: "키워드 밀도 결과",
          word: "키워드",
          count: "횟수",
          density: "밀도",
        },
        placeholders: {
          content: "여기에 콘텐츠를 붙여넣거나 입력하세요...",
        },
        buttons: {
          analyze: "키워드 밀도 분석",
          clear: "지우기",
        },
        options: {
          top10: "상위 10",
          top20: "상위 20",
          top50: "상위 50",
        },
        messages: {
          empty: "분석할 콘텐츠를 입력하세요.",
        },
        csv: {
          word: "키워드",
          count: "횟수",
          density: "밀도",
        },
        faqs: [
          {
            question: "키워드 밀도란 무엇인가요?",
            answer:
              "키워드 밀도는 특정 키워드가 콘텐츠에 등장하는 횟수를 전체 단어 수로 나눈 비율입니다. (키워드 등장 횟수 ÷ 총 단어 수) × 100으로 계산합니다.",
          },
          {
            question: "적절한 키워드 밀도는 얼마인가요?",
            answer:
              "일반적으로 1%~3%가 SEO에 적합한 수준입니다. 이보다 높으면 키워드 스터핑으로 간주되어 검색엔진의 제재를 받을 수 있습니다.",
          },
          {
            question: "이 도구는 어떻게 밀도를 계산하나요?",
            answer:
              "콘텐츠의 모든 단어를 세고 각 키워드의 등장 횟수를 총 단어 수로 나눈 뒤 100을 곱합니다. 최소 단어 길이를 설정해 너무 짧은 단어를 제외할 수 있습니다.",
          },
          {
            question: "키워드 밀도를 왜 확인해야 하나요?",
            answer:
              "주요 키워드가 검색엔진이 주제를 이해할 만큼 충분히, 그리고 과하지 않게 등장하는지 확인할 수 있습니다.",
          },
          {
            question: "콘텐츠가 서버로 전송되나요?",
            answer: "아니요. 모든 분석은 브라우저에서 로컬로 이루어지며 콘텐츠가 기기를 벗어나지 않습니다.",
          },
        ],
        relatedTools: [
          { name: "단어 수 세기", href: "/tools/word-counter" },
          { name: "문자 수 세기", href: "/tools/character-counter" },
          { name: "메타 태그 생성기", href: "/tools/meta-tag-generator" },
          { name: "키워드 순위 확인", href: "/tools/keyword-position" },
        ],
        guide: {
          intro: {
            title: "키워드 밀도 체커란?",
            paragraphs: [
              "키워드 밀도 체커는 특정 단어나 구문이 콘텐츠에 얼마나 자주 등장하는지 분석하는 무료 온라인 도구입니다. 각 키워드의 횟수, 빈도, 비율을 보여줘 키워드 스터핑 없이 콘텐츠를 최적화하는 데 도움을 줍니다.",
            ],
          },
          sections: [
            {
              title: "사용 방법",
              paragraphs: [
                "텍스트 영역에 콘텐츠를 붙여넣고, 최소 단어 길이를 설정해 짧은 조사를 걸러낸 뒤, 표시할 키워드 수를 선택하고 분석을 클릭하세요.",
              ],
              items: [
                "총 단어 수와 고유 단어 수로 콘텐츠 규모를 파악하세요.",
                "결과 표에서 각 키워드의 횟수와 밀도 비율을 확인하세요.",
                "주요 키워드 밀도는 1%~3%를 목표로 하세요.",
              ],
            },
            {
              title: "SEO 팁",
              paragraphs: [
                "제목, 제목 태그, 첫 문단에 주요 키워드를 사용하고 본문에서 자연스럽게 반복하세요. 이 도구로 과하게 사용하지 않았는지 확인하세요.",
              ],
              items: [
                "주요 키워드 밀도는 1%~3%로 유지하세요.",
                "보조 키워드는 유의어와 롱테일 변형을 사용하세요.",
                "검색엔진보다 독자 우선의 자연스러운 글쓰기를 하세요.",
              ],
            },
          ],
        },
      },
    },
    "meta-tags-analyzer": {
      home: {
        name: "메타 태그 분석기",
        description: "모든 URL의 메타 태그를 분석합니다.",
        category: "마케팅",
        icon: "🏷",
      },
      tool: {
        metadata: {
          title: "메타 태그 분석기",
          description: "모든 URL의 메타 태그를 분석하고 SEO 제안을 제공",
          category: "마케팅",
        },
        keywords: [
          "메타 태그 분석",
          "메타 태그 확인",
          "메타 태그 분석하기",
          "메타 설명 확인",
          "seo 메타 태그",
          "url 메타 태그",
          "og 태그 분석",
          "사이트 메타 태그 확인",
        ],
        labels: {
          urlMode: "URL로",
          htmlMode: "HTML 붙여넣기",
          url: "페이지 URL",
          html: "HTML 소스",
        },
        placeholders: {
          html: "여기에 페이지의 HTML 소스를 붙여넣으세요...",
        },
        buttons: {
          analyze: "메타 태그 분석",
          loading: "분석 중...",
        },
        messages: {
          fetchFailed:
            "페이지를 가져올 수 없습니다. 사이트가 자동 요청을 차단했을 수 있습니다. HTML 붙여넣기 모드를 사용해 보세요.",
          proxyNote:
            "브라우저는 교차 출처 페이지를 직접 읽을 수 없으므로 공용 CORS 프록시를 통해 페이지를 가져옵니다.",
          noTags: "인식 가능한 메타 태그가 없습니다.",
        },
        faqs: [
          {
            question: "메타 태그 분석기란?",
            answer:
              "웹 페이지의 제목, 메타 설명, 키워드, Open Graph, Twitter Card 등 태그를 읽어 검색엔진과 소셜 네트워크에 어떻게 보이는지 보여주고, 누락되거나 잘못된 태그를 경고합니다.",
          },
          {
            question: "어떤 태그를 확인하나요?",
            answer:
              "제목, 메타 설명, 키워드, robots, canonical 링크, H1과 Open Graph(og:title, og:description, og:image), Twitter Card 등 소셜 태그를 확인합니다.",
          },
          {
            question: "일부 URL을 가져오지 못하는 이유는?",
            answer:
              "브라우저가 교차 출처 요청을 차단하므로 프록시를 통해 페이지를 가져옵니다. 일부 사이트는 프록시를 차단하거나 JavaScript를 요구해 가져올 수 없습니다. 이 경우 HTML 붙여넣기 모드를 사용하세요.",
          },
          {
            question: "데이터가 저장되나요?",
            answer: "아니요. 페이지 내용은 브라우저 세션에서만 가져와 분석되며 당사 서버에 업로드되지 않습니다.",
          },
          {
            question: "좋은 메타 태그란?",
            answer:
              "60자 이내의 제목, 160자 이내의 메타 설명, 정확한 H1, canonical URL, 그리고 소셜 공유용 Open Graph와 Twitter Card 태그입니다. 분석기가 누락 또는 길이 문제를 경고합니다.",
          },
        ],
        relatedTools: [
          { name: "메타 태그 생성기", href: "/tools/meta-tag-generator" },
          { name: "Robots.txt 생성기", href: "/tools/robots-txt-generator" },
          { name: "Open Graph 미리보기", href: "/tools/og-preview" },
          { name: "키워드 밀도 체커", href: "/tools/keyword-density" },
        ],
        guide: {
          intro: {
            title: "메타 태그 분석기란?",
            paragraphs: [
              "메타 태그 분석기는 웹 페이지를 가져와 모든 메타 태그를 추출하는 무료 도구입니다. 검색결과와 소셜 미디어 미리보기에서 페이지가 어떻게 보이는지 감사하고, 클릭률을 낮추는 문제를 찾아냅니다.",
            ],
          },
          sections: [
            {
              title: "사용 방법",
              paragraphs: [
                "페이지 URL을 입력하고 '메타 태그 분석'을 클릭하세요. 프록시를 통해 페이지를 가져와 찾은 모든 메타 태그를 나열합니다.",
              ],
              items: [
                "제목이 60자 이내인지 확인하세요.",
                "메타 설명이 160자 이내인지 확인하세요.",
                "소셜 공유용 Open Graph와 Twitter Card 태그가 있는지 확인하세요.",
              ],
            },
            {
              title: "문제 해결",
              paragraphs: [
                "URL을 가져올 수 없으면 페이지의 HTML 소스를 복사해 HTML 붙여넣기 모드로 전환하세요. 비공개 또는 동적 페이지에서도 작동합니다.",
              ],
            },
          ],
        },
      },
    },
    "long-tail-keywords": {
      home: {
        name: "롱테일 키워드 도구",
        description: "주제에 대한 롱테일 키워드 제안을 생성합니다.",
        category: "마케팅",
        icon: "🔎",
      },
      tool: {
        metadata: {
          title: "롱테일 키워드 도구",
          description: "주제에 대한 롱테일 키워드 제안을 생성",
          category: "마케팅",
        },
        keywords: [
          "롱테일 키워드",
          "롱테일 키워드 생성기",
          "키워드 제안",
          "롱테일 키워드 도구",
          "키워드 아이디어",
          "seo 키워드 생성",
          "키워드 조합",
          "롱테일 seo",
        ],
        labels: {
          seed: "시드 키워드",
          country: "국가 / 언어",
          category: "카테고리",
          results: "롱테일 키워드 제안",
        },
        placeholders: {
          seed: "예: 커피 메이커, 요가 매트...",
        },
        options: {
          global: "글로벌",
          us: "미국 (영어)",
          uk: "영국 (영어)",
          in: "인도 (영어)",
          au: "호주 (영어)",
          ca: "캐나다 (영어)",
          general: "일반",
          howTo: "How To",
          best: "Best / Top",
          buy: "구매",
          reviews: "리뷰",
          nearMe: "내 주변",
          question: "질문",
        },
        buttons: {
          generate: "롱테일 키워드 생성",
          copy: "복사",
          copied: "복사됨",
        },
        faqs: [
          {
            question: "롱테일 키워드란?",
            answer:
              "'커피 메이커'가 아닌 '캠핑용 추천 저렴한 커피 메이커'처럼 더 길고 구체적인 검색 구문입니다. 검색량은 적지만 전환 의도가 훨씬 높습니다.",
          },
          {
            question: "이 도구는 어떻게 키워드를 생성하나요?",
            answer:
              "시드 키워드에 '최고', '방법', '리뷰' 등의 접두사와 접미사를 결합해 '프렌치프레스 사용법' 또는 '최고의 에스프레소 머신 리뷰' 같은 조합을 생성합니다.",
          },
          {
            question: "롱테일 키워드가 SEO에서 중요한 이유는?",
            answer:
              "경쟁이 적고 순위 확보가 쉬우며, 구매에 가깝거나 특정 답을 찾는 사용자를 유치합니다.",
          },
          {
            question: "한 번에 몇 개를 생성할 수 있나요?",
            answer:
              "시드 키워드당 최대 60개의 제안을 생성합니다. 국가별·질문형 변형도 포함됩니다. 개별 또는 전체 복사가 가능합니다.",
          },
        ],
        relatedTools: [
          { name: "키워드 밀도 체커", href: "/tools/keyword-density" },
          { name: "키워드 순위 확인", href: "/tools/keyword-position" },
          { name: "메타 태그 생성기", href: "/tools/meta-tag-generator" },
          { name: "단어 수 세기", href: "/tools/word-counter" },
        ],
        guide: {
          intro: {
            title: "롱테일 키워드 도구란?",
            paragraphs: [
              "하나의 시드 키워드를 수십 개의 길고 구체적인 검색 구문으로 확장해주는 무료 생성기입니다. 블로그 글, 상품 페이지, SEO 캠페인의 키워드 목록을 빠르게 만드는 데 유용합니다.",
            ],
          },
          sections: [
            {
              title: "사용 방법",
              paragraphs: [
                "시드 키워드를 입력하고 대상 국가 또는 언어를 선택한 뒤 'How To'나 'Best / Top' 같은 카테고리를 고르고 생성 버튼을 클릭하세요.",
              ],
              items: [
                "정보형 콘텐츠에는 '무엇인가', '방법' 질문형 키워드를 사용하세요.",
                "상업용 페이지에는 '최고', '리뷰', '구매' 키워드를 사용하세요.",
                "로컬 SEO에는 '내 주변'과 국가 변형을 사용하세요.",
              ],
            },
            {
              title: "팁",
              paragraphs: [
                "넓은 시드 키워드로 시작해 도구로 확장한 뒤, 사용자 의도에 맞는 구문으로 필터링하세요.",
              ],
            },
          ],
        },
      },
    },
    "keyword-position": {
      home: {
        name: "키워드 순위 확인",
        description: "검색 엔진에서 키워드 순위를 확인합니다.",
        category: "마케팅",
        icon: "🎯",
      },
      tool: {
        metadata: {
          title: "키워드 순위 확인",
          description: "검색 엔진에서 키워드 순위를 확인",
          category: "마케팅",
        },
        keywords: [
          "키워드 순위 확인",
          "키워드 순위 체커",
          "키워드 순위 조회",
          "키워드 랭킹 도구",
          "serp 순위 확인",
          "키워드 순위 추적",
          "순위 확인 seo",
          "검색 순위 조회",
        ],
        labels: {
          domain: "웹사이트 URL",
          keywords: "확인할 키워드 (한 줄에 하나)",
          results: "순위 결과",
          keyword: "키워드",
          position: "순위",
          url: "일치 URL",
          notFound: "상위 50위 밖",
        },
        placeholders: {
          keywords: "커피 메이커\n최고의 에스프레소 머신\n프렌치프레스",
        },
        buttons: {
          check: "키워드 순위 확인",
          checking: "확인 중...",
        },
        messages: {
          disclaimer:
            "이 도구는 브라우저에서 Bing 유기적 검색 결과를 확인합니다. 순위는 추정치이며 Google과 다를 수 있습니다. 정확한 순위는 Google Search Console 또는 전문 SEO 도구를 사용하세요.",
          partial: "일부 키워드는 확인할 수 없거나 상위 50개 결과에 없습니다.",
        },
        faqs: [
          {
            question: "키워드 순위 확인은 어떻게 작동하나요?",
            answer:
              "각 키워드에 대해 프록시를 통해 검색 결과 페이지를 가져와 유기적 결과를 분석하고, 도메인이 나타나는 위치를 찾습니다.",
          },
          {
            question: "어떤 검색 엔진을 확인하나요?",
            answer:
              "Bing 유기적 검색 결과를 확인합니다. 브라우저는 Google에 대한 직접 요청을 차단하므로 신뢰할 수 있는 대안으로 Bing을 사용합니다.",
          },
          {
            question: "검색 엔진마다 순위가 다른 이유는?",
            answer:
              "Google과 Bing은 서로 다른 순위 알고리즘과 인덱스를 사용하므로 같은 키워드의 순위가 다를 수 있습니다. 그래서 결과를 추정치로 표시합니다.",
          },
          {
            question: "한 번에 몇 개까지 확인할 수 있나요?",
            answer:
              "한 줄에 하나씩 개수 제한 없이 확인할 수 있습니다. 각 키워드마다 개별 검색 요청이 필요하므로 목록이 길수록 시간이 더 걸립니다.",
          },
        ],
        relatedTools: [
          { name: "키워드 밀도 체커", href: "/tools/keyword-density" },
          { name: "롱테일 키워드 도구", href: "/tools/long-tail-keywords" },
          { name: "메타 태그 생성기", href: "/tools/meta-tag-generator" },
          { name: "도메인 Whois 조회", href: "/tools/whois-lookup" },
        ],
        guide: {
          intro: {
            title: "키워드 순위 확인이란?",
            paragraphs: [
              "키워드 순위 확인(랭크 체커)은 특정 키워드에서 웹사이트가 검색 결과의 어느 위치에 나타나는지 보여줍니다. 비싼 순위 추적 소프트웨어 없이 SEO 진행 상황을 모니터링할 수 있습니다.",
            ],
          },
          sections: [
            {
              title: "사용 방법",
              paragraphs: [
                "웹사이트 URL과 키워드 목록(한 줄에 하나)을 입력하고 '키워드 순위 확인'을 클릭하세요. 각 키워드의 순위와 일치하는 결과 URL이 표시됩니다.",
              ],
              items: [
                "1~10위는 유기적 트래픽에 가장 가치가 높습니다.",
                "상위 50위에 없는 키워드는 '상위 50위 밖'으로 표시됩니다.",
                "정기적으로 확인해 순위 변화를 추적하세요.",
              ],
            },
            {
              title: "팁",
              paragraphs: [
                "이미 트래픽을 가져오는 키워드로 기준선을 파악한 뒤, 11~30위 키워드에 집중하면 상위 10위 진입이 쉬워집니다.",
              ],
            },
          ],
        },
      },
    },
  },
};

// ---------- JSON builders ----------

function buildEntry(slug, obj, indent) {
  const lines = [];
  lines.push(`${" ".repeat(indent)}"${slug}": {`);
  const inner = JSON.stringify(obj, null, 2).split("\n");
  for (let i = 1; i < inner.length - 1; i++) {
    lines.push(`${" ".repeat(indent)}${inner[i]}`);
  }
  lines.push(`${" ".repeat(indent)}},`);
  return lines.join("\n");
}

function insertAfter(text, anchor, block) {
  const idx = text.indexOf(anchor);
  if (idx === -1) throw new Error(`Anchor not found: ${JSON.stringify(anchor.slice(0, 40))}`);
  const insertAt = idx + anchor.length;
  return text.slice(0, insertAt) + "\n" + block + "\n" + text.slice(insertAt);
}

for (const locale of LOCALES) {
  const file = path.join(root, "messages", `${locale}.json`);
  let text = fs.readFileSync(file, "utf-8");

  // home.tools entries: inserted right after the opening "tools" object (4-space indent).
  // Anchors start with the file's EOL so the 2-space variant can never match inside the
  // 4-space variant (otherwise "  \"tools\"" is a substring of "    \"tools\"").
  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  const homeAnchor = `${eol}    "tools": {${eol}`;
  const toolsAnchor = `${eol}  "tools": {${eol}`;

  const homeBlock = Object.entries(CONTENT[locale] ?? CONTENT.en)
    .map(([slug, data]) => buildEntry(slug, data.home, 6))
    .join("\n");
  const toolsBlock = Object.entries(CONTENT[locale] ?? CONTENT.en)
    .map(([slug, data]) => buildEntry(slug, data.tool, 4))
    .join("\n");

  text = insertAfter(text, homeAnchor, homeBlock);
  text = insertAfter(text, toolsAnchor, toolsBlock);

  fs.writeFileSync(file, text);
  console.log(`Updated ${locale}.json`);
}
