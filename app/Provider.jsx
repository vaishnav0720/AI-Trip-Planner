"use client"

import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import Navbar from '@/components/Navbar'
import { ConvexClientProvider } from './ConvexClientProvider'
import { TripDetailContext } from '@/convex/TripDatailContext'

function Provider({ children, ...props }) {
  const [tripdetailId, setTripDtailId] = React.useState(null);
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <TripDetailContext.Provider value={{ tripdetailId, setTripDtailId }}>
          <NextThemesProvider attribute="class" defaultTheme="system" enableSystem {...props}>
            <Navbar />
            {children}
          </NextThemesProvider>
        </TripDetailContext.Provider>
      </ConvexClientProvider>
    </ClerkProvider>
  )
}

export default Provider
