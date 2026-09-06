import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 lg:px-20">

        {/* TOP SECTION */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* BRAND */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              ✈️ AI Travel
            </Link>

            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
              Plan smarter. Travel better. Let AI create personalized
              travel experiences based on your destination, budget,
              interests and travel style.
            </p>

            <Link
              href="/plan"
              className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              ✨ Start Planning
            </Link>
          </div>

          {/* EXPLORE */}
          <div>
            <h3 className="font-semibold">
              Explore
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="transition hover:text-foreground"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/#destinations"
                  className="transition hover:text-foreground"
                >
                  Destinations
                </Link>
              </li>

              <li>
                <Link
                  href="/#how-it-works"
                  className="transition hover:text-foreground"
                >
                  How It Works
                </Link>
              </li>

              <li>
                <Link
                  href="/plan"
                  className="transition hover:text-foreground"
                >
                  AI Trip Planner
                </Link>
              </li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="font-semibold">
              Company
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="#"
                  className="transition hover:text-foreground"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  className="transition hover:text-foreground"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  className="transition hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  className="transition hover:text-foreground"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-10 border-t" />

        {/* BOTTOM */}
        <div className="flex flex-col gap-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">

          <p>
            © {new Date().getFullYear()} AI Travel Planner. All rights reserved.
          </p>

          <div className="flex gap-5">
            <Link
              href="#"
              className="transition hover:text-foreground"
            >
              Instagram
            </Link>

            <Link
              href="#"
              className="transition hover:text-foreground"
            >
              GitHub
            </Link>

            <Link
              href="#"
              className="transition hover:text-foreground"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}