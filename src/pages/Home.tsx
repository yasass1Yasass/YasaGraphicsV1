// src/pages/Home.tsx
import { Link } from "react-router-dom";
import { useMemo, useEffect, useRef, useState, ReactNode } from "react";

/** ---------- Types ---------- */
type Category = "hiking" | "cycling" | "nature";

type Tour = {
  id: string;
  title: string;
  category: Category;
  shortDescription: string;
  durationDays: number;
  location: string;
  nextStartDate: string; // ISO
  availableSlots: number;
  priceGBP: number;
  images: string[];
  rating: number; // 0..5
};

type Review = {
  id: string;
  author: string;
  text: string;
  rating: number;
  tourTitle: string;
};

/** ---------- Online Images (Unsplash) ---------- */
const IMG = {
  hero:
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=60",
  catHiking:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=60",
  catCycling:
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=60",
  catNature:
    "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?auto=format&fit=crop&w=1600&q=60",
  tourHiking:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=60",
  tourCycling:
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=60",
  tourNature:
    "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?auto=format&fit=crop&w=1400&q=60",
  forestSoft:
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=60",
};

/** ---------- Dummy Data (swap with API later) ---------- */
const FEATURED_TOURS: Tour[] = [
  {
    id: "t1",
    title: "Lake District Ridgeway",
    category: "hiking",
    shortDescription:
      "Panoramic fell views and low-impact routes through classic Lakeland scenery.",
    durationDays: 3,
    location: "Lake District, England",
    nextStartDate: "2025-09-20",
    availableSlots: 8,
    priceGBP: 189,
    images: [IMG.tourHiking],
    rating: 4.8,
  },
  {
    id: "t2",
    title: "Cotswolds Gravel Spin",
    category: "cycling",
    shortDescription:
      "Quiet lanes, rolling hills, and café stops—perfect for mixed-ability riders.",
    durationDays: 2,
    location: "Cotswolds, England",
    nextStartDate: "2025-09-27",
    availableSlots: 12,
    priceGBP: 159,
    images: [IMG.tourCycling],
    rating: 4.7,
  },
  {
    id: "t3",
    title: "Caledonian Forest Walk",
    category: "nature",
    shortDescription:
      "Guided woodland immersion focused on habitats, birdsong, and conservation.",
    durationDays: 1,
    location: "Cairngorms, Scotland",
    nextStartDate: "2025-10-05",
    availableSlots: 2, // demo "Few left"
    priceGBP: 89,
    images: [IMG.tourNature],
    rating: 4.9,
  },
];

// Start reviews in state from these initial ones
const INITIAL_REVIEWS: Review[] = [
  {
    id: "r1",
    author: "Amelia P.",
    text: "Thoughtful routes and brilliant guides. Loved the leave-no-trace brief!",
    rating: 5,
    tourTitle: "Lake District Ridgeway",
  },
  {
    id: "r2",
    author: "Hassan K.",
    text: "Cycling pace options kept our group together. Top cafés, too.",
    rating: 5,
    tourTitle: "Cotswolds Gravel Spin",
  },
  {
    id: "r3",
    author: "Sophie L.",
    text: "Calming, informative, and accessible. I learned so much about native species.",
    rating: 4,
    tourTitle: "Caledonian Forest Walk",
  },
];

/** ---------- Helpers ---------- */
function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

function formatGBP(n: number) {
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `£${n}`;
  }
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

/** ---------- Animations & Utilities (no extra libs) ---------- */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, show };
}

const PLACEHOLDER =
  "data:image/svg+xml;base64," +
  btoa(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='#16A34A'/>
          <stop offset='100%' stop-color='#4F46E5'/>
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' fill='url(#g)'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
        font-family='Arial' font-size='26' fill='white' opacity='0.9'>
        EcoVenture Image
      </text>
    </svg>`
  );

function SmartImage({
  src,
  alt,
  className,
  imgClass,
}: {
  src?: string;
  alt: string;
  className?: string;
  imgClass?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const finalSrc = failed || !src ? PLACEHOLDER : src;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-emerald-50 to-indigo-50",
        className
      )}
    >
      <img
        src={finalSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={cn(
          "h-full w-full object-cover transition duration-700 ease-out",
          loaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-sm scale-105",
          imgClass
        )}
      />
      {/* Subtle vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0"
      />
    </div>
  );
}

function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { ref, show } = useReveal();
  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      {children}
    </div>
  );
}

/** ---------- Tiny Inline Icons ---------- */
const Icon = {
  Hiking: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" className="text-emerald-700" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" />
      <path d="M9 22v-6l2-3 3 2 1 7" />
      <path d="M7 12l4-2 3 2 3-1" />
      <path d="M5 22h5" />
    </svg>
  ),
  Cycling: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" className="text-emerald-700" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="5.5" cy="18.5" r="3.5" />
      <circle cx="18.5" cy="18.5" r="3.5" />
      <path d="M5.5 18.5h4l3-7h3" />
      <path d="M14 6l2 2" />
      <path d="M10 10l-2-2" />
    </svg>
  ),
  Nature: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" className="text-emerald-700" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 2v20" />
      <path d="M7 7c2 0 3-3 5-3s3 3 5 3" />
      <path d="M7 14c2 0 3-3 5-3s3 3 5 3" />
      <path d="M7 21c2 0 3-3 5-3s3 3 5 3" />
    </svg>
  ),
};

/** ---------- Page ---------- */
export default function Home() {
  const heroStats = useMemo(
    () => [
      { label: "Eco-verified routes", value: "92%" },
      { label: "Small group size", value: "≤12" },
      { label: "Conservation giveback", value: "1%" },
    ],
    []
  );

  // Reviews state (users can add)
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  const addReview = (r: Omit<Review, "id">) => {
    const id =
      (globalThis as any).crypto?.randomUUID?.() ??
      `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    setReviews((prev) => [{ id, ...r }, ...prev]);
  };

  return (
    <div className="space-y-20 px-4 sm:px-6">
      {/* Hero with right-side image (emerald → indigo) */}
      <section
        aria-label="Eco-friendly UK Adventures"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-indigo-600 text-white"
      >
        {/* decorative contour dots */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(transparent 1px, rgba(255,255,255,0.1) 1px)",
            backgroundSize: "12px 12px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <Reveal className="max-w-xl">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Eco-friendly UK Adventures
              </h1>
              <p className="mt-4 text-emerald-50">
                Guided hiking, cycling, and nature walks—minimal footprint,
                maximum wonder.
              </p>
              <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
                {/* Primary CTA - Green on white */}
                <Link
                  to="/tours"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 font-semibold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-white/60 sm:w-auto"
                >
                  Explore Tours
                </Link>
                {/* Secondary CTA - subtle outline */}
                <Link
                  to="/about"
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-white/70 px-5 py-3 font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60 sm:w-auto"
                >
                  Why EcoVenture?
                </Link>
                {/* Accent CTA - Indigo solid */}
                <Link
                  to="/tours#deals"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-white/60 sm:w-auto"
                >
                  Limited Offers
                </Link>
              </div>

              {/* Hero stats */}
              <dl className="mt-8 grid grid-cols-3 gap-3 text-center sm:max-w-lg sm:gap-6">
                {heroStats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl bg-white/10 px-3 py-4 shadow-sm ring-1 ring-white/20 backdrop-blur-sm sm:px-4 sm:py-5"
                  >
                    <dt className="text-xs sm:text-sm text-emerald-100">{s.label}</dt>
                    <dd className="mt-1 text-xl sm:text-2xl font-bold">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal>
              <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/20 shadow-lg">
                <SmartImage
                  src={IMG.hero}
                  alt="Misty UK hillside at sunrise"
                  className="h-[240px] w-full sm:h-[320px] lg:h-[420px]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-emerald-600/10 via-transparent to-indigo-600/10" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Experiences (3 Category Cards with icons) */}
      <section aria-labelledby="categories-heading" className="py-2">
        <SectionHeading
          id="categories-heading"
          title="Experiences"
          subtitle="Three ways to explore sustainably across the UK."
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Reveal>
            <CategoryCard
              title="Hiking"
              to="/tours#hiking"
              image={IMG.catHiking}
              icon={<Icon.Hiking />}
              blurb="Fell paths, ridge lines, and mindful pacing on leave-no-trace routes."
            />
          </Reveal>
          <Reveal>
            <CategoryCard
              title="Cycling"
              to="/tours#cycling"
              image={IMG.catCycling}
              icon={<Icon.Cycling />}
              blurb="Quiet lanes, gravel connectors, and local café stops—group-friendly."
            />
          </Reveal>
          <Reveal>
            <CategoryCard
              title="Nature Walks"
              to="/tours#nature"
              image={IMG.catNature}
              icon={<Icon.Nature />}
              blurb="Guided woodland and coastal rambles with a focus on habitats."
            />
          </Reveal>
        </div>
      </section>

      {/* Featured Tours */}
      <section aria-labelledby="featured-heading">
        <SectionHeading
          id="featured-heading"
          title="Featured Tours"
          subtitle="Hand-picked routes starting soon."
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_TOURS.map((t) => (
            <Reveal key={t.id}>
              <TourCard tour={t} />
            </Reveal>
          ))}
        </div>
        <div className="mt-8">
          <Link
            to="/tours"
            className="inline-flex items-center rounded-2xl border border-indigo-600 px-5 py-3 text-indigo-700 transition hover:-translate-y-0.5 hover:bg-indigo-50"
          >
            Browse all tours
          </Link>
        </div>
      </section>

      {/* Sustainability Promise */}
      <section
        aria-labelledby="promise-heading"
        className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-10"
      >
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <h2
                id="promise-heading"
                className="text-2xl font-extrabold tracking-tight text-emerald-900"
              >
                Our Sustainability Promise
              </h2>
              <p className="mt-3 text-neutral-700">
                We plan itineraries that respect habitats and reduce erosion.
                Every group receives a short leave-no-trace briefing and uses
                refillable bottles—no single-use plastics.
              </p>
              <ul className="mt-6 space-y-3 text-neutral-800">
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block size-2 rounded-full bg-emerald-600" />
                  Low-impact route planning on verified trails
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block size-2 rounded-full bg-emerald-600" />
                  Small groups and wildlife distance guidelines
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block size-2 rounded-full bg-emerald-600" />
                  1% of revenue supports UK conservation partners
                </li>
              </ul>
            </div>
          </Reveal>
          <Reveal>
            <div className="relative h-64 overflow-hidden rounded-2xl ring-1 ring-emerald-200 sm:h-80 lg:h-full">
              <SmartImage
                src={IMG.forestSoft}
                alt="Green woodland canopy with dappled light"
                className="h-full w-full"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-emerald-600/10 via-transparent to-indigo-600/10"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Reviews + Add Review */}
      <section aria-labelledby="reviews-heading">
        <SectionHeading
          id="reviews-heading"
          title="Guests Say"
          subtitle="A few words from recent EcoVenture travellers."
        />

        {/* Add Review Form */}
        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <h3 className="text-lg font-semibold text-neutral-900">Write a review</h3>
          <ReviewForm tours={FEATURED_TOURS} onAdd={addReview} />
        </div>

        {/* Existing + new reviews */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <Reveal key={r.id}>
              <ReviewCard review={r} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <Reveal>
        <NewsletterBar />
      </Reveal>
    </div>
  );
}

/** ---------- Reusable UI ---------- */
function SectionHeading({
  id,
  title,
  subtitle,
}: {
  id: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header>
      <h2
        id={id}
        className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-700 via-emerald-600 to-indigo-600 bg-clip-text text-transparent"
      >
        {title}
      </h2>
      {subtitle && <p className="mt-2 text-neutral-700">{subtitle}</p>}
    </header>
  );
}

function CategoryCard({
  title,
  image,
  blurb,
  to,
  icon,
}: {
  title: string;
  image: string;
  blurb: string;
  to: string;
  icon: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <div className="relative h-40 w-full">
        <SmartImage src={image} alt={`${title} category`} className="h-full w-full" />
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-600/20">
          <span aria-hidden>{icon}</span>
          {title}
        </span>
      </div>
      <div className="p-4">
        <p className="text-neutral-700">{blurb}</p>
        <span className="mt-3 inline-block bg-gradient-to-r from-emerald-700 to-indigo-600 bg-clip-text font-medium text-transparent underline-offset-4 group-hover:underline">
          View {title}
        </span>
      </div>
    </Link>
  );
}

function TourCard({ tour }: { tour: Tour }) {
  const fewLeft = tour.availableSlots <= 3;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-lg">
      <div className="relative h-44 w-full">
        <SmartImage src={tour.images[0]} alt={tour.title} className="h-full w-full" />
        <div className="absolute left-3 top-3 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-600/20">
          {tour.category}
        </div>

        {fewLeft && (
          <div className="absolute right-3 top-3 rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            Few left
          </div>
        )}

        {/* Gradient ribbon on hover (emerald→indigo) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-600 via-emerald-500 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-bold text-neutral-900">{tour.title}</h3>
        <p className="mt-1 text-sm text-neutral-700">{tour.shortDescription}</p>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm text-neutral-800">
          <div className="rounded-lg bg-neutral-50 p-2">
            <dt className="text-neutral-500">Location</dt>
            <dd className="font-medium">{tour.location}</dd>
          </div>
          <div className="rounded-lg bg-neutral-50 p-2">
            <dt className="text-neutral-500">Duration</dt>
            <dd className="font-medium">{tour.durationDays} days</dd>
          </div>
          <div className="rounded-lg bg-neutral-50 p-2">
            <dt className="text-neutral-500">Next start</dt>
            <dd className="font-medium">{formatDate(tour.nextStartDate)}</dd>
          </div>
          <div className="rounded-lg bg-neutral-50 p-2">
            <dt className="text-neutral-500">Slots</dt>
            <dd className={cn("font-medium", fewLeft ? "text-indigo-700" : "text-emerald-700")}>
              {tour.availableSlots} available
            </dd>
          </div>
        </dl>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-base font-semibold text-emerald-700">
            from {formatGBP(tour.priceGBP)}
          </span>
          <span
            aria-label={`Rating ${tour.rating} out of 5`}
            className="rounded-full bg-emerald-100 px-2.5 py-1 text-sm font-semibold text-emerald-800"
          >
            ★ {tour.rating.toFixed(1)}
          </span>
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Link
            to={`/tours?focus=${tour.id}`}
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            View details
          </Link>
          <Link
            to={`/tours?book=${tour.id}`}
            className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-2 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Book now
          </Link>
        </div>
      </div>
    </article>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <figcaption className="font-semibold text-neutral-900">
          {review.author}
        </figcaption>
        <span
          aria-label={`Rating ${review.rating} out of 5`}
          className="rounded-full bg-emerald-100 px-2.5 py-1 text-sm font-semibold text-emerald-800"
        >
          ★ {review.rating}
        </span>
      </div>
      <p className="mt-1 text-xs text-neutral-500">{review.tourTitle}</p>
      <blockquote className="mt-3 text-neutral-700">“{review.text}”</blockquote>
    </figure>
  );
}

function NewsletterBar() {
  return (
    <section
      aria-labelledby="newsletter-heading"
      className="rounded-2xl ring-1 ring-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-indigo-50 p-6 sm:flex sm:items-center sm:justify-between sm:p-8"
    >
      <div>
        <h2
          id="newsletter-heading"
          className="text-lg font-extrabold bg-gradient-to-r from-emerald-700 via-emerald-600 to-indigo-600 bg-clip-text text-transparent"
        >
          Trail updates & last-minute slots
        </h2>
        <p className="mt-1 text-neutral-700">
          Subscribe for route notes, seasonal tips, and early access to new tours.
        </p>
      </div>
      <form
        className="mt-4 flex w-full max-w-md gap-2 sm:mt-0"
        onSubmit={(e) => {
          e.preventDefault();
          alert("Subscribed! (wire up to your API later)");
        }}
      >
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="w-full flex-1 rounded-2xl border border-emerald-300 bg-white px-4 py-3 text-neutral-900 placeholder-neutral-500 outline-none ring-0 transition focus:border-indigo-500"
        />
        <button
          type="submit"
          className="shrink-0 rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
}

/** ---------- Review Form (Users can type rating & review) ---------- */
function ReviewForm({
  tours,
  onAdd,
}: {
  tours: Tour[];
  onAdd: (r: Omit<Review, "id">) => void;
}) {
  const [author, setAuthor] = useState("");
  const [tourTitle, setTourTitle] = useState(tours[0]?.title ?? "");
  const [rating, setRating] = useState<number>(5);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const canSubmit = author.trim() && text.trim() && rating >= 1 && rating <= 5;

  return (
    <form
      className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        setSubmitting(true);
        // fake delay to show button state
        setTimeout(() => {
          onAdd({ author: author.trim(), tourTitle, rating, text: text.trim() });
          setAuthor("");
          setText("");
          setRating(5);
          setSubmitting(false);
        }, 300);
      }}
    >
      <label className="block">
        <span className="text-sm font-semibold text-neutral-800">Your name</span>
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Alex Morgan"
          className="mt-1 w-full rounded-xl border border-emerald-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-neutral-800">Tour</span>
        <select
          value={tourTitle}
          onChange={(e) => setTourTitle(e.target.value)}
          className="mt-1 w-full rounded-xl border border-emerald-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
        >
          {tours.map((t) => (
            <option key={t.id} value={t.title}>
              {t.title}
            </option>
          ))}
        </select>
      </label>

      {/* Stars + textarea span full width on small screens */}
      <div className="sm:col-span-2 flex flex-col gap-3">
        <div>
          <span className="text-sm font-semibold text-neutral-800">Your rating</span>
          <StarRatingInput value={rating} onChange={setRating} />
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-neutral-800">Your review</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What did you love? Anything we could improve?"
            rows={4}
            className="mt-1 w-full rounded-xl border border-emerald-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
            required
          />
        </label>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:opacity-60"
          >
            {submitting ? "Posting…" : "Post review"}
          </button>
          <p className="text-xs text-neutral-600">
            Be respectful. Reviews may be moderated.
          </p>
        </div>
      </div>
    </form>
  );
}

function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mt-1 inline-flex items-center gap-1 rounded-xl bg-white px-2 py-1 ring-1 ring-emerald-200">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          aria-label={`${i} star${i > 1 ? "s" : ""}`}
          className={cn(
            "p-1 transition",
            i <= value ? "text-emerald-600" : "text-neutral-400 hover:text-neutral-600"
          )}
          title={`${i} / 5`}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
            <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </button>
      ))}
      <span className="ml-2 text-sm font-semibold text-emerald-700">{value}/5</span>
    </div>
  );
}
