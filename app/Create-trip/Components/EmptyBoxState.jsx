import React from 'react'
import { MapPin } from 'lucide-react'

const EmptyBoxState = () => {
  return (
    <div className='flex flex-col items-center justify-center mt-10 p-10 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50'>
      <div className='bg-orange-100 p-5 rounded-full mb-5'>
        <MapPin className='h-10 w-10 text-orange-500' />
      </div>
      <h2 className='font-bold text-2xl text-center text-gray-800'>
        Start Planning New <span className='text-orange-500'>Trip</span> Using AI
      </h2>
      <p className='text-gray-500 text-center mt-2'>
        Discover personalized travel itineraries tailored just for you
      </p>
    </div>
  )
}

export default EmptyBoxState
