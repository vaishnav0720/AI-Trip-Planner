"use client";;
import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const Card = React.memo(({
  card,
  index,
  hovered,
  setHovered
}) => (
  <div
    onMouseEnter={() => setHovered(index)}
    onMouseLeave={() => setHovered(null)}
    className={cn(
      "rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full transition-all duration-300 ease-out",
      hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
    )}>
    <Image src={card.src} alt={card.title} fill sizes="100vw" className="object-cover absolute inset-0" />
    <div
      className={cn(
        "absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300",
        hovered === index ? "opacity-100" : "opacity-0"
      )}>
      <div
        className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
        {card.title}
      </div>
    </div>
  </div>
));

Card.displayName = "Card";

export function FocusCards({
  cards
}) {
  const [hovered, setHovered] = useState(null);

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto md:px-8 w-full">
      {(
        (() => {
          const safe = Array.isArray(cards) ? cards : [];
          const seen = new Set();
          return safe.filter((c) => {
            const k = c?.src || c?.title;
            if (!k) return false;
            if (seen.has(k)) return false;
            seen.add(k);
            return true;
          });
        })()
      ).map((card, index) => (
        <Card
          key={`${card.src ?? card.title}-${index}`}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered} />
      ))}
    </div>
  );
}

export function FocusCardsDemo() {
  const cards = [
    {
      title: "Forest Adventure",
      src: "https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "Valley of life",
      src: "https://images.unsplash.com/photo-1600271772470-bd22a42787b3?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "Sala behta hi jayega",
      src: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "Camping is for pros",
      src: "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "The road not taken",
      src: "https://images.unsplash.com/photo-1507041957456-9c397ce39c97?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "The First Rule",
      src: "https://assets.aceternity.com/the-first-rule.png",
    },
    {
      title: "Mountain Pass",
      src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "City Nights",
      src: "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "Ocean View",
      src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "Desert Dunes",
      src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "Forest Trail",
      src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1600&auto=format&fit=crop",
    },
  ];

  return <FocusCards cards={cards} />;
}
