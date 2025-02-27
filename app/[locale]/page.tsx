"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Button } from "@/components/ui/button"
import { Monitor, Code, ShoppingCart, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"

export default function Home() {
  const t = useTranslations("home")
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">{t("hero.title")}</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">{t("hero.description")}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="hover:bg-white/90 text-white hover:text-primary-foreground" size="lg" asChild>
                <Link href="/products">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {t("hero.browseProducts")}
                </Link>
              </Button>
              <Button
                className="bg-white text-primary-foreground hover:bg-primary/90"
                size="lg"
                variant="outline"
                asChild
              >
                <Link href="/services">
                  <Code className="mr-2 h-5 w-5" />
                  {t("hero.exploreServices")}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={ref} className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <Monitor className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t("features.premiumEquipment.title")}</h3>
              <p className="text-muted-foreground mb-4">{t("features.premiumEquipment.description")}</p>
              <Link href="/products" className="group inline-flex items-center text-primary hover:text-primary/90">
                {t("features.learnMore")}{" "}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm">
              <Code className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t("features.developmentServices.title")}</h3>
              <p className="text-muted-foreground mb-4">{t("features.developmentServices.description")}</p>
              <Link href="/services" className="group inline-flex items-center text-primary hover:text-primary/90">
                {t("features.learnMore")}{" "}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm">
              <Monitor className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t("features.itConsulting.title")}</h3>
              <p className="text-muted-foreground mb-4">{t("features.itConsulting.description")}</p>
              <Link
                href="/services/consulting"
                className="group inline-flex items-center text-primary hover:text-primary/90"
              >
                {t("features.learnMore")}{" "}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

