"use client"

import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export default function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale()

  // Check if the current path starts with a locale
  const isLocalePath = /^\/[a-z]{2}($|\/)/.test(pathname)
  const t = useTranslations(isLocalePath ? "common.languageSwitcher" : "")

  const switchLanguage = (newLocale: string) => {
    // Save the selected language in a cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`

    // Navigate to the same page but with the new locale
    const newPath = isLocalePath ? pathname.replace(/^\/[a-z]{2}/, `/${newLocale}`) : `/${newLocale}${pathname}`
    router.push(newPath)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => switchLanguage("en")} className={locale === "en" ? "bg-muted" : ""}>
          {isLocalePath ? t("en") : "English"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLanguage("fr")} className={locale === "fr" ? "bg-muted" : ""}>
          {isLocalePath ? t("fr") : "French"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

