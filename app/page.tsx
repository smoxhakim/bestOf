// app/page.ts
"use client"

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import { Monitor, Code, ShoppingCart, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Transform Your Business with
              <span className="text-primary"> Technology Solutions</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Premium computer equipment and professional development services to drive your business forward.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/products">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Browse Products
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/services">
                  <Code className="mr-2 h-5 w-5" />
                  Explore Services
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
              <h3 className="text-xl font-semibold mb-2">Premium Equipment</h3>
              <p className="text-muted-foreground mb-4">
                High-quality computers and accessories for your business needs.
              </p>
              <Link href="/products" className="group inline-flex items-center text-primary hover:text-primary/90">
                Learn More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm">
              <Code className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Development Services</h3>
              <p className="text-muted-foreground mb-4">
                Custom web and app development solutions tailored to your requirements.
              </p>
              <Link href="/services" className="group inline-flex items-center text-primary hover:text-primary/90">
                Learn More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm">
              <Monitor className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">IT Consulting</h3>
              <p className="text-muted-foreground mb-4">
                Expert guidance to help you make informed technology decisions.
              </p>
              <Link href="/services/consulting" className="group inline-flex items-center text-primary hover:text-primary/90">
                Learn More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}