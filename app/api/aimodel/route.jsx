import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const PROMPT = `You are an Al Trip Planner Agent. Your goal is to help the user plan a trip by asking one relevant trip-related question at a time.


Only ask questions about the following details in order, and wait for the user's answer before asking the next:

1. Starting location (source)

2. Destination city or country

3. Group size (Solo, Couple, Family, Friends)

4. Budget (Low, Medium, High)

5. Trip duration (number of days)

6. Travel interests (e.g., adventure, sightseeing, cultural, food, nightlife, relaxation)

7. Special requirements or preferences (if any)

Do not ask multiple questions at once, and never ask irrelevant questions.

If any answer is missing or unclear, politely ask the user to clarify before proceeding.

Always maintain a conversational, interactive style while asking questions.

Along wth response also send which wifcomponent to display for generative UI for example "budget/groupSize/TripDuration/Final), where Final means Al generating co

Once all required information is collected, generate and return a strict JSON response only (no explanations or extra text) with following JSON schema:

resp:Text Resp.

ui: budget/groupSize/tripDuration/Final)'
{
  "resp": "Text Response",
  "ui": "travelers|budget|duration|final|null"
}`;

const FINAL_PROMPT = `Generate a comprehensive travel plan based on the user's requirements. Provide hotel recommendations and a detailed day-by-day itinerary.

Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, Place address, ticket Pricing, Time travel each of the location, with each day plan with best time to visit in JSON format.

{
  "trip_plan": {
    "destination": "string",
    "budget": "string",
    "duration": "string",
    "origin": "string",
    "group_size": "string",
    "preferences": "string",
    "hotels": [
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "price_per_night": "string",
        "hotel_image_url": "string (use placeholder URLs from unsplash.com)",
        "geo_coordinates": {
          "latitude": 0,
          "longitude": 0
        },
        "rating": 0,
        "description": "string"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "day_plan": "string",
        "best_time_to_visit_day": "string",
        "activities": [
          {
            "place_name": "string",
            "place_details": "string",
            "place_image_url": "string (use placeholder URLs from unsplash.com)",
            "geo_coordinates": {
              "latitude": 0,
              "longitude": 0
            },
            "place_address": "string",
            "ticket_pricing": "string",
            "time_travel_each_location": "string",
            "best_time_to_visit": "string"
          }
        ]
      }
    ]
  },
  "resp": "Your trip plan is ready!",
  "ui": "final"
}`

export async function POST(req) {
  try {
    const body = await req.json();
    const { isFinal } = body;
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    // Filter out messages with empty content
    const filteredMessages = messages.filter(msg => msg.content && msg.content.trim().length > 0);

    if (filteredMessages.length === 0) {
      return NextResponse.json({ resp: "Invalid request body.", ui: "error" }, { status: 400 });
    }

    const openrouterKey = process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEYS;
    const useOpenRouter = !!openrouterKey;
    const useOpenAI = !!process.env.OPENAI_API_KEY && !useOpenRouter;
    if (!useOpenRouter && !useOpenAI) {
      return NextResponse.json({ resp: "Server misconfigured: missing AI API key.", ui: "error" }, { status: 500 });
    }

    const client = new OpenAI(
      useOpenRouter
        ? { baseURL: "https://openrouter.ai/api/v1", apiKey: openrouterKey }
        : { apiKey: process.env.OPENAI_API_KEY }
    );
    const model = useOpenRouter ? "openai/gpt-4o-mini" : "gpt-4o-mini";

    const completion = await client.chat.completions.create({
      model,
      messages: [{ role: "system", content: isFinal ? FINAL_PROMPT : PROMPT }, ...filteredMessages],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const responseMessage = completion.choices[0]?.message ?? { content: "" };
    const content = responseMessage.content ?? "";

    // Check if content is empty
    if (!content || content.trim().length === 0) {
      console.error("Empty response from AI model");
      return NextResponse.json({ resp: "I apologize, but I need more information to help you plan your trip. Could you please tell me more about your travel plans?", ui: "text" });
    }

    try {
      const parsedContent = JSON.parse(content);
      return NextResponse.json(parsedContent);
    } catch {
      const cleaned = content.replace(/^```[a-z]*\n?/i, "").replace(/```$/i, "").trim();
      try {
        const parsedContent = JSON.parse(cleaned);
        return NextResponse.json(parsedContent);
      } catch {
        const start = cleaned.indexOf("{");
        const end = cleaned.lastIndexOf("}");
        if (start !== -1 && end !== -1 && end > start) {
          try {
            const parsedContent = JSON.parse(cleaned.slice(start, end + 1));
            return NextResponse.json(parsedContent);
          } catch { }
        }
        return NextResponse.json({ resp: cleaned || content, ui: "text" });
      }
    }
  } catch (e) {
    console.error("API Error:", e);
    const msg = typeof e?.message === "string" ? e.message : "Unexpected server error.";
    return NextResponse.json({ resp: `Error: ${msg}`, ui: "error" }, { status: 500 });
  }
}
