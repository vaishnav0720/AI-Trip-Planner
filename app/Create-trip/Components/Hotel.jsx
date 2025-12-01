"use client"

import React from 'react'
import SafeImage from './SafeImage'
import { Star, Wallet, MapPin } from 'lucide-react'
import { useTripDetail } from '@/convex/TripDatailContext'

function HotelCard({ placeName, details, address, ticketPricing, rating, distance }) {
  const queryTerm = (placeName || address || details || 'hotel').toString();
  const photoSrc = `/api/google-place-photo?placeName=${encodeURIComponent(queryTerm)}&type=hotel`;
  return (
    <div className="rounded-xl border bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
      <SafeImage
        src={photoSrc}
        alt={placeName || 'Place'}
        type="hotel"
        width={1920}
        height={600}
        sizes="100vw"
        className="w-full h-48 md:h-56 lg:h-64 object-cover object-center"
      />
      <div className="p-4 flex flex-col gap-2">
        <h4 className="text-lg md:text-xl font-semibold text-zinc-900 dark:text-zinc-100">{placeName}</h4>
        {details && <p className="text-sm text-zinc-600 dark:text-zinc-300">{details}</p>}
        {address && <p className="text-sm text-zinc-500 dark:text-zinc-400">{address}</p>}
        <div className="flex items-center gap-4 mt-2 flex-wrap">
          {ticketPricing && (
            <span className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-medium">
              <Wallet className="w-4 h-4" />{ticketPricing}
            </span>
          )}
          {rating !== undefined && (
            <span className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-medium">
              <Star className="w-4 h-4" />{rating}
            </span>
          )}
          {distance && (
            <span className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-300 font-medium">
              <MapPin className="w-4 h-4" />{distance}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function Hotel() {
  const { tripdetailId } = useTripDetail()
  return (
    <div className="grid grid-cols-1 gap-4">
      {tripdetailId?.hotels?.map((hotel, index) => (
        <HotelCard
          key={index}
          placeName={hotel?.name || hotel?.hotelName}
          details={hotel?.description || hotel?.hotelDetails}
          address={hotel?.address || hotel?.hotelAddress}
          ticketPricing={hotel?.price || hotel?.hotelPrice}
          rating={hotel?.rating}
          distance={hotel?.distance || hotel?.distance_from_city_center || hotel?.distanceFromCenter}
        />
      ))}
    </div>
  )
}

export default Hotel
