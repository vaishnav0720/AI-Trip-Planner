"use client";
import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { FocusCards } from "@/components/ui/focus-cards";

function SafeImage({ src, alt, width, height, sizes, className }) {
  const fallbackTerm = (alt || "travel").toString();
  const fallbackList = [
    "https://images.unsplash.com/photo-1526495124232-a04e1849168c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
   "https://images.unsplash.com/photo-1600271772470-bd22a42787b3?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507041957456-9c397ce39c97?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2600&auto=format&fit=crop",
   "https://plus.unsplash.com/premium_photo-1661954654458-c673671d4a08?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1522547902298-51566e4fb383?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
   "https://plus.unsplash.com/premium_photo-1675975678457-d70708bf77c8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
  ];
  const hash = Array.from(fallbackTerm).reduce((a, c) => a + c.charCodeAt(0), 0);
  const [fbIndex, setFbIndex] = useState(hash % fallbackList.length);
  const [curSrc, setCurSrc] = useState(src || fallbackList[fbIndex]);
  const [usedFallback, setUsedFallback] = useState(!src);

  if (!curSrc) return null;
  return (
    <Image
      src={curSrc}
      alt={alt || "Image"}
      width={width}
      height={height}
      sizes={sizes || "100vw"}
      className={cn("object-cover object-center", className)}
      onError={() => {
        if (!usedFallback) {
          setCurSrc(fallbackList[fbIndex]);
          setUsedFallback(true);
        } else {
          const next = (fbIndex + 1) % fallbackList.length;
          if (next !== fbIndex) {
            setFbIndex(next);
            setCurSrc(fallbackList[next]);
          } else {
            setCurSrc(null);
          }
        }
      }}
      loading="lazy"
      priority={false}
    />
  );
}

export default SafeImage;

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
  ];

  return <FocusCards cards={cards} />;
}
