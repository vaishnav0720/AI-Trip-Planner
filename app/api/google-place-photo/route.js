import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const placeName = searchParams.get("placeName") || "";
    const type = searchParams.get("type") || "place";
    if (!placeName) return NextResponse.json({ error: "missing placeName" }, { status: 400 });

    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
    if (!apiKey) {
      const fallbackUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(type)},${encodeURIComponent(placeName)}`;
      const fbResp = await fetch(fallbackUrl, { redirect: "follow" });
      const fbType = fbResp.headers.get("content-type") || "image/jpeg";
      const fbBuf = Buffer.from(await fbResp.arrayBuffer());
      return new NextResponse(fbBuf, { status: 200, headers: { "Content-Type": fbType, "Cache-Control": "public, max-age=86400" } });
    }

    const searchResp = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.photos",
      },
      body: JSON.stringify({ textQuery: placeName })
    });

    if (!searchResp.ok) {
      const fallbackUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(type)},${encodeURIComponent(placeName)}`;
      const fbResp = await fetch(fallbackUrl, { redirect: "follow" });
      const fbType = fbResp.headers.get("content-type") || "image/jpeg";
      const fbBuf = Buffer.from(await fbResp.arrayBuffer());
      return new NextResponse(fbBuf, { status: 200, headers: { "Content-Type": fbType, "Cache-Control": "public, max-age=86400" } });
    }
    const data = await searchResp.json();
    const firstPlace = Array.isArray(data?.places) ? data.places[0] : null;
    const firstPhoto = Array.isArray(firstPlace?.photos) ? firstPlace.photos[0] : null;
    const photoName = firstPhoto?.name || "";
    if (!photoName) {
      const fallbackUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(type)},${encodeURIComponent(placeName)}`;
      const fbResp = await fetch(fallbackUrl, { redirect: "follow" });
      const fbType = fbResp.headers.get("content-type") || "image/jpeg";
      const fbBuf = Buffer.from(await fbResp.arrayBuffer());
      return new NextResponse(fbBuf, { status: 200, headers: { "Content-Type": fbType, "Cache-Control": "public, max-age=86400" } });
    }

    const mediaUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&maxHeightPx=600`;
    const mediaResp = await fetch(mediaUrl, {
      headers: { "X-Goog-Api-Key": apiKey },
      redirect: "follow",
    });
    if (!mediaResp.ok) {
      const fallbackUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(type)},${encodeURIComponent(placeName)}`;
      const fbResp = await fetch(fallbackUrl, { redirect: "follow" });
      const fbType = mediaResp.headers.get("content-type") || "image/jpeg";
      const fbBuf = Buffer.from(await fbResp.arrayBuffer());
      return new NextResponse(fbBuf, { status: 200, headers: { "Content-Type": fbType, "Cache-Control": "public, max-age=86400" } });
    }

    const contentType = mediaResp.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await mediaResp.arrayBuffer();
    return new NextResponse(Buffer.from(arrayBuffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    try {
      const { searchParams } = new URL(req.url);
      const placeName = searchParams.get("placeName") || "";
      const type = searchParams.get("type") || "place";
      if (!placeName) return NextResponse.json({ error: "server error" }, { status: 500 });
      const fallbackUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(type)},${encodeURIComponent(placeName)}`;
      const fbResp = await fetch(fallbackUrl, { redirect: "follow" });
      const fbType = fbResp.headers.get("content-type") || "image/jpeg";
      const fbBuf = Buffer.from(await fbResp.arrayBuffer());
      return new NextResponse(fbBuf, { status: 200, headers: { "Content-Type": fbType, "Cache-Control": "public, max-age=86400" } });
    } catch {
      return NextResponse.json({ error: "server error" }, { status: 500 });
    }
  }
}
