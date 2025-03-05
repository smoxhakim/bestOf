'use client'

import Link from "next/link"
import { Monitor } from "lucide-react"

export default function Footer() {
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
              Autonomiser les entreprises avec des solutions technologiques de pointe et des services de développement professionnels.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Produits</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products/computers" className="text-muted-foreground hover:text-foreground">
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
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/web-development" className="text-muted-foreground hover:text-foreground">
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
          </div>

          <div>
            <h3 className="font-semibold mb-4">Entreprise</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
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
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground">© 2024 TechSolutions. Tous droits réservés.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                Politique de Confidentialité
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                Conditions d&apos;Utilisation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

