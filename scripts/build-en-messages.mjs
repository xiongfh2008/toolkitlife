import fs from "fs";
import path from "path";

const tools = JSON.parse(fs.readFileSync(path.join(process.cwd(), "scripts/tools-en.json"), "utf-8"));

const messages = {
  metadata: {
    title: "ToolkitLife - Free Developer & Design Tools | No Signup Required",
    description: "17 free browser-based tools for developers and designers. QR codes, watermark removal, JSON formatting, password generation, color palettes, and more. No signup, no data stored.",
    keywords: [
      "free online tools",
      "developer tools",
      "design tools",
      "QR code generator",
      "watermark remover",
      "JSON formatter",
      "password generator",
      "color palette generator",
      "base64 encoder",
      "regex tester",
      "no signup tools",
    ],
    ogTitle: "ToolkitLife - Free Developer & Design Tools",
    ogDescription: "17 free browser-based tools. No signup, no data stored. Everything runs locally.",
    twitterTitle: "ToolkitLife - Free Developer & Design Tools",
    twitterDescription: "17 free browser-based tools. No signup required.",
  },
  nav: {
    home: "ToolkitLife",
    allTools: "All Tools",
  },
  footer: {
    brand: "ToolkitLife",
    privacy: "Privacy",
    terms: "Terms",
    copyright: "Free tools, no signup, no data stored.",
  },
  toolLayout: {
    breadcrumbHome: "Home",
    faqTitle: "Frequently Asked Questions",
    relatedToolsTitle: "Related Tools",
    keywordsSuffix: "free online {keywords}. No signup required. Works in your browser.",
  },
  home: {
    title: "ToolkitLife",
    subtitle: "Free online tools & calculators, right in your browser.",
    noSignup: "No signup. No data stored. Ever.",
    searchPlaceholder: "Search tools...",
    noResults: "No tools found. Try a different search or category.",
    categories: {
      All: "All",
      Developer: "Developer",
      Design: "Design",
      Text: "Text",
      Utility: "Utility",
      Finance: "Finance",
      Health: "Health",
      Math: "Math",
    },
    tools,
  },
};

const outDir = path.join(process.cwd(), "messages");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "en.json"), JSON.stringify(messages, null, 2));
console.log("Created messages/en.json");
