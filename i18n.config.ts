export const locales = ["en", "fr"] as const
export const defaultLocale = "en" as const

import { getRequestConfig } from "next-intl/server"

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}))

