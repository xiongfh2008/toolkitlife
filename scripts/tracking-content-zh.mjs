export default {
  "what-is-my-browser": {
    home: {
      name: "浏览器信息检测",
      description: "检测你的浏览器、操作系统和 IP 地址。",
      category: "Tracking",
      icon: "🌐",
    },
    tool: {
      metadata: {
        title: "浏览器信息检测",
        description: "检测你的浏览器名称、版本、操作系统和 IP 地址",
        category: "Tracking",
      },
      keywords: [
        "我的浏览器",
        "浏览器检测",
        "浏览器版本",
        "检测浏览器",
        "user agent",
        "浏览器系统",
        "我在用什么浏览器",
      ],
      labels: {
        browser: "浏览器",
        version: "版本",
        engine: "内核",
        os: "操作系统",
        screen: "屏幕分辨率",
        colorDepth: "色彩深度",
        language: "语言",
        languages: "语言列表",
        timezone: "时区",
        ipAddress: "IP 地址",
        cookies: "Cookie 已启用",
        online: "在线",
        userAgent: "User Agent 字符串",
      },
      buttons: {
        refresh: "刷新",
        copy: "复制",
      },
      messages: {
        ipFailed: "无法检测",
        yes: "是",
        no: "否",
      },
      faqs: [
        {
          question: "它是如何检测我的浏览器的？",
          answer: "工具读取浏览器的 User-Agent 字符串以及任何网站都能获取的 JavaScript API。",
        },
        {
          question: "我的数据会被发送到别处吗？",
          answer: "不会。所有信息都在本地浏览器中检测，只有公网 IP 需要向公共 IP 服务请求。",
        },
        {
          question: "浏览器信息对网站有什么意义？",
          answer: "网站利用浏览器检测提供兼容功能，开发者通过 User-Agent 测试和调试站点。",
        },
      ],
      relatedTools: [
        { name: "IP 地址查询", href: "/tools/ip-lookup" },
        { name: "GEO IP 定位", href: "/tools/geo-ip-locator" },
        { name: "打字速度测试", href: "/tools/typing-speed-test" },
        { name: "IP 查询", href: "/tools/ip-lookup" },
      ],
      guide: {
        intro: {
          title: "什么是浏览器信息检测？",
          paragraphs: [
            "此工具检测你的浏览器名称、版本、渲染内核、操作系统、屏幕分辨率、语言、时区和公网 IP 地址。",
          ],
        },
        sections: [
          {
            title: "使用方法",
            paragraphs: [
              "打开页面即自动检测。更改设置后可点击刷新重新检测。",
            ],
            items: [
              "User-Agent 字符串显示在底部，供开发者使用。",
              "上报 bug 时可复制 User-Agent 一并提交。",
            ],
          },
          {
            title: "提示",
            paragraphs: [
              "如果使用 VPN，显示的 IP 可能属于 VPN 提供商而非你的真实位置。",
            ],
          },
        ],
      },
    },
  },
  "geo-ip-locator": {
    home: {
      name: "GEO IP 定位",
      description: "查找任意 IP 地址的地理位置。",
      category: "Tracking",
      icon: "📍",
    },
    tool: {
      metadata: {
        title: "GEO IP 定位",
        description: "查找任意 IP 地址的地理位置、ISP 和所属组织",
        category: "Tracking",
      },
      keywords: [
        "ip 定位",
        "ip 地理位置",
        "ip 归属地查询",
        "查询 ip 位置",
        "ip 地址定位",
        "ip 追踪",
        "ip 转位置",
      ],
      labels: {
        ip: "IP 地址",
        continent: "大洲",
        country: "国家",
        region: "地区",
        city: "城市",
        coordinates: "坐标",
        isp: "ISP",
        organization: "所属组织",
        asn: "ASN",
        timezone: "时区",
        type: "IP 类型",
        myIp: "使用我的 IP 地址",
      },
      buttons: {
        lookUp: "查询",
        loading: "查询中...",
      },
      messages: {
        errorInvalid: "请输入有效的 IPv4 地址。",
        errorNotFound: "未找到该 IP 的位置数据。",
        errorGeneric: "查询失败，请重试。",
      },
      faqs: [
        {
          question: "IP 地理定位有多准确？",
          answer: "IP 地理定位通常精确到城市或地区级别，不能精确到具体物理地址。",
        },
        {
          question: "IP 定位会出错吗？",
          answer: "会。VPN、代理和移动运营商可能让 IP 显示与实际不同的位置。",
        },
        {
          question: "什么是 ASN？",
          answer: "自治系统编号标识拥有该 IP 段的网络，通常是 ISP 或托管公司。",
        },
      ],
      relatedTools: [
        { name: "IP 地址查询", href: "/tools/ip-lookup" },
        { name: "Whois 查询", href: "/tools/whois-lookup" },
        { name: "域名托管检测", href: "/tools/domain-hosting" },
        { name: "浏览器信息检测", href: "/tools/what-is-my-browser" },
      ],
      guide: {
        intro: {
          title: "什么是 GEO IP 定位？",
          paragraphs: [
            "GEO IP 定位工具可查找任意 IP 地址的大致地理位置，以及 ISP 和网络信息。",
          ],
        },
        sections: [
          {
            title: "使用方法",
            paragraphs: [
              "输入 IPv4 地址并点击查询，或点击“使用我的 IP 地址”查询自己的公网 IP。",
            ],
            items: [
              "结果包含大洲、国家、城市和坐标。",
              "ISP 和 ASN 标识拥有该 IP 的网络。",
            ],
          },
          {
            title: "提示",
            paragraphs: [
              "可用于查看访客或流量的来源地区，或验证可疑的 IP 地址。",
            ],
          },
        ],
      },
    },
  },
  "redirect-checker": {
    home: {
      name: "重定向检测",
      description: "检查网址重定向及最终目标。",
      category: "Tracking",
      icon: "🔀",
    },
    tool: {
      metadata: {
        title: "重定向检测",
        description: "检查网址重定向到何处以及最终状态码",
        category: "Tracking",
      },
      keywords: [
        "重定向检测",
        "url 重定向检查",
        "301 重定向",
        "重定向链",
        "链接重定向",
        "重定向测试",
        "检查重定向",
      ],
      labels: {
        url: "网址",
        originalUrl: "原始网址",
        finalUrl: "最终网址",
        statusCode: "状态码",
        hasRedirect: "该网址会重定向到其他地址",
        noRedirect: "该网址直接加载",
      },
      buttons: {
        check: "检测",
        checking: "检测中...",
      },
      messages: {
        empty: "请输入要检测的网址。",
        fetchFailed: "无法获取该网址。网站可能阻止了自动请求，或网址无效。",
        disclaimer: "这是通过代理执行的轻量检测。完整重定向链请使用服务端工具。",
      },
      faqs: [
        {
          question: "什么是 301 重定向？",
          answer: "301 重定向将旧网址永久指向新网址，告知浏览器和搜索引擎页面已迁移。",
        },
        {
          question: "为什么要检查重定向？",
          answer: "失效或过长的重定向链会拖慢网站并损害 SEO。定期检查有助于保持链接健康。",
        },
        {
          question: "哪些状态码需要关注？",
          answer: "200 表示正常，301/302 表示重定向，404 表示未找到，403/500 表示错误。",
        },
      ],
      relatedTools: [
        { name: "网站宕机检测", href: "/tools/is-it-down" },
        { name: "URL 批量打开", href: "/tools/url-opener" },
        { name: "URL Slug 生成器", href: "/tools/url-slug-generator" },
        { name: "移动端友好测试", href: "/tools/mobile-friendly-test" },
      ],
      guide: {
        intro: {
          title: "什么是重定向检测？",
          paragraphs: [
            "重定向检测工具测试网址是否跳转到其他地址，并显示最终目标和状态码。",
          ],
        },
        sections: [
          {
            title: "使用方法",
            paragraphs: [
              "输入网址并点击检测。工具通过代理获取网址，并对比最终网址与原始网址。",
            ],
            items: [
              "如果最终网址不同，说明页面发生了重定向。",
              "状态码告诉你页面是否正常（200）或已迁移（301/302）。",
            ],
          },
          {
            title: "提示",
            paragraphs: [
              "页面迁移后务必为旧网址设置 301 重定向，以保留 SEO 权重。",
            ],
          },
        ],
      },
    },
  },
  "is-it-down": {
    home: {
      name: "网站宕机检测",
      description: "检查网站是否宕机或可访问。",
      category: "Tracking",
      icon: "🛡️",
    },
    tool: {
      metadata: {
        title: "网站宕机检测",
        description: "检查网站是对所有人宕机还是只有你无法访问",
        category: "Tracking",
      },
      keywords: [
        "网站宕机检测",
        "网站是否可访问",
        "网站状态检测",
        "网站可用性",
        "uptime 检测",
        "站点状态",
        "宕机检测",
      ],
      labels: {
        url: "网址",
        status: "状态码",
        responseTime: "响应时间",
      },
      buttons: {
        check: "检测",
        checking: "检测中...",
      },
      messages: {
        empty: "请输入要检测的网址。",
        online: "网站正常！",
        offline: "网站可能已宕机",
        disclaimer: "本工具通过代理检测可达性。网站可能因本地网络问题对你不可用，或在其他地区可用。",
      },
      faqs: [
        {
          question: "它是如何检测网站是否宕机的？",
          answer: "工具通过公共代理请求该网站。请求成功说明网站可达，失败则可能已宕机。",
        },
        {
          question: "为什么显示“可能已宕机”？",
          answer: "有些网站会阻止自动请求，且地区性故障存在差异。结果是强信号，但不保证绝对准确。",
        },
        {
          question: "我的网站宕机了该怎么办？",
          answer: "查看托管商的状态页面、检查 DNS 变更，若持续宕机请联系技术支持。",
        },
      ],
      relatedTools: [
        { name: "重定向检测", href: "/tools/redirect-checker" },
        { name: "域名托管检测", href: "/tools/domain-hosting" },
        { name: "Whois 查询", href: "/tools/whois-lookup" },
        { name: "打字速度测试", href: "/tools/typing-speed-test" },
      ],
      guide: {
        intro: {
          title: "什么是网站宕机检测？",
          paragraphs: [
            "网站宕机检测检查网站当前是否可访问，帮助你判断故障是影响所有人还是只有你。",
          ],
        },
        sections: [
          {
            title: "使用方法",
            paragraphs: [
              "输入网址并点击检测。工具通过代理请求网站并显示是否响应。",
            ],
            items: [
              "成功响应表示网站正常。",
              "状态码和响应时间供参考。",
            ],
          },
          {
            title: "提示",
            paragraphs: [
              "如果网站对你不可用但这里正常，问题很可能出在你这边：网络、DNS 缓存或本地防火墙。",
            ],
          },
        ],
      },
    },
  },
  "domain-age": {
    home: {
      name: "域名年龄查询",
      description: "查询任意域名的注册年龄。",
      category: "Domain",
      icon: "⏳",
    },
    tool: {
      metadata: {
        title: "域名年龄查询",
        description: "查询任意域名的注册日期和年龄",
        category: "Domain",
      },
      keywords: [
        "域名年龄",
        "域名年龄查询",
        "域名注册时间",
        "查询域名年龄",
        "域名注册日期",
        "域名多大",
        "whois 年龄",
      ],
      labels: {
        domain: "域名",
        registrationDate: "注册日期",
        expiryDate: "到期日期",
        updatedDate: "最近更新",
        status: "状态",
        years: "{n} 年",
        months: "{n} 个月",
        days: "{n} 天",
      },
      buttons: {
        check: "查询",
        checking: "查询中...",
      },
      messages: {
        errorEmpty: "请输入域名。",
        errorInvalid: "请输入有效的域名。",
        errorNotFound: "未找到该域名的注册数据。",
        errorGeneric: "查询失败，请重试。",
        noRegistration: "未找到该域名的注册日期。",
      },
      faqs: [
        {
          question: "域名年龄为什么重要？",
          answer: "较老的域名在搜索引擎和用户眼中往往更可信，老域名也可能带有既有的历史记录。",
        },
        {
          question: "数据从哪里来？",
          answer: "工具读取公共 RDAP 注册数据，这是取代传统 WHOIS 的现代标准。",
        },
        {
          question: "注册日期会被隐藏吗？",
          answer: "大多数注册局通过 RDAP 公开注册日期。隐私保护通常隐藏联系信息，而非日期。",
        },
      ],
      relatedTools: [
        { name: "Whois 查询", href: "/tools/whois-lookup" },
        { name: "域名托管检测", href: "/tools/domain-hosting" },
        { name: "GEO IP 定位", href: "/tools/geo-ip-locator" },
        { name: "IP 地址查询", href: "/tools/ip-lookup" },
      ],
      guide: {
        intro: {
          title: "什么是域名年龄查询？",
          paragraphs: [
            "域名年龄查询显示域名何时注册，并以年、月、天计算其年龄。",
          ],
        },
        sections: [
          {
            title: "使用方法",
            paragraphs: [
              "输入域名（不含 http:// 或 www）并点击查询。将显示注册、到期和更新日期。",
            ],
            items: [
              "年龄根据注册日期计算。",
              "有数据时同时显示到期和更新日期。",
            ],
          },
          {
            title: "提示",
            paragraphs: [
              "评估网站历史或决定购买域名时，可先查询域名年龄。",
            ],
          },
        ],
      },
    },
  },
  "domain-hosting": {
    home: {
      name: "域名托管检测",
      description: "查询任意域名托管在何处。",
      category: "Domain",
      icon: "🏢",
    },
    tool: {
      metadata: {
        title: "域名托管检测",
        description: "查询域名使用的托管服务商和网络",
        category: "Domain",
      },
      keywords: [
        "域名托管检测",
        "网站托管在哪",
        "查询托管商",
        "网站托管查询",
        "域名主机查询",
        "托管检测",
        "网站部署在哪",
      ],
      labels: {
        domain: "域名",
        ipAddress: "IP 地址",
        host: "托管服务商",
        organization: "所属组织",
        asn: "ASN",
        country: "国家",
        city: "城市",
      },
      buttons: {
        check: "查询",
        checking: "查询中...",
      },
      messages: {
        errorEmpty: "请输入域名。",
        errorInvalid: "请输入有效的域名。",
        errorNoARecord: "未找到该域名的 A 记录，可能尚未接入主机。",
        errorGeneric: "查询失败，请重试。",
      },
      faqs: [
        {
          question: "托管商是如何检测的？",
          answer: "将域名的 A 记录解析为 IP 地址，再查询该 IP 的网络所有者，即可得知托管商。",
        },
        {
          question: "如果域名用了 CDN 会怎样？",
          answer: "若启用了 CDN，IP 将属于 CDN（如 Cloudflare）而非源站，工具会显示 CDN 为托管方。",
        },
        {
          question: "什么是 ASN？",
          answer: "自治系统编号是网络的唯一标识，通常是 ISP、托管商或 CDN。",
        },
      ],
      relatedTools: [
        { name: "Whois 查询", href: "/tools/whois-lookup" },
        { name: "域名年龄查询", href: "/tools/domain-age" },
        { name: "IP 地址查询", href: "/tools/ip-lookup" },
        { name: "网站宕机检测", href: "/tools/is-it-down" },
      ],
      guide: {
        intro: {
          title: "什么是域名托管检测？",
          paragraphs: [
            "域名托管检测通过解析网站的 IP 地址并查询网络所有者，揭示网站运行在哪个托管服务商或网络上。",
          ],
        },
        sections: [
          {
            title: "使用方法",
            paragraphs: [
              "输入域名并点击查询。工具解析 A 记录，再查询该 IP 的 ISP 和所属组织。",
            ],
            items: [
              "结果显示 IP 地址及其网络所有者。",
              "ASN 标识托管商或 CDN。",
            ],
          },
          {
            title: "提示",
            paragraphs: [
              "了解竞品的托管商有助于对比性能方案。",
            ],
          },
        ],
      },
    },
  },
};
