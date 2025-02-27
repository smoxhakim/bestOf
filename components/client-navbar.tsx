'use client'

import { useState, useLayoutEffect } from 'react'
import  Navbar  from './navbar'

export default function ClientNavbar() {
  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <Navbar />
}

