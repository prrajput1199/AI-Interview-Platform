import React from 'react'
import Navbar from '../shared/Navbar'


interface LayoutProps {
   children: React.ReactNode
}

export default function Layout ({children}: LayoutProps) {
  return (
    <div className='min-h-screen bg-gray-50'><Navbar/>
    <main>{children}</main>
    </div>
  )
}