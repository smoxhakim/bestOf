export const locales = ["en", "fr"] as const;
export const defaultLocale = "en" as const;

import { getRequestConfig } from "next-intl/server";

export function getLocale(pathname: string) {
  const segmentedPath = pathname.split('/');
  const locale = segmentedPath[1];
  return locales.includes(locale as any) ? locale : defaultLocale;
}

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}));