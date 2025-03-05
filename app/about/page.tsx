// app/about/page.tsx
"use client"

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Target, Award, Rocket, Heart, Shield, ArrowRight } from 'lucide-react'
import Image from 'next/image'

const values = [
  {
    icon: <Target className="h-6 w-6" />,
    title: 'Innovation',
    description: 'Constantly pushing boundaries to deliver cutting-edge solutions',
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: 'Excellence',
    description: 'Committed to delivering the highest quality in everything we do',
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: 'Customer Focus',
    description: `Your success is our priority - we're dedicated to exceeding expectations`,
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Integrity',
    description: 'Building trust through transparency and ethical business practices',
  },
]

const teamMembers = [
  {
    name: 'Samuel Lee',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bW9yY2FuJTIwbWFufGVufDB8fDB8fHww',
    bio: '15+ years of experience in technology leadership and business development',
  },
  {
    name: 'Michael Chen',
    role: 'CTO',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bW9yY2FuJTIwbWFufGVufDB8fDB8fHww',
    bio: 'Expert in software architecture and emerging technologies',
  },
]

export default function AboutPage() {
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
            About BestOf
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Empowering businesses through innovative technology solutions
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
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-8">
                To empower businesses with cutting-edge technology solutions that drive growth, 
                efficiency, and innovation. We&apos;re committed to delivering exceptional value through 
                our premium IT equipment and expert development services.
              </p>
              <Button size="lg" variant="outline" asChild>
                <a href="/contact">
                  Partner with Us
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
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
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

        {/* Team Section */}
        <motion.div
          ref={teamRef}
          initial="hidden"
          animate={teamInView ? "show" : "hidden"}
          variants={container}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-primary/10 rounded-lg mb-6">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Our Leadership Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the experts behind BestOf who are passionate about 
              delivering excellence in technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -5 }}
                className="bg-card rounded-lg shadow-sm overflow-hidden"
              >
                <div className="relative h-48">
                  <Image
                    width={500}
                    height={500}
                    src={member.image}
                    alt={member.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary mb-2">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center bg-card rounded-lg shadow-sm p-8"
        >
          <h2 className="text-2xl font-bold mb-4">Join Our Journey</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Be part of our mission to transform businesses through technology
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <a href="/contact">Contact Us</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}