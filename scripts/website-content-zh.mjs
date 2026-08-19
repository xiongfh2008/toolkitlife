export default {
  "xml-sitemap": {
    home: {
      name: "XML 站点地图生成器",
      description: "快速为你的网站生成 XML 站点地图。",
      category: "营销",
      icon: "🗺️",
    },
    tool: {
      metadata: {
        title: "XML 站点地图生成器",
        description: "几秒钟内为你的网站创建标准 XML 站点地图",
        category: "营销",
      },
      keywords: [
        "XML 站点地图生成",
        "站点地图生成器",
        "sitemap 生成",
        "SEO 站点地图",
        "sitemap.xml",
        "网站地图",
        "站点地图工具",
      ],
      labels: {
        websiteUrl: "网站地址",
        paths: "页面路径（每行一个）",
        changefreq: "更新频率",
        priority: "优先级",
        results: "站点地图输出",
      },
      placeholders: {
        websiteUrl: "https://example.com",
        paths: "/\n/about\n/contact\n/blog",
      },
      buttons: {
        generate: "生成站点地图",
        clear: "清空",
        download: "下载 XML",
        copy: "复制 XML",
      },
      options: {
        always: "始终",
        hourly: "每小时",
        daily: "每天",
        weekly: "每周",
        monthly: "每月",
        yearly: "每年",
        never: "从不",
      },
      messages: {
        empty: "请至少输入一个页面路径。",
        invalidUrl: "请输入有效的网站地址。",
        placeholder: "生成的站点地图将显示在这里。",
      },
      faqs: [
        {
          question: "什么是 XML 站点地图？",
          answer: "XML 站点地图是一个列出网站重要页面的文件，帮助搜索引擎更高效地发现和抓取你的页面。",
        },
        {
          question: "应该多久更新一次站点地图？",
          answer: "每当添加、删除或修改重要页面时都应更新。大多数网站将更新频率设置为每周或每月。",
        },
        {
          question: "站点地图应该上传到哪里？",
          answer: "将 sitemap.xml 上传到网站根目录，并在 Google Search Console 或必应站长平台中提交。",
        },
        {
          question: "优先级应该设置多少？",
          answer: "优先级范围为 0.0 到 1.0，告诉搜索引擎哪些页面更重要。仅对首页和关键落地页使用 1.0。",
        },
      ],
      relatedTools: [
        { name: "Robots.txt 生成器", href: "/tools/robots-txt-generator" },
        { name: "Meta 标签生成器", href: "/tools/meta-tag-generator" },
        { name: "URL Slug 生成器", href: "/tools/url-slug-generator" },
        { name: "关键词排名查询", href: "/tools/keyword-position" },
      ],
      guide: {
        intro: {
          title: "什么是 XML 站点地图生成器？",
          paragraphs: [
            "XML 站点地图生成器创建列出网站 URL 的 sitemap.xml 文件，帮助搜索引擎发现和索引你的页面。",
          ],
        },
        sections: [
          {
            title: "使用方法",
            paragraphs: [
              "输入网站地址、逐行列出页面路径、选择更新频率和优先级，然后点击生成站点地图。",
            ],
            items: [
              "路径可以是绝对路径（/about）或相对路径（about）。",
              "lastmod 日期自动设为今天。",
              "下载 XML 文件并上传到网站根目录。",
            ],
          },
          {
            title: "提示",
            paragraphs: [
              "站点地图 URL 应控制在 50,000 以内。大型网站请拆分为多个站点地图。",
            ],
          },
        ],
      },
    },
  },
  "adsense-calculator": {
    home: {
      name: "AdSense 收入计算器",
      description: "估算你的 Google AdSense 收入。",
      category: "营销",
      icon: "💰",
    },
    tool: {
      metadata: {
        title: "AdSense 收入计算器",
        description: "根据流量和广告数据估算 Google AdSense 收入",
        category: "营销",
      },
      keywords: [
        "adsense 计算器",
        "adsense 收入计算",
        "google adsense 收入",
        "广告收入计算",
        "cpm 计算器",
        "adsense rpm",
        "广告收益计算器",
      ],
      labels: {
        dailyPageviews: "每日页面浏览量",
        adsPerPage: "每页广告数",
        ctr: "点击率（%）",
        cpc: "单次点击费用（$）",
        daily: "预计每日收入",
        monthly: "预计每月收入",
        yearly: "预计每年收入",
      },
      messages: {
        disclaimer: "仅为估算。实际收入取决于行业、地区、季节、广告质量等多种因素。",
      },
      faqs: [
        {
          question: "AdSense 收入是如何计算的？",
          answer:
            "收入大致等于 页面浏览量 × 每页广告数 × 点击率（CTR）× 单次点击费用（CPC）。本工具使用该公式进行估算。",
        },
        {
          question: "AdSense 的合理点击率是多少？",
          answer: "展示广告的典型点击率在 1% 到 3% 之间。高质量、位置合适的广告表现更好。",
        },
        {
          question: "什么是 CPC，受什么影响？",
          answer: "CPC 是每次点击获得的费用，受行业、用户地区、季节和广告主竞争影响。",
        },
        {
          question: "为什么结果只是估算？",
          answer: "实际收入取决于流量来源、广告质量、用户行为等本计算器无法获知的因素。",
        },
      ],
      relatedTools: [
        { name: "营收计算器", href: "/tools/revenue-calculator" },
        { name: "利润率计算器", href: "/tools/profit-margin-calculator" },
        { name: "百分比计算器", href: "/tools/percentage-calculator" },
        { name: "关键词密度检测", href: "/tools/keyword-density" },
      ],
      guide: {
        intro: {
          title: "什么是 AdSense 计算器？",
          paragraphs: [
            "AdSense 计算器根据你的流量和广告设置，估算网站通过 Google AdSense 可以获得多少收入。",
          ],
        },
        sections: [
          {
            title: "使用方法",
            paragraphs: [
              "输入每日页面浏览量、每页平均广告数、点击率和单次点击费用，每日、每月和每年估算会即时更新。",
            ],
            items: [
              "CTR 是广告展示被点击的百分比。",
              "CPC 是每次点击的平均收入。",
              "使用 AdSense 后台的真实数据可以获得更准确的估算。",
            ],
          },
          {
            title: "提示",
            paragraphs: [
              "尝试不同的输入值，了解流量和参与度如何影响收入。",
            ],
          },
        ],
      },
    },
  },
  "url-opener": {
    home: {
      name: "URL 批量打开器",
      description: "同时在新标签页中打开多个网址。",
      category: "营销",
      icon: "🔗",
    },
    tool: {
      metadata: {
        title: "URL 批量打开器",
        description: "同时在新浏览器标签页中打开多个网址",
        category: "营销",
      },
      keywords: [
        "url 批量打开",
        "批量打开网址",
        "同时打开多个链接",
        "多链接打开器",
        "网址批量打开",
        "链接批量打开",
      ],
      labels: {
        urls: "网址（每行一个或用逗号分隔）",
      },
      placeholders: {
        urls: "https://example.com\nhttps://example.com/about",
      },
      buttons: {
        open: "打开全部网址",
        clear: "清空",
      },
      messages: {
        empty: "请至少输入一个网址。",
        popupBlocked: "浏览器阻止了部分弹窗。请允许本站的弹窗后再试。",
      },
      status: {
        pending: "等待中",
        opened: "已打开",
        blocked: "被阻止",
      },
      faqs: [
        {
          question: "为什么浏览器会阻止新标签页？",
          answer: "浏览器会阻止非用户操作触发的弹窗。出现这种情况时，请在浏览器设置中允许本站弹窗后重试。",
        },
        {
          question: "可以输入不带 http:// 的网址吗？",
          answer: "可以。工具会自动为不含协议的网址添加 https://。",
        },
        {
          question: "一次可以打开多少个网址？",
          answer: "数量不限，但超大列表可能受到浏览器限制。",
        },
      ],
      relatedTools: [
        { name: "URL 短链接生成", href: "/tools/url-shortener" },
        { name: "URL Slug 生成器", href: "/tools/url-slug-generator" },
        { name: "关键词排名查询", href: "/tools/keyword-position" },
        { name: "域名 Whois 查询", href: "/tools/whois-lookup" },
      ],
      guide: {
        intro: {
          title: "什么是 URL 批量打开器？",
          paragraphs: [
            "URL 批量打开器可以同时在多个新标签页中打开链接，免去逐个复制粘贴的麻烦。",
          ],
        },
        sections: [
          {
            title: "使用方法",
            paragraphs: [
              "粘贴网址列表（每行一个或用逗号分隔），然后点击打开全部网址，每个网址会在新标签页中打开。",
            ],
            items: [
              "重复网址会自动去除。",
              "如果浏览器阻止标签页，请允许本站弹窗。",
            ],
          },
          {
            title: "提示",
            paragraphs: [
              "可以用它快速检查网站多个页面、批量打开参考资料或快速测试链接。",
            ],
          },
        ],
      },
    },
  },
  "html-viewer": {
    home: {
      name: "HTML 查看器",
      description: "实时查看和预览 HTML 代码。",
      category: "开发者",
      icon: "🖥️",
    },
    tool: {
      metadata: {
        title: "HTML 查看器",
        description: "实时查看和预览 HTML 代码",
        category: "开发者",
      },
      keywords: [
        "html 查看器",
        "html 预览",
        "html 渲染",
        "在线 html 查看",
        "html 代码预览",
        "预览 html",
        "html 沙盒",
      ],
      labels: {
        html: "HTML 代码",
      },
      tabs: {
        preview: "预览",
        source: "源码",
      },
      buttons: {
        clear: "清空",
        copy: "复制 HTML",
      },
      faqs: [
        {
          question: "预览会执行脚本吗？",
          answer: "预览在沙盒 iframe 中渲染，出于安全不会执行脚本。静态 HTML、CSS 和内联样式均可正常显示。",
        },
        {
          question: "我的 HTML 会被发送到别处吗？",
          answer: "不会。一切都在浏览器中运行，你的代码不会离开设备。",
        },
        {
          question: "可以复制渲染结果吗？",
          answer: "使用源码标签页复制 HTML 代码，使用预览查看视觉效果。",
        },
      ],
      relatedTools: [
        { name: "Markdown 预览", href: "/tools/markdown-preview" },
        { name: "HTML 压缩", href: "/tools/html-minifier" },
        { name: "HTML 实体编码", href: "/tools/html-entity-encoder" },
        { name: "HTML 转图片", href: "/tools/html-to-image" },
      ],
      guide: {
        intro: {
          title: "什么是 HTML 查看器？",
          paragraphs: [
            "HTML 查看器实时渲染你的 HTML 代码，让你在编辑的同时看到视觉效果。",
          ],
        },
        sections: [
          {
            title: "使用方法",
            paragraphs: [
              "在左侧编辑器中输入或粘贴 HTML，右侧预览会自动更新。可在预览和源码标签页之间切换查看渲染结果或代码。",
            ],
            items: [
              "预览支持 HTML、CSS 和内联样式。",
              "出于安全，外部资源会被阻止。",
            ],
          },
          {
            title: "提示",
            paragraphs: [
              "适合快速原型设计、调试布局问题或检查邮件模板效果。",
            ],
          },
        ],
      },
    },
  },
  "mobile-friendly-test": {
    home: {
      name: "移动端友好测试",
      description: "检查你的网站是否适配移动设备。",
      category: "营销",
      icon: "📱",
    },
    tool: {
      metadata: {
        title: "移动端友好测试",
        description: "检查你的网站是否针对移动设备进行了优化",
        category: "营销",
      },
      keywords: [
        "移动端友好测试",
        "移动适配检测",
        "响应式测试",
        "移动端可用性",
        "移动端 seo",
        "移动友好检测",
        "响应式检测",
      ],
      labels: {
        url: "页面地址",
        score: "移动友好度评分",
        pass: "通过",
        fail: "未通过",
      },
      placeholders: {
        url: "https://example.com",
      },
      buttons: {
        check: "检测网址",
        checking: "检测中...",
      },
      messages: {
        empty: "请输入要检测的网址。",
        fetchFailed: "无法获取该页面。网站可能阻止了自动请求，或网址无效。",
        viewportPass: "页面包含 device-width 的 viewport meta 标签。",
        viewportFail: "页面缺少正确的 viewport meta 标签。",
        titlePass: "页面包含 title 标签。",
        titleFail: "页面没有 title 标签。",
        descriptionPass: "页面包含 meta description。",
        descriptionFail: "页面没有 meta description。",
        responsivePass: "页面使用了响应式 CSS（检测到媒体查询）。",
        responsiveFail: "未检测到媒体查询——布局可能无法适配小屏幕。",
        fontSizePass: "检测到可读的字体大小（12px 以上）。",
        fontSizeFail: "字体大小未明确设置，移动端文本可能难以阅读。",
        disclaimer: "这是基于页面 HTML 的轻量启发式检查。完整分析请使用 Google 官方 Mobile-Friendly Test。",
      },
      faqs: [
        {
          question: "移动端友好测试是如何工作的？",
          answer:
            "工具获取页面 HTML 并检查常见移动端优化项：viewport 标签、title、description、响应式 CSS 和字体大小。",
        },
        {
          question: "什么是 viewport meta 标签？",
          answer:
            "类似 width=device-width 的 viewport 标签告诉移动浏览器按设备宽度渲染页面，而不是桌面宽度。",
        },
        {
          question: "它与 Google 的测试一样准确吗？",
          answer:
            "不一样。这是快速启发式检查。Google 的 Mobile-Friendly Test 会渲染页面并提供更完整的评估。",
        },
      ],
      relatedTools: [
        { name: "Meta 标签分析器", href: "/tools/meta-tags-analyzer" },
        { name: "HTML 查看器", href: "/tools/html-viewer" },
        { name: "XML 站点地图生成器", href: "/tools/xml-sitemap" },
        { name: "网页图片优化", href: "/tools/image-web-optimizer" },
      ],
      guide: {
        intro: {
          title: "什么是移动端友好测试？",
          paragraphs: [
            "移动端友好测试检查你的网站在手机和平板上的表现，这对用户体验和 Google 移动优先索引都很重要。",
          ],
        },
        sections: [
          {
            title: "使用方法",
            paragraphs: [
              "输入要检测的页面地址并点击检测网址。工具会获取页面并给出评分及检查项结果。",
            ],
            items: [
              "评分基于下方的检查项。",
              "修复未通过的检查项以改善移动端体验。",
            ],
          },
          {
            title: "提示",
            paragraphs: [
              "先从 viewport meta 标签开始——这是移动端渲染最重要的单个修复项。",
            ],
          },
        ],
      },
    },
  },
};
