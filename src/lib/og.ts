export const OG_BASE = "https://toolkitlife.com";

/**
 * Builds the dynamic Open Graph image URL for a given page.
 * Keep the title short: only the first 80 ASCII chars are rendered.
 */
export function ogImageUrl(opts: {
  title?: string;
  type?: "tool" | "blog" | "home";
}): string {
  const params = new URLSearchParams();
  if (opts.title) params.set("title", opts.title);
  params.set("type", opts.type ?? "tool");
  return `${OG_BASE}/og?${params.toString()}`;
}
