"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Bot, Loader, Send, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Emptybox from "./Emptybox";
import { v4 as uuidv4 } from "uuid";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUserDetail } from "@/context/UserDetailContext";
import { useUser } from "@clerk/nextjs";
import { TripPlan, TripSummary } from "@/lib/trip-types";

type Message = {
  role: "user" | "assistant";
  content: string;
  ui?: string;
};

type AiResponse = {
  resp?: string;
  ui?: string;
  trip_plan?: TripPlan;
  tripPlan?: TripPlan;
  tripSummary?: TripSummary;
  error?: string;
};

type ChatboxProps = {
  onTripPlanReady?: (tripPlan: TripPlan) => void;
  onViewTrip?: () => void;
  initialPrompt?: string;
};

const finalUiValues = new Set(["final", "finalloading"]);

function Chatbox({ onTripPlanReady, onViewTrip, initialPrompt }: ChatboxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFinal, setIsFinal] = useState(false);
  const [tripSaved, setTripSaved] = useState(false);
  const [tripSummary, setTripSummary] = useState<TripSummary | null>(null);
  const autoPromptTriggered = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const saveTripDetail = useMutation(api.tripDetails.SaveTripDetail);
  const { userDetail } = useUserDetail();
  const { user } = useUser();
  const userEmail = userDetail?.email ?? user?.primaryEmailAddress?.emailAddress ?? "";

  const onSend = useCallback(async (promptText?: string, forceFinalMode = false) => {
    const content = (promptText ?? userInput).trim();

    if (!content || isLoading) return;

    const finalMode = forceFinalMode || isFinal;
    setIsLoading(true);
    setUserInput("");

    const newMsg: Message = {
      role: "user",
      content,
    };

    const nextMessages = [...messages, newMsg];
    setMessages((prev: Message[]) => [...prev, newMsg]);

    try {
      const result = await axios.post<AiResponse>("/api/aimodel", {
        messages: nextMessages,
        isFinal: finalMode,
        tripSummary,
      });

      const responseData = result.data;
      const assistantUi = responseData.ui;
      const tripPayload = responseData.trip_plan ?? responseData.tripPlan ?? null;
      const shouldShowFinal = finalMode || finalUiValues.has(assistantUi ?? "");

      if (responseData.tripSummary) {
        setTripSummary(responseData.tripSummary);
      }

      const assistantResponse: Message = {
        role: "assistant",
        content:
          responseData.resp ??
          (tripPayload
            ? "Your itinerary is ready. I added hotels, activities, budget, tips, and a map preview."
            : "Tell me a little more so I can build the right trip."),
        ui: assistantUi,
      };

      setMessages((prev: Message[]) => [...prev, assistantResponse]);

      if (tripPayload) {
        onTripPlanReady?.(tripPayload);
        if (shouldShowFinal) {
          onViewTrip?.();
        }
      }

      if (shouldShowFinal) {
        setIsFinal(true);
      }

      if (tripPayload && !tripSaved && userEmail && shouldShowFinal) {
        const tripId = uuidv4();

        try {
          await saveTripDetail({
            tripId,
            email: userEmail,
            tripDetail: tripPayload,
          });
          setTripSaved(true);
        } catch (error) {
          console.error("Failed to save trip detail:", error);
        }
      }
    } catch (error) {
      const fallback =
        axios.isAxiosError<AiResponse>(error) && error.response?.data?.resp
          ? error.response.data.resp
          : axios.isAxiosError<AiResponse>(error) && error.response?.data?.error
          ? error.response.data.error
          : "I could not generate the trip right now. Please check your API key and try again.";

      setMessages((prev: Message[]) => [
        ...prev,
        {
          role: "assistant",
          content: fallback,
          ui: axios.isAxiosError<AiResponse>(error) ? error.response?.data?.ui : undefined,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [
    isFinal,
    isLoading,
    messages,
    onTripPlanReady,
    onViewTrip,
    saveTripDetail,
    tripSaved,
    tripSummary,
    userEmail,
    userInput,
  ]);

  useEffect(() => {
    if (!initialPrompt || autoPromptTriggered.current) return;

    autoPromptTriggered.current = true;
    void onSend(initialPrompt);
  }, [initialPrompt, onSend]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="border-b border-slate-200/80 bg-white/80 px-5 py-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-950 text-white shadow-sm">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-950">Backpacker AI</p>
            <p className="text-xs text-slate-500">Ask, decide, and build your trip</p>
          </div>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            Live
          </span>
        </div>
      </div>

      <section className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
        {messages.length === 0 && (
          <Emptybox onSelect={(prompt) => void onSend(prompt)} />
        )}

        {messages.map((msg, index) =>
          msg.role === "user" ? (
            <div className="mt-3 flex justify-end" key={index}>
              <div className="max-w-lg rounded-2xl rounded-br-md bg-slate-950 px-4 py-3 text-sm leading-6 text-white shadow-lg shadow-slate-200">
                {msg.content}
              </div>
            </div>
          ) : (
            <div className="mt-3 flex items-start gap-2.5" key={index}>
              <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                <Bot className="h-4 w-4" />
              </div>
              <div className="w-full max-w-3xl rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-3 text-black shadow-sm">
                <div className="text-[0.95rem] leading-6 text-slate-800">{msg.content}</div>
              </div>
            </div>
          )
        )}

        <div ref={messagesEndRef} />

        {isLoading && (
          <div className="mt-3 flex items-start gap-2.5">
            <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
              <Bot className="h-4 w-4" />
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
              <Loader className="animate-spin" size={16} />
              Thinking through the best route...
            </div>
          </div>
        )}
      </section>


      {/* User Input */}
      {!isFinal && (
        <section className="shrink-0 border-t border-slate-200 bg-white/90 p-4 backdrop-blur">
          <div className="relative rounded-lg border border-slate-200 bg-white shadow-sm focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-100">
            <Textarea
              onChange={(event) => setUserInput(event.target.value)}
              value={userInput}
              placeholder="Ask anything about your trip..."
              className="h-24 max-h-24 min-h-24 w-full resize-none border-0 bg-transparent p-4 pr-16 text-sm shadow-none focus-visible:ring-0"
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  onSend();
                }
              }}
            />

            <Button
              onClick={() => onSend()}
              size="icon"
              className="absolute bottom-4 right-4 rounded-lg bg-slate-950 text-white hover:bg-slate-800"
              disabled={isLoading || !userInput.trim()}
              aria-label="Send message"
            >
              {isLoading ? <Loader className="animate-spin" size={20} /> : <Send size={20} />}
            </Button>
          </div>
        </section>
      )}

    </div>
  );
}

export default Chatbox;
