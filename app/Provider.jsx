"use client"

import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import Navbar from '@/components/Navbar'
import { ConvexClientProvider } from './ConvexClientProvider'
import { TripDetailContext } from '@/convex/TripDatailContext'

function Provider({ children, ...props }) {
  const [tripdetailId, setTripDtailId] = React.useState(null);
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  const appTree = (
    <ConvexClientProvider>
      <TripDetailContext.Provider value={{ tripdetailId, setTripDtailId }}>
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem {...props}>
          <Navbar />
          {children}
        </NextThemesProvider>
      </TripDetailContext.Provider>
    </ConvexClientProvider>
  );
  if (!publishableKey) return appTree;
  return (
    <ClerkProvider publishableKey={publishableKey}>
      {appTree}
    </ClerkProvider>
  )
}

export default Provider
