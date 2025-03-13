'use client'

import Link from "next/link"
import { Monitor, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { motion } from "framer-motion"

export default function Footer() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <footer className="bg-background border-t dark:bg-background/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2 group">
                <Monitor className="h-6 w-6 group-hover:text-primary transition-colors duration-300" />
                <span className="font-bold text-xl group-hover:text-primary transition-colors duration-300">BestOf</span>
              </Link>
              <p className="text-muted-foreground">
                Autonomiser les entreprises avec des solutions technologiques de pointe et des services de développement professionnels.
              </p>
              <div className="pt-2 space-y-2">
                <div className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>contact@bestof.com</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+212 5XX-XXXXXX</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Casablanca, Maroc</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
            <h3 className="font-semibold text-lg mb-4 pb-1 border-b border-muted/50 inline-block">Produits</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products/computers" className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center">
                  Ordinateurs
                </Link>
              </li>
              <li>
                <Link href="/products/laptops" className="text-muted-foreground hover:text-foreground">
                  Ordinateurs Portables
                </Link>
              </li>
              <li>
                <Link href="/products/accessories" className="text-muted-foreground hover:text-foreground">
                  Accessoires
                </Link>
              </li>
              <li>
                <Link href="/products/networking" className="text-muted-foreground hover:text-foreground">
                  Réseaux
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
            <h3 className="font-semibold text-lg mb-4 pb-1 border-b border-muted/50 inline-block">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/services/web-development" className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center">
                  Développement Web
                </Link>
              </li>
              <li>
                <Link href="/services/app-development" className="text-muted-foreground hover:text-foreground">
                  Développement d&apos;Applications
                </Link>
              </li>
              <li>
                <Link href="/services/consulting" className="text-muted-foreground hover:text-foreground">
                  Conseil Informatique
                </Link>
              </li>
              <li>
                <Link href="/services/support" className="text-muted-foreground hover:text-foreground">
                  Support Technique
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
            <h3 className="font-semibold text-lg mb-4 pb-1 border-b border-muted/50 inline-block">Entreprise</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center">
                  À Propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                  Carrières
                </Link>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col sm:flex-row items-center">
              <p className="text-muted-foreground">© 2025 BestOf. Tous droits réservés.</p>
              <div className="flex space-x-4 mt-4 sm:mt-0 sm:ml-6">
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 mt-6 md:mt-0 text-center sm:text-left">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                Politique de Confidentialité
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                Conditions d&apos;Utilisation
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="bg-muted/30 dark:bg-muted/10 py-2 text-center text-xs text-muted-foreground">
        <p>Conçu avec passion par l&apos;équipe BestOf</p>
      </div>
    </footer>
  )
}
