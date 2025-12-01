"use client"

import React from 'react'
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials"

function Hero() {

    const testimonials = [
        {
            quote: "This AI trip planner made organizing my dream vacation to Paris effortless. The personalized itinerary was spot-on and saved me hours of research!",
            name: "Paris Adventure",
            designation: "Travel Enthusiast",
            src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2600&auto=format&fit=crop",
        },
        {
            quote: "I've used many travel apps, but this one stands out. The AI recommendations perfectly matched my budget and interests. My Tokyo trip was unforgettable!",
            name: "Tokyo Journey",
            designation: "Adventure Traveler",
            src: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=3540&auto=format&fit=crop",
        },
        {
            quote: "Planning family vacations used to be stressful, but this app changed everything. It found kid-friendly activities and perfect accommodations for our Dubai trip!",
            name: "Dubai Experience",
            designation: "Family Traveler",
            src: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=3540&auto=format&fit=crop",
        },
        {
            quote: "As a solo traveler, safety and planning are crucial. This AI assistant created the perfect itinerary for my Rome adventure with all the hidden gems!",
            name: "Rome Discovery",
            designation: "Solo Explorer",
            src: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=3464&auto=format&fit=crop",
        },
        {
            quote: "The best travel planning tool I've ever used! It understood exactly what I wanted for my honeymoon in Bali. Every detail was perfectly curated!",
            name: "Bali Paradise",
            designation: "Luxury Traveler",
            src: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2592&auto=format&fit=crop",
        },
    ];

    return (
        <div className='relative flex flex-col items-center justify-center mx-auto max-w-7xl px-6 sm:px-10 gap-1 py-2 min-h-[600px] md:min-h-[550px] rounded-2xl overflow-hidden mt-2'>
            <AnimatedTestimonials testimonials={testimonials} />


        </div>
    )
}

export default Hero
