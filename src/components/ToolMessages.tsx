import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

/**
 * Per-slug messages provider for tool pages. Ships only the current tool's
 * detail bundle (plus the tiny `toolLayout` and `common` namespaces used by
 * ToolLayout/CopyButton), instead of all 299 tool bundles (~1MB) that the
 * [locale] layout excludes.
 *
 * Note: nested NextIntlClientProvider messages replace (not merge) the outer
 * ones, so every namespace consumed inside this subtree must be listed here.
 */
export default async function ToolMessages({
  slug,
  locale,
  children,
}: {
  slug: string;
  locale: string;
  children: React.ReactNode;
}) {
  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  return (
    <NextIntlClientProvider
      messages={{
        common: messages.common,
        tools: { [slug]: messages.tools?.[slug] },
        toolLayout: messages.toolLayout,
      }}
      locale={locale}
    >
      {children}
    </NextIntlClientProvider>
  );
}
