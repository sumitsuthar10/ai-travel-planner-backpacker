const features = [
  {
    icon: "✨",
    title: "AI-Powered Itineraries",
    description:
      "Tell us your destination, dates, budget and interests. Our AI creates a personalized day-by-day itinerary for you.",
  },
  {
    icon: "💰",
    title: "Smart Budget Planning",
    description:
      "Get estimated costs for accommodation, food, transportation and activities so you can travel without overspending.",
  },
  {
    icon: "🗺️",
    title: "Discover Hidden Gems",
    description:
      "Go beyond the usual tourist spots and discover local experiences, underrated places and unique adventures.",
  },
  {
    icon: "👥",
    title: "Group Travel",
    description:
      "Plan trips with friends, split expenses and create an itinerary that works for everyone in your group.",
  },
  {
    icon: "🎒",
    title: "Backpacker Mode",
    description:
      "Optimize your trip for budget travel, hostels, public transport, local food and authentic experiences.",
  },
  {
    icon: "🤖",
    title: "AI Travel Assistant",
    description:
      "Ask questions anytime and get instant help with destinations, activities, budgets, routes and travel decisions.",
  },
];

function Features() {
  return (
    <section className="border-t py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Section Heading */}
        <div className="mx-auto max-w-3xl text-center">

          <div className="mb-4 inline-flex items-center rounded-full border bg-muted/50 px-4 py-2 text-sm">
            ✨ Everything you need to travel smarter
          </div>

          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            Your personal AI travel companion
          </h2>

          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            From finding the perfect destination to planning every
            detail of your journey, Backpacker helps you travel
            better with AI.
          </p>

        </div>

        {/* Features */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border bg-background p-7 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-2xl transition group-hover:scale-110">
                {feature.icon}
              </div>

              <h3 className="mt-6 text-xl font-bold">
                {feature.title}
              </h3>

              <p className="mt-3 leading-7 text-muted-foreground">
                {feature.description}
              </p>

              <button className="mt-5 text-sm font-semibold text-primary">
                Learn more →
              </button>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Features;