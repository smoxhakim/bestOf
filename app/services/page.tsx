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
    title: 'Web Development',
    icon: <Globe className="h-6 w-6" />,
    description: 'Custom web applications built with modern technologies',
    features: [
      'Responsive Design',
      'Progressive Web Apps',
      'E-commerce Solutions',
      'Content Management Systems',
    ],
  },
  {
    id: 'mobile',
    title: 'Mobile Development',
    icon: <Smartphone className="h-6 w-6" />,
    description: 'Native and cross-platform mobile applications',
    features: [
      'iOS Development',
      'Android Development',
      'Cross-platform Solutions',
      'Mobile UI/UX Design',
    ],
  },
  {
    id: 'consulting',
    title: 'IT Consulting',
    icon: <Lightbulb className="h-6 w-6" />,
    description: 'Strategic technology consulting and digital transformation',
    features: [
      'Technology Assessment',
      'Digital Strategy',
      'Process Optimization',
      'Security Consulting',
    ],
  },
]

const caseStudies = [
  {
    id: 1,
    title: 'E-commerce Platform',
    client: 'RetailTech Solutions',
    category: 'web',
    description: 'Developed a scalable e-commerce platform with real-time inventory management',
    results: [
      '150% increase in online sales',
      'Reduced load time by 60%',
      'Improved conversion rate by 35%',
    ],
    image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80',
  },
  {
    id: 2,
    title: 'Logistics Mobile App',
    client: 'Global Freight Inc.',
    category: 'mobile',
    description: 'Built a comprehensive mobile app for real-time shipment tracking and management',
    results: [
      'Reduced delivery delays by 40%',
      'Improved customer satisfaction by 45%',
      '98% user adoption rate',
    ],
    image: 'https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1476&q=80',
  },
  {
    id: 3,
    title: 'Digital Transformation',
    client: 'Manufacturing Corp',
    category: 'consulting',
    description: 'Led digital transformation initiative to modernize manufacturing processes',
    results: [
      'Operational efficiency improved by 75%',
      'Reduced IT costs by 40%',
      'Implemented IoT solutions',
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
            Development & Consulting Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your business with our comprehensive technology solutions
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
          <Tabs defaultValue="web" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
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

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center bg-card rounded-lg shadow-sm p-8"
        >
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Let&apos;s discuss how our technology solutions can help you achieve your business goals
          </p>
          <Button size="lg" asChild>
            <a href="/contact">Get Started</a>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}