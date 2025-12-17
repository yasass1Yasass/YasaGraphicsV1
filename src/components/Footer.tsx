import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";

const Footer: React.FC = () => {
  const phoneNumberDisplay = "+94 71 993 3437";
  const phoneDial = "+94719933437";
  const email = "yasagraphics@gmail.com";

  const socials = [
    { label: "Instagram", href: "https://www.instagram.com/yasa_graphics/", Icon: Instagram },
    { label: "Facebook", href: "https://www.facebook.com/share/1GrwZ4y39i/", Icon: Facebook },
    {
      label: "TikTok",
      href: "https://www.tiktok.com/@yasassriattanayak",
      Icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" {...props}>
          <path
            d="M14 3v9.2a3.8 3.8 0 1 1-3-3.7"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 6.3c1.2 1.9 2.9 3 5 3.2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 3h2c.2 2.6 1.6 4.6 3.9 5.5V11c-2.4-.2-4.1-1.2-5.9-2.9V15a5.5 5.5 0 1 1-5.5-5.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          />
        </svg>
      ),
    },
  ];

  return (
    <footer id="contact" className="relative overflow-hidden border-t border-white/10 text-white">
      {/* Background Image Layer (50% opacity) */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-50"
        style={{ backgroundImage: "url(/Assets/footerback1.png)" }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Extra glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[720px] -translate-x-1/2 rounded-full bg-[#f7b500]/10 blur-3xl" />

      {/* Content */}
      <div className="relative z-10">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          {/* Glass Panel */}
          <div className="rounded-3xl border border-white/10 bg-black/45 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.55)] p-6 sm:p-8">
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {/* Brand */}
              <div>
                <h3 className="text-[13px] font-extrabold text-[#f7b500]">YASA Graphics</h3>
                <p className="mt-3 text-[12px] leading-6 text-white/75 max-w-sm">
                  Creative design solutions that help your business stand out and grow.
                  From branding to social media and web UI — we deliver clean, modern visuals.
                </p>

                {/* Social Icons */}
                <div className="mt-4 flex items-center gap-2">
                  {socials.map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      title={label}
                      className="
                        inline-flex items-center justify-center
                        h-9 w-9 rounded-xl
                        border border-white/10 bg-white/5
                        hover:bg-[#f7b500]/15 hover:border-[#f7b500]/30
                        transition
                      "
                    >
                      <Icon className="h-4 w-4 text-white/85" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-[13px] font-extrabold text-white">Quick Links</h4>
                <ul className="mt-3 space-y-2 text-[12px] text-white/75">
                  <li>
                    <Link className="hover:text-[#f7b500] transition" to="/">
                      Home
                    </Link>
                  </li>
                  <li>
                    <a className="hover:text-[#f7b500] transition" href="#services">
                      Services
                    </a>
                  </li>
                  <li>
                    <Link className="hover:text-[#f7b500] transition" to="/design">
                      Designs
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-[#f7b500] transition" to="/galary">
                      Gallery
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-[#f7b500] transition" to="/admin-login">
                      Admin
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-[13px] font-extrabold text-white">Contact Info</h4>

                <div className="mt-3 space-y-3 text-[12px] text-white/75">
                  {/* Click to call */}
                  <a
                    href={`tel:${phoneDial}`}
                    className="flex items-center gap-3 hover:text-[#f7b500] transition"
                  >
                    <Phone className="w-4 h-4 text-[#f7b500] shrink-0" />
                    <span>{phoneNumberDisplay}</span>
                  </a>

                  {/* Click to email */}
                  <button
                    onClick={() => {
                      window.location.href = "mailto:yasagraphics@gmail.com";
                    }}
                    className="flex items-center gap-3 hover:text-[#f7b500] transition cursor-pointer bg-none border-none p-0 text-inherit font-inherit"
                  >
                    <Mail className="w-4 h-4 text-[#f7b500] shrink-0" />
                    <span className="break-all text-left">{email}</span>
                  </button>

                  {/* Location */}
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-[#f7b500] shrink-0" />
                    <span>Colombo, Sri Lanka</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-6 border-t border-white/10 py-4 text-center text-[11px] text-white/60">
            © {new Date().getFullYear()} ▣ Yasa Graphics | Established 2018. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
