import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  LayoutGrid,
  Megaphone,
  Image as ImageIcon,
  Tag,
  DollarSign,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

type DesignItem = {
  id: string;
  title: string;
  category: string;
  priceLKR: number;
  img?: string; // URL/path
  badge?: "Popular" | "New" | "Best Value" | "";
};

type AdItem = {
  id: string;
  text: string;
  link?: string;
  active: boolean;
};

const LS_KEYS = {
  designs: "yasa_admin_designs_v1",
  ads: "yasa_admin_ads_v1",
};

const CURRENCY = (n: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(n);

const DEFAULT_DESIGNS: DesignItem[] = [
  { id: "logo", title: "Logo Design", category: "Branding", priceLKR: 3500, badge: "Popular" },
  { id: "smpost", title: "Social Media Post", category: "Social Media", priceLKR: 1200, badge: "Best Value" },
  { id: "web", title: "Web Designs", category: "Web/UI", priceLKR: 15000, badge: "Popular" },
];

const DEFAULT_ADS: AdItem[] = [
  { id: "ad-1", text: "🔥 New Year Offer: 10% OFF on Logo Design!", link: "#designs", active: true },
  { id: "ad-2", text: "🎥 Get a 5s Logo Intro Animation — Starting from LKR 8,000", link: "#designs", active: true },
];

function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveJSON<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export default function Admin() {
  const [tab, setTab] = useState<"designs" | "ads">("designs");

  const [designs, setDesigns] = useState<DesignItem[]>([]);
  const [ads, setAds] = useState<AdItem[]>([]);

  // Forms
  const [dTitle, setDTitle] = useState("");
  const [dCategory, setDCategory] = useState("Branding");
  const [dPrice, setDPrice] = useState<number>(3500);
  const [dImg, setDImg] = useState("");
  const [dBadge, setDBadge] = useState<DesignItem["badge"]>("");

  const [adText, setAdText] = useState("");
  const [adLink, setAdLink] = useState("");
  const [adActive, setAdActive] = useState(true);

  // Load from localStorage (once)
  useEffect(() => {
    const storedDesigns = loadJSON<DesignItem[]>(LS_KEYS.designs, DEFAULT_DESIGNS);
    const storedAds = loadJSON<AdItem[]>(LS_KEYS.ads, DEFAULT_ADS);
    setDesigns(storedDesigns);
    setAds(storedAds);
  }, []);

  // Backend URL (Vite env optional) — falls back to localhost:4000
  const BACKEND = ((import.meta as any)?.env?.VITE_BACKEND_URL as string) || "http://localhost:4000";

  // Try to load persisted data from backend (if available)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BACKEND}/api/data`);
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.designs)) setDesigns(json.designs as DesignItem[]);
          if (Array.isArray(json.ads)) setAds(json.ads as AdItem[]);
        }
      } catch (err) {
        // ignore, fall back to localStorage
      }
    })();
  }, []);

  // Persist on changes
  useEffect(() => saveJSON(LS_KEYS.designs, designs), [designs]);
  useEffect(() => saveJSON(LS_KEYS.ads, ads), [ads]);

  const categories = useMemo(() => {
    const base = new Set<string>(["Branding", "Animation", "Print", "Social Media", "Packaging", "Stationery", "Web/UI", "Video", "Merch", "Advertising"]);
    designs.forEach((d) => base.add(d.category));
    return Array.from(base);
  }, [designs]);

  const addDesign = () => {
    const title = dTitle.trim();
    const category = dCategory.trim();
    if (!title || !category || !Number.isFinite(dPrice)) return;

    const newItem: DesignItem = {
      id: uid("design"),
      title,
      category,
      priceLKR: Math.max(0, Math.floor(dPrice)),
      img: dImg.trim() || undefined,
      badge: dBadge || "",
    };

    setDesigns((prev) => [newItem, ...prev]);
    setDTitle("");
    setDImg("");
    setDBadge("");
  };

  const deleteDesign = (id: string) => {
    setDesigns((prev) => prev.filter((d) => d.id !== id));
  };

  const addAd = () => {
    const text = adText.trim();
    if (!text) return;

    const newAd: AdItem = {
      id: uid("ad"),
      text,
      link: adLink.trim() || undefined,
      active: adActive,
    };

    setAds((prev) => [newAd, ...prev]);
    setAdText("");
    setAdLink("");
    setAdActive(true);
  };

  const toggleAd = (id: string) => {
    setAds((prev) => prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));
  };

  const deleteAd = (id: string) => {
    setAds((prev) => prev.filter((a) => a.id !== id));
  };

  const resetDemoData = () => {
    setDesigns(DEFAULT_DESIGNS);
    setAds(DEFAULT_ADS);
  };

  // Sync current data to backend (best-effort)
  const syncToServer = async () => {
    try {
      await fetch(`${BACKEND}/api/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ designs, ads }),
      });
      return true;
    } catch (err) {
      console.warn("Failed to sync to server", err);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0708] text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-sm md:text-base font-extrabold">
              Admin Panel <span className="text-[#f7b500]">• Yasa Graphics</span>
            </h1>
            <p className="text-xs text-white/60 mt-1">
              Manage design listings + scrolling ads (no users).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetDemoData}
              className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
              title="Reset demo data"
            >
              Reset Demo
            </button>
            <button
              onClick={async () => {
                // try sync to server first, then always save to localStorage as fallback
                try {
                  await syncToServer();
                } catch {}
                saveJSON(LS_KEYS.designs, designs);
                saveJSON(LS_KEYS.ads, ads);
              }}
              className="rounded-md bg-[#f7b500] px-3 py-2 text-xs font-extrabold text-black hover:brightness-95 transition inline-flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTab("designs")}
            className={`rounded-full px-4 py-2 text-xs font-extrabold transition inline-flex items-center gap-2
              ${tab === "designs" ? "bg-[#f7b500] text-black" : "bg-white/5 border border-white/10 text-white hover:bg-white/10"}`}
          >
            <LayoutGrid className="w-4 h-4" /> Design Listings
          </button>

          <button
            onClick={() => setTab("ads")}
            className={`rounded-full px-4 py-2 text-xs font-extrabold transition inline-flex items-center gap-2
              ${tab === "ads" ? "bg-[#f7b500] text-black" : "bg-white/5 border border-white/10 text-white hover:bg-white/10"}`}
          >
            <Megaphone className="w-4 h-4" /> Scrolling Ads
          </button>
        </div>

        {/* Content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* Left: Form */}
          <section className="lg:col-span-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
              {tab === "designs" ? (
                <>
                  <h2 className="text-sm font-extrabold text-[#f7b500]">Add Design Listing</h2>
                  <p className="text-xs text-white/60 mt-1">Create a new service item for Designs page.</p>

                  <div className="mt-4 space-y-3">
                    <label className="block">
                      <span className="text-xs text-white/70">Title</span>
                      <input
                        value={dTitle}
                        onChange={(e) => setDTitle(e.target.value)}
                        placeholder="e.g., Logo Design"
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-[#f7b500]/60"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs text-white/70">Category</span>
                      <div className="mt-1 flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2">
                        <Tag className="w-4 h-4 text-[#f7b500]" />
                        <select
                          value={dCategory}
                          onChange={(e) => setDCategory(e.target.value)}
                          className="w-full bg-transparent text-sm outline-none"
                        >
                          {categories.map((c) => (
                            <option key={c} value={c} className="bg-[#0b0708]">
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </label>

                    <label className="block">
                      <span className="text-xs text-white/70">Starting Price (LKR)</span>
                      <div className="mt-1 flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2">
                        <DollarSign className="w-4 h-4 text-[#f7b500]" />
                        <input
                          type="number"
                          value={dPrice}
                          onChange={(e) => setDPrice(Number(e.target.value))}
                          className="w-full bg-transparent text-sm outline-none"
                        />
                      </div>
                    </label>

                    <label className="block">
                      <span className="text-xs text-white/70">Image URL (optional)</span>
                      <div className="mt-1 flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2">
                        <ImageIcon className="w-4 h-4 text-[#f7b500]" />
                        <input
                          value={dImg}
                          onChange={(e) => setDImg(e.target.value)}
                          placeholder="https://... or /assets/..."
                          className="w-full bg-transparent text-sm outline-none"
                        />
                      </div>
                    </label>

                    <label className="block">
                      <span className="text-xs text-white/70">Badge (optional)</span>
                      <select
                        value={dBadge}
                        onChange={(e) => setDBadge(e.target.value as DesignItem["badge"])}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
                      >
                        <option value="" className="bg-[#0b0708]">None</option>
                        <option value="Popular" className="bg-[#0b0708]">Popular</option>
                        <option value="New" className="bg-[#0b0708]">New</option>
                        <option value="Best Value" className="bg-[#0b0708]">Best Value</option>
                      </select>

                    </label>

                    <button
                      onClick={addDesign}
                      className="w-full rounded-lg bg-[#f7b500] px-4 py-2 text-sm font-extrabold text-black hover:brightness-95 transition inline-flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Listing
                    </button>

                    <p className="text-[11px] text-white/50">
                      Tip: Later you can connect this to a database/API. For now it saves in your browser storage.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-sm font-extrabold text-[#f7b500]">Add Scrolling Advertisement</h2>
                  <p className="text-xs text-white/60 mt-1">These can be used in a home page marquee/slider.</p>

                  <div className="mt-4 space-y-3">
                    <label className="block">
                      <span className="text-xs text-white/70">Ad Text</span>
                      <input
                        value={adText}
                        onChange={(e) => setAdText(e.target.value)}
                        placeholder="e.g., 10% OFF on Logo Design!"
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-[#f7b500]/60"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs text-white/70">Link (optional)</span>
                      <input
                        value={adLink}
                        onChange={(e) => setAdLink(e.target.value)}
                        placeholder="e.g., #designs or https://..."
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
                      />
                    </label>

                    <label className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-3 py-2">
                      <span className="text-xs text-white/70">Active</span>
                      <button
                        onClick={() => setAdActive((v) => !v)}
                        className="inline-flex items-center gap-2 text-xs font-semibold"
                        type="button"
                      >
                        {adActive ? (
                          <>
                            <ToggleRight className="w-5 h-5 text-[#f7b500]" /> On
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-5 h-5 text-white/60" /> Off
                          </>
                        )}
                      </button>
                    </label>

                    <button
                      onClick={addAd}
                      className="w-full rounded-lg bg-[#f7b500] px-4 py-2 text-sm font-extrabold text-black hover:brightness-95 transition inline-flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Ad
                    </button>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Right: Listing table/cards */}
          <section className="lg:col-span-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
              {tab === "designs" ? (
                <>
                  <h2 className="text-sm font-extrabold text-[#f7b500]">Design Listings</h2>
                  <p className="text-xs text-white/60 mt-1">
                    Items shown on your Designs page. Total: {designs.length}
                  </p>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {designs.map((d) => (
                      <div
                        key={d.id}
                        className="rounded-2xl border border-[#f7b500]/20 bg-white/[0.06] backdrop-blur-xl overflow-hidden"
                      >
                        <div className="h-28 bg-black/40 relative">
                          {d.img ? (
                            <img src={d.img} alt={d.title} className="h-full w-full object-cover opacity-90" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-xs text-white/50">
                              No image
                            </div>
                          )}
                          {d.badge ? (
                            <span className="absolute left-3 top-3 rounded-full bg-[#f7b500] px-3 py-1 text-[11px] font-extrabold text-black">
                              {d.badge}
                            </span>
                          ) : null}
                        </div>

                        <div className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-sm font-extrabold">{d.title}</h3>
                              <p className="text-xs text-white/60 mt-1">{d.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-white/50">Starting</p>
                              <p className="text-sm font-extrabold text-[#f7b500]">
                                {CURRENCY(d.priceLKR)}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => deleteDesign(d.id)}
                            className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition inline-flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-4 h-4 text-red-300" /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {designs.length === 0 && (
                    <p className="mt-8 text-center text-sm text-white/60">No design listings yet.</p>
                  )}
                </>
              ) : (
                <>
                  <h2 className="text-sm font-extrabold text-[#f7b500]">Scrolling Advertisements</h2>
                  <p className="text-xs text-white/60 mt-1">
                    Use these in a home page scrolling banner. Total: {ads.length}
                  </p>

                  <div className="mt-4 space-y-3">
                    {ads.map((a) => (
                      <div
                        key={a.id}
                        className="rounded-2xl border border-[#f7b500]/20 bg-white/[0.06] backdrop-blur-xl p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold leading-6">
                              <span className={a.active ? "text-white" : "text-white/50"}>
                                {a.text}
                              </span>
                            </p>
                            {a.link ? (
                              <p className="text-xs text-white/50 mt-1 break-all">
                                Link: <span className="text-[#f7b500]">{a.link}</span>
                              </p>
                            ) : (
                              <p className="text-xs text-white/40 mt-1">No link</p>
                            )}
                          </div>

                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => toggleAd(a.id)}
                              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition inline-flex items-center gap-2"
                            >
                              {a.active ? (
                                <>
                                  <ToggleRight className="w-4 h-4 text-[#f7b500]" /> Active
                                </>
                              ) : (
                                <>
                                  <ToggleLeft className="w-4 h-4 text-white/50" /> Disabled
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => deleteAd(a.id)}
                              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition inline-flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4 text-red-300" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {ads.length === 0 && (
                    <p className="mt-8 text-center text-sm text-white/60">No ads created yet.</p>
                  )}
                </>
              )}
            </div>
          </section>
        </div>

        {/* Hint */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
          <h3 className="text-sm font-extrabold text-[#f7b500]">Connect to your public pages</h3>
          <p className="mt-2 text-xs text-white/65 leading-6">
            Your <span className="text-white font-semibold">Designs page</span> can read listings from localStorage
            using the key: <span className="text-[#f7b500]">{LS_KEYS.designs}</span>.
            <br />
            Your <span className="text-white font-semibold">Home scrolling ads</span> can read from:
            <span className="text-[#f7b500]"> {LS_KEYS.ads}</span> (use only active ads).
          </p>
        </div>
      </main>
    </div>
  );
}
