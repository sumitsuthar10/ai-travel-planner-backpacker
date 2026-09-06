"use client";

import { useState } from "react";

const themes = [
  "Historical Sites & Landmarks",
  "Adventure",
  "Local Culture",
  "Beaches",
  "Hills, Nature and Wildlife",
  "Nightlife",
  "For the Gram",
  "Shopping & Relaxation",
];

export default function PlanPage() {
  const [step, setStep] = useState(1);
  const [startCity, setStartCity] = useState("");
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState("");
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);

  const toggleTheme = (theme: string) => {
    setSelectedThemes((current) =>
      current.includes(theme)
        ? current.filter((item) => item !== theme)
        : [...current, theme]
    );
  };

  return (
    <main className="min-h-screen bg-background px-6 py-12 md:px-10 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-3xl border bg-card shadow-xl">
          <div className="grid lg:grid-cols-[34%_66%]">

            {/* LEFT SIDE */}
            <div className="flex min-h-[40rem] flex-col justify-between bg-primary p-8 text-primary-foreground md:p-10">

              <div>
                <h1 className="text-3xl font-bold">
                  Create a Plan
                </h1>

                {/* STEPS */}
                <div className="mt-12 flex items-center justify-between">
                  {[1, 2, 3, 4].map((number, index) => (
                    <div key={number} className="flex items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                          step >= number
                            ? "bg-white text-primary"
                            : "border-white/50 text-white"
                        }`}
                      >
                        {number}
                      </div>

                      {index < 3 && (
                        <div className="mx-3 h-px w-10 bg-white/50 md:w-16" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* LEFT ILLUSTRATION */}
              <div className="py-10 text-center">
                <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-full bg-white/15 text-8xl">
                  🌍
                </div>

                <h2 className="mt-8 text-2xl font-bold">
                  Set the Course,
                  <br />
                  Own the Journey
                </h2>

                <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-white/80">
                  Define your dream destination and chart the perfect path
                  to make it a reality.
                </p>
              </div>

              <div />
            </div>

            {/* RIGHT SIDE */}
            <div className="p-8 md:p-10">

              {/* STEP 1 */}
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold">
                    Tell us about your trip
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Let's start with the basics of your journey.
                  </p>

                  {/* START CITY */}
                  <div className="mt-8">
                    <label className="mb-2 block text-sm font-semibold">
                      Where are you starting your trip from?
                    </label>

                    <input
                      value={startCity}
                      onChange={(e) => setStartCity(e.target.value)}
                      placeholder="Enter your start city here..."
                      className="w-full rounded-xl border bg-background px-4 py-3 outline-none transition focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* DESTINATION */}
                  <div className="mt-6">
                    <label className="mb-2 block text-sm font-semibold">
                      Search for your destination country/city
                    </label>

                    <input
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Search for places..."
                      className="w-full rounded-xl border bg-background px-4 py-3 outline-none transition focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* DATE */}
                  <div className="mt-6">
                    <label className="mb-2 block text-sm font-semibold">
                      Select Dates
                    </label>

                    <input
                      type="date"
                      value={dates}
                      onChange={(e) => setDates(e.target.value)}
                      className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* THEMES */}
                  <div className="mt-6">
                    <label className="mb-3 block text-sm font-semibold">
                      Which of these travel themes best describes your dream
                      getaway? <span className="text-muted-foreground">(Optional)</span>
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {themes.map((theme) => (
                        <button
                          key={theme}
                          type="button"
                          onClick={() => toggleTheme(theme)}
                          className={`rounded-lg border px-3 py-2 text-sm transition ${
                            selectedThemes.includes(theme)
                              ? "border-primary bg-primary text-primary-foreground"
                              : "bg-muted/40 hover:bg-muted"
                          }`}
                        >
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div className="mt-10 flex justify-between">
                    <button
                      type="button"
                      disabled
                      className="rounded-lg border px-5 py-3 text-sm text-muted-foreground"
                    >
                      ← Back
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold">
                    Tell us your travel preferences
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    This helps our AI create a trip that matches you.
                  </p>

                  <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {[
                      "🎒 Backpacker",
                      "🏔️ Adventure",
                      "🏖️ Relaxation",
                      "✨ Luxury",
                      "🍜 Food & Culture",
                      "📸 Photography",
                    ].map((item) => (
                      <button
                        key={item}
                        className="rounded-xl border p-5 text-left font-medium transition hover:border-primary hover:bg-muted"
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  <div className="mt-10 flex justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="rounded-lg border px-5 py-3 text-sm"
                    >
                      ← Back
                    </button>

                    <button
                      onClick={() => setStep(3)}
                      className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-bold">
                    Set your budget
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Choose how much you want to spend on your trip.
                  </p>

                  <div className="mt-8 grid gap-4">
                    {[
                      "💰 Budget Friendly",
                      "💳 Moderate",
                      "💎 Premium",
                      "👑 Luxury",
                    ].map((budget) => (
                      <button
                        key={budget}
                        className="rounded-xl border p-5 text-left font-medium transition hover:border-primary hover:bg-muted"
                      >
                        {budget}
                      </button>
                    ))}
                  </div>

                  <div className="mt-10 flex justify-between">
                    <button
                      onClick={() => setStep(2)}
                      className="rounded-lg border px-5 py-3 text-sm"
                    >
                      ← Back
                    </button>

                    <button
                      onClick={() => setStep(4)}
                      className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <div>
                  <h2 className="text-2xl font-bold">
                    Ready to generate your trip?
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Review your choices before our AI creates your itinerary.
                  </p>

                  <div className="mt-8 space-y-4 rounded-2xl bg-muted/50 p-6">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Starting from
                      </p>
                      <p className="font-semibold">
                        {startCity || "Not selected"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Destination
                      </p>
                      <p className="font-semibold">
                        {destination || "Not selected"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Date
                      </p>
                      <p className="font-semibold">
                        {dates || "Not selected"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Themes
                      </p>
                      <p className="font-semibold">
                        {selectedThemes.length > 0
                          ? selectedThemes.join(", ")
                          : "No themes selected"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-8 w-full rounded-xl bg-primary py-4 font-semibold text-primary-foreground shadow-lg transition hover:opacity-90"
                  >
                    ✨ Generate My AI Trip
                  </button>

                  <button
                    onClick={() => setStep(3)}
                    className="mt-4 w-full rounded-xl border py-3 text-sm"
                  >
                    ← Back
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}