"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const usedImageSrcs = new Set();

function SafeImage({ src, alt, width, height, sizes, className, type }) {
  const fallbackTerm = (alt || "travel").toString();
  const category = (type || "place").toString().toLowerCase();
  const fallbackList = buildCategorySrcs(category, fallbackTerm);
  const hotelPlaceGenerated = [
    ...buildCategorySrcs('hotel', fallbackTerm, 10),
    ...buildCategorySrcs('place', fallbackTerm, 10)
  ];
  const candidates = Array.from(new Set([src, ...fallbackList, ...hotelPlaceGenerated].filter(Boolean)));
  const genExtra = (offset) => `https://source.unsplash.com/1600x900/?${encodeURIComponent(category)},${encodeURIComponent(fallbackTerm)}&sig=${10 + offset}`;

  const pickUnusedFrom = (list, start = 0) => {
    for (let i = start; i < list.length; i++) {
      const u = list[i];
      if (!usedImageSrcs.has(u)) {
        usedImageSrcs.add(u);
        return { val: u, i };
      }
    }
    return { val: null, i: -1 };
  };

  const firstPick = pickUnusedFrom(candidates, 0);
  const [fbIndex, setFbIndex] = useState(firstPick.i >= 0 ? firstPick.i : 0);
  const [nextExtra, setNextExtra] = useState(0);
  const [curSrc, setCurSrc] = useState(() => {
    if (firstPick.val) return firstPick.val;
    for (let k = 0; k < 50; k++) {
      const u = genExtra(k);
      if (!usedImageSrcs.has(u)) {
        usedImageSrcs.add(u);
        setNextExtra(k + 1);
        return u;
      }
    }
    return null;
  });
  const [usedFallback, setUsedFallback] = useState(!src || usedImageSrcs.has(src));

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
        const nextPick = pickUnusedFrom(candidates, fbIndex + 1);
        if (nextPick.val) {
          setFbIndex(nextPick.i);
          setCurSrc(nextPick.val);
          setUsedFallback(true);
        } else {
          // Try dynamic URLs
          for (let k = nextExtra; k < nextExtra + 50; k++) {
            const u = genExtra(k);
            if (!usedImageSrcs.has(u)) {
              usedImageSrcs.add(u);
              setNextExtra(k + 1);
              setCurSrc(u);
              setUsedFallback(true);
              return;
            }
          }
          setCurSrc(null);
        }
      }}
      loading="lazy"
      priority={false}
    />
  );
}

export default SafeImage;

const imagesByType = {
  hotel: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600&auto=format&fit=crop", // Luxury hotel exterior
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1600&auto=format&fit=crop", // Modern hotel lobby
    "https://images.unsplash.com/photo-1571896349842-6e5c48dc52e3?q=80&w=1600&auto=format&fit=crop", // Hotel room bed
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1600&auto=format&fit=crop", // Resort pool
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop", // Boutique hotel interior
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1600&auto=format&fit=crop", // Hotel reception
    "https://images.unsplash.com/photo-1559508551-44bff1de756b?q=80&w=1600&auto=format&fit=crop", // Hotel suite
    "https://images.unsplash.com/photo-1521783593447-5702b9bfd267?q=80&w=1600&auto=format&fit=crop", // Hotel night view
    "https://images.unsplash.com/photo-1529290130-4ca3753253ae?q=80&w=1600&auto=format&fit=crop", // Hotel pool sunset
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1600&auto=format&fit=crop"  // Hotel breakfast buffet
  ],
  museum: [
    "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?q=80&w=1600&auto=format&fit=crop", // Art museum interior
    "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d6?q=80&w=1600&auto=format&fit=crop", // Modern art gallery
    "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=1600&auto=format&fit=crop", // Museum exterior
    "https://images.unsplash.com/photo-1554907984-15263bfd63bd?q=80&w=1600&auto=format&fit=crop", // Exhibition hall
    "https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1600&auto=format&fit=crop", // Art gallery paintings
    "https://images.unsplash.com/photo-1567191414969-413465a1f413?q=80&w=1600&auto=format&fit=crop", // Science museum
    "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=1600&auto=format&fit=crop", // History museum
    "https://images.unsplash.com/photo-1577083552792-a0d461cb1dd6?q=80&w=1600&auto=format&fit=crop", // Modern art installation
    "https://images.unsplash.com/photo-1544262571-1290c2c1a11e?q=80&w=1600&auto=format&fit=crop", // Museum architecture
    "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?q=80&w=1600&auto=format&fit=crop"  // Gallery exhibit
  ],
  beach: [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop", // Tropical beach
    "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=1600&auto=format&fit=crop", // Beach sunset
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1600&auto=format&fit=crop", // Sandy beach coast
    "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=1600&auto=format&fit=crop", // Ocean shore
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1600&auto=format&fit=crop", // Rocky beach
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1600&auto=format&fit=crop", // Beach bay
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600&auto=format&fit=crop", // Coastline aerial
    "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?q=80&w=1600&auto=format&fit=crop", // Beach paradise
    "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?q=80&w=1600&auto=format&fit=crop", // Sea waves
    "https://images.unsplash.com/photo-1501436513145-30f24e19fcc8?q=80&w=1600&auto=format&fit=crop"  // Turquoise beach
  ],
  place: [
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop", // Paris landmark
    "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1600&auto=format&fit=crop", // Mountain landscape
    "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?q=80&w=1600&auto=format&fit=crop", // Cityscape
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600&auto=format&fit=crop", // Mountain viewpoint
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop", // Historic architecture
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop", // Nature park
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop", // River landscape
    "https://images.unsplash.com/photo-1507041957456-9c397ce39c97?q=80&w=1600&auto=format&fit=crop", // Tourist attraction
    "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?q=80&w=1600&auto=format&fit=crop", // Old town street
    "https://images.unsplash.com/photo-1600271772470-bd22a42787b3?q=80&w=1600&auto=format&fit=crop"  // Urban viewpoint
  ]
};

export function buildCategorySrcs(type, alt, count = 10) {
  const category = (type || "place").toString().toLowerCase();
  const images = imagesByType[category] || imagesByType.place;
  return images.slice(0, count);
}
