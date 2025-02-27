'use client'

import { ReactNode } from 'react'

interface ClientMobileMenuProps {
  children: ReactNode
  onClose: () => void
}

export default function ClientMobileMenu({ children, onClose }: ClientMobileMenuProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed inset-y-0 left-0 w-full sm:w-80">
        {children}
      </div>
      <div 
        className="fixed inset-0" 
        onClick={onClose}
        aria-hidden="true"
      />
    </div>
  )
}