import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const prompt = `
You are an AI Travel Planner.

Your job is to collect information from the user step by step and help create a complete travel itinerary.

IMPORTANT RULES:
- Ask only ONE question at a time.
- Never ask multiple questions in one response.
- Return ONLY valid JSON with exactly these keys:
  {
    "response": "single question text",
    "ui": "source|destination|group_size|budget|duration|interest|requirements|none"
  }
- The "ui" field must be a string, not an object.
- The value of "ui" must be one of: source, destination, group_size, budget, duration, interest, requirements, none.
- If the user has already answered a detail, ask for the next missing detail.
- Keep responses short and friendly.
- If the user gives a full trip request like 'Create a trip to Paris from New York', do not answer the whole trip yet. Instead ask the next missing question based on the trip-planning flow.
`;

const allowedUiValues = new Set([
  "source",
  "destination",
  "group_size",
  "budget",
  "duration",
  "interest",
  "requirements",
  "none",
]);

function getFallbackQuestion(messages: Array<{ role: string; content: string }>) {
  const userMessages = messages.filter((message) => message.role === "user");
  const lastUserMessage = userMessages[userMessages.length - 1]?.content ?? "";
  const lastText = lastUserMessage.toLowerCase();

  if (!lastText || !/(from|starting|origin|depart|leave)/.test(lastText)) {
    return {
      response: "Hi! To help plan your trip, could you tell me your starting location?",
      ui: "source",
    };
  }

  if (!/(to |destination|paris|rome|london|new york|dubai|tokyo|maldives|bali|goa|india|france|italy|thailand)/i.test(lastText)) {
    return {
      response: "Great! Where would you like to travel to?",
      ui: "destination",
    };
  }

  return {
    response: "How many people are traveling?",
    ui: "group_size",
  };
}

type AiResponseShape = {
  response?: string;
  resp?: string;
  ui?: string;
};

function normalizeResponse(data: AiResponseShape | null | undefined, fallback: { response: string; ui: string }) {
  const response =
    typeof data?.response === "string" && data.response.trim()
      ? data.response
      : typeof data?.resp === "string" && data.resp.trim()
        ? data.resp
        : fallback.response;

  const ui =
    typeof data?.ui === "string" && allowedUiValues.has(data.ui)
      ? data.ui
      : fallback.ui;

  return {
    response,
    ui,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        {
          response: "Invalid messages.",
          ui: "none",
        },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: prompt,
        },
        ...messages,
      ],
    });

    const content = completion.choices[0]?.message?.content;
    const fallback = getFallbackQuestion(messages);

    if (!content) {
      return NextResponse.json(fallback);
    }

    let parsedResponse: AiResponseShape | null = null;

    try {
      parsedResponse = JSON.parse(content) as AiResponseShape;
    } catch {
      const cleaned = content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      try {
        parsedResponse = JSON.parse(cleaned);
      } catch {
        parsedResponse = {
          response: content,
          ui: "none",
        };
      }
    }

    return NextResponse.json(normalizeResponse(parsedResponse, fallback));
  } catch (error) {
    console.error("AI MODEL ERROR:", error);

    return NextResponse.json(
      {
        response: "Something went wrong. Please try again.",
        ui: "none",
      },
      { status: 500 }
    );
  }
}