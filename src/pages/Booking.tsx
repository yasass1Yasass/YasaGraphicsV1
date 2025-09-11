// src/pages/Booking.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";

/** ---------- Types (aligned with your Tours.tsx) ---------- */
type Category = "hiking" | "cycling" | "nature";
type Difficulty = "Easy" | "Moderate" | "Challenging";

type Tour = {
  id: string;
  title: string;
  category: Category;
  shortDescription: string;
  longDescription?: string;
  durationDays: number;
  location: string;
  nextStartDate: string; // ISO
  availableSlots: number;
  priceGBP: number;
  images: string[];
  rating: number;
  difficulty?: Difficulty;
};

/** ---------- Utils ---------- */
const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
const uid = (p = "bk") => `${p}_${Math.random().toString(36).slice(2, 8)}${Date.now()}`;
const load = <T,>(k: string, f: T): T => {
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : f;
  } catch {
    return f;
  }
};
const save = <T,>(k: string, v: T) => localStorage.setItem(k, JSON.stringify(v));

function formatGBP(n: number) {
  try {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
  } catch {
    return `£${n}`;
  }
}
function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

/** ---------- Placeholder image gradient ---------- */
const PLACEHOLDER =
  "data:image/svg+xml;base64," +
  btoa(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'>
      <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='#059669'/><stop offset='100%' stop-color='#2563EB'/>
      </linearGradient></defs>
      <rect width='100%' height='100%' fill='url(#g)'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
        font-family='Arial' font-size='26' fill='white' opacity='0.9'>EcoVenture</text>
    </svg>`
  );

function ImageCover({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [ok, setOk] = useState(true);
  return (
    <div className={cn("relative overflow-hidden bg-emerald-50", className)}>
      <img
        src={ok && src ? src : PLACEHOLDER}
        alt={alt}
        loading="lazy"
        onError={() => setOk(false)}
        className="h-full w-full object-cover"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0" />
    </div>
  );
}

/** ---------- Sample fallback based on your card ---------- */
const FALLBACK_TOUR: Tour = {
  id: "t1",
  title: "Lake District Ridgeway",
  category: "hiking",
  shortDescription: "Panoramic fell views across classic Lakeland scenery.",
  durationDays: 3,
  location: "Lake District, England",
  nextStartDate: "2025-09-20",
  availableSlots: 8,
  priceGBP: 189,
  images: [
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=60",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=60",
  ],
  rating: 4.8,
  difficulty: "Moderate",
};

/** ---------- Page ---------- */
export default function Booking() {
  const nav = useNavigate();
  const { state } = useLocation() as { state?: { tour?: Tour } };
  const [params] = useSearchParams();
  const wantedId = params.get("id") || params.get("book") || state?.tour?.id;

  // Try: 1) from state, 2) from localStorage custom_tours by id, 3) fallback
  const tour: Tour = useMemo(() => {
    if (state?.tour) return state.tour;
    if (wantedId) {
      const custom = load<Tour[]>("custom_tours", []);
      const found = custom.find((t) => t.id === wantedId);
      if (found) return found;
    }
    return FALLBACK_TOUR;
  }, [state?.tour, wantedId]);

  const soldOut = tour.availableSlots <= 0;

  /** ----- Booking form state ----- */
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [party, setParty] = useState(1);
  const [startDate, setStartDate] = useState(tour.nextStartDate || "");
  const [notes, setNotes] = useState("");
  const [payMode, setPayMode] = useState<"deposit" | "full">("full");
  const [agree, setAgree] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (party > tour.availableSlots) setParty(tour.availableSlots || 1);
  }, [tour.availableSlots, party]);

  const price = tour.priceGBP;
  const subtotal = price * Math.max(1, party);
  const depositDue = Math.round(subtotal * 0.2);
  const totalDue = payMode === "full" ? subtotal : depositDue;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (soldOut) return alert("Sorry, this tour is currently sold out.");
    if (!first.trim() || !last.trim()) return alert("Please enter your full name.");
    if (!email.trim()) return alert("Please enter an email address.");
    if (!agree) return alert("Please agree to the terms to continue.");

    const booking = {
      id: uid(),
      tourId: tour.id,
      tourTitle: tour.title,
      startDate,
      party,
      customer: { first: first.trim(), last: last.trim(), email: email.trim(), phone: phone.trim() },
      notes: notes.trim(),
      payMode,
      totalDue,
      createdAt: new Date().toISOString(),
    };

    const current = load<any[]>("bookings", []);
    save("bookings", [booking, ...current]);

    setSuccess(`Booking confirmed for ${first} ${last}. Reference: ${booking.id}`);
    // Optionally redirect after a short delay:
    // setTimeout(() => nav("/tours"), 1200);
  }

  return (
    <div className="space-y-8 px-4 sm:px-6">
      {/* Header */}
      <section className="rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-indigo-600 p-6 text-white ring-1 ring-black/10">
        <div className="mx-auto max-w-7xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm ring-1 ring-white/20">
            <span className="inline-block size-2 rounded-full bg-emerald-300" /> {tour.category}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">{tour.title}</h1>
          <p className="mt-1 text-emerald-50">{tour.shortDescription}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
        {/* Left: image + summary (sticky on desktop) */}
        <aside className="lg:col-span-1">
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
            <ImageCover src={tour.images?.[0]} alt={tour.title} className="h-48 w-full" />
            <div className="p-5">
              <dl className="grid grid-cols-2 gap-3 text-sm text-neutral-800">
                <div className="rounded-lg bg-neutral-50 p-2">
                  <dt className="text-neutral-500">Location</dt>
                  <dd className="font-semibold">{tour.location}</dd>
                </div>
                <div className="rounded-lg bg-neutral-50 p-2">
                  <dt className="text-neutral-500">Duration</dt>
                  <dd className="font-semibold">{tour.durationDays} days</dd>
                </div>
                <div className="rounded-lg bg-neutral-50 p-2">
                  <dt className="text-neutral-500">Next start</dt>
                  <dd className="font-semibold">{formatDate(tour.nextStartDate)}</dd>
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
                <span className="text-lg font-extrabold text-emerald-700">from {formatGBP(tour.priceGBP)}</span>
                <span
                  aria-label={`Rating ${tour.rating} out of 5`}
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-sm font-semibold text-emerald-800"
                >
                  ★ {tour.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h3 className="font-semibold text-neutral-900">Price breakdown</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span>{formatGBP(price)} × {party} {party > 1 ? "guests" : "guest"}</span>
                <span className="font-semibold">{formatGBP(subtotal)}</span>
              </li>
              <li className="flex items-center justify-between text-neutral-600">
                <span>Tour protection & fees</span>
                <span>Included</span>
              </li>
              <li className="mt-2 flex items-center justify-between border-t pt-2">
                <span className="font-semibold">
                  {payMode === "full" ? "Total due now" : "Deposit due (20%)"}
                </span>
                <span className="text-lg font-extrabold text-emerald-700">
                  {formatGBP(totalDue)}
                </span>
              </li>
            </ul>
          </div>
        </aside>

        {/* Right: booking form */}
        <section className="lg:col-span-2">
          <form onSubmit={submit} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            {success && (
              <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-emerald-800 ring-1 ring-emerald-200">
                {success}
              </div>
            )}

            <h2 className="text-lg font-extrabold text-emerald-900">Guest details</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="first" className="text-sm font-semibold text-neutral-800">First name *</label>
                <input
                  id="first" value={first} onChange={(e) => setFirst(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-emerald-300 bg-white/90 px-3 py-2 outline-none transition focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="last" className="text-sm font-semibold text-neutral-800">Last name *</label>
                <input
                  id="last" value={last} onChange={(e) => setLast(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-emerald-300 bg-white/90 px-3 py-2 outline-none transition focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-semibold text-neutral-800">Email *</label>
                <input
                  id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-emerald-300 bg-white/90 px-3 py-2 outline-none transition focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="text-sm font-semibold text-neutral-800">Phone</label>
                <input
                  id="phone" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-emerald-300 bg-white/90 px-3 py-2 outline-none transition focus:border-emerald-500"
                />
              </div>
            </div>

            <h3 className="mt-6 text-lg font-extrabold text-emerald-900">Trip details</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="party" className="text-sm font-semibold text-neutral-800">Party size *</label>
                <input
                  id="party" type="number" min={1} max={Math.max(1, tour.availableSlots)}
                  value={party} onChange={(e) => setParty(Math.max(1, Math.min(Number(e.target.value), tour.availableSlots)))}
                  className="mt-1 w-full rounded-xl border border-emerald-300 bg-white/90 px-3 py-2 outline-none transition focus:border-emerald-500"
                  required
                />
                <p className="mt-1 text-xs text-neutral-600">Max {tour.availableSlots} remaining.</p>
              </div>
              <div>
                <label htmlFor="start" className="text-sm font-semibold text-neutral-800">Start date *</label>
                <input
                  id="start" type="date" value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-emerald-300 bg-white/90 px-3 py-2 outline-none transition focus:border-emerald-500"
                  required
                />
                <p className="mt-1 text-xs text-neutral-600">Suggested: {formatDate(tour.nextStartDate)}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-neutral-800">Payment</span>
                <div className="mt-2 flex gap-3">
                  <label className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white/90 px-3 py-2 text-sm">
                    <input
                      type="radio" name="pay" checked={payMode === "full"} onChange={() => setPayMode("full")}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    Pay in full
                  </label>
                  <label className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white/90 px-3 py-2 text-sm">
                    <input
                      type="radio" name="pay" checked={payMode === "deposit"} onChange={() => setPayMode("deposit")}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    20% deposit
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="notes" className="text-sm font-semibold text-neutral-800">Notes (access, dietary, kit…)</label>
              <textarea
                id="notes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)}
                className="mt-1 w-full rounded-xl border border-emerald-300 bg-white/90 px-3 py-2 outline-none transition focus:border-emerald-500"
                placeholder="Anything we should know?"
              />
            </div>

            <label className="mt-4 inline-flex items-start gap-3 text-sm">
              <input
                type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 size-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-neutral-700">
                I agree to EcoVenture’s booking terms and leave-no-trace policy.
              </span>
            </label>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="submit" disabled={soldOut}
                className={cn(
                  "rounded-2xl px-5 py-3 font-semibold shadow-sm focus:outline-none focus:ring-2",
                  soldOut
                    ? "cursor-not-allowed bg-neutral-200 text-neutral-500"
                    : "bg-emerald-600 text-white hover:-translate-y-0.5 hover:bg-emerald-700 focus:ring-emerald-500"
                )}
              >
                {soldOut ? "Sold out" : `Pay ${formatGBP(totalDue)} & reserve`}
              </button>
              <Link
                to="/tours"
                className="rounded-2xl border border-emerald-300 bg-white px-5 py-3 font-semibold text-emerald-700 transition hover:-translate-y-0.5 hover:bg-emerald-50"
              >
                Back to tours
              </Link>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
