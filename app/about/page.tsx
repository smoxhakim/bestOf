// app/about/page.tsx
"use client"

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Target, Award, Rocket, Heart, Shield, ArrowRight, Building2 as Building } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

type TrustedCompany = {
  id: string
  name: string
  logoUrl: string
  createdAt: string
  updatedAt: string
}


const values = [
  {
    icon: <Target className="h-6 w-6" />,
    title: 'Innovation',
    description: 'Repousser constamment les limites pour offrir des solutions de pointe',
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: 'Excellence',
    description: 'Engagés à fournir la plus haute qualité dans tout ce que nous faisons',
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: 'Orientation Client',
    description: 'Votre succès est notre priorité - nous nous engageons à dépasser vos attentes',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Intégrité',
    description: 'Bâtir la confiance grâce à la transparence et des pratiques commerciales éthiques',
  },
]

// Default companies as fallback
const defaultCompanies = [
  {
    name: 'Microsoft',
    color: '#00A4EF',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
  },
  {
    name: 'IBM',
    color: '#1F70C1',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
  },
  {
    name: 'Oracle',
    color: '#F80000',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg',
  },
  {
    name: 'SAP',
    color: '#0FAAFF',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg',
  },
]



export default function AboutPage() {
  const [trustedCompanies, setTrustedCompanies] = useState<TrustedCompany[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch trusted companies from the API
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        console.log('About page: Fetching trusted companies')
        const response = await fetch('/api/public/trusted-companies')
        const data = await response.json()
        
        console.log('About page: Received data:', data)
        
        if (Array.isArray(data) && data.length > 0) {
          setTrustedCompanies(data)
          console.log('About page: Set trusted companies:', data.length)
        } else {
          console.log('About page: No companies found or invalid data')
          // Fallback to default companies
          setTrustedCompanies([])
        }
      } catch (error) {
        console.error('About page: Error fetching trusted companies:', error)
        setTrustedCompanies([])
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  const [missionRef, missionInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [valuesRef, valuesInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [teamRef, teamInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            À Propos de BestOf
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Accompagner les entreprises grâce à des solutions technologiques innovantes
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          ref={missionRef}
          initial="hidden"
          animate={missionInView ? "show" : "hidden"}
          variants={container}
          className="mb-20"
        >
          <div className="bg-card rounded-lg shadow-sm p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-block p-3 bg-primary/10 rounded-lg mb-6">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-6">Notre Mission</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Accompagner les entreprises avec des solutions technologiques de pointe qui favorisent la croissance, 
                l&apos;efficacité et l&apos;innovation. Nous nous engageons à offrir une valeur exceptionnelle grâce à 
                nos équipements informatiques premium et nos services de développement expert.
              </p>
              <Button size="lg" variant="outline" asChild>
                <a href="/contact">
                  Collaborer avec Nous
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          ref={valuesRef}
          initial="hidden"
          animate={valuesInView ? "show" : "hidden"}
          variants={container}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Nos Valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={item}
                className="bg-card rounded-lg shadow-sm p-6"
              >
                <div className="p-2 bg-primary/10 rounded-lg w-fit mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trusted Companies Section */}
        <motion.div
          ref={teamRef}
          initial="hidden"
          animate={teamInView ? "show" : "hidden"}
          variants={container}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-primary/10 rounded-lg mb-6">
              <Building className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Les entreprises qui nous font confiance</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nous sommes fiers de collaborer avec des entreprises de premier plan dans divers secteurs
            </p>
          </div>

          <div className="marquee-container">
            <h3 className="sr-only">Les entreprises qui nous font confiance</h3>
            
            {loading ? (
              <div className="text-center py-8">Chargement...</div>
            ) : trustedCompanies.length > 0 ? (
              <div className="marquee-content">
                <div className="marquee-track">
                  {trustedCompanies.map((company, index) => (
                    <motion.div key={company.id} variants={item} className="marquee-item">
                      <div className="company-card">
                        <div className="company-icon-container">
                          <Image 
                            src={company.logoUrl} 
                            alt={company.name} 
                            width={40} 
                            height={40} 
                            className="company-logo"
                            onError={(e) => {
                              // Fallback to first letter if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.parentElement!.classList.add('company-icon-fallback');
                              target.parentElement!.textContent = company.name.charAt(0);
                            }}
                          />
                        </div>
                        <p className="company-name">{company.name}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Duplicate track for continuous scrolling */}
                <div className="marquee-track">
                  {trustedCompanies.map((company, index) => (
                    <motion.div key={`duplicate-${company.id}`} variants={item} className="marquee-item">
                      <div className="company-card">
                        <div className="company-icon-container">
                          <Image 
                            src={company.logoUrl} 
                            alt={company.name} 
                            width={40} 
                            height={40} 
                            className="company-logo"
                            onError={(e) => {
                              // Fallback to first letter if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.parentElement!.classList.add('company-icon-fallback');
                              target.parentElement!.textContent = company.name.charAt(0);
                            }}
                          />
                        </div>
                        <p className="company-name">{company.name}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              // Fallback to default companies if no companies in database
              <div className="marquee-content">
                <div className="marquee-track">
                  {defaultCompanies.map((company, index) => (
                    <motion.div key={index} variants={item} className="marquee-item">
                      <div className="company-card">
                        <div 
                          className="company-icon"
                          style={{ backgroundColor: company.color }}
                        >
                          {company.name.charAt(0)}
                        </div>
                        <p className="company-name">{company.name}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Duplicate track for continuous scrolling */}
                <div className="marquee-track">
                  {defaultCompanies.map((company, index) => (
                    <motion.div key={`duplicate-${index}`} variants={item} className="marquee-item">
                      <div className="company-card">
                        <div 
                          className="company-icon"
                          style={{ backgroundColor: company.color }}
                        >
                          {company.name.charAt(0)}
                        </div>
                        <p className="company-name">{company.name}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center bg-card rounded-lg shadow-sm p-8"
        >
          <h2 className="text-2xl font-bold mb-4">Rejoignez Notre Aventure</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Faites partie de notre mission de transformer les entreprises grâce à la technologie
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <a href="/contact">Contactez-Nous</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}