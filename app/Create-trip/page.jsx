"use client"
import React from 'react'
import { SignedIn, SignedOut, SignIn } from '@clerk/nextjs'
import Chatbox from './Components/Chatbox'
import ViewTripUi from './Components/ViewTripUi'

const CreateTrip = () => {
  return (
    <>
      <SignedOut>
        <div className='min-h-[70vh] flex items-center justify-center p-6'>
          <SignIn afterSignInUrl="/Create-trip" />
        </div>
      </SignedOut>
      <SignedIn>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5 p-6'>
          <div>
            <Chatbox />
          </div>
          <div className='relative w-full h-[75vh] overflow-auto'>
                  <ViewTripUi />
          </div>
        </div>
      </SignedIn>
    </>
  )
}

export default CreateTrip
