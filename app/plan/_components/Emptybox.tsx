import React from "react";
import Image from "next/image";
import { Compass, Map, Mountain, Plane } from "lucide-react";

type EmptyboxProps = {
  onSelect?: (prompt: string) => void;
};

const suggestions = [
  {
    label: "Create New Trip",
    prompt: "Create a new trip plan for me.",
    icon: Plane,
    accent: "text-blue-600 bg-blue-100",
    image: "/destinations/paris.jpg",
  },
  {
    label: "Inspire me where to go",
    prompt: "Inspire me with destination ideas for my next trip.",
    icon: Compass,
    accent: "text-emerald-600 bg-emerald-100",
    image: "/destinations/dubai.jpg",
  },
  {
    label: "Discover Hidden gems",
    prompt: "Discover hidden gems and unique places to visit.",
    icon: Map,
    accent: "text-orange-600 bg-orange-100",
    image: "/destinations/goa.jpg",
  },
  {
    label: "Adventure Destination",
    prompt: "Suggest an adventure-focused destination for me.",
    icon: Mountain,
    accent: "text-amber-600 bg-amber-100",
    image: "/destinations/manali.jpg",
  },
];

function Emptybox({ onSelect }: EmptyboxProps) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center px-4 py-4">
      <h1 className="text-center text-4xl font-black leading-[1.02] text-slate-950 md:text-5xl">
        Start Planning new <span className="text-orange-500">Trip</span> using AI
      </h1>

      <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-7 text-slate-600 md:text-lg">
        Discover personalized travel itineraries, find the best destinations, and plan your dream
        vacation effortlessly with the power of AI. Let our smart assistant do the hard work while
        you enjoy the journey.
      </p>

      {onSelect ? (
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {suggestions.map(({ label, prompt, icon: Icon, accent, image }) => (
            <button
              key={label}
              type="button"
              onClick={() => onSelect(prompt)}
              className="group overflow-hidden rounded-lg border border-slate-200 bg-white text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-xl"
            >
              <span className="relative block h-28 w-full overflow-hidden bg-slate-100">
                <Image
                  src={image}
                  alt={label}
                  fill
                  sizes="(min-width: 640px) 280px, 100vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-slate-950/55 to-transparent" />
                <span className={`absolute bottom-3 left-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accent}`}>
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                </span>
              </span>
              <span className="block px-4 py-3 text-base font-bold text-slate-950">
                {label}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white/80 p-6 text-center text-slate-600 shadow-sm">
          Ask me to plan a trip, suggest a destination, or create a full itinerary.
        </div>
      )}
    </div>
  );
}

export default Emptybox;
