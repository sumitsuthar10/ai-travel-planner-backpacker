"use client";

import Link from "next/link";
import { useState } from "react";

function Hero() {
    const [authOpen, setAuthOpen] = useState(false);
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl items-center px-6 py-20">

        <div className="grid w-full items-center gap-12 lg:grid-cols-2">

          {/* LEFT SIDE */}
          <div className="max-w-2xl">

            {/* Small Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-2 text-sm">
              <span>✈️</span>
              <span>AI-Powered Travel Planning</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Your Journey.
              <br />

              <span className="text-primary">
                Your Adventure.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Plan unforgettable trips with the power of AI.
              Get personalized itineraries, discover hidden gems,
              manage your budget, and travel smarter.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                href="/plan"
                className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
              >
                Start Planning ✨
              </Link>

       <button
        type="button"
        onClick={() => {
            document.getElementById("destinations")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
        }}
        className="rounded-xl border px-6 py-3 font-semibold transition hover:bg-muted"
        >
        Explore Destinations
        </button>

            </div>

            {/* Features */}
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">

              <div>
                <p className="text-2xl font-bold">AI</p>
                <p className="text-sm text-muted-foreground">
                  Smart Planning
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-sm text-muted-foreground">
                  Travel Assistant
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold">100%</p>
                <p className="text-sm text-muted-foreground">
                  Personalized
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="relative hidden lg:block">

            <div className="relative mx-auto aspect-square max-w-lg">

              {/* Main Travel Card */}
              <div className="absolute inset-8 rounded-3xl border bg-card p-6 shadow-2xl">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Your next adventure
                    </p>

                    <h2 className="mt-1 text-2xl font-bold">
                      Explore the World 🌎
                    </h2>
                  </div>

                  <div className="rounded-full bg-primary/10 p-3">
                    ✈️
                  </div>
                </div>

                {/* Fake Map */}
                <div className="mt-6 flex h-56 items-center justify-center rounded-2xl bg-muted">
                  <div className="text-center">
                    <div className="text-6xl">🗺️</div>
                    <p className="mt-3 font-medium">
                      AI Trip Planner
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Discover your perfect destination
                    </p>
                  </div>
                </div>

                {/* Destination */}
                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Recommended
                    </p>

                    <p className="font-semibold">
                      Manali, India 🇮🇳
                    </p>
                  </div>

                  <div className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
                    View Trip
                  </div>
                </div>

              </div>

              {/* Floating Card */}
              <div className="absolute -right-2 top-20 rounded-2xl border bg-card p-4 shadow-xl">
                <p className="text-xs text-muted-foreground">
                  AI Recommendation
                </p>

                <p className="mt-1 font-semibold">
                  ⭐ Perfect for you
                </p>
              </div>

              {/* Floating Bottom Card */}
              <div className="absolute -bottom-2 left-0 rounded-2xl border bg-card p-4 shadow-xl">
                <p className="text-xs text-muted-foreground">
                  Estimated Budget
                </p>

                <p className="text-lg font-bold">
                  ₹25,000
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;