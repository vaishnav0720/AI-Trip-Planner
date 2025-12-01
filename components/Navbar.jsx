
import React from 'react'
import Image from 'next/image'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Button } from './ui/button'

const Navbar = () => {
  return (
    <div className='flex justify-between items-center p-4'>
      <Image src='/logo.png' alt='Logo' width={60} height={30} priority />
      <div>
        <SignedOut>
          <SignInButton mode="modal">
            <Button>Sign In</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  )
}

export default Navbar

