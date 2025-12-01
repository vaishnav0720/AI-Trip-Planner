# Travel-Trip AI

## Description

Travel-Trip AI is an AI-powered trip planning application built with Next.js. It guides users through a conversational flow to collect trip requirements (origin, destination, group size, budget, duration, preferences), generates a detailed itinerary with hotels and day-wise activities, and renders a rich UI to preview the trip plan. It integrates with OpenAI/OpenRouter for content generation and Google Places for fetching contextual images, with graceful fallbacks to Unsplash.

## Features

- Conversational trip planning with AI
- Typed generative UI for travelers, budget, duration, and final itinerary
- Timeline-based trip preview with recommended hotels and day plans
- Safe image component with fallbacks and typed image routing (hotel, museum, beach, place)
- Convex integration to persist trip details once per unique fingerprint
- Dark mode friendly UI components and animations

## Project Structure

```
.
├─ app/
│  ├─ api/
│  │  ├─ aimodel/route.jsx                # AI chat completion (prompting, final plan)
│  │  ├─ google-place-photo/route.js      # Image proxy with typed fallbacks
│  │  └─ google-place-detail/route.js     # Place detail API (if used)
│  └─ Create-trip/Components/
│     ├─ Chatbox.jsx                      # Chat UI and generative components rendering
│     ├─ ViewTripUi.jsx                   # Timeline wrapper and persistence
│     ├─ Hotel.jsx                        # Hotel cards using typed image API
│     ├─ Place.jsx                        # Activities list with typed image detection
│     ├─ SafeImage.jsx                    # Safe image loader with fallback rotation
│     ├─ GroupSizeUi.jsx                  # Group size selector
│     ├─ BudgetUi.jsx                     # Budget selector
│     ├─ DurationUi.jsx                   # Duration selector
│     └─ EmptyBoxState.jsx                # Empty state component
├─ components/ui/
│  ├─ timeline.jsx                        # Timeline UI component
│  └─ focus-cards.jsx                     # Focus cards demo gallery
├─ components/PopularCityList.jsx         # Popular cities showcase
├─ convex/                                # Convex generated API bindings
├─ next.config.mjs                        # Next image remote patterns and config
├─ package.json                           # Dependencies and scripts
└─ middleware.js                          # Clerk middleware
```

## Demo

- Run development server: `npm run dev`
- [Visit my game](ai-trip-planner-aocn.vercel.app)


