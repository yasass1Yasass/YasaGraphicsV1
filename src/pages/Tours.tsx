// src/pages/Tours.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

/** ---------- Types ---------- */
type Category = "hiking" | "cycling" | "nature";

type Tour = {
  id: string;
  title: string;
  category: Category;
  shortDescription: string;
  longDescription: string;
  durationDays: number;
  location: string;
  nextStartDate: string; // ISO
  availableSlots: number;
  priceGBP: number;
  images: string[];
  rating: number; // 0..5
  difficulty: "Easy" | "Moderate" | "Challenging";
};

/** ---------- Online Images (Unsplash) ---------- */
const IMG = {
  hike1:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=60",
  hike2:
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=60",
  hike3:
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=60",
  cycle1:
    "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1400&q=60",
  cycle2:
    "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=1400&q=60",
  cycle3:
    "https://images.unsplash.com/photo-1517400508447-f8dd518b86db?auto=format&fit=crop&w=1400&q=60",
  nature1:
    "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?auto=format&fit=crop&w=1400&q=60",
  nature2:
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=60",
  nature3:
    "https://images.unsplash.com/photo-1500530856044-9f2f0c5b9b12?auto=format&fit=crop&w=1400&q=60",
};

/** ---------- Dummy Data (replace with API later) ---------- */
const ALL_TOURS: Tour[] = [
  // Hiking
  {
    id: "t1",
    title: "Lake District Ridgeway",
    category: "hiking",
    shortDescription: "Panoramic fell views across classic Lakeland scenery.",
    longDescription:
      "Tread lightly on ridge lines and shepherd paths, with leave-no-trace tips and pauses for wildlife spotting. Perfect for those who love steady climbs and sweeping views.",
    durationDays: 3,
    location: "Lake District, England",
    nextStartDate: "2025-09-20",
    availableSlots: 8,
    priceGBP: 189,
    images: [IMG.hike1, IMG.hike2],
    rating: 4.8,
    difficulty: "Moderate",
  },
  {
    id: "t4",
    title: "Snowdonia Peaks Circuit",
    category: "hiking",
    shortDescription: "Craggy summits, lakes, and historic slate valleys.",
    longDescription:
      "Guided loop of iconic peaks with flexible pace groups. We cover route ethics and habitat respect along the way.",
    durationDays: 2,
    location: "Eryri (Snowdonia), Wales",
    nextStartDate: "2025-10-03",
    availableSlots: 0,
    priceGBP: 159,
    images: [IMG.hike3, IMG.hike1],
    rating: 4.6,
    difficulty: "Challenging",
  },
  {
    id: "t5",
    title: "Ben Nevis Warm-Up",
    category: "hiking",
    shortDescription: "Intro day with skills, pacing, and micro-nav basics.",
    longDescription:
      "Get trail-ready with a guide-led day that focuses on safety, gear, and environmental care. Ideal before larger objectives.",
    durationDays: 1,
    location: "Fort William, Scotland",
    nextStartDate: "2025-09-29",
    availableSlots: 11,
    priceGBP: 79,
    images: [IMG.hike2],
    rating: 4.7,
    difficulty: "Easy",
  },

  // Cycling
  {
    id: "t2",
    title: "Cotswolds Gravel Spin",
    category: "cycling",
    shortDescription: "Quiet lanes, rolling hills, and café stops.",
    longDescription:
      "Mixed-ability ride through limestone villages and hedgerow-lined tracks. We prioritise safe group riding and local businesses.",
    durationDays: 2,
    location: "Cotswolds, England",
    nextStartDate: "2025-09-27",
    availableSlots: 12,
    priceGBP: 159,
    images: [IMG.cycle1, IMG.cycle2],
    rating: 4.7,
    difficulty: "Moderate",
  },
  {
    id: "t6",
    title: "Yorkshire Dales Road Day",
    category: "cycling",
    shortDescription: "Valley loops, iconic climbs, and sweeping descents.",
    longDescription:
      "Scenic tarmac day with multiple pace groups and mechanical support. Emphasis on respectful road sharing.",
    durationDays: 1,
    location: "Yorkshire Dales, England",
    nextStartDate: "2025-10-10",
    availableSlots: 6,
    priceGBP: 95,
    images: [IMG.cycle2, IMG.cycle3],
    rating: 4.5,
    difficulty: "Moderate",
  },
  {
    id: "t7",
    title: "Forest of Dean Flow",
    category: "cycling",
    shortDescription: "Beginner-friendly forest trails with skills coaching.",
    longDescription:
      "A confidence-building day among ancient woodland. Learn cornering and braking with minimal trail impact.",
    durationDays: 1,
    location: "Forest of Dean, England",
    nextStartDate: "2025-09-25",
    availableSlots: 0,
    priceGBP: 85,
    images: [IMG.cycle3],
    rating: 4.6,
    difficulty: "Easy",
  },

  // Nature walks
  {
    id: "t3",
    title: "Caledonian Forest Walk",
    category: "nature",
    shortDescription: "Guided immersion focused on habitats and birdsong.",
    longDescription:
      "Slow-paced woodland walk exploring native species and rewilding stories. Suitable for all abilities and ages.",
    durationDays: 1,
    location: "Cairngorms, Scotland",
    nextStartDate: "2025-10-05",
    availableSlots: 10,
    priceGBP: 89,
    images: [IMG.nature1, IMG.nature2],
    rating: 4.9,
    difficulty: "Easy",
  },
  {
    id: "t8",
    title: "Jurassic Coast Tide Trails",
    category: "nature",
    shortDescription: "Coastal geology, fossils, and shoreline ecology.",
    longDescription:
      "Discover sea-cliff strata and beach ecology with a conservation-minded guide. Tides govern timing; flexibility required.",
    durationDays: 1,
    location: "Dorset, England",
    nextStartDate: "2025-09-30",
    availableSlots: 5,
    priceGBP: 99,
    images: [IMG.nature2, IMG.nature3],
    rating: 4.7,
    difficulty: "Moderate",
  },
  {
    id: "t9",
    title: "Peak District Moorland Ramble",
    category: "nature",
    shortDescription: "Heather moors, waders, and peatland restoration.",
    longDescription:
      "Gentle loop highlighting moorland habitats and the importance of peat for carbon storage.",
    durationDays: 1,
    location: "Peak District, England",
    nextStartDate: "2025-10-08",
    availableSlots: 15,
    priceGBP: 75,
    images: [IMG.nature3],
    rating: 4.6,
    difficulty: "Easy",
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

/** ---------- Small SVG Icons ---------- */
const Icon = {
  Hiking: () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="4" r="2" />
      <path d="M9 22v-6l2-3 3 2 1 7" />
      <path d="M7 12l4-2 3 2 3-1" />
    </svg>
  ),
  Cycling: () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="5.5" cy="18.5" r="3.5" />
      <circle cx="18.5" cy="18.5" r="3.5" />
      <path d="M5.5 18.5h4l3-7h3" />
      <path d="M14 6l2 2" />
    </svg>
  ),
  Nature: () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 2v20" />
      <path d="M7 7c2 0 3-3 5-3s3 3 5 3" />
      <path d="M7 14c2 0 3-3 5-3s3 3 5 3" />
      <path d="M7 21c2 0 3-3 5-3s3 3 5 3" />
    </svg>
  ),
  Star: () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 17.27 18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  ),
};

/** ---------- Smart Image (with graceful fallback) ---------- */
const PLACEHOLDER =
  "data:image/svg+xml;base64," +
  btoa(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='#16A34A'/>
          <stop offset='100%' stop-color='#22C55E'/>
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' fill='url(#g)'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
        font-family='Arial' font-size='26' fill='white' opacity='0.9'>
        EcoVenture
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
    <div className={cn("relative overflow-hidden bg-emerald-50", className)}>
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
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0" />
    </div>
  );
}

/** ---------- Hooks: hash & focus handling ---------- */
function useHashCategory(): Category | "all" {
  const { hash } = useLocation();
  return useMemo(() => {
    const h = (hash || "").replace("#", "").toLowerCase();
    return (["hiking", "cycling", "nature"].includes(h) ? (h as Category) : "all");
  }, [hash]);
}

function useFocusTour() {
  const [params] = useSearchParams();
  const id = params.get("focus") || "";
  return id;
}

/** ---------- Page ---------- */
export default function Tours() {
  const navigate = useNavigate();
  const hashCategory = useHashCategory();
  const [active, setActive] = useState<Category | "all">(hashCategory);
  const [query, setQuery] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [open, setOpen] = useState<Tour | null>(null);
  const focusId = useFocusTour();
  const focusRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setActive(hashCategory), [hashCategory]);

  // Scroll and open if ?focus=ID present
  useEffect(() => {
    if (!focusId) return;
    const t = ALL_TOURS.find((x) => x.id === focusId);
    if (t) {
      setOpen(t);
      setTimeout(() => focusRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
    }
  }, [focusId]);

  const filtered = useMemo(() => {
    return ALL_TOURS.filter((t) => (active === "all" ? true : t.category === active))
      .filter((t) => (onlyAvailable ? t.availableSlots > 0 : true))
      .filter((t) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q) ||
          t.shortDescription.toLowerCase().includes(q)
        );
      });
  }, [active, onlyAvailable, query]);

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-700 p-6 text-white ring-1 ring-black/10">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-extrabold tracking-tight">Tours & Itineraries</h1>
          <p className="mt-1 text-emerald-100">
            Explore eco-friendly hiking trips, cycling tours, and guided nature walks across the UK.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Tabs */}
          <nav className="flex flex-wrap gap-2">
            <Tab
              label="All"
              active={active === "all"}
              onClick={() => {
                setActive("all");
                navigate("#");
              }}
            />
            <Tab
              icon={<Icon.Hiking />}
              label="Hiking"
              active={active === "hiking"}
              onClick={() => {
                setActive("hiking");
                navigate("#hiking");
              }}
            />
            <Tab
              icon={<Icon.Cycling />}
              label="Cycling"
              active={active === "cycling"}
              onClick={() => {
                setActive("cycling");
                navigate("#cycling");
              }}
            />
            <Tab
              icon={<Icon.Nature />}
              label="Nature walks"
              active={active === "nature"}
              onClick={() => {
                setActive("nature");
                navigate("#nature");
              }}
            />
          </nav>

          {/* Search & toggle */}
          <div className="flex flex-1 flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
            <div className="relative sm:w-80">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tours, e.g. 'Cotswolds'…"
                className="w-full rounded-xl border border-emerald-300 bg-white/90 px-10 py-3 text-neutral-900 placeholder-neutral-500 outline-none transition focus:border-emerald-500"
              />
              <span className="pointer-events-none absolute left-3 top-2.5 inline-flex h-7 w-7 items-center justify-center text-emerald-600">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
              </span>
            </div>

            <label className="inline-flex items-center gap-2 self-start rounded-xl border border-emerald-300 bg-white/90 px-3 py-2 text-sm text-neutral-800 transition hover:bg-emerald-50 sm:self-auto">
              <input
                type="checkbox"
                className="size-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
              />
              Only show available
            </label>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl bg-white p-8 text-center text-neutral-700 ring-1 ring-black/5">
              No tours match your filters. Try clearing search or switching categories.
            </div>
          )}

          {filtered.map((t) => (
            <div key={t.id} ref={t.id === focusId ? focusRef : undefined}>
              <TourCard tour={t} onOpen={() => setOpen(t)} navigate={navigate} />
            </div>
          ))}
        </div>
      </div>

      {/* Detail modal */}
      {open && <DetailModal tour={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

/** ---------- UI Bits ---------- */
function Tab({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon?: JSX.Element;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ring-1 transition",
        active
          ? "bg-emerald-600 text-white ring-emerald-600"
          : "bg-white text-emerald-700 ring-emerald-300 hover:bg-emerald-50"
      )}
    >
      {icon && <span className="text-white/90">{active ? icon : <span className="text-emerald-700">{icon}</span>}</span>}
      {label}
    </button>
  );
}

function TourCard({ tour, onOpen, navigate }: { tour: Tour; onOpen: () => void; navigate: (path: string) => void }) {
  const soldOut = tour.availableSlots <= 0;
  // Accept navigate as a prop from parent
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative h-44 w-full">
        <SmartImage src={tour.images[0]} alt={tour.title} className="h-full w-full" />
        <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-600/20">
          <span className="inline-block size-2 rounded-full bg-emerald-600" />
          {tour.category}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-bold text-neutral-900">{tour.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-neutral-700">{tour.shortDescription}</p>

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
            <dt className="text-neutral-500">Availability</dt>
            <dd
              className={cn(
                "font-semibold",
                soldOut ? "text-rose-700" : tour.availableSlots <= 5 ? "text-amber-700" : "text-emerald-700"
              )}
            >
              {soldOut ? "Sold out" : `${tour.availableSlots} left`}
            </dd>
          </div>
        </dl>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-base font-semibold text-emerald-700">from {formatGBP(tour.priceGBP)}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-sm font-semibold text-emerald-800">
            <Icon.Star /> {tour.rating.toFixed(1)}
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={onOpen}
            className="inline-flex items-center rounded-2xl bg-emerald-600 px-4 py-2 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            View details
          </button>
          <button
            disabled={soldOut}
            className={cn(
              "inline-flex items-center rounded-2xl px-4 py-2 font-semibold shadow-sm focus:outline-none focus:ring-2",
              soldOut
                ? "cursor-not-allowed bg-neutral-200 text-neutral-500"
                : "bg-white text-emerald-700 ring-1 ring-emerald-300 hover:bg-emerald-50 focus:ring-emerald-500"
            )}
            onClick={() => navigate('/booking')}
          >
            {soldOut ? "Join waitlist" : "Book now"}
          </button>
        </div>
      </div>
    </article>
  );
}

function DetailModal({ tour, onClose }: { tour: Tour; onClose: () => void }) {
  const [imgIndex, setImgIndex] = useState(0);
  const imgs = tour.images.length ? tour.images : [PLACEHOLDER];
  const prev = () => setImgIndex((i) => (i - 1 + imgs.length) % imgs.length);
  const next = () => setImgIndex((i) => (i + 1) % imgs.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const soldOut = tour.availableSlots <= 0;

  return (
    <div className="fixed inset-0 z-50">
      <div
        aria-hidden
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/10">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-10 inline-flex size-9 items-center justify-center rounded-full bg-white/90 text-neutral-700 ring-1 ring-black/10 transition hover:scale-105"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Gallery */}
          <div className="relative h-64 w-full sm:h-80">
            <SmartImage src={imgs[imgIndex]} alt={tour.title} className="h-full w-full" />
            {imgs.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 ring-1 ring-black/10 transition hover:scale-105"
                  aria-label="Previous image"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 ring-1 ring-black/10 transition hover:scale-105"
                  aria-label="Next image"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </>
            )}
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
              {imgs.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 w-4 rounded-full",
                    i === imgIndex ? "bg-white" : "bg-white/50"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="grid gap-6 p-6 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <h2 className="text-xl font-extrabold text-neutral-900">{tour.title}</h2>
              <p className="mt-1 text-sm text-neutral-600">{tour.location} • {tour.durationDays} days • {tour.difficulty}</p>
              <div className="mt-3 text-neutral-800">{tour.longDescription}</div>
            </div>
            <aside className="sm:col-span-1">
              <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
                <dl className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-neutral-600">Next start</dt>
                    <dd className="font-semibold">{formatDate(tour.nextStartDate)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-neutral-600">Availability</dt>
                    <dd
                      className={cn(
                        "font-semibold",
                        soldOut ? "text-rose-700" : tour.availableSlots <= 5 ? "text-amber-700" : "text-emerald-700"
                      )}
                    >
                      {soldOut ? "Sold out" : `${tour.availableSlots} slots`}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-neutral-600">Rating</dt>
                    <dd className="inline-flex items-center gap-1 font-semibold text-emerald-800">
                      <Icon.Star /> {tour.rating.toFixed(1)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-extrabold text-emerald-700">{formatGBP(tour.priceGBP)}</span>
                  <button
                    disabled={soldOut}
                    onClick={() => navigate('/booking')}
                    className={cn(
                      "rounded-xl px-4 py-2 font-semibold shadow-sm focus:outline-none focus:ring-2",
                      soldOut
                        ? "cursor-not-allowed bg-neutral-200 text-neutral-500"
                        : "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500"
                    )}
                  >
                    {soldOut ? "Join waitlist" : "Book now"}
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
