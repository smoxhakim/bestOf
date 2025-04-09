// app/[locale]/page.tsx
"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Button } from "@/components/ui/button"
import { BackgroundLines } from "@/components/ui/background-lines"
import { Monitor, Code, ShoppingCart, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
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
      <section className="relative">
        <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 pt-20 sm:pt-32 pb-12 sm:pb-16">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 dark:from-foreground dark:to-foreground/70">BESTOF – La tech au service de votre savoir</h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto">Découvrez notre gamme complète de produits et services informatiques pour propulser votre entreprise vers le succès.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full max-w-md mx-auto">
                <Button 
                  className="relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary/90 dark:hover:bg-primary/80 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 group w-full sm:w-auto" 
                  size="lg" 
                  asChild
                >
                  <Link href="/products" className="flex items-center justify-center">
                    <ShoppingCart className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span>Parcourir les Produits</span>
                    <span className="absolute inset-0 w-full h-full bg-white/10 dark:bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                  </Link>
                </Button>
                <Button
                  className="relative overflow-hidden bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/90 dark:bg-secondary/80 dark:text-secondary-foreground dark:border-secondary/50 dark:hover:bg-secondary/70 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 group w-full sm:w-auto"
                  size="lg"
                  variant="outline"
                  asChild
                >
                  <Link href="/services" className="flex items-center justify-center">
                    <Code className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span>Explorer nos Services</span>
                    <span className="absolute inset-0 w-full h-full bg-primary/10 dark:bg-primary/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </BackgroundLines>
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
              <h3 className="text-xl font-semibold mb-2">Vente des matériels informatiques</h3>
              <p className="text-muted-foreground mb-4">Découvrez notre sélection d&apos;équipements informatiques haut de gamme pour optimiser votre environnement de travail.</p>
              <Link href="/products" className="group inline-flex items-center text-primary hover:text-primary/90">
                En savoir plus{" "}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm">
              <Code className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Création des sites web</h3>
              <p className="text-muted-foreground mb-4">Des solutions sur mesure pour vos projets web et applications, développées par nos experts.</p>
              <Link href="/services" className="group inline-flex items-center text-primary hover:text-primary/90">
                En savoir plus{" "}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm">
              <Monitor className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Conseil Informatique</h3>
              <p className="text-muted-foreground mb-4">Bénéficiez de l&apos;expertise de nos consultants pour optimiser votre infrastructure IT.</p>
              <Link
                href="/services/consulting"
                className="group inline-flex items-center text-primary hover:text-primary/90"
              >
                En savoir plus{" "}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

