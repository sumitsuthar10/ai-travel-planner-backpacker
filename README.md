# Backpacker - AI Travel Planner

Backpacker is an AI-powered travel planning web app built with Next.js. It helps users create personalized trip itineraries through a chat-based planner, then displays the generated plan with hotels, day-wise activities, budget estimates, travel tips, destination images, and Google Maps previews.

The project focuses on making trip planning easier for backpackers and travelers who want quick, practical, and budget-aware recommendations instead of manually researching every place, hotel, route, and activity.

## Live Website

Visit the deployed app here: [https://ai-travel-planner-backpacker.vercel.app/](https://ai-travel-planner-backpacker.vercel.app/)

## What This Project Does

- Collects trip details through a conversational AI chat interface.
- Asks for important planning inputs such as source, destination, budget, group size, trip duration, and travel interests.
- Generates a complete AI trip plan using OpenRouter/OpenAI-compatible chat completion.
- Shows destination summary, hotel suggestions, estimated cost breakdown, travel tips, and day-wise itinerary.
- Displays places and routes with Google Maps embeds and external map links.
- Saves generated trips for signed-in users using Convex.
- Provides a "My Trips" page where users can view previously saved itineraries.
- Uses Clerk for authentication and subscription-aware access.
- Limits free users to 10 final itinerary generations per day with Arcjet.
- Fetches travel-related photos from Unsplash or Pexels when API keys are available.

## Main Features

### AI Trip Chat

Users can describe what kind of trip they want, ask questions, get suggestions, and gradually build a complete trip plan. The assistant collects missing details one by one and generates the final itinerary only after it has enough information.

### Personalized Itinerary Generation

The final trip plan includes:

- Origin and destination
- Duration
- Budget category
- Group size
- Travel interests
- Trip summary
- Hotel recommendations
- Daily itinerary
- Activity details
- Best time to visit each place
- Travel time and travel mode
- Approximate ticket pricing
- Estimated budget split
- Travel tips

### Saved Trips

When a signed-in user generates a final trip plan, the app saves it in Convex. Users can later open the "My Trips" page to browse and review their saved travel plans.

### Maps and Photos

The planner includes map previews using Google Maps embed URLs. It also loads destination and activity images from local assets, Unsplash, or Pexels, with fallback images for common destinations such as Dubai, Goa, Manali, and Paris.

### Authentication and Pricing

Clerk handles sign-in, sign-up, user sessions, and pricing UI. Protected pages such as `/plan` and `/my-trips` require authentication.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Clerk authentication
- Convex database
- OpenRouter/OpenAI SDK
- Arcjet rate limiting
- Axios
- Lucide React icons
- Unsplash and Pexels image APIs

## Project Structure

```text
app/
  page.tsx                  Home page
  plan/                     AI trip planning workspace
  my-trips/                 Saved trip dashboard
  Pricing/                  Clerk pricing page
  api/aimodel/              AI itinerary generation API
  api/travel-photo/         Travel photo fetch API
  api/place-photo/          Photo redirect API

convex/
  Schema.ts                 Convex database schema
  user.ts                   User creation mutation
  tripDetails.ts            Trip save and fetch functions

components/
  ui/                       Reusable UI components

context/
  UserDetailContext.tsx     Current user detail context

public/
  destinations/             Local fallback destination images
  images/                   App images and logo
```

## How It Works

1. User signs in with Clerk.
2. User opens the planner and chats with Backpacker AI.
3. The app sends chat history and collected trip details to `/api/aimodel`.
4. The API extracts structured trip information from the conversation.
5. If required fields are missing, the assistant asks one follow-up question.
6. Once enough information is available, the API generates a full itinerary.
7. The frontend renders hotels, activities, map previews, budget estimates, and travel tips.
8. The final trip is saved in Convex and becomes available on the "My Trips" page.

## Environment Variables

Create a `.env.local` file in the project root and add the required keys.

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/

NEXT_PUBLIC_CONVEX_URL=
CONVEX_DEPLOYMENT=

OPENROUTER_API_KEY=
ARCJET_KEY=

UNSPLASH_ACCESS_KEY=
PEXELS_API_KEY=
```

Notes:

- `OPENROUTER_API_KEY` is required for AI trip generation.
- `NEXT_PUBLIC_CONVEX_URL` is required for Convex client access.
- Clerk keys are required for authentication.
- `ARCJET_KEY` is required for free-user daily credit limiting.
- Unsplash and Pexels keys are optional, but improve destination and activity images.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the app:

```text
http://localhost:3000
```

Run linting:

```bash
npm run lint
```

Build for production:

```bash
npm run build
```

## Current Status

The app currently supports the main travel planning flow:

- Landing page
- Authentication
- AI chat-based trip planning
- Final itinerary generation
- Saved trips
- Maps preview
- Travel photo loading
- Pricing page
- Free-user itinerary credit limit

## Future Scope

- Add real hotel booking integrations.
- Add live flight, train, and bus search.
- Add collaborative trip planning with friends or family.
- Allow users to edit generated itineraries manually.
- Add export options such as PDF, email, or shareable public links.
- Add calendar integration for planned activities.
- Improve budget accuracy with live pricing APIs.
- Add weather-based trip suggestions.
- Add multilingual support.
- Add admin dashboard for monitoring users, trips, credits, and API usage.
- Add richer filters for travel style, safety, food preferences, accessibility, and visa requirements.
- Add offline trip access for saved itineraries.

## Deployment

The live version is deployed on Vercel: [https://ai-travel-planner-backpacker.vercel.app/](https://ai-travel-planner-backpacker.vercel.app/)

This app can also be deployed on Vercel or any platform that supports Next.js. Before deployment, configure all required environment variables in the hosting provider dashboard and connect the Convex, Clerk, OpenRouter, and Arcjet services.

## Project Name Meaning

Backpacker represents simple, flexible, and budget-conscious travel. The app is designed to help users plan smarter trips without spending hours searching across multiple websites.
