import { useEffect, useMemo, useState } from "react";
import { Search, Tag, Menu, X } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

type DesignListing = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  price: number;
  image: string;
  video?: string;
  starting?: boolean;
  discountEnabled?: boolean;
  discountPercentage?: number;
  createdAt: number;
};

// Normalized type for display
type NormalizedDesign = {
  id: string;
  title: string;
  category: string;
  price: number;
  image: string;
  subtitle?: string;
  video?: string;
  starting?: boolean;
  discountEnabled?: boolean;
  discountPercentage?: number;
};

const CURRENCY = (n: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(n);



export default function Designs() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [mobileCatsOpen, setMobileCatsOpen] = useState(false);
  const [allCategories, setAllCategories] = useState<string[]>([]);

  // Load listings from Convex
  const listingsData = useQuery(api.designs.list) || [];
  
  // Convert Convex data to DesignListing format
  const customListings: DesignListing[] = useMemo(() => {
    return listingsData.map((item) => ({
      id: item.id.toString(),
      title: item.title,
      subtitle: item.subtitle,
      category: item.category,
      price: item.price,
      image: item.image,
      video: item.video,
      starting: item.starting,
      discountEnabled: item.discountEnabled,
      discountPercentage: item.discountPercentage,
      createdAt: item.createdAt,
    }));
  }, [listingsData]);

  // Generate categories from custom listings
  useEffect(() => {
    const cats = new Set<string>(["All"]);
    customListings.forEach((l) => cats.add(l.category));
    setAllCategories(Array.from(cats).sort());
  }, [customListings]);

  // Use only custom listings from API
  const allDesignItems = useMemo(() => {
    const items: NormalizedDesign[] = customListings.map((l) => ({
      id: l.id,
      title: l.title,
      category: l.category,
      price: l.price,
      image: l.image,
      subtitle: l.subtitle,
      video: l.video,
      starting: l.starting,
      discountEnabled: l.discountEnabled,
      discountPercentage: l.discountPercentage,
    }));
    return items;
  }, [customListings]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return allDesignItems.filter((d) => {
      const title = d.title.toLowerCase();
      const matchesQuery = !query || title.includes(query) || d.category.toLowerCase().includes(query);
      const matchesCategory = category === "All" ? true : d.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [q, category, allDesignItems]);

  return (
    <div className="min-h-screen bg-[#0b0708] text-white">
      {/* Animations */}
      <style>
        {`
          @keyframes fadeUp {
            from { transform: translateY(10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes fadeSlideLeft {
            from { transform: translateX(-10px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes drawerIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
          @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
        `}
      </style>

      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(247,181,0,0.14),transparent_60%)]" />
        <div className="mx-auto max-w-6xl px-4 pt-8 sm:pt-12 pb-4 sm:pb-6 relative">
          <div className="will-change-transform" style={{ animation: "fadeUp .55s ease-out both" }}>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">
              Our <span className="text-[#f7b500]">Designs</span>
            </h1>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-white/70 max-w-2xl leading-6">
              Browse our design services with pricing. Use search and categories to find what you need.
            </p>
          </div>

          {/* Controls */}
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Mobile category button */}
            <button
              type="button"
              onClick={() => setMobileCatsOpen(true)}
              className="md:hidden w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-3 text-xs sm:text-sm font-semibold hover:bg-white/10 transition"
            >
              <Menu className="w-4 h-4 text-[#f7b500]" />
              Categories
            </button>

            {/* Search */}
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl px-3 sm:px-4 py-2.5 sm:py-3">
                <Search className="h-4 w-4 text-[#f7b500] flex-shrink-0" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search (logo, web, flyer, video...)"
                  className="w-full bg-transparent text-xs sm:text-sm outline-none placeholder:text-white/40"
                />
              </div>
            </div>
          </div>

          <p className="mt-3 sm:mt-4 text-xs text-white/50">
            Category: <span className="text-[#f7b500] font-bold">{category}</span> • Showing{" "}
            <span className="text-[#f7b500] font-bold">{filtered.length}</span> designs
          </p>
        </div>
      </section>

      {/* Layout: Sidebar + Content */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mt-6 grid gap-6 md:grid-cols-12">
          {/* Sidebar (Desktop) */}
          <aside className="hidden md:block md:col-span-3">
            <div
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 sticky top-24 will-change-transform"
              style={{ animation: "fadeSlideLeft .45s ease-out both" }}
            >
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#f7b500]" />
                <h3 className="text-sm font-extrabold">Categories</h3>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {allCategories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`
                      w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition
                      ${category === c ? "bg-[#f7b500] text-black" : "text-white/80 hover:bg-[#f7b500]/15"}
                    `}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setQ("");
                  setCategory("All");
                }}
                className="mt-4 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Cards */}
          <div className="md:col-span-9">
            <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item, idx) => (
                <div
                  key={item.id}
                  className="
                    group overflow-hidden rounded-xl sm:rounded-2xl
                    border border-[#f7b500]/20
                    bg-white/[0.06] backdrop-blur-xl
                    shadow-[0_0_0_1px_rgba(255,255,255,0.03)]
                    hover:border-[#f7b500]/45 hover:bg-white/[0.08]
                    transition hover:-translate-y-1
                  "
                  style={{
                    animation: "fadeUp .55s ease-out both",
                    animationDelay: `${Math.min(0.35, idx * 0.04)}s`,
                  }}
                >
                  {/* Image/Video */}
                  <div className="relative h-40 sm:h-44 bg-black/30 group/media overflow-hidden">
                    {item.video ? (
                      <video
                        src={item.video.startsWith('http') || item.video.startsWith('data:') ? item.video : item.video}
                        className="h-full w-full object-cover opacity-95 group-hover:opacity-100 transition"
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                        muted
                        loop
                      />
                    ) : item.image ? (
                      <img
                        src={item.image.startsWith('http') || item.image.startsWith('data:') ? item.image : item.image}
                        alt={item.title}
                        className="h-full w-full object-cover opacity-95 group-hover:opacity-100 transition"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-[#f7b500] text-xs sm:text-sm font-extrabold">YASA Graphics</div>
                          <div className="text-xs text-white/60 mt-1">Preview Image</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-5">
                    <div className="flex items-start justify-between gap-2 sm:gap-3">
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-extrabold truncate">{item.title}</h3>
                        <p className="mt-1 text-xs text-white/60">{item.category}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {item.starting && <p className="text-xs text-white/50">Starting</p>}
                        <div className="flex flex-col gap-0.5">
                          {item.discountEnabled && item.discountPercentage && item.discountPercentage > 0 ? (
                            <>
                              <p className="text-xs sm:text-xs font-semibold text-white/60 line-through">
                                {CURRENCY(item.price)}
                              </p>
                              <p className="text-xs sm:text-sm font-extrabold text-[#f7b500]">
                                {CURRENCY(Math.round(item.price * (1 - item.discountPercentage / 100)))}
                              </p>
                              <p className="text-xs text-red-400 font-bold">-{item.discountPercentage}%</p>
                            </>
                          ) : (
                            <p className="text-xs sm:text-sm font-extrabold text-[#f7b500]">
                              {CURRENCY(item.price)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="mt-14 text-center">
                <p className="text-sm font-semibold">No results found</p>
                <p className="mt-2 text-xs text-white/60">Try another keyword or choose “All”.</p>
                <button
                  onClick={() => {
                    setQ("");
                    setCategory("All");
                  }}
                  className="mt-4 rounded-md bg-[#f7b500] px-5 py-2 text-xs font-extrabold text-black hover:brightness-95 transition"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Drawer */}
      {mobileCatsOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60"
            style={{ animation: "overlayIn .18s ease-out both" }}
            onClick={() => setMobileCatsOpen(false)}
          />
          <div
            className="absolute left-0 top-0 h-full w-[82%] max-w-xs
              border-r border-white/10 bg-[#0b0708]/75 backdrop-blur-xl p-4"
            style={{ animation: "drawerIn .22s ease-out both" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#f7b500]" />
                <h3 className="text-sm font-extrabold">Categories</h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileCatsOpen(false)}
                className="rounded-lg border border-white/10 bg-white/5 p-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              {allCategories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCategory(c);
                    setMobileCatsOpen(false);
                  }}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition
                    ${category === c ? "bg-[#f7b500] text-black" : "text-white/80 hover:bg-[#f7b500]/15"}
                  `}
                >
                  {c}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setQ("");
                setCategory("All");
                setMobileCatsOpen(false);
              }}
              className="mt-4 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
