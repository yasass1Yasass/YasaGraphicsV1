// src/components/Navbar.tsx
import { NavLink, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

type Notice = { id: string; text: string; time: string; href?: string; unread?: boolean };

export default function Navbar() {
  const linkBase =
    "group relative inline-flex items-center px-3 py-2 rounded-xl font-medium transition";
  const linkActive = "text-white bg-emerald-600 shadow-sm";
  // Blue hover accents
  const linkInactive =
    "text-emerald-700 hover:text-indigo-700 hover:bg-indigo-50 hover:-translate-y-0.5";

  // Scroll elevation animation
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Demo auth state (replace with real auth)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  // Notifications mock
  const [openNoti, setOpenNoti] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([
    { id: "n1", text: "2 slots left — Cotswolds Gravel Spin", time: "1h", unread: true },
    { id: "n2", text: "New dates: Caledonian Forest Walk", time: "1d" },
    { id: "n3", text: "Packing checklist updated for hiking", time: "3d" },
  ]);
  const unreadCount = notices.filter((n) => n.unread).length;
  const notiRef = useRef<HTMLDivElement | null>(null);

  // Profile menu
  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  // Mobile menu
  const [openMobile, setOpenMobile] = useState(false);
  const mobileRef = useRef<HTMLDivElement | null>(null);

  // Close dropdowns on outside click / ESC
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (notiRef.current && !notiRef.current.contains(e.target as Node)) setOpenNoti(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setOpenProfile(false);
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) setOpenMobile(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenNoti(false);
        setOpenProfile(false);
        setOpenMobile(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const markAllRead = () => setNotices((prev) => prev.map((n) => ({ ...n, unread: false })));

  const initials = (name: string) =>
    name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <header
      className={[
        "sticky top-0 z-50 backdrop-blur transition-all duration-300 ring-1 ring-black/5",
        scrolled ? "bg-white/95 shadow-md" : "bg-white/80 shadow-sm",
      ].join(" ")}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" className="text-xl font-extrabold text-emerald-700 transition hover:opacity-90">
          EcoVenture
        </Link>

        {/* Desktop nav */}
        <nav className="hidden gap-2 sm:flex">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
          >
            Home
            <span className="pointer-events-none absolute inset-x-2 -bottom-1 h-0.5 scale-x-0 bg-indigo-600 transition-transform duration-300 group-hover:scale-x-100" />
          </NavLink>
          <NavLink
            to="/tours"
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
          >
            Tours
            <span className="pointer-events-none absolute inset-x-2 -bottom-1 h-0.5 scale-x-0 bg-indigo-600 transition-transform duration-300 group-hover:scale-x-100" />
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
          >
            About
            <span className="pointer-events-none absolute inset-x-2 -bottom-1 h-0.5 scale-x-0 bg-indigo-600 transition-transform duration-300 group-hover:scale-x-100" />
          </NavLink>
          <NavLink
            to="/rentals"
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
          >
            Rent
            <span className="pointer-events-none absolute inset-x-2 -bottom-1 h-0.5 scale-x-0 bg-indigo-600 transition-transform duration-300 group-hover:scale-x-100" />
          </NavLink>
        </nav>

        {/* Right actions (desktop) */}
        <div className="hidden items-center gap-2 sm:flex">
          {/* Notifications */}
          {user && (
            <div className="relative" ref={notiRef}>
              <button
                onClick={() => setOpenNoti((o) => !o)}
                aria-label="Notifications"
                className="relative inline-flex items-center justify-center rounded-xl bg-indigo-50 p-2 text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {/* bell */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M14 18a2 2 0 1 1-4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path
                    d="M6 9a6 6 0 1 1 12 0c0 3 1.5 4.5 2 5H4c.5-.5 2-2 2-5Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-xs font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {openNoti && (
                <div className="absolute right-0 mt-2 w-80 origin-top-right overflow-hidden rounded-2xl bg-white text-emerald-900 shadow-xl ring-1 ring-black/10">
                  <div className="flex items-center justify-between px-4 py-3">
                    <p className="text-sm font-semibold">Notifications</p>
                    <button onClick={markAllRead} className="text-xs font-semibold text-indigo-700 hover:underline">
                      Mark all read
                    </button>
                  </div>
                  <ul className="divide-y divide-indigo-100/80">
                    {notices.map((n) => (
                      <li key={n.id} className="px-4 py-3 hover:bg-indigo-50/60">
                        <Link to={n.href ?? "#"} className="block">
                          <p className="text-sm">
                            {n.text}{" "}
                            {n.unread && (
                              <span className="ml-2 inline-block rounded-full bg-indigo-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                NEW
                              </span>
                            )}
                          </p>
                          <p className="mt-1 text-xs text-indigo-700/70">{n.time} ago</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="px-4 py-2 text-right">
                    <Link to="/tours" className="text-xs font-semibold text-indigo-700 hover:underline">
                      View updates →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Auth buttons or Profile */}
          {!user ? (
            <>
              <Link
                to="/login"
                className="inline-flex items-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-indigo-700 shadow-sm ring-1 ring-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-50"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700"
              >
                Sign up
              </Link>
              <button
                onClick={() => setUser({ name: "Alex Morgan", email: "alex@example.com" })}
                className="hidden md:inline-flex items-center rounded-xl px-3 py-2 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200 transition hover:bg-indigo-50"
                title="Demo: toggle signed-in state"
              >
                Demo Sign-in
              </button>
            </>
          ) : (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setOpenProfile((o) => !o)}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-2 py-1.5 text-sm font-semibold text-emerald-800 shadow-sm ring-1 ring-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-haspopup="menu"
                aria-expanded={openProfile}
              >
                <span className="inline-flex size-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                  {initials(user.name)}
                </span>
                <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
                <svg className={`h-4 w-4 transition ${openProfile ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.118l3.71-3.886a.75.75 0 111.08 1.04l-4.24 4.444a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {openProfile && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right overflow-hidden rounded-2xl bg-white text-emerald-900 shadow-xl ring-1 ring-black/10">
                  <div className="px-4 py-3">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-emerald-700/70">{user.email}</p>
                  </div>
                  <ul className="py-1">
                    <li>
                      <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-indigo-50">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/bookings" className="block px-4 py-2 text-sm hover:bg-indigo-50">
                        My bookings
                      </Link>
                    </li>
                    <li>
                      <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-indigo-50">
                        Settings
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setUser(null);
                          setOpenProfile(false);
                        }}
                        className="block w-full px-4 py-2 text-left text-sm text-rose-700 hover:bg-rose-50"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hamburger (mobile) */}
        <button
          onClick={() => setOpenMobile((o) => !o)}
          className="inline-flex items-center justify-center rounded-xl p-2 text-emerald-700 ring-1 ring-indigo-200 transition hover:bg-indigo-50 sm:hidden"
          aria-label="Open menu"
          aria-expanded={openMobile}
        >
          <svg className={`h-5 w-5 transition ${openMobile ? "opacity-0 scale-95 absolute" : ""}`} viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <svg className={`h-5 w-5 transition ${openMobile ? "" : "opacity-0 scale-95 absolute"}`} viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Mobile panel */}
      <div
        ref={mobileRef}
        className={`sm:hidden ${openMobile ? "block" : "hidden"}`}
      >
        <div className="mx-4 mb-3 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/10">
          <nav className="flex flex-col gap-1 p-2">
            <NavLink
              to="/"
              end
              onClick={() => setOpenMobile(false)}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : "text-emerald-700 hover:text-indigo-700 hover:bg-indigo-50"}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/tours"
              onClick={() => setOpenMobile(false)}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : "text-emerald-700 hover:text-indigo-700 hover:bg-indigo-50"}`
              }
            >
              Tours
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setOpenMobile(false)}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : "text-emerald-700 hover:text-indigo-700 hover:bg-indigo-50"}`
              }
            >
              About
            </NavLink>
          </nav>

          <div className="border-t border-indigo-100 p-2">
            {!user ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setOpenMobile(false)}
                  className="inline-flex items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-indigo-700 shadow-sm ring-1 ring-indigo-200 transition hover:bg-indigo-50"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpenMobile(false)}
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  Sign up
                </Link>

                <button
                  onClick={() => {
                    setUser({ name: "Alex Morgan", email: "alex@example.com" });
                    setOpenMobile(false);
                  }}
                  className="col-span-2 inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200 transition hover:bg-indigo-50"
                  title="Demo: toggle signed-in state"
                >
                  Demo Sign-in
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 p-2">
                  <span className="inline-flex size-8 items-center justify-center rounded-full bg-emerald-600 text-white">
                    {initials(user.name)}
                  </span>
                  <div className="text-sm">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-emerald-700/70">{user.email}</p>
                  </div>
                </div>
                <div className="grid gap-1 p-2">
                  <Link to="/profile" onClick={() => setOpenMobile(false)} className="rounded-xl px-3 py-2 text-sm hover:bg-indigo-50">
                    Profile
                  </Link>
                  <Link to="/bookings" onClick={() => setOpenMobile(false)} className="rounded-xl px-3 py-2 text-sm hover:bg-indigo-50">
                    My bookings
                  </Link>
                  <Link to="/settings" onClick={() => setOpenMobile(false)} className="rounded-xl px-3 py-2 text-sm hover:bg-indigo-50">
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setUser(null);
                      setOpenMobile(false);
                    }}
                    className="rounded-xl px-3 py-2 text-left text-sm text-rose-700 hover:bg-rose-50"
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Old quick nav removed in favor of hamburger panel */}
    </header>
  );
}
