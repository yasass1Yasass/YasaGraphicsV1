// src/pages/About.tsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

/** Simple fade-in on mount (no extra libs) */
function useMountReveal() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 40);
    return () => clearTimeout(t);
  }, []);
  return show;
}

export default function About() {
  const show = useMountReveal();

  return (
    <div className="space-y-20">
      {/* Hero (no image) */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-600 via-teal-600 to-emerald-700 text-white">
        {/* decorative dots */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(transparent 1px, rgba(255,255,255,0.08) 1px)",
            backgroundSize: "12px 12px",
          }}
        />
        <div
          className={[
            "relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-12 sm:py-16 transition-all duration-700",
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
          ].join(" ")}
        >
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              About EcoVenture Tours
            </h1>
            <p className="mt-4 text-teal-50">
              We design small-group hiking trips, cycling tours, and guided
              nature walks across the UK — championing conservation, local
              communities, and low-impact travel.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#story"
                className="inline-flex items-center rounded-2xl bg-white px-5 py-3 font-semibold text-teal-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-white/60"
              >
                Our story
              </a>
              <a
                href="#impact"
                className="inline-flex items-center rounded-2xl border border-white/70 px-5 py-3 font-semibold transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60"
              >
                Our impact
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Values */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <header className="max-w-2xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-teal-900">
            Our mission
          </h2>
          <p className="mt-2 text-neutral-700">
            Make world-class UK nature accessible — while leaving trails,
            wildlife, and communities better than we found them.
          </p>
        </header>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Low impact",
              text: "Small groups (max 12), leave-no-trace briefings, refill stations — no single-use bottles.",
            },
            {
              title: "Local first",
              text: "We partner with local guides, cafes, and lodging to keep spend in the community.",
            },
            {
              title: "Access for all",
              text: "Clear grading, pace options, and inclusive route notes so more people can get outside.",
            },
            {
              title: "Giveback",
              text: "We allocate 1% of revenue to UK conservation partners and trail maintenance.",
            },
          ].map((v) => (
            <div
              key={v.title}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5"
            >
              <h3 className="font-semibold text-teal-800">{v.title}</h3>
              <p className="mt-2 text-neutral-700">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Real-world context: UK outdoors by the numbers */}
      <section id="impact" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <header className="max-w-2xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-teal-900">
            UK outdoors — by the numbers
          </h2>
          <p className="mt-2 text-neutral-700">
            We plan on established, waymarked routes and protected landscapes.
            Here’s the big picture our trips fit into:
          </p>
        </header>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            kpi="15"
            label="UK National Parks"
            hint="10 England, 3 Wales, 2 Scotland"
            href="https://www.nationalparks.uk/parks/"
          />
          <Stat
            kpi="20"
            label="National Trails (UK)"
            hint="Iconic long-distance routes"
            href="https://www.nationaltrails.uk/"
          />
          <Stat
            kpi="29"
            label="Scotland’s Great Trails"
            hint="1,900+ miles of paths"
            href="https://www.nature.scot/enjoying-outdoors/routes-explore/scotlands-great-trails"
          />
          <Stat
            kpi="~12,700"
            label="Miles in the National Cycle Network"
            hint="~5,100 traffic-free"
            href="https://www.sustrans.org.uk/national-cycle-network/our-plans-to-improve-the-national-cycle-network/"
          />
        </div>

        <p className="mt-4 text-sm text-neutral-600">
          Sources: National Parks UK; National Trails; NatureScot; Sustrans.
          Follow the cards above for details.
        </p>
      </section>

      {/* Story / Timeline */}
      <section id="story" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <header className="max-w-2xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-teal-900">
            Our story
          </h2>
        </header>

        <ol className="mt-8 relative border-l-2 border-teal-200 pl-6">
          {[
            {
              year: "2023",
              title: "Idea on the trail",
              text: "A group of UK guides noticed travelers wanted greener options — without losing comfort or great coffee stops.",
            },
            {
              year: "2024",
              title: "Pilot seasons",
              text: "We tested ridge walks in the Lakes, gravel weekends in the Cotswolds, and woodland ecology days in the Cairngorms.",
            },
            {
              year: "2025",
              title: "EcoVenture launches",
              text: "A streamlined booking experience, PWA for offline route notes, and a giveback program with UK partners.",
            },
          ].map((i) => (
            <li key={i.year} className="mb-8">
              <span className="absolute -left-[11px] mt-1 inline-block size-5 rounded-full bg-teal-600 ring-2 ring-white" />
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                <p className="text-xs font-semibold text-teal-700">{i.year}</p>
                <h3 className="mt-1 font-semibold text-neutral-900">{i.title}</h3>
                <p className="mt-2 text-neutral-700">{i.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* How we run trips */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="relative overflow-hidden rounded-2xl ring-1 ring-teal-200">
            <img
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=60"
              alt="Cyclists on a quiet lane through countryside"
              className="h-72 w-full object-cover sm:h-96"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-teal-600/10 via-transparent to-emerald-700/10" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-teal-900">
              Thoughtful design, end-to-end
            </h2>
            <ul className="mt-4 space-y-3 text-neutral-800">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block size-2 rounded-full bg-teal-600" />
                <span>
                  Routes vetted for seasonality, erosion risk, wildlife
                  sensitivity, and public transport access.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block size-2 rounded-full bg-teal-600" />
                <span>
                  Clear kit lists, pace options, and contingency plans —
                  comfort without compromising footprint.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block size-2 rounded-full bg-teal-600" />
                <span>
                  Leave-no-trace briefing on every trip and refill points mapped
                  into route notes.
                </span>
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/tours"
                className="inline-flex items-center rounded-2xl bg-teal-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-teal-700"
              >
                Explore tours
              </Link>
              <Link
                to="/about#faq"
                className="inline-flex items-center rounded-2xl border border-teal-600 px-4 py-2 font-semibold text-teal-700 transition hover:bg-teal-50"
              >
                Read our FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <header className="max-w-2xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-teal-900">
            Frequently asked questions
          </h2>
        </header>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {FAQ.map((f) => (
            <div
              key={f.q}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5"
            >
              <dt className="font-semibold text-neutral-900">{f.q}</dt>
              <dd className="mt-2 text-neutral-700">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16 lg:px-12">
        <div className="rounded-2xl bg-gradient-to-r from-sky-50 via-teal-50 to-emerald-100 p-6 ring-1 ring-teal-200 sm:flex sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="text-lg font-extrabold text-teal-900">
              Ready for your next low-impact adventure?
            </h2>
            <p className="mt-1 text-neutral-700">
              Browse upcoming dates and last-minute slots.
            </p>
          </div>
          <Link
            to="/tours"
            className="mt-4 inline-flex items-center rounded-2xl bg-teal-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-teal-700 sm:mt-0"
          >
            View tours
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({
  kpi,
  label,
  hint,
  href,
}: {
  kpi: string;
  label: string;
  hint?: string;
  href?: string;
}) {
  const content = (
    <div className="h-full rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:shadow-md">
      <p className="text-3xl font-extrabold text-teal-700">{kpi}</p>
      <p className="mt-1 font-semibold text-neutral-900">{label}</p>
      {hint && <p className="text-sm text-neutral-600">{hint}</p>}
    </div>
  );
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className="block">
      {content}
    </a>
  ) : (
    content
  );
}

const FAQ = [
  {
    q: "What fitness level do I need?",
    a: "We grade trips from relaxed to challenging. Cycling weekends offer pace groups; hikes include regular breaks and alternatives in bad weather.",
  },
  {
    q: "How big are the groups?",
    a: "We keep groups to 12 or fewer to reduce impact, keep things social, and give guides space to support everyone.",
  },
  {
    q: "What about sustainability in practice?",
    a: "Leave-no-trace briefings, refill water points, public-transport meet locations where possible, and a 1% revenue allocation to UK conservation partners.",
  },
  {
    q: "Can I join solo?",
    a: "Absolutely. Many guests travel solo — we create a welcoming group dynamic and can suggest room-share options where appropriate.",
  },
];
