"use client";

import React, { Suspense, useRef, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Chatbox from "./_components/chatbox";
import { Timeline } from "@/components/ui/timeline";
import {
  CalendarDays,
  Clock,
  Hotel,
  LocateFixed,
  MapPin,
  Navigation,
  Sparkles,
  Star,
} from "lucide-react";
import { Activity, TripPlan } from "@/lib/trip-types";

const destinationImages: Record<string, string> = {
  dubai: "/destinations/dubai.jpg",
  goa: "/destinations/goa.jpg",
  manali: "/destinations/manali.jpg",
  paris: "/destinations/paris.jpg",
};

const fallbackTravelImages = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
];

const fallbackHotelImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80",
];

const getDestinationImage = (destination: string) => {
  const normalizedDestination = destination.toLowerCase();
  const matchedKey = Object.keys(destinationImages).find((key) =>
    normalizedDestination.includes(key)
  );

  return matchedKey ? destinationImages[matchedKey] : fallbackTravelImages[0];
};

const buildTravelPhotoUrl = (query: string) =>
  `/api/travel-photo?query=${encodeURIComponent(query)}`;

const getFallbackActivityImage = (activity: Activity, index: number) => {
  const text = `${activity.place_name} ${activity.place_details}`.toLowerCase();

  if (/\b(beach|sea|water|island|coast)\b/.test(text)) return fallbackTravelImages[0];
  if (/\b(mountain|trek|hike|trail|waterfall|forest)\b/.test(text)) return fallbackTravelImages[3];

  return fallbackTravelImages[index % fallbackTravelImages.length];
};

const getHotelImage = (imageUrl: string | undefined, index: number) =>
  imageUrl?.trim() || fallbackHotelImages[index % fallbackHotelImages.length];

const getCurrencySymbol = (value: string) => {
  const match = value.match(/[₹$£€¥₩₽₺฿₫₱₦₴₲₵₡₪]|AED|INR|GBP|USD|EUR|JPY|THB/i);
  return match?.[0].toUpperCase() ?? "₹";
};

const buildMapQuery = (tripPlan: TripPlan) => {
  const firstActivity = tripPlan.itinerary
    .flatMap((day) => day.activities)
    .find((activity) => activity.geo_coordinates);
  const coordinates =
    firstActivity?.geo_coordinates ?? tripPlan.hotels?.[0]?.geo_coordinates;
  const query = coordinates
    ? `${coordinates.latitude},${coordinates.longitude}`
    : tripPlan.destination;

  return query;
};

const buildMapUrl = (query: string) => {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
};

const buildGoogleMapsSearchUrl = (query: string) => {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

const buildDirectionsUrl = (destination: string, activity: Activity) => {
  const coordinates = activity.geo_coordinates;
  const query = coordinates
    ? `${coordinates.latitude},${coordinates.longitude}`
    : activity.place_address || activity.place_name;

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    query
  )}&travelmode=driving&dir_action=navigate&query=${encodeURIComponent(
    `${activity.place_name}, ${destination}`
  )}`;
};

function PlannerContent() {
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [activeMapQuery, setActiveMapQuery] = useState<string>("");
  const mapPreviewRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();
  const destination = searchParams.get("destination");
  const initialPrompt = destination
    ? `I want to plan a trip to ${destination}.`
    : undefined;

  const showInMapPreview = (query: string) => {
    setActiveMapQuery(query);
    window.setTimeout(() => {
      mapPreviewRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  return (
    <div className="min-h-[calc(100dvh-64px)] bg-[radial-gradient(circle_at_top_left,#e0f2fe_0,#f8fafc_34%,#f7f8f4_72%)]">
      <div className="mx-auto grid h-[calc(100dvh-64px)] max-w-[1500px] grid-cols-1 gap-4 p-4 md:p-5 xl:grid-cols-[minmax(360px,0.8fr)_minmax(0,1.2fr)]">
        <div className="min-h-0 overflow-hidden rounded-lg border border-white/70 bg-white/90 shadow-xl shadow-slate-200/70 backdrop-blur">
          <Chatbox
            onTripPlanReady={(plan) => {
              setTripPlan(plan);
              setActiveMapQuery(buildMapQuery(plan));
            }}
            initialPrompt={initialPrompt}
          />
        </div>

        <aside className="min-h-0 overflow-hidden rounded-lg border border-white/70 bg-white/90 shadow-xl shadow-slate-200/70 backdrop-blur">
          <div className="border-b border-slate-200/80 bg-white/85 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Live Trip Workspace
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950">Map, Hotels and Plan</h2>
          </div>

        {!tripPlan && (
            <div className="relative grid h-[calc(100dvh-166px)] place-items-center overflow-hidden bg-slate-950 p-6">
              <Image
                src="/destinations/dubai.jpg"
                alt="Dubai skyline travel preview"
                fill
                priority
                sizes="(min-width: 1280px) 60vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/25 to-slate-950/65" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.34),rgba(15,23,42,0.34))]" />
              <div className="relative z-10 max-w-md rounded-lg border border-white/80 bg-white/90 p-6 text-center shadow-2xl shadow-slate-950/25 backdrop-blur-md">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-100">
                  <MapPin className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-950">Your trip board is waiting</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Once the assistant has your source, destination, budget, group, days, and interests,
                  this space fills with Google Maps, hotels, routes, costs, and daily activities.
                </p>
              </div>
          </div>
        )}

        {tripPlan && (
            <div className="h-[calc(100dvh-166px)] overflow-y-auto">
              {(() => {
                const mapQuery = activeMapQuery || buildMapQuery(tripPlan);

                return (
              <>
              <div className="relative min-h-[420px] overflow-hidden border-b border-slate-200 bg-slate-950">
                <Image
                  src={buildTravelPhotoUrl(`${tripPlan.destination} travel destination`)}
                  alt={`${tripPlan.destination} travel preview`}
                  fill
                  priority
                  unoptimized
                  sizes="(min-width: 1280px) 60vw, 100vw"
                  className="object-cover opacity-80"
                  onError={(event) => {
                    event.currentTarget.src = getDestinationImage(tripPlan.destination);
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/25 via-slate-950/30 to-slate-950/80" />
                <div
                  ref={mapPreviewRef}
                  className="absolute right-4 top-4 z-10 h-44 w-[min(380px,calc(100%-2rem))] overflow-hidden rounded-lg border border-white/35 shadow-2xl ring-0 transition focus-within:ring-4 focus-within:ring-emerald-300/50"
                >
                  <iframe
                    title={`${tripPlan.destination} Google Map`}
                    src={buildMapUrl(mapQuery)}
                    className="h-full w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <a
                    href={buildGoogleMapsSearchUrl(mapQuery)}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-2 left-2 inline-flex h-8 items-center gap-1.5 rounded-md bg-white/95 px-2.5 text-xs font-bold text-slate-950 shadow-sm backdrop-blur transition hover:bg-white"
                  >
                    <MapPin className="h-3.5 w-3.5 text-emerald-700" />
                    Open Map
                  </a>
                </div>
                <div className="absolute bottom-0 left-0 right-0 z-20 p-5 md:p-7">
                  <div className="max-w-3xl">
                    <span className="inline-flex items-center gap-2 rounded-md bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
                      <Sparkles className="h-3.5 w-3.5" />
                      AI Generated Trip
                    </span>
                    <h3 className="mt-3 text-4xl font-black leading-tight text-white md:text-5xl">
                      {tripPlan.destination}
                    </h3>
                    <p className="mt-3 flex flex-wrap items-center gap-2 text-sm font-medium text-white/85">
                      <span>{tripPlan.origin}</span>
                      <span>to</span>
                      <span>{tripPlan.destination}</span>
                      <span>|</span>
                      <span>{tripPlan.duration}</span>
                      <span>|</span>
                      <span>{tripPlan.budget}</span>
                      <span>|</span>
                      <span>{tripPlan.group_size}</span>
                    </p>
                    <p className="mt-4 max-w-2xl text-sm leading-6 text-white/90 md:text-base">
                      {tripPlan.summary}
                    </p>
                  </div>
                </div>
            </div>

              <div className="space-y-5 p-5">
                <section>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {Object.entries(tripPlan.estimated_budget).map(([label, value]) => (
                      <div key={label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                          <span className="grid h-5 w-5 place-items-center rounded-md bg-emerald-50 text-[10px] font-black text-emerald-700">
                            {getCurrencySymbol(String(value))}
                          </span>
                          {label}
                        </div>
                        <div className="mt-2 text-base font-bold text-slate-950">{value}</div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="mb-3 flex items-center gap-2">
                    <Hotel className="h-5 w-5 text-emerald-700" />
                    <h3 className="text-lg font-semibold text-slate-950">Hotels</h3>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    {tripPlan.hotels.map((hotel, index) => (
                      <article key={hotel.hotel_name} className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-xl">
                        <div className="relative h-44 bg-slate-100">
                          <Image
                            src={buildTravelPhotoUrl(
                              `${hotel.hotel_name} ${hotel.hotel_address} ${tripPlan.destination} hotel`
                            )}
                            alt={hotel.hotel_name}
                            fill
                            unoptimized
                            sizes="(min-width: 1024px) 30vw, 100vw"
                            className="object-cover"
                            onError={(event) => {
                              event.currentTarget.src = getHotelImage(hotel.hotel_image_url, index);
                            }}
                          />
                          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-white/95 px-2.5 py-1.5 text-sm font-bold text-amber-700 shadow-sm backdrop-blur">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            {hotel.rating}
                          </span>
                          <div className="absolute bottom-3 left-3 rounded-md bg-slate-950/85 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur">
                            {hotel.price_per_night}
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="text-lg font-bold text-slate-950">{hotel.hotel_name}</h4>
                          <p className="mt-1 text-sm text-slate-600">{hotel.hotel_address}</p>
                          <p className="mt-3 text-sm leading-6 text-slate-700">{hotel.description}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                showInMapPreview(
                                  `${hotel.hotel_name}, ${hotel.hotel_address}, ${tripPlan.destination}`
                                )
                              }
                              className="inline-flex h-9 items-center gap-2 rounded-md bg-emerald-600 px-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                            >
                              <LocateFixed className="h-4 w-4" />
                              Show on map
                            </button>
                            <a
                              href={buildGoogleMapsSearchUrl(
                                `${hotel.hotel_name}, ${hotel.hotel_address}, ${tripPlan.destination}`
                              )}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
                            >
                              <MapPin className="h-4 w-4" />
                              Open Google Maps
                            </a>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="mb-3 flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-emerald-700" />
                    <h3 className="text-lg font-semibold text-slate-950">Day-wise Itinerary</h3>
                  </div>
                  <Timeline
                    data={tripPlan.itinerary.map((day, dayIndex) => ({
                      title: `Day ${day.day}`,
                      content: (
                        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:border-emerald-200 hover:shadow-xl">
                          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white p-4">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                                  Day {day.day}
                                </p>
                                <h4 className="mt-1 text-xl font-black text-slate-950">
                                  {day.title}
                                </h4>
                                <p className="mt-2 text-sm leading-6 text-slate-700">{day.description}</p>
                              </div>
                              {day.date && (
                                <span className="rounded-md bg-slate-100 px-2.5 py-1.5 text-sm font-bold text-slate-600">
                                  {day.date}
                                </span>
                              )}
                            </div>
                          </div>

                        <div className="grid gap-3 p-4">
                          {day.activities.map((activity, activityIndex) => (
                            <div key={`${day.day}-${activity.place_name}`} className="grid overflow-hidden rounded-lg border border-slate-100 bg-[#fbfbf8] shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md md:grid-cols-[180px_1fr]">
                              <div className="relative h-44 w-full md:h-full">
                              <Image
                                src={buildTravelPhotoUrl(
                                  `${activity.place_name} ${activity.place_address || tripPlan.destination} travel`
                                )}
                                alt={activity.place_name}
                                fill
                                unoptimized
                                sizes="(min-width: 1024px) 180px, 100vw"
                                className="object-cover"
                                onError={(event) => {
                                  event.currentTarget.src = getFallbackActivityImage(
                                    activity,
                                    dayIndex + activityIndex
                                  );
                                }}
                              />
                              </div>
                              <div className="p-4">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div>
                                    <h5 className="font-bold text-slate-950">{activity.place_name}</h5>
                                    <p className="mt-1 text-sm leading-6 text-slate-700">{activity.place_details}</p>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        showInMapPreview(
                                          `${activity.place_name}, ${
                                            activity.place_address || tripPlan.destination
                                          }`
                                        )
                                      }
                                      className="inline-flex h-9 items-center gap-2 rounded-md bg-emerald-600 px-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                                    >
                                      <LocateFixed className="h-4 w-4" />
                                      Map
                                    </button>
                                    <a
                                      href={buildDirectionsUrl(tripPlan.destination, activity)}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex h-9 items-center gap-2 rounded-md bg-slate-950 px-3 text-sm font-medium text-white transition hover:bg-slate-800"
                                    >
                                      <Navigation className="h-4 w-4" />
                                      Route
                                    </a>
                                  </div>
                                </div>
                                <div className="mt-4 grid gap-2 text-xs font-medium text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                                  <span className="inline-flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    {activity.best_time_to_visit}
                                  </span>
                                  <span>{activity.visit_duration}</span>
                                  <span>{activity.travel_mode}</span>
                                  <span>{activity.ticket_pricing}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        </div>
                      ),
                    }))}
                  />
                </section>

                <section className="rounded-lg border border-slate-200 bg-emerald-50 p-4">
                  <h3 className="text-lg font-semibold text-slate-950">Travel Tips</h3>
                  <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700 md:grid-cols-2">
                    {tripPlan.travel_tips.map((tip) => (
                      <li key={tip}>- {tip}</li>
                    ))}
                  </ul>
                </section>
              </div>
              </>
                );
              })()}
          </div>
        )}
        </aside>
      </div>
    </div>
  );
}

function Page() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100dvh-64px)] bg-[#f7f8f4]" />}>
      <PlannerContent />
    </Suspense>
  );
}

export default Page;
