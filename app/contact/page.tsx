// app/contact/page.tsx
"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { MapPin, Phone, Mail, Clock, MessageSquare, Building, ArrowRight } from 'lucide-react'
import Image from 'next/image'

const offices = [
  {
    city: 'CasaBlanca',
    address: '123 Tech Avenue, NY 10001',
    phone: '+212 6 61 52 37 44',
    email: 'hichamessadi@bestoftech.ma',
    hours: 'Lun-Ven: 9h00 - 18h00',
    image: 'https://images.unsplash.com/photo-1579017461826-8ea20d5cdb28?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2FzYWJsYW5jYXxlbnwwfHwwfHx8MA%3D%3D',
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formRef, formInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [officesRef, officesInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Reset form
    setFormData({ name: '', email: '', company: '', message: '' })
    setIsSubmitting(false)
    
    // Show success message (you can implement a toast notification here)
    alert('Merci pour votre message. Nous vous répondrons bientôt !')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

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
            Contactez-nous
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Vous avez une question ou un projet en tête ? Nous serions ravis de vous entendre.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            ref={formRef}
            initial="hidden"
            animate={formInView ? "show" : "hidden"}
            variants={container}
            className="bg-card rounded-lg shadow-sm p-8"
          >
            <div className="mb-8">
              <div className="inline-block p-3 bg-primary/10 rounded-lg mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Envoyez-nous un message</h2>
              <p className="text-muted-foreground">
                Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={item}>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Nom
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </motion.div>

              <motion.div variants={item}>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  E-mail
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </motion.div>

              <motion.div variants={item}>
                <label htmlFor="company" className="block text-sm font-medium mb-2">
                  Entreprise
                </label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </motion.div>

              <motion.div variants={item}>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full min-h-[150px]"
                />
              </motion.div>

              <motion.div variants={item}>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                </Button>
              </motion.div>
            </form>
          </motion.div>

          {/* Company Information */}
          <div>
            {/* Quick Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card rounded-lg shadow-sm p-8 mb-8"
            >
              <div className="inline-block p-3 bg-primary/10 rounded-lg mb-6">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-6">Contact Rapide</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-muted-foreground">+212 6 61 52 37 44</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">E-mail</p>
                    <p className="text-muted-foreground">hichamessadi@bestoftech.ma</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Heures d&apos;ouverture</p>
                    <p className="text-muted-foreground">Lun-Ven: 9h00 - 18h00</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Office Locations */}
            <motion.div
              ref={officesRef}
              initial="hidden"
              animate={officesInView ? "show" : "hidden"}
              variants={container}
            >
              <h2 className="text-2xl font-bold mb-6">Nos Bureaux</h2>
              <div className="space-y-6">
                {offices.map((office, index) => (
                  <motion.div
                    key={index}
                    variants={item}
                    whileHover={{ y: -5 }}
                    className="bg-primary/10 rounded-lg shadow-sm overflow-hidden"
                  >
                    <div className="relative h-48">
                      <Image
                        src={office.image}
                        alt={office.city}
                        className="object-cover w-full h-full"
                        width={700}
                        height={500}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-4">{office.city}</h3>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <MapPin className="h-5 w-5 text-primary mt-1" />
                          <p className="text-muted-foreground">{office.address}</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Phone className="h-5 w-5 text-primary mt-1" />
                          <p className="text-muted-foreground">{office.phone}</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Mail className="h-5 w-5 text-primary mt-1" />
                          <p className="text-muted-foreground">{office.email}</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Clock className="h-5 w-5 text-primary mt-1" />
                          <p className="text-muted-foreground">{office.hours}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}