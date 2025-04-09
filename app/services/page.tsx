// app/service/page.ts
"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Code, Smartphone, Globe, Database, Server, Lightbulb, ArrowRight } from 'lucide-react'
import Image from 'next/image'

const services = [
  {
    id: 'web',
    title: 'Création de Sites Web',
    icon: <Globe className="h-6 w-6" />,
    description: 'Applications web personnalisées construites avec des technologies modernes',
    features: [
      'Design Responsive',
      'Applications Web Progressives',
      'Solutions E-commerce',
      'Systèmes de Gestion de Contenu',
    ],
  },
  {
    id: 'mobile',
    title: 'Développement Mobile',
    icon: <Smartphone className="h-6 w-6" />,
    description: 'Applications mobiles natives et multiplateformes',
    features: [
      'Développement iOS',
      'Développement Android',
      'Solutions Multiplateformes',
      'Design UI/UX Mobile',
    ],
  },
  {
    id: 'consulting',
    title: 'Conseil Informatique',
    icon: <Lightbulb className="h-6 w-6" />,
    description: 'Conseil stratégique en technologie et transformation digitale',
    features: [
      'Évaluation Technologique',
      'Stratégie Digitale',
      'Optimisation des Processus',
      'Conseil en Sécurité',
    ],
  },
]

const caseStudies = [
  {
    id: 1,
    title: 'Plateforme E-commerce',
    client: 'RetailTech Solutions',
    category: 'web',
    description: 'Développement d\'une plateforme e-commerce évolutive avec gestion des stocks en temps réel',
    results: [
      'Augmentation de 150% des ventes en ligne',
      'Réduction du temps de chargement de 60%',
      'Amélioration du taux de conversion de 35%',
    ],
    image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80',
  },
  {
    id: 2,
    title: 'Application Mobile de Logistique',
    client: 'Global Freight Inc.',
    category: 'mobile',
    description: 'Création d\'une application mobile complète pour le suivi et la gestion des expéditions en temps réel',
    results: [
      'Réduction des retards de livraison de 40%',
      'Amélioration de la satisfaction client de 45%',
      'Taux d\'adoption utilisateur de 98%',
    ],
    image: 'https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1476&q=80',
  },
  {
    id: 3,
    title: 'Transformation Digitale',
    client: 'Manufacturing Corp',
    category: 'consulting',
    description: 'Pilotage d\'une initiative de transformation digitale pour moderniser les processus de fabrication',
    results: [
      'Efficacité opérationnelle améliorée de 75%',
      'Réduction des coûts informatiques de 40%',
      'Mise en œuvre de solutions IoT',
    ],
    image: 'https://images.unsplash.com/photo-1664575198308-3959904fa430?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
]

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState('web')

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Services de Développement & Conseil
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transformez votre entreprise avec nos solutions technologiques complètes
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={item}
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-lg shadow-sm p-6"
            >
              <div className="p-2 bg-primary/10 rounded-lg w-fit mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-muted-foreground mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Case Studies */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Case Studies</h2>
          
          {/* Desktop/Tablet Tabs - Hidden on Mobile */}
          <div className="hidden sm:block">
            <Tabs defaultValue="web" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full sm:grid-cols-2 md:grid-cols-3 gap-2 mb-8">
                <TabsTrigger value="web">Web Development</TabsTrigger>
                <TabsTrigger value="mobile">Mobile Development</TabsTrigger>
                <TabsTrigger value="consulting">IT Consulting</TabsTrigger>
              </TabsList>
              {services.map((service) => (
                <TabsContent key={service.id} value={service.id}>
                  <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="flex justify-center"
                  >
                    {caseStudies
                      .filter((study) => study.category === service.id)
                      .map((study) => (
                        <motion.div
                          key={study.id}
                          variants={item}
                          className="relative group"
                        >
                          <Card>
                            <CardHeader>
                              <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                                <Image
                                  width={700}
                                  height={500}
                                  src={study.image}
                                  alt={study.title}
                                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                                />
                              </div>
                              <CardTitle>{study.title}</CardTitle>
                              <CardDescription>{study.client}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="mb-4">{study.description}</p>
                              <h4 className="font-semibold mb-2">Key Results:</h4>
                              <ul className="space-y-2">
                                {study.results.map((result, index) => (
                                  <li key={index} className="flex items-center text-sm">
                                    <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                                    {result}
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          {/* Mobile Slider - Visible only on Mobile */}
          <div className="block sm:hidden">
            <div className="flex mb-4 justify-center space-x-2 overflow-x-auto py-2">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setActiveTab(service.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeTab === service.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                >
                  {service.id === 'web' ? 'Dév Web' : service.id === 'mobile' ? 'Dév Mobile' : 'Conseil IT'}
                </button>
              ))}
            </div>
            
            <div className="overflow-x-auto pb-4 snap-x snap-mandatory flex justify-center space-x-4 scrollbar-hide px-4">
              {caseStudies
                .filter((study) => study.category === activeTab)
                .map((study) => (
                  <div 
                    key={study.id} 
                    className="snap-center flex-shrink-0 w-[85vw] max-w-sm mx-auto"
                  >
                    <Card className="h-full">
                      <CardHeader className="p-0">
                        <div className="relative h-48 rounded-t-lg overflow-hidden">
                          <Image 
                            width={700}
                            height={500}
                            src={study.image} 
                            alt={study.title} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="p-4">
                          <CardTitle className="text-lg">{study.title}</CardTitle>
                          <CardDescription>{study.client}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">{study.description}</p>
                        <h4 className="font-semibold text-sm mb-2">Résultats Clés :</h4>
                        <ul className="space-y-1">
                          {study.results.map((result, index) => (
                            <li key={index} className="flex items-start text-xs">
                              <ArrowRight className="h-3 w-3 mr-1 mt-0.5 text-primary flex-shrink-0" />
                              <span>{result}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center bg-card rounded-lg shadow-sm p-8"
        >
          <h2 className="text-2xl font-bold mb-4">Prêt à Transformer Votre Entreprise ?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Discutons de la façon dont nos solutions technologiques peuvent vous aider à atteindre vos objectifs commerciaux
          </p>
          <Button size="lg" asChild>
            <a href="/contact">Commencer</a>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}