import Link from "next/link"
import { Monitor } from "lucide-react"
import { useTranslations } from "next-intl"

const Footer = () => {
  const t = useTranslations("common.footer")

  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Monitor className="h-6 w-6" />
              <span className="font-bold text-xl">TechSolutions</span>
            </Link>
            <p className="text-muted-foreground">
              Empowering businesses with cutting-edge technology solutions and professional development services.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("products")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products/computers" className="text-muted-foreground hover:text-foreground">
                  {t("computers")}
                </Link>
              </li>
              <li>
                <Link href="/products/laptops" className="text-muted-foreground hover:text-foreground">
                  {t("laptops")}
                </Link>
              </li>
              <li>
                <Link href="/products/accessories" className="text-muted-foreground hover:text-foreground">
                  {t("accessories")}
                </Link>
              </li>
              <li>
                <Link href="/products/networking" className="text-muted-foreground hover:text-foreground">
                  {t("networking")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("services")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/web-development" className="text-muted-foreground hover:text-foreground">
                  {t("webDevelopment")}
                </Link>
              </li>
              <li>
                <Link href="/services/app-development" className="text-muted-foreground hover:text-foreground">
                  {t("appDevelopment")}
                </Link>
              </li>
              <li>
                <Link href="/services/consulting" className="text-muted-foreground hover:text-foreground">
                  {t("itConsulting")}
                </Link>
              </li>
              <li>
                <Link href="/services/support" className="text-muted-foreground hover:text-foreground">
                  {t("technicalSupport")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("company")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  {t("contact")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                  {t("blog")}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                  {t("careers")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground">{t("copyright")}</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                {t("privacyPolicy")}
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                {t("termsOfService")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

