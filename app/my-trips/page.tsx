"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  Hotel,
  Loader,
  LocateFixed,
  MapPin,
  Navigation,
  Plane,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useUserDetail } from "@/context/UserDetailContext";
import { Activity, TripPlan } from "@/lib/trip-types";

type SavedTrip = {
  _id: string;
  tripId: string;
  tripDetail: TripPlan;
  createdAt: number;
};

const destinationImages: Record<string, string> = {
  dubai: "/destinations/dubai.jpg",
  goa: "/destinations/goa.jpg",
  manali: "/destinations/manali.jpg",
  paris: "/destinations/paris.jpg",
};

const getDestinationImage = (destination?: string) => {
  const normalizedDestination = destination?.toLowerCase() ?? "";
  const matchedKey = Object.keys(destinationImages).find((key) =>
    normalizedDestination.includes(key)
  );

  return matchedKey ? destinationImages[matchedKey] : "/destinations/goa.jpg";
};

const getTripImage = (trip: TripPlan) =>
  `/api/travel-photo?query=${encodeURIComponent(`${trip.destination} travel destination skyline landscape`)}`;

const getFallbackActivityImage = (activity: Activity, index: number) => {
  const text = `${activity.place_name} ${activity.place_details}`.toLowerCase();

  if (/\b(beach|sea|water|island|coast|lake)\b/.test(text)) return "/destinations/goa.jpg";
  if (/\b(mountain|trek|hike|trail|snow|forest)\b/.test(text)) return "/destinations/manali.jpg";
  if (/\b(city|mall|tower|market|museum|palace)\b/.test(text)) return "/destinations/dubai.jpg";

  return index % 2 === 0 ? "/destinations/paris.jpg" : "/destinations/goa.jpg";
};

const getHotelImage = (trip: TripPlan, hotelName: string, imageUrl?: string) =>
  imageUrl?.trim() ||
  `/api/travel-photo?query=${encodeURIComponent(`${hotelName} hotel ${trip.destination}`)}`;

const formatTripDate = (timestamp: number) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(timestamp));

const buildMapQuery = (trip: TripPlan) => {
  const firstActivity = trip.itinerary
    ?.flatMap((day) => day.activities)
    .find((activity) => activity.geo_coordinates);
  const coordinates = firstActivity?.geo_coordinates ?? trip.hotels?.[0]?.geo_coordinates;

  return coordinates ? `${coordinates.latitude},${coordinates.longitude}` : trip.destination;
};

const buildMapUrl = (query: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

const buildGoogleMapsSearchUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

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

const getCurrencySymbol = (value: string) => {
  const match = value.match(/[₹$£€¥₩₽₺฿₫₱₦₴₲₵₡₪]|AED|INR|GBP|USD|EUR|JPY|THB/i);
  return match?.[0].toUpperCase() ?? "₹";
};

function MyTripsPage() {
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const { userDetail } = useUserDetail();
  const { user, isLoaded } = useUser();
  const userEmail = userDetail?.email ?? user?.primaryEmailAddress?.emailAddress ?? "";
  const trips = useQuery(api.tripDetails.getUserTrips, userEmail ? { email: userEmail } : "skip") as
    | SavedTrip[]
    | undefined;
  const selectedSavedTrip = useMemo(
    () => trips?.find((trip) => trip.tripId === selectedTripId) ?? trips?.[0] ?? null,
    [selectedTripId, trips]
  );
  const selectedTrip = selectedSavedTrip?.tripDetail;
  const selectedMapQuery = selectedTrip ? buildMapQuery(selectedTrip) : "";

  return (
    <main className="min-h-[calc(100dvh-64px)] bg-[radial-gradient(circle_at_top_left,#e0f2fe_0,#f8fafc_36%,#f7f8f4_78%)] px-4 py-8 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Saved itineraries
            </p>
            <h1 className="mt-2 text-4xl font-black text-slate-950 md:text-5xl">My Trips</h1>
          </div>
          <Link
            href="/plan"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
          >
            <Plane className="h-4 w-4" />
            Plan Trip
          </Link>
        </div>

        {(!isLoaded || trips === undefined) && (
          <div className="grid min-h-[360px] place-items-center rounded-lg border border-white/70 bg-white/85 shadow-xl shadow-slate-200/70">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
              <Loader className="h-4 w-4 animate-spin" />
              Loading trips...
            </div>
          </div>
        )}

        {isLoaded && trips?.length === 0 && (
          <div className="grid min-h-[360px] place-items-center rounded-lg border border-dashed border-slate-300 bg-white/85 p-6 text-center shadow-xl shadow-slate-200/70">
            <div>
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                <MapPin className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-2xl font-bold text-slate-950">No saved trips yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                Create a trip plan and your saved itinerary will appear here.
              </p>
            </div>
          </div>
        )}

        {trips && trips.length > 0 && (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_520px]">
            <section className="grid content-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {trips.map((savedTrip) => {
                const trip = savedTrip.tripDetail;
                const isSelected = savedTrip.tripId === selectedSavedTrip?.tripId;

                return (
                  <button
                    key={savedTrip._id}
                    type="button"
                    onClick={() => setSelectedTripId(savedTrip.tripId)}
                    className={`group overflow-hidden rounded-lg border bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-xl ${
                      isSelected ? "border-emerald-400 ring-4 ring-emerald-100" : "border-slate-200"
                    }`}
                  >
                    <div className="relative h-56 bg-slate-100">
                      <Image
                        src={getTripImage(trip)}
                        alt={`${trip.destination} trip preview`}
                        fill
                        unoptimized
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition duration-300 group-hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.src = getDestinationImage(trip.destination);
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 to-transparent opacity-80" />
                      <span className="absolute bottom-3 left-3 rounded-md bg-white/95 px-2.5 py-1 text-xs font-bold text-slate-900 shadow-sm backdrop-blur">
                        {formatTripDate(savedTrip.createdAt)}
                      </span>
                    </div>
                    <div className="p-4">
                      <h2 className="flex items-center gap-2 text-xl font-black text-slate-950">
                        <span>{trip.origin}</span>
                        <ArrowRight className="h-5 w-5 shrink-0" />
                        <span>{trip.destination}</span>
                      </h2>
                      <p className="mt-2 text-sm font-medium text-slate-500">
                        {trip.duration} trip with {trip.budget} budget
                      </p>
                    </div>
                  </button>
                );
              })}
            </section>

            {selectedTrip && (
              <aside className="h-fit overflow-hidden rounded-lg border border-white/70 bg-white/90 shadow-xl shadow-slate-200/70 backdrop-blur xl:sticky xl:top-6">
                <div className="relative min-h-80 bg-slate-950">
                  <Image
                    src={getTripImage(selectedTrip)}
                    alt={`${selectedTrip.destination} travel preview`}
                    fill
                    priority
                    unoptimized
                    sizes="(min-width: 1280px) 520px, 100vw"
                    className="object-cover opacity-80"
                    onError={(event) => {
                      event.currentTarget.src = getDestinationImage(selectedTrip.destination);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-950/25 via-slate-950/35 to-slate-950/85" />
                  <div className="absolute right-4 top-4 h-36 w-[min(260px,calc(100%-2rem))] overflow-hidden rounded-lg border border-white/35 shadow-2xl">
                    <iframe
                      title={`${selectedTrip.destination} Google Map`}
                      src={buildMapUrl(selectedMapQuery)}
                      className="h-full w-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h2 className="text-3xl font-black leading-tight text-white">
                      {selectedTrip.origin} to {selectedTrip.destination}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-white/85">{selectedTrip.summary}</p>
                  </div>
                </div>

                <div className="max-h-[calc(100dvh-140px)] overflow-y-auto p-5">
                  <div className="flex flex-wrap gap-3 text-sm font-semibold text-slate-700">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4" />
                      {selectedTrip.duration}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Wallet className="h-4 w-4" />
                      {selectedTrip.budget}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      {selectedTrip.group_size}
                    </span>
                  </div>

                  <section className="mt-6">
                    <h3 className="flex items-center gap-2 text-xl font-black text-slate-950">
                      <Hotel className="h-5 w-5 text-emerald-700" />
                      Hotels
                    </h3>
                    <div className="mt-3 grid gap-4">
                      {selectedTrip.hotels?.map((hotel) => (
                        <article
                          key={hotel.hotel_name}
                          className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
                        >
                          <div className="relative h-40 bg-slate-100">
                            <Image
                              src={getHotelImage(selectedTrip, hotel.hotel_name, hotel.hotel_image_url)}
                              alt={hotel.hotel_name}
                              fill
                              unoptimized
                              sizes="520px"
                              className="object-cover"
                              onError={(event) => {
                                event.currentTarget.src = getDestinationImage(selectedTrip.destination);
                              }}
                            />
                            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-white/95 px-2.5 py-1 text-sm font-bold text-amber-700 shadow-sm backdrop-blur">
                              <Star className="h-3.5 w-3.5 fill-current" />
                              {hotel.rating}
                            </span>
                          </div>
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h4 className="font-bold text-slate-950">{hotel.hotel_name}</h4>
                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                  {hotel.hotel_address}
                                </p>
                              </div>
                              <p className="shrink-0 text-sm font-bold text-emerald-700">
                                {hotel.price_per_night}
                              </p>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-slate-700">{hotel.description}</p>
                            <a
                              href={buildGoogleMapsSearchUrl(
                                `${hotel.hotel_name}, ${hotel.hotel_address}, ${selectedTrip.destination}`
                              )}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
                            >
                              <LocateFixed className="h-4 w-4" />
                              View on Map
                            </a>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>

                  <section className="mt-6">
                    <h3 className="text-xl font-black text-slate-950">Estimated Budget</h3>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {Object.entries(selectedTrip.estimated_budget ?? {}).map(([label, value]) => (
                        <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                          <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
                          <p className="mt-1 font-black text-slate-950">
                            <span className="text-emerald-700">{getCurrencySymbol(String(value))}</span>{" "}
                            {String(value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="mt-6">
                    <h3 className="text-xl font-black text-slate-950">Day-wise Itinerary</h3>
                    <div className="mt-3 grid gap-4">
                      {selectedTrip.itinerary?.map((day, dayIndex) => (
                        <article key={`${selectedSavedTrip?.tripId}-${day.day}`} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                                Day {day.day}
                              </p>
                              <h4 className="mt-1 text-lg font-black text-slate-950">{day.title}</h4>
                            </div>
                            {day.date && (
                              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                                {day.date}
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-700">{day.description}</p>

                          <div className="mt-4 grid gap-3">
                            {day.activities?.map((activity, activityIndex) => (
                              <div
                                key={`${day.day}-${activity.place_name}`}
                                className="overflow-hidden rounded-lg border border-slate-100 bg-[#fbfbf8]"
                              >
                                <div className="relative h-36 bg-slate-100">
                                  <Image
                                    src={`/api/travel-photo?query=${encodeURIComponent(
                                      `${activity.place_name} ${activity.place_address || selectedTrip.destination} travel`
                                    )}`}
                                    alt={activity.place_name}
                                    fill
                                    unoptimized
                                    sizes="520px"
                                    className="object-cover"
                                    onError={(event) => {
                                      event.currentTarget.src = getFallbackActivityImage(
                                        activity,
                                        dayIndex + activityIndex
                                      );
                                    }}
                                  />
                                </div>
                                <div className="p-3">
                                  <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                      <h5 className="font-bold text-slate-950">{activity.place_name}</h5>
                                      <p className="mt-1 text-sm leading-6 text-slate-700">
                                        {activity.place_details}
                                      </p>
                                    </div>
                                    <div className="flex gap-2">
                                      <a
                                        href={buildGoogleMapsSearchUrl(
                                          `${activity.place_name}, ${
                                            activity.place_address || selectedTrip.destination
                                          }`
                                        )}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex h-8 items-center gap-1.5 rounded-md bg-emerald-600 px-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
                                      >
                                        <MapPin className="h-3.5 w-3.5" />
                                        Map
                                      </a>
                                      <a
                                        href={buildDirectionsUrl(selectedTrip.destination, activity)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex h-8 items-center gap-1.5 rounded-md bg-slate-950 px-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
                                      >
                                        <Navigation className="h-3.5 w-3.5" />
                                        Route
                                      </a>
                                    </div>
                                  </div>
                                  <div className="mt-3 grid gap-2 text-xs font-medium text-slate-600 sm:grid-cols-2">
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
                        </article>
                      ))}
                    </div>
                  </section>

                  <section className="mt-6 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                    <h3 className="text-xl font-black text-slate-950">Travel Tips</h3>
                    <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
                      {selectedTrip.travel_tips?.map((tip) => (
                        <li key={tip}>- {tip}</li>
                      ))}
                    </ul>
                  </section>
                </div>
              </aside>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyTripsPage;
