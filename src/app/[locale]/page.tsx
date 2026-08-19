import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import HomeClient from "./home-client";

/**
 * Server wrapper for the homepage. Only the `home` namespace (tool directory,
 * scenes, labels) is shipped to the client — the [locale] layout already
 * provides nav/footer/common — instead of serializing the whole message file.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  return (
    <NextIntlClientProvider messages={{ home: messages.home }} locale={locale}>
      <HomeClient />
    </NextIntlClientProvider>
  );
}
