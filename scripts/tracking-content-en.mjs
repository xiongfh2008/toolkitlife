export default {
  "what-is-my-browser": {
    home: {
      name: "What Is My Browser",
      description: "Detect your browser, OS and IP address.",
      category: "Tracking",
      icon: "🌐",
    },
    tool: {
      metadata: {
        title: "What Is My Browser",
        description: "Detect your browser name, version, OS and IP address",
        category: "Tracking",
      },
      keywords: [
        "what is my browser",
        "browser detector",
        "my browser version",
        "detect browser",
        "user agent",
        "browser os",
        "what browser am I using",
        "browser info",
      ],
      labels: {
        browser: "Browser",
        version: "Version",
        engine: "Engine",
        os: "Operating System",
        screen: "Screen Resolution",
        colorDepth: "Color Depth",
        language: "Language",
        languages: "Languages",
        timezone: "Timezone",
        ipAddress: "IP Address",
        cookies: "Cookies Enabled",
        online: "Online",
        userAgent: "User Agent String",
      },
      buttons: {
        refresh: "Refresh",
        copy: "Copy",
      },
      messages: {
        ipFailed: "Unable to detect",
        yes: "Yes",
        no: "No",
      },
      faqs: [
        {
          question: "How does this detect my browser?",
          answer: "The tool reads your browser's User-Agent string and other JavaScript APIs available to any website.",
        },
        {
          question: "Is my data sent anywhere?",
          answer: "No. Everything is detected locally in your browser, except your public IP which is requested from a public IP service.",
        },
        {
          question: "Why does my browser matter for websites?",
          answer: "Websites use browser detection to deliver compatible features, and your User-Agent helps developers test and debug their sites.",
        },
      ],
      relatedTools: [
        { name: "IP Address Lookup", href: "/tools/ip-lookup" },
        { name: "GEO IP Locator", href: "/tools/geo-ip-locator" },
        { name: "User Agent Parser", href: "/tools/typing-speed-test" },
        { name: "IP Finder", href: "/tools/ip-lookup" },
      ],
      guide: {
        intro: {
          title: "What Is My Browser?",
          paragraphs: [
            "This tool detects your browser name, version, rendering engine, operating system, screen resolution, language, timezone and public IP address.",
          ],
        },
        sections: [
          {
            title: "How to use it",
            paragraphs: [
              "Open the page and the information is detected automatically. Click Refresh to re-detect after changing settings.",
            ],
            items: [
              "The User-Agent string is shown at the bottom for developers.",
              "Copy the User-Agent to share it when reporting a bug.",
            ],
          },
          {
            title: "Tips",
            paragraphs: [
              "If you use a VPN, the IP shown may belong to your VPN provider instead of your real location.",
            ],
          },
        ],
      },
    },
  },
  "geo-ip-locator": {
    home: {
      name: "GEO IP Locator",
      description: "Find the geographic location of any IP address.",
      category: "Tracking",
      icon: "📍",
    },
    tool: {
      metadata: {
        title: "GEO IP Locator",
        description: "Find the geographic location, ISP and organization of any IP address",
        category: "Tracking",
      },
      keywords: [
        "geo ip locator",
        "ip location",
        "ip geolocation",
        "find ip location",
        "ip address location",
        "ip tracker",
        "geolocate ip",
        "ip to location",
      ],
      labels: {
        ip: "IP Address",
        continent: "Continent",
        country: "Country",
        region: "Region",
        city: "City",
        coordinates: "Coordinates",
        isp: "ISP",
        organization: "Organization",
        asn: "ASN",
        timezone: "Timezone",
        type: "IP Type",
        myIp: "Use my IP address",
      },
      buttons: {
        lookUp: "Look Up",
        loading: "Looking up...",
      },
      messages: {
        errorInvalid: "Please enter a valid IPv4 address.",
        errorNotFound: "No location data found for this IP.",
        errorGeneric: "Could not look up this IP. Please try again.",
      },
      faqs: [
        {
          question: "How accurate is IP geolocation?",
          answer: "IP geolocation typically identifies the city or region level. It is not exact to a physical address.",
        },
        {
          question: "Can IP location be wrong?",
          answer: "Yes. VPNs, proxies and mobile carriers can make an IP appear in a different location than you actually are.",
        },
        {
          question: "What is an ASN?",
          answer: "An Autonomous System Number identifies the network that owns the IP block, usually an ISP or hosting company.",
        },
      ],
      relatedTools: [
        { name: "IP Address Lookup", href: "/tools/ip-lookup" },
        { name: "Whois Lookup", href: "/tools/whois-lookup" },
        { name: "Domain Hosting Checker", href: "/tools/domain-hosting" },
        { name: "What Is My Browser", href: "/tools/what-is-my-browser" },
      ],
      guide: {
        intro: {
          title: "What is a GEO IP Locator?",
          paragraphs: [
            "A GEO IP locator finds the approximate geographic location of any IP address, along with the ISP and network information.",
          ],
        },
        sections: [
          {
            title: "How to use it",
            paragraphs: [
              "Enter an IPv4 address and click Look Up, or click 'Use my IP address' to look up your own public IP.",
            ],
            items: [
              "The result shows continent, country, city and coordinates.",
              "ISP and ASN identify the network that owns the IP.",
            ],
          },
          {
            title: "Tips",
            paragraphs: [
              "Use it to check where your visitors or traffic come from, or to verify a suspicious IP address.",
            ],
          },
        ],
      },
    },
  },
  "redirect-checker": {
    home: {
      name: "Redirect Checker",
      description: "Check URL redirects and final destination.",
      category: "Tracking",
      icon: "🔀",
    },
    tool: {
      metadata: {
        title: "Redirect Checker",
        description: "Check where a URL redirects to and its final status code",
        category: "Tracking",
      },
      keywords: [
        "redirect checker",
        "url redirect checker",
        "301 redirect check",
        "redirect chain",
        "link redirect",
        "url redirect test",
        "check redirects",
        "redirect tracker",
      ],
      labels: {
        url: "URL",
        originalUrl: "Original URL",
        finalUrl: "Final URL",
        statusCode: "Status Code",
        hasRedirect: "This URL redirects to another address",
        noRedirect: "This URL loads directly",
      },
      buttons: {
        check: "Check",
        checking: "Checking...",
      },
      messages: {
        empty: "Enter a URL to check.",
        fetchFailed: "Could not fetch the URL. The site may block automated requests or the URL may be invalid.",
        disclaimer:
          "This is a lightweight check performed through a proxy. For full redirect chains, use a server-side tool.",
      },
      faqs: [
        {
          question: "What is a 301 redirect?",
          answer: "A 301 redirect permanently points an old URL to a new one, telling browsers and search engines the page has moved.",
        },
        {
          question: "Why should I check redirects?",
          answer: "Broken or long redirect chains slow down your site and can hurt SEO. Checking helps you keep links healthy.",
        },
        {
          question: "What status codes matter?",
          answer: "200 means OK, 301/302 mean redirected, 404 means not found, and 403/500 indicate errors.",
        },
      ],
      relatedTools: [
        { name: "Is It Down", href: "/tools/is-it-down" },
        { name: "URL Opener", href: "/tools/url-opener" },
        { name: "URL Slug Generator", href: "/tools/url-slug-generator" },
        { name: "Mobile Friendly Test", href: "/tools/mobile-friendly-test" },
      ],
      guide: {
        intro: {
          title: "What is a Redirect Checker?",
          paragraphs: [
            "A redirect checker tests a URL to see if it redirects to another address and shows the final destination and status code.",
          ],
        },
        sections: [
          {
            title: "How to use it",
            paragraphs: [
              "Enter the URL and click Check. The tool fetches the URL through a proxy and compares the final URL with the original.",
            ],
            items: [
              "If the final URL differs, the page is being redirected.",
              "The status code tells you if the page is healthy (200) or moved (301/302).",
            ],
          },
          {
            title: "Tips",
            paragraphs: [
              "After moving pages, always set up 301 redirects from old URLs to preserve SEO value.",
            ],
          },
        ],
      },
    },
  },
  "is-it-down": {
    home: {
      name: "Is It Down",
      description: "Check if a website is down or reachable.",
      category: "Tracking",
      icon: "🛡️",
    },
    tool: {
      metadata: {
        title: "Is It Down",
        description: "Check if a website is down for everyone or just you",
        category: "Tracking",
      },
      keywords: [
        "is it down",
        "website down checker",
        "is website down",
        "site status",
        "uptime check",
        "website status checker",
        "is site down",
        "down detector",
      ],
      labels: {
        url: "URL",
        status: "Status Code",
        responseTime: "Response Time",
      },
      buttons: {
        check: "Check",
        checking: "Checking...",
      },
      messages: {
        empty: "Enter a URL to check.",
        online: "It's up!",
        offline: "It might be down",
        disclaimer:
          "This checks reachability through a proxy. A site may still be down for you due to local network issues, or up for you while down elsewhere.",
      },
      faqs: [
        {
          question: "How does this check if a site is down?",
          answer: "The tool requests the website through a public proxy. If the request succeeds, the site is reachable; if it fails, the site may be down.",
        },
        {
          question: "Why does it say 'might be down'?",
          answer: "Some sites block automated requests, and regional outages can differ. The result is a strong signal, not a guarantee.",
        },
        {
          question: "What should I do if my site is down?",
          answer: "Check your hosting provider's status page, look for DNS changes, and contact support if it stays down.",
        },
      ],
      relatedTools: [
        { name: "Redirect Checker", href: "/tools/redirect-checker" },
        { name: "Domain Hosting Checker", href: "/tools/domain-hosting" },
        { name: "Whois Lookup", href: "/tools/whois-lookup" },
        { name: "Uptime Tracker", href: "/tools/typing-speed-test" },
      ],
      guide: {
        intro: {
          title: "What is Is It Down?",
          paragraphs: [
            "Is It Down checks whether a website is reachable right now, helping you tell if an outage affects everyone or just you.",
          ],
        },
        sections: [
          {
            title: "How to use it",
            paragraphs: [
              "Enter the URL and click Check. The tool requests the site through a proxy and shows whether it responded.",
            ],
            items: [
              "A successful response means the site is up.",
              "The status code and response time are shown for reference.",
            ],
          },
          {
            title: "Tips",
            paragraphs: [
              "If a site is down for you but up here, the problem is likely on your side: your internet, DNS cache or local firewall.",
            ],
          },
        ],
      },
    },
  },
  "domain-age": {
    home: {
      name: "Domain Age Checker",
      description: "Find out how old any domain is.",
      category: "Domain",
      icon: "⏳",
    },
    tool: {
      metadata: {
        title: "Domain Age Checker",
        description: "Find out the age and registration date of any domain",
        category: "Domain",
      },
      keywords: [
        "domain age",
        "domain age checker",
        "domain age check",
        "check domain age",
        "domain registration date",
        "how old is a domain",
        "domain age tool",
        "whois age",
      ],
      labels: {
        domain: "Domain",
        registrationDate: "Registration Date",
        expiryDate: "Expiry Date",
        updatedDate: "Last Updated",
        status: "Status",
        years: "{n} years",
        months: "{n} months",
        days: "{n} days",
      },
      buttons: {
        check: "Check",
        checking: "Checking...",
      },
      messages: {
        errorEmpty: "Enter a domain name.",
        errorInvalid: "Please enter a valid domain name.",
        errorNotFound: "No registration data found for this domain.",
        errorGeneric: "Could not check this domain. Please try again.",
        noRegistration: "No registration date was found for this domain.",
      },
      faqs: [
        {
          question: "Why does domain age matter?",
          answer: "Older domains often appear more trustworthy to search engines and users, and expired-age domains may carry established history.",
        },
        {
          question: "Where does the data come from?",
          answer: "The tool reads the public RDAP registry data, the modern standard that replaced traditional WHOIS.",
        },
        {
          question: "Can the registration date be hidden?",
          answer: "Most registries publish registration dates publicly through RDAP. Privacy protection usually hides contact details, not dates.",
        },
      ],
      relatedTools: [
        { name: "Whois Lookup", href: "/tools/whois-lookup" },
        { name: "Domain Hosting Checker", href: "/tools/domain-hosting" },
        { name: "GEO IP Locator", href: "/tools/geo-ip-locator" },
        { name: "IP Address Lookup", href: "/tools/ip-lookup" },
      ],
      guide: {
        intro: {
          title: "What is a Domain Age Checker?",
          paragraphs: [
            "A domain age checker shows when a domain was registered and calculates how old it is in years, months and days.",
          ],
        },
        sections: [
          {
            title: "How to use it",
            paragraphs: [
              "Enter a domain name (without http:// or www) and click Check. The registration, expiry and update dates are shown.",
            ],
            items: [
              "The age is calculated from the registration date.",
              "Expiry and update dates are shown when available.",
            ],
          },
          {
            title: "Tips",
            paragraphs: [
              "Use domain age when evaluating a site's history or deciding on a domain purchase.",
            ],
          },
        ],
      },
    },
  },
  "domain-hosting": {
    home: {
      name: "Domain Hosting Checker",
      description: "Find out where any domain is hosted.",
      category: "Domain",
      icon: "🏢",
    },
    tool: {
      metadata: {
        title: "Domain Hosting Checker",
        description: "Find out which hosting provider and network a domain uses",
        category: "Domain",
      },
      keywords: [
        "domain hosting checker",
        "who hosts a website",
        "find hosting provider",
        "check website hosting",
        "domain host lookup",
        "hosting checker",
        "where is a site hosted",
        "find web host",
      ],
      labels: {
        domain: "Domain",
        ipAddress: "IP Address",
        host: "Hosting Provider",
        organization: "Organization",
        asn: "ASN",
        country: "Country",
        city: "City",
      },
      buttons: {
        check: "Check",
        checking: "Checking...",
      },
      messages: {
        errorEmpty: "Enter a domain name.",
        errorInvalid: "Please enter a valid domain name.",
        errorNoARecord: "No A record was found for this domain. It may not be connected to a host yet.",
        errorGeneric: "Could not check this domain. Please try again.",
      },
      faqs: [
        {
          question: "How is hosting detected?",
          answer: "The domain's A record is resolved to an IP address, then the network owner of that IP is looked up — that reveals the hosting provider.",
        },
        {
          question: "What if the domain uses a CDN?",
          answer: "If a CDN is in front, the IP belongs to the CDN (like Cloudflare) rather than the origin server. The tool will show the CDN as the host.",
        },
        {
          question: "What is an ASN?",
          answer: "An Autonomous System Number is a unique identifier for a network, typically an ISP, hosting provider or CDN.",
        },
      ],
      relatedTools: [
        { name: "Whois Lookup", href: "/tools/whois-lookup" },
        { name: "Domain Age Checker", href: "/tools/domain-age" },
        { name: "IP Address Lookup", href: "/tools/ip-lookup" },
        { name: "Is It Down", href: "/tools/is-it-down" },
      ],
      guide: {
        intro: {
          title: "What is a Domain Hosting Checker?",
          paragraphs: [
            "A domain hosting checker reveals which hosting provider or network a website is running on by resolving its IP address and looking up the network owner.",
          ],
        },
        sections: [
          {
            title: "How to use it",
            paragraphs: [
              "Enter a domain and click Check. The tool resolves the A record, then looks up the ISP and organization of the IP.",
            ],
            items: [
              "The result shows the IP address and its network owner.",
              "ASN identifies the hosting provider or CDN.",
            ],
          },
          {
            title: "Tips",
            paragraphs: [
              "Knowing a competitor's hosting provider can help you compare performance options.",
            ],
          },
        ],
      },
    },
  },
};
