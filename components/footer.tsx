'use client'

import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { motion } from "framer-motion"

export default function Footer() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <footer className="bg-[#0e6670] text-primary-foreground border-t dark:bg-[#111827] dark:text-gray-100 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
            <div className="space-y-4">
              <Link href="/" className="flex items-center group">
                <div className="relative h-20 w-60 group-hover:opacity-90 transition-all duration-300 group-hover:scale-105">
                  <Image 
                    src="/BESTOF-LOGO-white.png" 
                    alt="BestOf Logo" 
                    fill 
                    className="object-contain dark:hidden" 
                  />
                  <Image 
                    src="/BESTOF-LOGO-dark.png" 
                    alt="BestOf Logo" 
                    fill 
                    className="object-contain hidden dark:block" 
                  />
                </div>
              </Link>
              <p className="text-primary-foreground/90 dark:text-gray-300">
              Entreprise de vente du matériel informatique et d&apos;aide de la transformation digital des entreprises.
              </p>
              <div className="pt-2 space-y-2">
                <div className="flex items-center text-sm text-primary-foreground dark:text-gray-300 hover:text-primary-foreground/80 dark:hover:text-white transition-colors duration-200">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>hichamessadi@bestoftech.ma</span>
                </div>
                <div className="flex items-center text-sm text-primary-foreground dark:text-gray-300 hover:text-primary-foreground/80 dark:hover:text-white transition-colors duration-200">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+212 6 61 52 37 44</span>
                </div>
                <div className="flex items-center text-sm text-primary-foreground dark:text-gray-300 hover:text-primary-foreground/80 dark:hover:text-white transition-colors duration-200">
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
                <Link href="/products/" className="text-primary-foreground/90 dark:text-gray-300 hover:text-primary-foreground dark:hover:text-white transition-colors duration-200 flex items-center">
                  Ordinateurs
                </Link>
              </li>
              <li>
                <Link href="/products/" className="text-primary-foreground/90 dark:text-gray-300 hover:text-primary-foreground dark:hover:text-white">
                  Ordinateurs Portables
                </Link>
              </li>
              <li>
                <Link href="/products/" className="text-primary-foreground/90 dark:text-gray-300 hover:text-primary-foreground dark:hover:text-white">
                  Accessoires
                </Link>
              </li>
              <li>
                <Link href="/products/" className="text-primary-foreground/90 dark:text-gray-300 hover:text-primary-foreground dark:hover:text-white">
                  Imprimantes
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
            <h3 className="font-semibold text-lg mb-4 pb-1 border-b border-muted/50 inline-block">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/services/" className="text-primary-foreground/90 dark:text-gray-300 hover:text-primary-foreground dark:hover:text-white transition-colors duration-200 flex items-center">
                Création des sites web
                </Link>
              </li>
              <li>
                <Link href="/services/" className="text-primary-foreground/90 dark:text-gray-300 hover:text-primary-foreground dark:hover:text-white">
                  Développement d&apos;Applications
                </Link>
              </li>
              <li>
                <Link href="/services/" className="text-primary-foreground/90 dark:text-gray-300 hover:text-primary-foreground dark:hover:text-white">
                  Conseil Informatique
                </Link>
              </li>
              <li>
                <Link href="/services/" className="text-primary-foreground/90 dark:text-gray-300 hover:text-primary-foreground dark:hover:text-white">
                  Support Technique
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
            <h3 className="font-semibold text-lg mb-4 pb-1 border-b border-muted/50 inline-block">Entreprise</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-primary-foreground/90 dark:text-gray-300 hover:text-primary-foreground dark:hover:text-white transition-colors duration-200 flex items-center">
                  À Propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-primary-foreground/90 dark:text-gray-300 hover:text-primary-foreground dark:hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-primary-foreground/90 dark:text-gray-300 hover:text-primary-foreground dark:hover:text-white">
                  Blog
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
              <p className="text-primary-foreground/90 dark:text-gray-300">© 2025 BestOf. Tous droits réservés.</p>
              <div className="flex space-x-4 mt-4 sm:mt-0 sm:ml-6">
                <Link href="#" className="text-primary-foreground/90 dark:text-gray-300 hover:text-white transition-colors duration-300">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-primary-foreground/90 dark:text-gray-300 hover:text-white transition-colors duration-300">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-primary-foreground/90 dark:text-gray-300 hover:text-white transition-colors duration-300">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="https://www.linkedin.com/in/bestof-tech-sarl-90b2511a4/" className="text-primary-foreground/90 hover:text-white transition-colors duration-300">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 mt-6 md:mt-0 text-center sm:text-left">
              <Link href="/privacy" className="text-primary-foreground/90 dark:text-gray-300 hover:text-primary-foreground dark:hover:text-white transition-colors duration-200">
                Politique de Confidentialité
              </Link>
              <Link href="/terms" className="text-primary-foreground/90 dark:text-gray-300 hover:text-primary-foreground dark:hover:text-white transition-colors duration-200">
                Conditions d&apos;Utilisation
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="bg-primary-foreground/10 dark:bg-gray-900 py-2 text-center text-xs text-primary-foreground dark:text-gray-300">
        <p>Conçu avec passion par l&apos;équipe BestOf</p>
      </div>
    </footer>
  )
}
