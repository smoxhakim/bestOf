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

const offices = [
  {
    city: 'New York',
    address: '123 Tech Avenue, NY 10001',
    phone: '+1 (555) 123-4567',
    email: 'nyc@techsolutions.com',
    hours: 'Mon-Fri: 9:00 AM - 6:00 PM',
    image: 'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
  },
  {
    city: 'London',
    address: '456 Innovation Street, London EC2A 1AB',
    phone: '+44 20 7123 4567',
    email: 'london@techsolutions.com',
    hours: 'Mon-Fri: 9:00 AM - 6:00 PM',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
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
    alert('Thank you for your message. We will get back to you soon!')
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
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have a question or project in mind? We'd love to hear from you.
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
              <h2 className="text-2xl font-bold mb-2">Send us a Message</h2>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={item}>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
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
                  Email
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
                  Company
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
                  {isSubmitting ? 'Sending...' : 'Send Message'}
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
              <h2 className="text-2xl font-bold mb-6">Quick Contact</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">info@techsolutions.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-muted-foreground">Mon-Fri: 9:00 AM - 6:00 PM</p>
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
              <h2 className="text-2xl font-bold mb-6">Our Offices</h2>
              <div className="space-y-6">
                {offices.map((office, index) => (
                  <motion.div
                    key={index}
                    variants={item}
                    whileHover={{ y: -5 }}
                    className="bg-card rounded-lg shadow-sm overflow-hidden"
                  >
                    <div className="relative h-48">
                      <img
                        src={office.image}
                        alt={office.city}
                        className="object-cover w-full h-full"
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