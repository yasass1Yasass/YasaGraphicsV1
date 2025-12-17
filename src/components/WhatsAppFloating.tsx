import React from "react";

const WhatsAppFloating: React.FC = () => {
  const phone = "94719933437"; // international format without +
  const href = `https://wa.me/${phone}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="
        fixed right-3 sm:right-4 bottom-6 z-50
        flex h-12 w-12 sm:h-14 sm:w-14
        items-center justify-center
        rounded-full bg-[#f7b500]
        shadow-xl
        transition-all duration-300
        hover:scale-110 hover:shadow-[0_0_25px_rgba(247,181,0,0.7)]
        active:scale-95
      "
    >
      {/* Clean WhatsApp Icon */}
      <svg
        viewBox="0 0 32 32"
        className="h-6 w-6 sm:h-7 sm:w-7"
        fill="black"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M19.11 17.23c-.28-.14-1.64-.8-1.9-.9-.25-.1-.44-.14-.62.14-.18.28-.72.9-.88 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.43-2.24-1.36-.83-.73-1.38-1.63-1.54-1.91-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.35-.02-.48-.07-.14-.62-1.5-.85-2.06-.22-.53-.45-.46-.62-.46h-.53c-.18 0-.48.07-.73.35-.25.28-.96.93-.96 2.28 0 1.35.98 2.66 1.12 2.84.14.18 1.95 3 4.75 4.21.66.28 1.17.45 1.57.57.66.21 1.26.18 1.73.11.53-.08 1.64-.66 1.87-1.31.23-.64.23-1.2.16-1.31-.07-.11-.25-.18-.53-.32z" />
        <path d="M16 3C8.82 3 3 8.6 3 15.5c0 2.73.95 5.24 2.55 7.27L3 29l6.5-2.06c1.85.99 3.97 1.56 6.5 1.56 7.18 0 13-5.6 13-12.5S23.18 3 16 3zm0 22.7c-2.2 0-4.24-.62-5.95-1.7l-.42-.25-3.85 1.22 1.28-3.62-.27-.44C5.33 19.26 4.6 17.4 4.6 15.5 4.6 9.56 9.7 4.8 16 4.8S27.4 9.56 27.4 15.5 22.3 25.7 16 25.7z" />
      </svg>
    </a>
  );
};

export default WhatsAppFloating;
