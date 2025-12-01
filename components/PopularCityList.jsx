"use client";

import React from "react";
import Image from "next/image";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { ArrowLeft } from "lucide-react";
export function PopularCityList({ compact = false }) {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} compact={compact} />
  ));

  return (
    <div className={compact ? "w-full h-full py-8" : "w-full h-full py-20"}>
      <h2
        className={compact ? "max-w-5xl pl-4 mx-auto text-lg md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 font-sans" : "max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans"}>
        Popular Destination to Visit.
      </h2>
      <Carousel items={cards} compact={compact} />
    </div>
  );
}

const DummyContent = () => {
  return (
    <>
      {[...new Array(3).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
            <p
              className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                The first rule of Apple club is that you boast about Apple club.
              </span>{" "}
              Keep a journal, quickly jot down a grocery list, and take amazing
              class notes. Want to convert those notes to text? No problem.
              Langotiya jeetu ka mara hua yaar is ready to capture every
              thought.
            </p>
            <Image
              src="https://assets.aceternity.com/macbook.png"
              alt="Macbook mockup from Aceternity UI"
              height={400}
              width={600}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain" />
            <div className="flex gap-2 p-3">
              <ArrowLeft />
              <h1 className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                Getting to know you to build perfect trip here...</h1></div>
          </div>

        );
      })}
    </>
  );
};

const data = [
  {
    category: "Paris, France",
    title: "Explore the City of Lights - Eiffel Tower, Louvre & more",
    src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2600&auto=format&fit=crop",
    content: <DummyContent />,
  },
  {
    category: "New York, USA",
    title: "Experience NYC - Times Square, Central Park, Broadway",
    src: "https://plus.unsplash.com/premium_photo-1661954654458-c673671d4a08?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Tokyo, Japan",
    title: "Discover Tokyo - Shibuya, Cherry Blossoms, Temples",
    src: "https://images.unsplash.com/photo-1522547902298-51566e4fb383?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Rome, Italy",
    title: "Walk through History - Colosseum, Vatican, Roman Forum",
    src: "https://plus.unsplash.com/premium_photo-1675975678457-d70708bf77c8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Dubai, UAE",
    title: "Luxury and Innovation - Burj Khalifa, Desert Safari",
    src: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "India",
    title: "Harbour Views - Opera House, Bondi Beach & Wildlife",
    src: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
];
