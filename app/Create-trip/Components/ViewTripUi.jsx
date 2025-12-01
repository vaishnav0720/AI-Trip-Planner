"use client";
import React, { useEffect } from "react";
import { Timeline } from "@/components/ui/timeline";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Hotel from "./Hotel";
import Place from "./Place";
import { useTripDetail } from "@/convex/TripDatailContext";


import { PopularCityList } from "@/components/PopularCityList";
import { FocusCardsDemo } from "./SafeImage";



function ViewTripUi({ content, disabled }) {
  const SaveTripDetails = useMutation(api.tripdetails.saveTripDetailsOnce);
  const { tripdetailId } = useTripDetail();

  useEffect(() => {
    if (!tripdetailId) return;
    const durationVal = Number.isFinite(tripdetailId.durationDays)
      ? tripdetailId.durationDays
      : parseInt(((tripdetailId.duration || '0').toString().match(/\d+/) || ['0'])[0]);
    const fingerprint = [
      (tripdetailId.origin || '').toString().trim(),
      (tripdetailId.destination || '').toString().trim(),
      String(durationVal),
      (tripdetailId.budget || '').toString().trim(),
      (tripdetailId.groupSize || tripdetailId.group_size || '').toString().trim()
    ].join('|');

    let savedSet = [];
    try {
      const raw = localStorage.getItem('TRIP_SAVED_SET') || '[]';
      const parsed = JSON.parse(raw);
      savedSet = Array.isArray(parsed) ? parsed : [];
    } catch { savedSet = []; }

    if (savedSet.includes(fingerprint)) return;

    try {
      const payload = JSON.stringify(tripdetailId);
      localStorage.setItem('TRIP_DATA', payload);
      (async () => {
        try {
          await SaveTripDetails({
            origin: tripdetailId.origin,
            destination: tripdetailId.destination,
            budget: tripdetailId.budget,
            durationDays: durationVal,
            groupSize: tripdetailId.groupSize || tripdetailId.group_size || '',
            preferences: tripdetailId.preferences,
            plan: payload,
          });
          const nextSaved = [...savedSet, fingerprint];
          localStorage.setItem('TRIP_SAVED_SET', JSON.stringify(nextSaved));
        } catch { }
      })();
    } catch { }
  }, [tripdetailId, SaveTripDetails]);

  console.log('tripdetailId:', tripdetailId)
  console.log('hotels:', tripdetailId?.hotels)

  const data = [
    {
      title: "Recommended Hotels",
      content: (
        <Hotel />
      ),
    },
    ...(tripdetailId?.itinerary?.map((dayPlan) => ({
      title: `Day ${dayPlan?.day}: ${dayPlan.day_plan}`,
      content: (
        <Place dayPlan={dayPlan} />
      ),
    })) || [])
  ];
  return (
    <div className="relative w-full overflow-clip">
      {tripdetailId && <Timeline data={data} tripData={tripdetailId} />}
      <PopularCityList compact />
    </div>
  );
}

export default ViewTripUi;
