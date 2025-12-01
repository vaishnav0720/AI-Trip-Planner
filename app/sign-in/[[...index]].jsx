"use client"
import React from "react"
import { SignIn } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <SignIn afterSignInUrl="/Create-trip" redirectUrl="/Create-trip" />
    </div>
  )
}
