import { PricingTable } from "@clerk/nextjs";

function Pricing() {
  return (
    <main className="min-h-[calc(100dvh-64px)] bg-[radial-gradient(circle_at_top_left,#e0f2fe_0,#f8fafc_38%,#f7f8f4_76%)] px-4 py-12">
      <section className="mx-auto max-w-6xl">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Pricing
          </p>
          <h1 className="mt-2 text-4xl font-black text-slate-950 md:text-5xl">
            Choose your travel planning credits
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Free users get 10 AI itinerary credits per day. Upgrade when you want more room to
            plan, compare, and refine trips.
          </p>
        </div>

        <div className="rounded-lg border border-white/70 bg-white/90 p-4 shadow-xl shadow-slate-200/70 backdrop-blur md:p-6">
          <PricingTable />
        </div>
      </section>
    </main>
  );
}

export default Pricing;
