const steps = [
  {
    number: "01",
    icon: "📍",
    title: "Choose your destination",
    description:
      "Tell us where you want to go, your travel dates, and how many people are joining.",
  },
  {
    number: "02",
    icon: "✨",
    title: "Tell AI your preferences",
    description:
      "Share your budget, interests, travel style, food preferences, and activities you enjoy.",
  },
  {
    number: "03",
    icon: "🤖",
    title: "AI creates your trip",
    description:
      "Our AI builds a personalized itinerary with places to visit, activities, food and estimated costs.",
  },
  {
    number: "04",
    icon: "🎒",
    title: "Travel & enjoy",
    description:
      "Save your trip, manage your itinerary and enjoy your journey without the planning stress.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-gray-50 px-6 py-24 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium text-gray-500">
            ✨ SIMPLE & SMART
          </p>

          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            How it works
          </h2>

          <p className="mt-4 text-lg text-gray-500">
            Plan your perfect trip in just a few simple steps with the help
            of AI.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-3xl border bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-8 flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
                  {step.icon}
                </div>

                <span className="text-sm font-semibold text-gray-300">
                  {step.number}
                </span>
              </div>

              <h3 className="text-xl font-semibold">
                {step.title}
              </h3>

              <p className="mt-3 leading-7 text-gray-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}