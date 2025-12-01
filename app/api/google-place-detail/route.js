import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const placeName = (body && body.placeName) ? String(body.placeName) : "";
    if (!placeName) return NextResponse.json("");

    const apiKey =
      process.env.GOOGLE_PLACE_API_KEY ||
      process.env.GOOGLE_MAPS_API_KEY ||
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

    if (!apiKey) {
      const fallbackUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(placeName)}`;
      return NextResponse.json(fallbackUrl);
    }

    const searchResp = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.id,places.displayName,places.photos",
      },
      body: JSON.stringify({ textQuery: placeName })
    });

    if (!searchResp.ok) {
      const fallbackUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(placeName)}`;
      return NextResponse.json(fallbackUrl);
    }

    const data = await searchResp.json();
    const firstPlace = Array.isArray(data?.places) ? data.places[0] : null;
    const firstPhoto = Array.isArray(firstPlace?.photos) ? firstPlace.photos[0] : null;
    const photoName = firstPhoto?.name || "";

    if (!photoName) {
      const fallbackUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(placeName)}`;
      return NextResponse.json(fallbackUrl);
    }

    const proxied = `/api/google-place-photo?placeName=${encodeURIComponent(placeName)}`;
    return NextResponse.json(proxied);
  } catch {
    return NextResponse.json(result?.data);
  }
}
