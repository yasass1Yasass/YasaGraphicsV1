import React, { useEffect, useRef, useState } from "react";
import GaleryViewer from "../components/GaleryViewer";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

type GalleryItem = {
  id: string;
  category: string;
  title: string;
  description: string;
  image_url: string;
  video_url: string;
  url: string;
  createdAt: number;
};

const Gallery: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Load gallery from Convex
  const galleryData = useQuery(api.gallery.list) || [];
  const loading = galleryData === undefined;

  // Convert Convex data to GalleryItem format
  const galleryItems: GalleryItem[] = galleryData.map((item) => ({
    id: item.id.toString(),
    category: item.category,
    title: item.title,
    description: item.description,
    image_url: item.image_url,
    video_url: item.video_url,
    url: item.url,
    createdAt: item.createdAt,
  }));

  useEffect(() => {
    // Auto-play video when modal opens
    if (selectedItem?.video_url && videoRef.current) {
      setTimeout(() => {
        videoRef.current?.play();
      }, 100);
    }
  }, [selectedItem]);

  const handleImageClick = (item: GalleryItem) => {
    if (!item.video_url) {
      setSelectedItem(item);
    } else {
      // For videos, show the old modal behavior
      setSelectedItem(item);
    }
  };

  const handleNextImage = () => {
    if (!selectedItem) return;
    const currentIndex = galleryItems.findIndex((i) => i.id === selectedItem.id);
    const nextIndex = (currentIndex + 1) % galleryItems.length;
    setSelectedItem(galleryItems[nextIndex]);
  };

  const handlePrevImage = () => {
    if (!selectedItem) return;
    const currentIndex = galleryItems.findIndex((i) => i.id === selectedItem.id);
    const prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    setSelectedItem(galleryItems[prevIndex]);
  };

  // Group items by category
  const groupedByCategory = galleryItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, GalleryItem[]>);

  // Get sorted categories
  const categories = Object.keys(groupedByCategory).sort();

  return (
    <div className="min-h-screen bg-[#0b0708] text-white">
      {/* Animations */}
      <style>
        {`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(14px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes modalIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>

      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(247,181,0,0.15),transparent_60%)]" />
        <div className="mx-auto max-w-6xl px-4 pt-8 sm:pt-14 pb-6 sm:pb-10 relative">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold"
            style={{ animation: "fadeUp .6s ease-out both" }}
          >
            Our <span className="text-[#f7b500]">Gallery</span>
          </h1>
          <p
            className="mt-2 sm:mt-3 max-w-2xl text-xs sm:text-sm text-white/70"
            style={{ animation: "fadeUp .7s ease-out both" }}
          >
            A showcase of our creative work across branding, print, digital,
            motion graphics, and web design.
          </p>
          <p className="mt-1 sm:mt-2 text-xs text-white/50">
            Total items: <span className="text-[#f7b500] font-bold">{galleryItems.length}</span>
          </p>
        </div>
      </section>

      {/* Gallery Sections */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:pb-20">
        {loading ? (
          <div className="py-12 sm:py-16 text-center">
            <p className="text-xs sm:text-base text-white/60">Loading gallery...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-12 sm:py-16 text-center">
            <p className="text-xs sm:text-base text-white/60">No gallery items uploaded yet.</p>
            <p className="text-xs text-white/40 mt-2">
              Admin can upload items from the Admin Dashboard Gallery section.
            </p>
          </div>
        ) : (
          categories.map((category, sIndex) => (
            <div
              key={category}
              className="mb-12 sm:mb-16"
              style={{
                animation: "fadeUp .6s ease-out both",
                animationDelay: `${Math.min(0.5, sIndex * 0.05)}s`,
              }}
            >
              {/* Section Title */}
              <h2 className="mb-4 sm:mb-6 text-lg sm:text-2xl font-extrabold text-[#f7b500]">
                {category}
                <span className="text-xs text-white/50 font-normal ml-2">
                  ({groupedByCategory[category].length} items)
                </span>
              </h2>

              {/* Grid */}
              <div className="grid gap-3 sm:gap-5 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {groupedByCategory[category].map((item, idx) => (
                  <div
                    key={item.id}
                    className="
                      group relative overflow-hidden rounded-lg sm:rounded-2xl
                      border border-[#f7b500]/20
                      bg-white/[0.06] backdrop-blur-xl
                      shadow-[0_0_0_1px_rgba(255,255,255,0.03)]
                      hover:border-[#f7b500]/50 hover:bg-white/[0.09]
                      transition hover:-translate-y-1 cursor-pointer
                    "
                    onClick={() => handleImageClick(item)}
                    style={{
                      animation: "fadeUp .55s ease-out both",
                      animationDelay: `${Math.min(0.35, idx * 0.04)}s`,
                    }}
                  >
                    {/* Image/Video */}
                    <div className="relative h-32 sm:h-40 bg-black/30 group/media overflow-hidden">
                      {item.video_url && item.video_url.trim() !== "" ? (
                        <video
                          key={item.id}
                          src={
                            item.video_url.startsWith("http")
                              ? item.video_url
                              : item.video_url
                          }
                          className="h-full w-full object-cover opacity-95 group-hover:opacity-100 transition"
                          onMouseEnter={(e) => {
                            const vid = e.currentTarget;
                            vid.play().catch(() => {});
                          }}
                          onMouseLeave={(e) => {
                            const vid = e.currentTarget;
                            vid.pause();
                            vid.currentTime = 0;
                          }}
                          muted
                          loop
                          playsInline
                        />
                      ) : item.image_url && item.image_url.trim() !== "" ? (
                        <img
                          key={item.id}
                          src={
                            item.image_url.startsWith("http")
                              ? item.image_url
                              : item.image_url
                          }
                          alt={item.description}
                          className="h-full w-full object-cover opacity-95 group-hover:opacity-100 transition"
                          onError={(e) => {
                            console.error("Image failed to load:", e.currentTarget.src);
                          }}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-black/60">
                          <div className="text-center">
                            <p className="text-sm font-extrabold text-[#f7b500]">YASA Graphics</p>
                            <p className="mt-1 text-xs text-white/60 line-clamp-2 px-2">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Badge */}
                      {item.video_url && item.video_url.trim() !== "" && (
                        <div className="absolute top-2 right-2 bg-blue-500/80 px-2 py-1 rounded text-xs font-semibold">
                          📹 Video
                        </div>
                      )}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex items-end opacity-0 group-hover:opacity-100 transition">
                      <div className="w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                        <p className="text-xs font-semibold text-white line-clamp-2">
                          {item.description}
                        </p>
                        {item.url && item.url.trim() !== "" && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#f7b500] hover:underline mt-1 inline-block"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View Project →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      {/* Image Previewer - GaleryViewer */}
      {selectedItem && !selectedItem.video_url && selectedItem.image_url && selectedItem.image_url.trim() !== "" && (
        <GaleryViewer
          item={selectedItem}
          allItems={galleryItems}
          onClose={() => setSelectedItem(null)}
          onNext={handleNextImage}
          onPrev={handlePrevImage}
        />
      )}

      {/* Video Modal */}
      {selectedItem && selectedItem.video_url && selectedItem.video_url.trim() !== "" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4"
          onClick={() => setSelectedItem(null)}
          style={{ animation: "modalIn .3s ease-out both" }}
        >
          <div
            className="bg-gradient-to-br from-[#1a1a1a] to-[#0b0708] border border-[#f7b500]/40 rounded-2xl sm:rounded-3xl max-w-3xl max-h-[95vh] overflow-y-auto w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-[#f7b500] hover:bg-[#f7b500]/90 text-black transition hover:scale-110"
            >
              ✕
            </button>

            {/* Video Container with gradient border effect */}
            <div className="relative overflow-hidden bg-black/50 p-1 sm:p-2 m-4 sm:m-6 rounded-xl sm:rounded-2xl border border-[#f7b500]/20">
              <video
                ref={videoRef}
                src={selectedItem.video_url.startsWith('http') ? selectedItem.video_url : selectedItem.video_url}
                controls
                controlsList="nodownload"
                className="w-full rounded-lg"
                poster={selectedItem.image_url ? (selectedItem.image_url.startsWith('http') ? selectedItem.image_url : selectedItem.image_url) : undefined}
                autoPlay
              />
            </div>

            {/* Content Section */}
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              {/* Category Badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-[#f7b500]/20 border border-[#f7b500]/40 text-xs font-semibold text-[#f7b500]">
                  {selectedItem.category}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
                {selectedItem.description}
              </h2>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-[#f7b500]/0 via-[#f7b500]/30 to-[#f7b500]/0 mb-4" />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {selectedItem.url && (
                  <a
                    href={selectedItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center rounded-lg bg-gradient-to-r from-[#f7b500] to-[#f7b500]/80 text-black px-4 py-3 text-sm sm:text-base font-extrabold hover:from-[#f7b500]/90 hover:to-[#f7b500]/70 transition transform hover:scale-105 active:scale-95"
                  >
                    View Full Project →
                  </a>
                )}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 rounded-lg border-2 border-[#f7b500]/40 hover:border-[#f7b500] text-white px-4 py-3 text-sm sm:text-base font-semibold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
