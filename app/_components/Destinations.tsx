import Image from "next/image";

const destinations = [
  {
    name: "Manali",
    country: "India 🇮🇳",
    description: "Mountains, snow & adventure",
    image: "/destinations/manali.jpg",
  },
  {
    name: "Goa",
    country: "India 🇮🇳",
    description: "Beaches, nightlife & relaxation",
    image: "/destinations/goa.jpg",
  },
  {
    name: "Paris",
    country: "France 🇫🇷",
    description: "Romance, art & iconic landmarks",
    image: "/destinations/paris.jpg",
  },
  {
    name: "Dubai",
    country: "UAE 🇦🇪",
    description: "Luxury, shopping & adventure",
    image: "/destinations/dubai.jpg",
  },
];

export default function Destinations() {
  return (
    <section
      id="destinations"
      className="scroll-mt-20 px-6 py-24 md:px-12 lg:px-20"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-3 text-sm font-medium text-primary">
              ✈️ EXPLORE THE WORLD
            </p>

            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Where will you go next?
            </h2>

            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Discover amazing destinations and let AI create the perfect
              travel plan for you.
            </p>
          </div>

          {/* View All Button */}
          <button
            type="button"
            className="hidden rounded-full border px-5 py-2.5 text-sm font-medium transition hover:bg-primary hover:text-primary-foreground md:block"
          >
            View all destinations →
          </button>
        </div>

        {/* Destination Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((destination) => (
            <div
              key={destination.name}
              className="group overflow-hidden rounded-3xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              {/* Image */}
              <div className="relative h-64 overflow-hidden bg-muted">
                <Image
                  src={destination.image}
                  alt={`${destination.name} travel destination`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />

                {/* AI Pick Badge */}
                <div className="absolute right-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur">
                  AI Pick ✨
                </div>
              </div>

              {/* Content */}
              <div className="p-5">

                {/* Country */}
                <p className="text-sm text-muted-foreground">
                  {destination.country}
                </p>

                {/* Destination Name */}
                <h3 className="mt-1 text-xl font-semibold">
                  {destination.name}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm text-muted-foreground">
                  {destination.description}
                </p>

                {/* Plan Button */}
                <button
                  type="button"
                  className="mt-5 w-full rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                  Plan this trip →
                </button>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}