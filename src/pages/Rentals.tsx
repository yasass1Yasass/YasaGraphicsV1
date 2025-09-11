import { useEffect, useMemo, useState } from "react";

/** ---------- Types ---------- */
type RentCategory = "tents" | "sleeping" | "backpacks" | "stoves" | "poles" | "misc";

type RentalItem = {
  id: string;
  title: string;
  brand: string;
  category: RentCategory;
  shortDescription: string;
  images: string[];
  dailyGBP: number;
  depositGBP: number;
  stock: number;
  rating: number; // 0..5
  weightKg?: number;
  capacityPeople?: number;
  tempComfortC?: number;
  volumeL?: number;
  tags?: string[];
};

/** ---------- Image set (Unsplash) ---------- */
const IMG = {
  tent1: "https://images.unsplash.com/photo-1504280390368-3971e38c98ad?auto=format&fit=crop&w=1400&q=60",
  tent2: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1400&q=60",
  sleeping1: "https://images.unsplash.com/photo-1523419409543-45b6067458a8?auto=format&fit=crop&w=1400&q=60",
  pack1: "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1400&q=60",
  stove1: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=60",
  poles1: "https://images.unsplash.com/photo-1520963742040-8c70b3d1a8b1?auto=format&fit=crop&w=1400&q=60",
};

/** ---------- Demo data ---------- */
const RENTAL_ITEMS: RentalItem[] = [
  {
    id: "r1",
    title: "Alpine 2P Tent",
    brand: "EverPeak",
    category: "tents",
    shortDescription: "Freestanding 3-season tent with quick pitch & great ventilation.",
    images: [IMG.tent1, IMG.tent2],
    dailyGBP: 18,
    depositGBP: 60,
    stock: 6,
    rating: 4.7,
    weightKg: 2.4,
    capacityPeople: 2,
    tags: ["3-season", "freestanding", "family"],
  },
  {
    id: "r2",
    title: "Summit Pro 4P Tent",
    brand: "NorthLite",
    category: "tents",
    shortDescription: "Roomy family tent, strong poles, excellent storm stability.",
    images: [IMG.tent2],
    dailyGBP: 24,
    depositGBP: 80,
    stock: 3,
    rating: 4.6,
    weightKg: 4.9,
    capacityPeople: 4,
    tags: ["family", "storm-ready"],
  },
  {
    id: "r3",
    title: "Down Sleeping Bag −5°C",
    brand: "TrailNest",
    category: "sleeping",
    shortDescription: "Lightweight down fill with draft collar for chilly nights.",
    images: [IMG.sleeping1],
    dailyGBP: 10,
    depositGBP: 40,
    stock: 10,
    rating: 4.8,
    tempComfortC: -5,
    weightKg: 1.1,
    tags: ["3-season", "down"],
  },
  {
    id: "r4",
    title: "Trekking Backpack 55L",
    brand: "HikeWorks",
    category: "backpacks",
    shortDescription: "Comfort frame, ventilated back panel, lots of pockets.",
    images: [IMG.pack1],
    dailyGBP: 9,
    depositGBP: 35,
    stock: 7,
    rating: 4.5,
    volumeL: 55,
    weightKg: 1.7,
    tags: ["men", "women"],
  },
  {
    id: "r5",
    title: "Ultralight Gas Stove",
    brand: "CampSpark",
    category: "stoves",
    shortDescription: "Fast boil, compact, easy simmer control.",
    images: [IMG.stove1],
    dailyGBP: 5,
    depositGBP: 20,
    stock: 12,
    rating: 4.4,
    weightKg: 0.09,
    tags: ["ultralight"],
  },
  {
    id: "r6",
    title: "Carbon Trekking Poles",
    brand: "StridePro",
    category: "poles",
    shortDescription: "Carbon shafts, cork grips, quick-lock length.",
    images: [IMG.poles1],
    dailyGBP: 6,
    depositGBP: 25,
    stock: 8,
    rating: 4.6,
    weightKg: 0.42,
    tags: ["ultralight", "pair"],
  },
];

/** ---------- Helpers ---------- */
const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
function formatGBP(n: number) {
  try {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
  } catch {
    return `£${n}`;
  }
}

/** ---------- Page ---------- */
export default function Rentals() {
  const [extra, setExtra] = useState<RentalItem[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("rental_items");
      setExtra(raw ? (JSON.parse(raw) as RentalItem[]) : []);
    } catch {
      setExtra([]);
    }
  }, []);

  const SOURCE = useMemo(() => [...extra, ...RENTAL_ITEMS], [extra]);

  // Filters (removed: sort & in-stock)
  const [active, setActive] = useState<"all" | RentCategory>("all");
  const [q, setQ] = useState("");
  const [maxDaily, setMaxDaily] = useState(() => Math.max(...SOURCE.map((i) => i.dailyGBP)));

  useEffect(() => {
    setMaxDaily(Math.max(...SOURCE.map((i) => i.dailyGBP)));
  }, [SOURCE]);

  const filtered = useMemo(() => {
    return SOURCE.filter((i) => (active === "all" ? true : i.category === active))
      .filter((i) => i.dailyGBP <= maxDaily)
      .filter((i) => {
        if (!q.trim()) return true;
        const s = q.toLowerCase();
        return (
          i.title.toLowerCase().includes(s) ||
          i.brand.toLowerCase().includes(s) ||
          i.shortDescription.toLowerCase().includes(s) ||
          (i.tags || []).some((t) => t.toLowerCase().includes(s))
        );
      });
    // no sorting applied (sort control removed)
  }, [SOURCE, active, q, maxDaily]);

  const sliderMax = Math.max(30, Math.ceil(Math.max(...SOURCE.map((i) => i.dailyGBP))));

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-indigo-600 p-6 text-white ring-1 ring-black/10">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-extrabold tracking-tight">Camping Gear Rentals</h1>
          <p className="mt-1 text-emerald-50">Tents, sleeping gear, packs & more — rent by the day, low deposit.</p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Category chips */}
          <nav className="flex flex-wrap gap-2">
            <Chip label="All" active={active === "all"} onClick={() => setActive("all")} />
            <Chip label="Tents" active={active === "tents"} onClick={() => setActive("tents")} />
            <Chip label="Sleeping" active={active === "sleeping"} onClick={() => setActive("sleeping")} />
            <Chip label="Backpacks" active={active === "backpacks"} onClick={() => setActive("backpacks")} />
            <Chip label="Stoves" active={active === "stoves"} onClick={() => setActive("stoves")} />
            <Chip label="Poles" active={active === "poles"} onClick={() => setActive("poles")} />
            <Chip label="Misc" active={active === "misc"} onClick={() => setActive("misc")} />
          </nav>

          {/* Right controls (search + price only) */}
          <div className="grid w-full grid-cols-1 gap-3 sm:w-auto sm:grid-cols-2 sm:items-center">
            {/* Search */}
            <div className="relative sm:col-span-1">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search (brand, tags…) "
                className="w-full rounded-xl border border-emerald-300 bg-white/90 px-10 py-3 text-neutral-900 placeholder-neutral-500 outline-none transition focus:border-emerald-500"
              />
              <span className="pointer-events-none absolute left-3 top-2.5 inline-flex h-7 w-7 items-center justify-center text-emerald-600">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </span>
            </div>

            {/* Max price slider */}
            <div className="sm:col-span-1">
              <label className="block text-sm font-semibold text-neutral-700">
                Max £/day <span className="text-emerald-700">({maxDaily})</span>
              </label>
              <input
                type="range"
                min={0}
                max={sliderMax}
                value={maxDaily}
                onChange={(e) => setMaxDaily(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl bg-white p-8 text-center text-neutral-700 ring-1 ring-black/5">
              No items match your filters. Try widening the price or switching categories.
            </div>
          )}

          {filtered.map((item) => (
            <RentalCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** ---------- UI Pieces ---------- */
function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
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
      {label}
    </button>
  );
}

function RentalCard({ item }: { item: RentalItem }) {
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState(3);
  const [start, setStart] = useState<string>("");

  const total = item.dailyGBP * Math.max(1, days) + item.depositGBP;
  const outOfStock = item.stock <= 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-lg">
      {/* Image */}
      <div className="relative h-44 w-full">
        <SmartImage src={item.images[0]} alt={item.title} />
        <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-600/20">
          {item.category}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-600 via-emerald-500 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {outOfStock && (
          <span className="absolute right-3 top-3 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            Out of stock
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-bold text-neutral-900">{item.title}</h3>
        <p className="mt-0.5 text-sm text-neutral-600">
          {item.brand} • ★ {item.rating.toFixed(1)}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-neutral-700">{item.shortDescription}</p>

        {/* Specs row */}
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm text-neutral-800">
          {item.capacityPeople && (
            <div className="rounded-lg bg-neutral-50 p-2">
              <dt className="text-neutral-500">Capacity</dt>
              <dd className="font-medium">{item.capacityPeople}-person</dd>
            </div>
          )}
          {item.tempComfortC !== undefined && (
            <div className="rounded-lg bg-neutral-50 p-2">
              <dt className="text-neutral-500">Comfort</dt>
              <dd className="font-medium">{item.tempComfortC}°C</dd>
            </div>
          )}
          {item.volumeL && (
            <div className="rounded-lg bg-neutral-50 p-2">
              <dt className="text-neutral-500">Volume</dt>
              <dd className="font-medium">{item.volumeL} L</dd>
            </div>
          )}
          {item.weightKg && (
            <div className="rounded-lg bg-neutral-50 p-2">
              <dt className="text-neutral-500">Weight</dt>
              <dd className="font-medium">{item.weightKg} kg</dd>
            </div>
          )}
        </dl>

        {/* Price */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-base font-semibold text-emerald-700">£{item.dailyGBP}/day</span>
          <span className="rounded-full bg-indigo-600 px-2.5 py-1 text-sm font-semibold text-white">
            Deposit {formatGBP(item.depositGBP)}
          </span>
        </div>

        {/* CTA */}
        <div className="mt-4">
          <button
            disabled={outOfStock}
            onClick={() => setOpen((o) => !o)}
            className={cn(
              "w-full rounded-2xl px-4 py-2 font-semibold shadow-sm focus:outline-none focus:ring-2",
              outOfStock
                ? "cursor-not-allowed bg-neutral-200 text-neutral-500"
                : "bg-emerald-600 text-white hover:-translate-y-0.5 hover:bg-emerald-700 focus:ring-emerald-500"
            )}
          >
            {outOfStock ? "Unavailable" : open ? "Hide rent options" : "Rent this item"}
          </button>
        </div>

        {/* Inline rent panel */}
        {open && !outOfStock && (
          <div className="mt-4 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <label className="block text-sm font-semibold text-neutral-700">Start date</label>
                <input
                  type="date"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-emerald-300 bg-white/90 px-3 py-2 outline-none transition focus:border-emerald-500"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm font-semibold text-neutral-700">Days</label>
                <input
                  type="number"
                  min={1}
                  value={days}
                  onChange={(e) => setDays(Math.max(1, Number(e.target.value) || 1))}
                  className="mt-1 w-full rounded-xl border border-emerald-300 bg-white/90 px-3 py-2 outline-none transition focus:border-emerald-500"
                />
              </div>
              <div className="sm:col-span-1 flex items-end">
                <div className="w-full rounded-xl bg-white px-3 py-2 ring-1 ring-emerald-200">
                  <p className="text-xs text-neutral-600">Estimated total</p>
                  <p className="text-lg font-extrabold text-emerald-700">{formatGBP(total)}</p>
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-600">
              <p>Total = days × daily + deposit. Gear returned clean & undamaged to refund deposit.</p>
              <button
                onClick={() => alert("Checkout flow to be implemented")}
                className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                Continue to checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

/** ---------- Smart Image ---------- */
function SmartImage({ src, alt }: { src?: string; alt: string }) {
  const fallback =
    "data:image/svg+xml;base64," +
    btoa(
      `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'>
        <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='#16A34A'/><stop offset='100%' stop-color='#4F46E5'/>
        </linearGradient></defs>
        <rect width='100%' height='100%' fill='url(#g)'/>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
          font-family='Arial' font-size='24' fill='white' opacity='0.9'>Gear Image</text>
      </svg>`
    );
  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-emerald-50 to-indigo-50">
      <img
        src={src || fallback}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover transition duration-700 ease-out"
        onError={(e) => ((e.currentTarget.src = fallback))}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0" />
    </div>
  );
}
