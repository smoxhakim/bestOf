import { notFound } from "next/navigation"

export const defaultLocale = 'en'
export const locales = ['en', 'fr'] as const

export type Locale = (typeof locales)[number]

export function getLocale(pathname: string) {
  const segmentedPath = pathname.split('/')
  const locale = segmentedPath[1]
  return locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale
}

export async function getMessages(locale: string) {
  try {
    return (await import(`../messages/${locale}.json`)).default
  } catch (error) {
    notFound()
  }
}