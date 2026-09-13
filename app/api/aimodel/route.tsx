import { NextRequest, NextResponse } from 'next/server';
import arcjet, { tokenBucket } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { TripSummary } from '@/lib/trip-types';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

const FREE_DAILY_CREDITS = 10;
const UNLIMITED_PLAN_ID = "monthly";
const NO_CREDITS_MESSAGE = "No credits left";

const freeUserLimiter = process.env.ARCJET_KEY
  ? arcjet({
      key: process.env.ARCJET_KEY,
      characteristics: ["userId"],
      rules: [
        tokenBucket({
          mode: "LIVE",
          refillRate: FREE_DAILY_CREDITS,
          interval: "1d",
          capacity: FREE_DAILY_CREDITS,
        }),
      ],
    })
  : null;

const EMPTY_TRIP_SUMMARY: TripSummary = {
  origin: "",
  destination: "",
  budget: "",
  group_size: "",
  duration: "",
  travel_interests: "",
  special_requirements: "",
};

const QUESTION_ORDER: Array<keyof Pick<
  TripSummary,
  "origin" | "destination" | "group_size" | "budget" | "duration" | "travel_interests"
>> = ["origin", "destination", "group_size", "budget", "duration", "travel_interests"];

const UI_FOR_FIELD: Record<(typeof QUESTION_ORDER)[number], string> = {
  origin: "source",
  destination: "destination",
  group_size: "groupSize",
  budget: "budget",
  duration: "tripDuration",
  travel_interests: "interests",
};

const SUMMARY_EXTRACTION_PROMPT = `
You extract structured trip planning details from a conversation.

Return ONLY valid JSON with this exact shape:
{
  "origin": "string",
  "destination": "string",
  "budget": "Low | Medium | High | string",
  "group_size": "Solo | Couple | Family | Friends | string",
  "duration": "string",
  "travel_interests": "string",
  "special_requirements": "string"
}

Rules:
- Preserve existing confirmed details unless the user clearly corrects them.
- Extract multiple fields if the user provides them in one message.
- Do not guess missing details.
- Keep empty strings for missing or unclear details.
- Normalize obvious budget/group values, but keep the user's meaning.
- travel_interests should be a concise comma-separated list.
- If the assistant most recently asked the user to choose a destination, treat a place-name answer as destination, not origin.
- If the assistant most recently asked where the user is starting from, treat a place-name answer as origin.
- If the assistant recommended one destination and the user agrees with words like yes, okay, sure, or sounds good, set destination to that recommended place.
`;

const CONVERSATION_PROMPT = `
You are Backpacker, a warm and practical AI travel planner inside a chatbox.

You can answer the user's travel questions naturally, recommend destinations, compare options, and help them decide. While chatting, your goal is to collect the missing trip details needed to create an itinerary.

Return ONLY valid JSON with this exact shape:
{
  "resp": "string"
}

Conversation rules:
- Sound like a real travel assistant, not a form.
- If the user asks for suggestions, give useful suggestions before asking a follow-up.
- Ask only ONE follow-up question at the end.
- The follow-up should collect the next missing field provided to you.
- Do not ask for information that is already present in the confirmed trip summary.
- If the next missing field is destination and the user asked you to suggest, recommend one clear destination and ask if they want to use it.
- If the next missing field is origin, ask where they will start from.
- If the next missing field is group_size, ask who is traveling.
- If the next missing field is budget, ask for low, medium, or high budget.
- If the next missing field is duration, ask how many days.
- If the next missing field is travel_interests, say it is the last question and ask what experiences they care about most.
- Keep the answer concise: 2-5 sentences maximum.
- Do not say you are generating the final itinerary unless no required field is missing.
- Do not use Markdown or code blocks.
`;

const FINAL_PROMPT = `
You are an expert AI Travel Planner.

Your task is to generate a complete, personalized travel itinerary based on the travel details provided by the user.

Generate a practical and realistic travel plan that includes accommodation options, places to visit, activities, transportation information, estimated costs, and a day-wise itinerary.

IMPORTANT INSTRUCTIONS:

1. Use all the information provided by the user.
2. Generate recommendations according to the user's origin, destination, duration, budget, group size, and interests.
3. Consider the selected budget carefully:
   - Low: Budget-friendly hotels and activities.
   - Medium: Comfortable hotels and moderate-priced activities.
   - High: Premium hotels and experiences.
4. Consider the group size when suggesting hotels and activities.
5. Plan activities according to the number of travel days.
6. Do not repeat the same place unnecessarily.
7. Arrange places geographically where possible to reduce unnecessary travel time.
8. Include realistic travel times between locations.
9. Suggest the best approximate time to visit each location.
10. Include popular attractions as well as places matching the user's interests.
11. Include a balanced combination of sightseeing, food, relaxation, and activities.
12. Keep the itinerary practical and not overloaded.
13. Return ONLY valid JSON.
14. Do not include Markdown, explanations, comments, or code blocks.
15. Every field in the output schema must be present.
16. Use numbers for latitude and longitude.
17. Use realistic hotel and attraction information.
18. If exact real-time prices are unavailable, provide estimated prices and clearly mention that they are approximate.
19. Do not invent impossible coordinates. Use approximate geographic coordinates when exact coordinates are unavailable.
20. Hotel image URLs should be valid image URLs or reliable placeholder image URLs.
21. Use the destination country's local currency for every money field, including hotel prices, ticket pricing, and estimated_budget. Examples: India = INR/₹, United Kingdom = GBP/£, United States = USD/$, Europe/France/Italy/Spain/Germany = EUR/€, United Arab Emirates = AED, Japan = JPY/¥, Thailand = THB/฿.
22. Do not use USD/$ unless the destination country normally uses USD or the destination is unclear.

The final response must follow exactly this JSON structure:

{
  "trip_plan": {
    "destination": "string",
    "origin": "string",
    "duration": "string",
    "budget": "string",
    "group_size": "string",
    "travel_interests": ["string"],

    "summary": "string",

    "hotels": [
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "price_per_night": "string",
        "hotel_image_url": "string",
        "rating": "number",
        "description": "string",
        "geo_coordinates": {
          "latitude": "number",
          "longitude": "number"
        }
      }
    ],

    "itinerary": [
      {
        "day": "number",
        "date": "string",
        "title": "string",
        "description": "string",

        "activities": [
          {
            "place_name": "string",
            "place_details": "string",
            "best_time_to_visit": "string",
            "visit_duration": "string",
            "travel_time_from_previous_location": "string",
            "travel_mode": "string",

            "geo_coordinates": {
              "latitude": "number",
              "longitude": "number"
            },

            "place_address": "string",
            "ticket_pricing": "string"
          }
        ]
      }
    ],

    "estimated_budget": {
      "accommodation": "string",
      "food": "string",
      "transportation": "string",
      "activities": "string",
      "total": "string"
    },

    "travel_tips": ["string"]
  }
}

`;

type PlannerMessage = {
  role: "user" | "assistant";
  content: string;
};

type PlannerRequestBody = {
  messages?: PlannerMessage[];
  isFinal?: boolean;
  tripSummary?: TripSummary;
};

const toChatMessages = (messages: PlannerMessage[] = []): ChatCompletionMessageParam[] =>
  messages
    .filter((message) => message.content.trim())
    .map((message) => ({
      role: message.role,
      content: message.content,
    }));

const cleanTripSummary = (summary?: Partial<TripSummary>): TripSummary => ({
  ...EMPTY_TRIP_SUMMARY,
  ...summary,
});

const findMissingField = (summary: TripSummary) =>
  QUESTION_ORDER.find((field) => !summary[field]?.trim());

const extractTripSummary = async (
  chatMessages: ChatCompletionMessageParam[],
  currentSummary?: TripSummary
) => {
  const completion = await openai.chat.completions.create({
    model: 'openai/gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: SUMMARY_EXTRACTION_PROMPT,
      },
      {
        role: 'user',
        content: `Current confirmed summary:\n${JSON.stringify(
          cleanTripSummary(currentSummary),
          null,
          2
        )}\n\nConversation:\n${JSON.stringify(chatMessages, null, 2)}`,
      },
    ],
  });

  const content = completion.choices[0].message.content ?? "{}";
  return cleanTripSummary(JSON.parse(content) as Partial<TripSummary>);
};

const createConversationResponse = async (
  chatMessages: ChatCompletionMessageParam[],
  collectedSummary: TripSummary,
  missingField: (typeof QUESTION_ORDER)[number]
) => {
  const completion = await openai.chat.completions.create({
    model: 'openai/gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: CONVERSATION_PROMPT,
      },
      {
        role: 'user',
        content: `Confirmed trip summary:\n${JSON.stringify(
          collectedSummary,
          null,
          2
        )}\n\nNext missing field to collect: ${missingField}\n\nConversation:\n${JSON.stringify(
          chatMessages,
          null,
          2
        )}`,
      },
    ],
  });

  const content = completion.choices[0].message.content ?? "{}";
  const parsed = JSON.parse(content) as { resp?: string };

  return {
    resp: parsed.resp?.trim() || "Tell me a little more so I can plan this properly.",
    ui: UI_FOR_FIELD[missingField],
    tripSummary: collectedSummary,
  };
};

export async function POST(req: NextRequest) {
  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "Missing OPENROUTER_API_KEY. Add it to .env.local and restart the dev server." },
      { status: 500 }
    );
  }

  try {
    const { messages, isFinal, tripSummary } = (await req.json()) as PlannerRequestBody;

    const { has, userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in to use the AI trip planner." },
        { status: 401 }
      );
    }

    const hasUnlimitedPlanning = has({ plan: UNLIMITED_PLAN_ID });
    const isFreeUser = !hasUnlimitedPlanning;

    if (isFinal && isFreeUser) {
      if (!freeUserLimiter) {
        return NextResponse.json({
          error: "Missing ARCJET_KEY. Add it to .env.local and restart the dev server.",
        }, { status: 500 });
      }

      const decision = await freeUserLimiter.protect(req, {
        userId,
        requested: 1,
      });

      if (decision.isDenied() && decision.reason.isRateLimit()) {
        return NextResponse.json(
          {
            error: NO_CREDITS_MESSAGE,
            resp: NO_CREDITS_MESSAGE,
            ui: "limit",
          },
          { status: 429 }
        );
      }
    }

    const chatMessages = toChatMessages(messages);

    if (chatMessages.length === 0) {
      return NextResponse.json(
        { error: "Please send at least one travel planning message." },
        { status: 400 }
      );
    }

    const collectedSummary = await extractTripSummary(chatMessages, tripSummary);
    const missingField = findMissingField(collectedSummary);

    if (missingField && !isFinal) {
      return NextResponse.json(
        await createConversationResponse(chatMessages, collectedSummary, missingField)
      );
    }

    const finalSystemPrompt = `${FINAL_PROMPT}\n\nUse this final confirmed trip summary exactly and do not drift from it:\n${JSON.stringify(collectedSummary, null, 2)}`;

    const completion = await openai.chat.completions.create({
    model: 'openai/gpt-4o-mini',
    response_format:{ type: 'json_object' },
    messages: [
        {
            role: 'system',
            content: finalSystemPrompt
        },
        ...chatMessages
    ],
  });

  const message = completion.choices[0].message;
    const content = message.content ?? "{}";

    try {
      const parsed = JSON.parse(content);
      return NextResponse.json({
        ...parsed,
        ui: parsed.ui ?? "final",
        resp: parsed.resp ?? "Your itinerary is ready. I added hotels, activities, budget, tips, and a map preview.",
        tripSummary: collectedSummary,
      });
    } catch {
      return NextResponse.json(
        {
          error: "The AI returned invalid JSON. Please try again.",
          resp: content,
        },
        { status: 502 }
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to generate trip plan.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
