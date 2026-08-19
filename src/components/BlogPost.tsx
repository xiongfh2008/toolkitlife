import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import BlogLayout from "./BlogLayout";

/**
 * Server wrapper for blog posts. Ships only the `blogLayout` namespace used by
 * the client BlogLayout component instead of the full message file.
 *
 * Must be used from each static post page — a `blog/[slug]/layout.tsx` does NOT
 * wrap the sibling static post directories.
 */
export default async function BlogPost({
  locale,
  post,
  children,
}: {
  locale: string;
  post: React.ComponentProps<typeof BlogLayout>["post"];
  children: React.ReactNode;
}) {
  const messages = await getMessages({ locale });
  return (
    <NextIntlClientProvider
      messages={{ blogLayout: messages.blogLayout }}
      locale={locale}
    >
      <BlogLayout post={post}>{children}</BlogLayout>
    </NextIntlClientProvider>
  );
}
