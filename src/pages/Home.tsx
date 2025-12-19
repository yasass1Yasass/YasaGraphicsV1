import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Brush,
  Share2,
  Image as ImageIcon,
  Shirt,
  Pencil,
  Video,
  ArrowRight,
} from "lucide-react";

type Service = {
  title: string;
  desc: string;
  Icon: React.ElementType;
};

const services: Service[] = [
  { title: "Logo Design & Branding", desc: "Unique logos and brand identities that represent your business.", Icon: Brush },
  { title: "Social Media Designs", desc: "Posts, stories, and ads that boost your online presence.", Icon: Share2 },
  { title: "Posters & Banners", desc: "Promotional designs for events, sales, and brand awareness.", Icon: ImageIcon },
  { title: "T-Shirt & Merchandise", desc: "Custom apparel and product designs for your brand.", Icon: Shirt },
  { title: "Illustrations & Artwork", desc: "Creative visuals tailored to your concept and style.", Icon: Pencil },
  { title: "Video Editing & Animations", desc: "Reels, short promos, and animated logo intros.", Icon: Video },
];

const DEFAULT_PORTFOLIO = [
  { id: 1, img: "/Assets/portfolio1.png", title: "Logo Design" },
  { id: 2, img: "/Assets/portfolio2.png", title: "Social Media Post" },
  { id: 3, img: "/Assets/portfolio3.png", title: "Web Design" },
  { id: 4, img: "/Assets/portfolio4.png", title: "Branding" },
  { id: 5, img: "/Assets/portfolio5.png", title: "Animation" },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(DEFAULT_PORTFOLIO);
  const [heroTitle, setHeroTitle] = useState("Welcome to Yasa Graphics");
  const [heroSubtitle, setHeroSubtitle] = useState("Designs that grow your brand.");
  const [heroDescription, setHeroDescription] = useState(
    "We specialize in creating stunning visual identities that make your business stand out. From logo design and branding to social media graphics, posters, banners, video edits, and logo animations — we bring your creative vision to life."
  );
  const [portfolioHeading, setPortfolioHeading] = useState("Our Portfolio");
  const [feedNews, setFeedNews] = useState<string[]>([
    "🔥 Logo Design • Branding • Social Media Posts",
    "🎬 Video Editing • Logo Animations • Reels",
    "🖼 Posters • Banners • Flyers • Print Designs",
    "👕 T-Shirt & Merchandise Designs",
    "🌟 Modern UI/UX & Website Design",
  ]);

  // Fetch site settings from Convex
  const siteSettings = useQuery(api.siteSettings.get);

  useEffect(() => {
    if (siteSettings) {
      if (siteSettings.heroTitle) setHeroTitle(siteSettings.heroTitle);
      if (siteSettings.heroSubtitle) setHeroSubtitle(siteSettings.heroSubtitle);
      if (siteSettings.heroDescription) setHeroDescription(siteSettings.heroDescription);
      if (siteSettings.portfolioHeading) setPortfolioHeading(siteSettings.portfolioHeading);
      if (siteSettings.portfolioImages && siteSettings.portfolioImages.length > 0) {
        setPortfolio(siteSettings.portfolioImages);
      }
      if (siteSettings.feedNews) {
        const items = siteSettings.feedNews.split("|").map((item: string) => item.trim()).filter((item: string) => item.length > 0);
        if (items.length > 0) setFeedNews(items);
      }
    } else {
      // Fallback to localStorage if Convex data not available
      try {
        const stored = localStorage.getItem("yasa_portfolio_images");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) setPortfolio(parsed);
        }

        const storedHeroTitle = localStorage.getItem("yasa_hero_title");
        const storedHeroSubtitle = localStorage.getItem("yasa_hero_subtitle");
        const storedHeroDescription = localStorage.getItem("yasa_hero_description");
        const storedPortfolioHeading = localStorage.getItem("yasa_portfolio_heading");

        if (storedHeroTitle) setHeroTitle(storedHeroTitle);
        if (storedHeroSubtitle) setHeroSubtitle(storedHeroSubtitle);
        if (storedHeroDescription) setHeroDescription(storedHeroDescription);
        if (storedPortfolioHeading) setPortfolioHeading(storedPortfolioHeading);

        const storedFeedNews = localStorage.getItem("yasa_feed_news_marquee");
        if (storedFeedNews) {
          const items = storedFeedNews.split("|").map((item: string) => item.trim()).filter((item: string) => item.length > 0);
          if (items.length > 0) setFeedNews(items);
        }
      } catch {
        // ignore
      }
    }
  }, [siteSettings]);

  return (
    <div className="min-h-screen text-white bg-[#0b0708] font-sans text-base leading-relaxed">
      {/* Keyframe Animations */}
      <style>
        {`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes pop {
            from { opacity: 0; transform: scale(0.96); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes marqueeWide {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          @keyframes scrollLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>

      <div className="relative overflow-hidden">
        {/* BG GLOW */}
        <div className="pointer-events-none absolute inset-0" style={{ animation: "fadeIn 0.8s ease-out both" }}>
          <div className="absolute -top-24 left-1/2 h-72 w-[720px] -translate-x-1/2 rounded-full bg-[#f7b500]/10 blur-3xl" />
          <div className="absolute top-[480px] left-10 h-60 w-60 rounded-full bg-[#f7b500]/7 blur-3xl" />
          <div className="absolute top-[720px] right-10 h-72 w-72 rounded-full bg-[#f7b500]/7 blur-3xl" />
        </div>

        {/* HERO */}
        <section id="home" className="mx-auto max-w-6xl px-4 pt-16 pb-8 md:pt-24">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            {/* Left */}
            <div style={{ animation: "fadeUp 0.8s ease-out both" }}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight mb-4">
                {heroTitle.split("Yasa Graphics").length > 1 ? (
                  <>
                    {heroTitle.split("Yasa Graphics")[0].trim().replace(/^["']|["']$/g, "")}
                    <span className="text-[#f7b500] drop-shadow-lg">Yasa Graphics</span>
                  </>
                ) : (
                  heroTitle.trim().replace(/^["']|["']$/g, "")
                )}
              </h1>

              <p
                className="mt-2 text-xl sm:text-2xl text-white/90 font-bold tracking-wide"
                style={{ animation: "fadeUp 0.9s ease-out both", animationDelay: "0.08s" }}
              >
                {heroSubtitle.trim().replace(/^["']|["']$/g, "")}
              </p>

              <p
                className="mt-5 text-base sm:text-lg leading-6 sm:leading-7 text-white/80 max-w-2xl"
                style={{ animation: "fadeUp 0.95s ease-out both", animationDelay: "0.14s" }}
              >
                {heroDescription.trim().replace(/^["']|["']$/g, "")}
              </p>

              <div
                className="mt-8 flex flex-col sm:flex-row gap-4"
                style={{ animation: "pop 0.7s ease-out both", animationDelay: "0.2s" }}
              >
                <button
                  onClick={() => navigate("/design")}
                  className="
                    inline-flex items-center justify-center sm:justify-start gap-2 rounded-lg bg-[#f7b500]
                    px-6 sm:px-7 py-3 text-base sm:text-lg font-extrabold text-black shadow-lg
                    hover:brightness-95 transition
                    hover:scale-[1.03] active:scale-[0.99]
                    cursor-pointer
                  "
                >
                  Get Started <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right (scrolling line-art cards) - Hidden on mobile */}
            <div
              className="hidden md:flex md:justify-end"
              style={{ animation: "fadeUp 0.9s ease-out both", animationDelay: "0.12s" }}
            >
              <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 overflow-hidden h-64 md:h-72">
                <div className="relative h-full">
                  <div
                    className="flex items-center gap-4 md:gap-6 h-full"
                    style={{ width: "200%", display: "flex", animation: "marqueeWide 26s linear infinite" }}
                  >
                    {[
                      "/Assets/Line art vector1.png",
                      "/Assets/Line art vector2.png",
                      "/Assets/Line art vector3.png",
                      "/Assets/Line art vector4.png",
                      "/Assets/Line art vector1.png",
                      "/Assets/Line art vector2.png",
                      "/Assets/Line art vector3.png",
                      "/Assets/Line art vector4.png",
                    ].map((src, i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 w-64 md:w-80 h-52 md:h-64 rounded-lg overflow-hidden bg-black/10 flex items-center justify-center"
                      >
                        <img
                          src={src}
                          alt={`Line art ${i + 1}`}
                          className="max-h-56 md:max-h-64 object-contain p-4 bg-transparent"
                          draggable={false}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ NEW: Wide Marquee Under Hero */}
          <div className="mt-6 sm:mt-8">
            <div className="rounded-2xl border border-white/10 bg-black/60 overflow-hidden">
              <div className="relative">
                {/* fades */}
                <div className="pointer-events-none absolute left-0 top-0 h-full w-12 sm:w-16 bg-gradient-to-r from-[#0b0708] to-transparent z-10" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-12 sm:w-16 bg-gradient-to-l from-[#0b0708] to-transparent z-10" />

                <div
                  className="flex items-center gap-4 sm:gap-8 whitespace-nowrap py-8 sm:py-3 px-3 sm:px-4"
                  style={{ width: "200%", animation: "marqueeWide 22s linear infinite" }}
                >
                  {[...feedNews, ...feedNews].map((t, i) => (
                    <span key={i} className="text-sm sm:text-sm md:text-base font-semibold text-white/85">
                      <span className="text-[#f7b500] font-extrabold">YASA</span> {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PORTFOLIO */}
        <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div style={{ animation: "fadeUp 0.85s ease-out both" }}>
            <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#f7b500] mb-8 sm:mb-10 md:mb-12 tracking-tight">
              {portfolioHeading.trim().replace(/^["']|["']$/g, "")}
            </h2>

          </div>

          {portfolio && portfolio.length > 0 ? (
            <div className="w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden p-3 sm:p-4 md:p-6">
              <div className="relative">
                <div
                  className="flex gap-3 sm:gap-4 md:gap-6"
                  style={{
                    width: "200%",
                    animation: "scrollLeft 40s linear infinite",
                  }}
                >
                  {portfolio.concat(portfolio).map((item, i) => (
                    <div
                      key={i}
                      className="
                        flex-shrink-0
                        w-72 h-56 sm:w-96 sm:h-56 md:w-120 md:h-80
                        rounded-xl sm:rounded-2xl overflow-hidden
                        bg-black/40 border border-white/10
                        hover:border-[#f7b500]/60 transition
                        shadow-xl group
                      "
                    >
                      <div className="relative h-full w-full">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                          draggable={false}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3 sm:p-5">
                          <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-[#f7b500]">{item.title}</h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full rounded-3xl border border-dashed border-white/20 bg-white/5 backdrop-blur-xl p-8 sm:p-12 text-center">
              <p className="text-sm sm:text-base text-white/60">
                No portfolio images available yet. Add images in the admin dashboard.
              </p>
            </div>
          )}
        </section>

        {/* WHAT WE DO */}
        <section id="about" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div style={{ animation: "fadeUp 0.85s ease-out both" }}>
            <h2 className="text-center text-3xl md:text-4xl font-extrabold text-[#f7b500] mb-4 tracking-tight">
              What We Do
            </h2>
            <p className="mx-auto mt-2 max-w-3xl text-center text-lg leading-7 text-white/80 font-medium">
              At Yasa Graphics, we help businesses grow through creative design solutions that capture attention and
              drive results. Our team combines artistic vision with strategic thinking to deliver designs that not only
              look amazing but also communicate your brand’s unique story effectively.
            </p>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="mx-auto max-w-6xl px-4 pb-16 md:pb-24">
          <h3
            className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#f7b500] mb-8 tracking-tight"
            style={{ animation: "fadeUp 0.8s ease-out both" }}
          >
            Our Services
          </h3>

          <div className="mt-10 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(({ title, desc, Icon }, idx) => (
              <div
                key={title}
                className="
                  rounded-2xl border border-[#f7b500]/25 bg-white/[0.10]
                  backdrop-blur-xl p-5 sm:p-7 shadow-lg
                  hover:border-[#f7b500]/55 hover:bg-white/[0.14]
                  transition hover:-translate-y-1
                "
                style={{
                  animation: "fadeUp 0.75s ease-out both",
                  animationDelay: `${0.12 + idx * 0.08}s`,
                }}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="rounded-lg bg-[#f7b500]/20 p-2.5 sm:p-3 flex-shrink-0">
                    <Icon className="w-6 sm:w-7 h-6 sm:h-7 text-[#f7b500]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base sm:text-lg font-extrabold mb-1 sm:mb-2 text-white">{title}</h4>
                    <p className="text-sm sm:text-base leading-6 text-white/80">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
