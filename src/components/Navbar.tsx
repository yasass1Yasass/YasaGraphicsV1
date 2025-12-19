import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NavBar: React.FC = () => {
  const links = [
    { label: "Home", to: "/" },
    { label: "Design", to: "/design" },
    { label: "Gallery", to: "/galary" },
  ];
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [offers, setOffers] = useState<string[]>([
    "✨ Welcome to Yasa Graphics — Expert Design Solutions!",
  ]);

  // Function to load navbar text from localStorage
  const loadNavbarText = () => {
    try {
      const navbarText = localStorage.getItem("yasa_navbar_marquee_text");
      if (navbarText) {
        setOffers([navbarText]);
        return;
      }

      const raw = localStorage.getItem("yasa_admin_ads_v1");
      if (!raw) return;

      const ads = JSON.parse(raw) as Array<{ text?: string; active?: boolean }>;
      const active = ads
        .filter((a) => a && a.active && a.text)
        .map((a) => a.text as string);

      if (active.length) setOffers(active);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    // Initial load
    loadNavbarText();

    // Set up polling to detect changes every 500ms
    const pollInterval = setInterval(() => {
      loadNavbarText();
    }, 500);

    return () => clearInterval(pollInterval);
  }, []);

  const tickerItems = useMemo(() => {
    const safe = offers.length ? offers : ["✨ Welcome to Yasa Graphics"];
    return [...safe, ...safe]; // duplicate for seamless loop
  }, [offers]);

  return (
    <header className="sticky top-0 z-50 bg-[#f7b500] border-b border-black/20 animate-[navSlide_0.6s_ease-out]">
      <div className="mx-auto max-w-6xl px-3 sm:px-4 py-2 sm:py-3">
        {/* Top Row */}
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-black/20 hover:bg-black/30 transition text-black"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 shrink-0 transition-transform duration-300 hover:scale-[1.02]"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img
              src="/Assets/Logo.png"
              alt="YASA Graphics"
              className="logo-auto h-7 sm:h-8 md:h-10"
              draggable={false}
            />
            <span className="hidden sm:inline text-xs sm:text-sm md:text-base font-extrabold text-black tracking-wide">
              YASA <span className="font-black">Graphics</span>
            </span>
          </Link>

          {/* Marquee (Mobile & Desktop) */}
          <div className="flex-1 flex justify-center">
            <div className="ticker ticker--mobile md:ticker--desktop">
              <div className="ticker__fade ticker__fade--left" />
              <div className="ticker__fade ticker__fade--right" />

              <div className="ticker__track">
                <div className="ticker__content">
                  {tickerItems.map((o, i) => (
                    <span key={i} className="ticker__item">
                      {o}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Nav (Desktop) */}
          <nav className="hidden md:flex items-center gap-2 sm:gap-3 shrink-0">
            {links.map((l) => {
              const active = location.pathname === l.to;
              return (
                <Link
                  key={l.label}
                  to={l.to}
                  className={`
                    rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-300
                    ${active
                      ? "bg-black text-[#f7b500]"
                      : "bg-black/80 text-white hover:bg-black hover:text-[#f7b500]"}
                  `}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-black/20 pt-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-2">
              {links.map((l) => {
                const active = location.pathname === l.to;
                return (
                  <Link
                    key={l.label}
                    to={l.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-300
                      ${active
                        ? "bg-black text-[#f7b500]"
                        : "bg-black/80 text-white hover:bg-black hover:text-[#f7b500]"}
                    `}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes navSlide {
            0% { opacity: 0; transform: translateY(-18px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          @keyframes logoRotate {
            0% { transform: rotateY(0deg); }
            20% { transform: rotateY(360deg); }
            100% { transform: rotateY(360deg); }
          }
          .logo-auto {
            transform-style: preserve-3d;
            backface-visibility: hidden;
            will-change: transform;
            animation: logoRotate 25s linear infinite;
          }

          /* DARK ticker container (no glass / no blur) */
          .ticker{
            position: relative;
            height: 42px;
            width: min(560px, 100%);
            border-radius: 12px;
            overflow: hidden;
            background: #0b0708; /* solid dark */
            border: 1px solid rgba(255,255,255,0.10);
          }

          /* side fades */
          .ticker__fade{
            position:absolute;
            top:0; bottom:0;
            width:50px;
            z-index: 3;
            pointer-events:none;
          }
          .ticker__fade--left{
            left:0;
            background: linear-gradient(to right, #0b0708, rgba(11,7,8,0));
          }
          .ticker__fade--right{
            right:0;
            background: linear-gradient(to left, #0b0708, rgba(11,7,8,0));
          }

          .ticker__track{
            position:absolute;
            inset:0;
            display:flex;
            align-items:center;
          }

          .ticker__content{
            display:inline-flex;
            align-items:center;
            gap: 26px;
            padding-left: 14px;
            padding-right: 14px;
            white-space: nowrap;
            will-change: transform;
            animation: tickerMove 22s linear infinite;
          }

          @keyframes logoRotate {
            0% { transform: rotateY(0deg); }
            20% { transform: rotateY(360deg); }
            100% { transform: rotateY(360deg); }
          }
          .logo-auto {
            transform-style: preserve-3d;
            backface-visibility: hidden;
            will-change: transform;
            animation: logoRotate 25s linear infinite;
          }

          /* DARK ticker container - Mobile & Desktop */
          .ticker{
            position: relative;
            height: 32px;
            width: 100%;
            border-radius: 8px;
            overflow: hidden;
            background: #0b0708;
            border: 1px solid rgba(255,255,255,0.10);
          }

          .ticker--mobile {
            height: 32px;
            width: 100%;
          }

          .ticker--desktop {
            height: 42px;
            width: min(560px, 100%);
            border-radius: 12px;
          }

          /* side fades */
          .ticker__fade{
            position:absolute;
            top:0; bottom:0;
            width:40px;
            z-index: 3;
            pointer-events:none;
          }
          .ticker__fade--left{
            left:0;
            background: linear-gradient(to right, #0b0708, rgba(11,7,8,0));
          }
          .ticker__fade--right{
            right:0;
            background: linear-gradient(to left, #0b0708, rgba(11,7,8,0));
          }

          .ticker__track{
            position:absolute;
            inset:0;
            display:flex;
            align-items:center;
          }

          .ticker__content{
            display:inline-flex;
            align-items:center;
            gap: 20px;
            padding-left: 10px;
            padding-right: 10px;
            white-space: nowrap;
            will-change: transform;
            animation: tickerMove 22s linear infinite;
          }

          .ticker:hover .ticker__content{
            animation-play-state: paused;
          }

          @keyframes tickerMove {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          /* clean item style */
          .ticker__item{
            font-size: 11px;
            font-weight: 700;
            color: rgba(255,255,255,0.92);
            letter-spacing: 0.2px;
          }

          @media (min-width: 768px) {
            .ticker__item {
              font-size: 13px;
            }
            
            .ticker__content {
              gap: 26px;
              padding-left: 14px;
              padding-right: 14px;
            }
          }
        `}
      </style>
    </header>
  );
};

export default NavBar;
