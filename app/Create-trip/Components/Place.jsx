import React from 'react'
import SafeImage from './SafeImage'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Ticket, Clock, Route } from 'lucide-react'
import { useTripDetail } from '@/convex/TripDatailContext'

function Place({ dayPlan }) {
  const { tripdetailId } = useTripDetail();

  const getCoords = (obj) => {
    if (!obj) return null;
    const gc = obj.geo_coordinates || obj.geoCoordinates || {};
    const lat = obj.latitude ?? gc.latitude;
    const lon = obj.longitude ?? gc.longitude;
    if (typeof lat === 'number' && typeof lon === 'number') return { lat, lon };
    return null;
  };

  const kmDistance = (a, b) => {
    if (!a || !b) return null;
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lon - a.lon);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.asin(Math.sqrt(h));
    return `${(R * c).toFixed(1)} km`;
  };

  const firstHotel = Array.isArray(tripdetailId?.hotels) ? tripdetailId.hotels[0] : null;
  const hotelCoords = getCoords(firstHotel);

  const imgForActivity = (activity) => {
    const name = (activity?.place_name || '').toString();
    const details = (activity?.place_details || '').toString();
    const raw = `${name} ${details}`.toLowerCase();
    let kw = 'place';
    if (raw.includes('museum') || raw.includes('gallery')) kw = 'museum';
    else if (raw.includes('beach') || raw.includes('shore') || raw.includes('sea') || raw.includes('coast') || raw.includes('bay')) kw = 'beach';
    const q = name || (activity?.place_address || 'place');
    return `/api/google-place-photo?placeName=${encodeURIComponent(q)}&type=${encodeURIComponent(kw)}`;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border-2 border-fuchsia-300/60 bg-gradient-to-r from-fuchsia-50 to-violet-50 p-4 mt-10 shadow-md dark:border-fuchsia-400/40 dark:from-fuchsia-900/20 dark:to-violet-900/20">
        <p className="text-sm text-zinc-900 dark:text-zinc-100">Best Time to Visit: <span className="font-semibold text-fuchsia-700 dark:text-fuchsia-300 bg-white/70 dark:bg-white/10 px-2 py-1 rounded-md">{dayPlan?.best_time_to_visit_day}</span></p>
      </div>
      {dayPlan?.activities.map((activity, index) => (
        <div key={index} className="rounded-xl border bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            <div className="md:col-span-3">
              <SafeImage
                src={imgForActivity(activity)}
                alt={activity.place_name}
                width={1920}
                height={600}
                sizes="100vw"
                className="w-full h-48 md:h-56 lg:h-64 object-cover object-center"
              />
            </div>
            <div className="md:col-span-3 p-4 flex flex-col gap-2">
              <h4 className="text-lg md:text-xl font-semibold text-zinc-900 dark:text-zinc-100">{activity.place_name}</h4>
              {activity.place_details && <p className="text-sm text-zinc-600 dark:text-zinc-300">{activity.place_details}</p>}
              {activity.place_address && <p className="text-sm text-zinc-500 dark:text-zinc-400">{activity.place_address}</p>}
              <div className="flex flex-wrap items-center gap-4 mt-2">
                {activity.ticket_pricing && (
                  <span className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-medium">
                    <Ticket className="w-4 h-4" />{activity.ticket_pricing}
                  </span>
                )}
                {activity.time_travel_each_location && (
                  <span className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-medium">
                    <Clock className="w-4 h-4" />{activity.time_travel_each_location}
                  </span>
                )}
                {(() => {
                  const placeCoords = getCoords(activity);
                  const dist = kmDistance(hotelCoords, placeCoords);
                  return dist ? (
                    <span className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-300 font-medium">
                      <Route className="w-4 h-4" />Distance from hotel: {dist}
                    </span>
                  ) : null;
                })()}
                {activity.best_time_to_visit && (
                  <span className="inline-flex items-center gap-2 text-rose-700 dark:text-rose-300 font-medium">
                    {activity.best_time_to_visit}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Place
