export interface BlogPostMeta {
  slug: string;
  author: string;
  datePublished: string;
  dateModified: string;
  tags: string[];
  relatedArticles?: { title: string; href: string }[];
}

export const blogPostsMeta: BlogPostMeta[] = [
  {
    slug: "how-to-build-a-resume",
    author: "ToolkitLife Team",
    datePublished: "2026-03-06",
    dateModified: "2026-03-06",
    tags: ["Resume", "Career", "Job Search", "Productivity"],
    relatedArticles: [
      { title: "How to Convert PDF to Word", href: "/blog/how-to-convert-pdf-to-word" },
    ],
  },
  {
    slug: "how-to-compress-video",
    author: "ToolkitLife Team",
    datePublished: "2026-03-06",
    dateModified: "2026-03-06",
    tags: ["Video", "Compression", "Media", "Productivity"],
    relatedArticles: [
      { title: "How to Convert Video to GIF", href: "/blog/how-to-convert-video-to-gif" },
    ],
  },
  {
    slug: "how-to-convert-pdf-to-word",
    author: "ToolkitLife Team",
    datePublished: "2026-03-06",
    dateModified: "2026-03-06",
    tags: ["PDF", "Word", "Converter", "Productivity"],
    relatedArticles: [
      { title: "How to Create a Digital Signature", href: "/blog/how-to-create-digital-signature" },
    ],
  },
  {
    slug: "how-to-convert-text-to-speech",
    author: "ToolkitLife Team",
    datePublished: "2026-03-07",
    dateModified: "2026-03-07",
    tags: ["Text to Speech", "Accessibility", "Productivity", "TTS"],
    relatedArticles: [
      { title: "How to Extract Text from Images", href: "/blog/how-to-extract-text-from-images" },
    ],
  },
  {
    slug: "how-to-convert-video-to-gif",
    author: "ToolkitLife Team",
    datePublished: "2026-03-07",
    dateModified: "2026-03-07",
    tags: ["GIF", "Video", "Converter", "Social Media"],
    relatedArticles: [
      { title: "How to Compress Video", href: "/blog/how-to-compress-video" },
    ],
  },
  {
    slug: "how-to-create-digital-signature",
    author: "ToolkitLife Team",
    datePublished: "2026-03-07",
    dateModified: "2026-03-07",
    tags: ["Signature", "Business", "PDF", "Productivity"],
    relatedArticles: [
      { title: "How to Convert PDF to Word", href: "/blog/how-to-convert-pdf-to-word" },
    ],
  },
  {
    slug: "how-to-extract-text-from-images",
    author: "ToolkitLife Team",
    datePublished: "2026-03-06",
    dateModified: "2026-03-06",
    tags: ["OCR", "Productivity", "Text Extraction", "Images"],
    relatedArticles: [
      { title: "How to Convert PDF to Word", href: "/blog/how-to-convert-pdf-to-word" },
    ],
  },
  {
    slug: "how-to-make-memes",
    author: "ToolkitLife Team",
    datePublished: "2026-03-07",
    dateModified: "2026-03-07",
    tags: ["Memes", "Social Media", "Image Editing", "Humor"],
    relatedArticles: [
      { title: "How to Upscale Images", href: "/blog/how-to-upscale-images" },
    ],
  },
  {
    slug: "how-to-record-your-screen",
    author: "ToolkitLife Team",
    datePublished: "2026-03-07",
    dateModified: "2026-03-07",
    tags: ["Screen Recording", "Productivity", "Video", "Tutorial"],
    relatedArticles: [
      { title: "How to Compress Video", href: "/blog/how-to-compress-video" },
    ],
  },
  {
    slug: "how-to-upscale-images",
    author: "ToolkitLife Team",
    datePublished: "2026-03-06",
    dateModified: "2026-03-06",
    tags: ["Image", "Design", "Upscaling", "Photo Editing"],
    relatedArticles: [
      { title: "How to Make Memes", href: "/blog/how-to-make-memes" },
    ],
  },
];

export function getPostMeta(slug: string): BlogPostMeta {
  const post = blogPostsMeta.find((p) => p.slug === slug);
  if (!post) throw new Error(`Blog post meta not found for slug: ${slug}`);
  return post;
}
