import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X } from "lucide-react";

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

interface GaleryViewerProps {
  item: GalleryItem | null;
  allItems: GalleryItem[];
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const GaleryViewer: React.FC<GaleryViewerProps> = ({
  item,
  allItems,
  onClose,
  onNext,
  onPrev,
}) => {
  const [zoom, setZoom] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Reset zoom when item changes
  useEffect(() => {
    setZoom(100);
    setPosition({ x: 0, y: 0 });
    setIsDragging(false);
  }, [item?.id]);

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNext, onPrev]);

  if (!item) return null;

  const isVideo = !!item.video_url;

  const mediaUrl = useMemo(() => {
    const raw = isVideo ? item.video_url : item.image_url;
    if (!raw) return "";
    return raw.startsWith("http") ? raw : raw;
  }, [item.image_url, item.video_url, isVideo]);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 20, 300));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 20, 100));
  const handleResetZoom = () => {
    setZoom(100);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isVideo) return;
    if (zoom > 100) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const currentIndex = Math.max(
    0,
    allItems.findIndex((i) => i.id === item.id)
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5"
      onClick={onClose}
      style={{ animation: "fadeIn .22s ease-out both" }}
    >
      <style>
        {`
          @keyframes fadeIn { from{opacity:0} to{opacity:1} }
          @keyframes popIn { from{opacity:0; transform:translateY(10px) scale(.98)} to{opacity:1; transform:translateY(0) scale(1)} }
        `}
      </style>

      {/* Viewer */}
      <div
        className="
          relative w-full max-w-6xl max-h-[92vh]
          overflow-hidden rounded-2xl sm:rounded-3xl
          border border-white/10
          bg-white/[0.06] backdrop-blur-2xl
          shadow-[0_30px_80px_rgba(0,0,0,0.65)]
        "
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "popIn .22s ease-out both" }}
      >
        {/* Top Bar */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-black/30">
          <div className="min-w-0 flex-1">
            <h2 className="text-sm sm:text-base font-extrabold text-white truncate">
              {item.description || item.title || "Preview"}
            </h2>
            <p className="text-[11px] sm:text-xs text-white/60 mt-1 truncate">
              {item.category}
            </p>
          </div>

          {/* Single Close Button ✅ */}
          <button
            onClick={onClose}
            className="
              inline-flex items-center justify-center
              w-9 h-9 sm:w-10 sm:h-10
              rounded-full bg-[#f7b500] text-black
              hover:brightness-95 transition
              active:scale-95
            "
            aria-label="Close"
            title="Close"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Media Area */}
        <div
          className="relative bg-black/40"
          style={{ height: "min(62vh, 560px)" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* subtle gradient */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(247,181,0,0.10),transparent_60%)]" />

          <div
            className="absolute inset-0 flex items-center justify-center p-3 sm:p-6"
            style={{
              cursor:
                !isVideo && zoom > 100
                  ? isDragging
                    ? "grabbing"
                    : "grab"
                  : "default",
            }}
          >
            {isVideo ? (
              <video
                src={mediaUrl}
                controls
                autoPlay
                className="
                  w-full h-full max-w-5xl
                  rounded-xl sm:rounded-2xl
                  border border-white/10
                  bg-black
                "
              />
            ) : (
              <img
                src={mediaUrl}
                alt={item.description || item.title}
                className="max-w-full max-h-full object-contain select-none"
                style={{
                  transform: `scale(${zoom / 100}) translate(${
                    position.x / (zoom / 100)
                  }px, ${position.y / (zoom / 100)}px)`,
                  transition: isDragging ? "none" : "transform 160ms ease",
                }}
                draggable={false}
              />
            )}
          </div>

          {/* Zoom badge (only images) */}
          {!isVideo && zoom > 100 && (
            <div className="absolute top-3 left-3 rounded-full bg-black/70 border border-white/10 px-3 py-1 text-xs font-semibold text-white">
              {zoom}%
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-white/10 bg-black/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Zoom Controls (images only) */}
            {!isVideo ? (
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <button
                  onClick={handleZoomOut}
                  disabled={zoom <= 100}
                  className="
                    w-10 h-10 rounded-xl
                    border border-white/10 bg-white/5
                    text-white hover:bg-white/10
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition
                  "
                  title="Zoom Out"
                >
                  <ZoomOut className="w-5 h-5 mx-auto" />
                </button>

                <div className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-semibold text-white/80">
                  {zoom}%
                </div>

                <button
                  onClick={handleZoomIn}
                  disabled={zoom >= 300}
                  className="
                    w-10 h-10 rounded-xl
                    border border-white/10 bg-white/5
                    text-white hover:bg-white/10
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition
                  "
                  title="Zoom In"
                >
                  <ZoomIn className="w-5 h-5 mx-auto" />
                </button>

                {zoom > 100 && (
                  <button
                    onClick={handleResetZoom}
                    className="
                      ml-1 px-3 py-2 rounded-xl
                      border border-white/10 bg-white/5
                      text-xs font-semibold text-white/80
                      hover:bg-white/10 transition
                    "
                    title="Reset Zoom"
                  >
                    Reset
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center sm:text-left text-xs text-white/60">
                Playing video preview
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-center sm:justify-end gap-2">
              <button
                onClick={onPrev}
                className="
                  w-11 h-11 rounded-xl
                  bg-[#f7b500] text-black
                  hover:brightness-95 transition
                  active:scale-95
                "
                title="Previous"
              >
                <ChevronLeft className="w-6 h-6 mx-auto" />
              </button>

              <div className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-semibold text-white/75">
                {currentIndex + 1} / {allItems.length}
              </div>

              <button
                onClick={onNext}
                className="
                  w-11 h-11 rounded-xl
                  bg-[#f7b500] text-black
                  hover:brightness-95 transition
                  active:scale-95
                "
                title="Next"
              >
                <ChevronRight className="w-6 h-6 mx-auto" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GaleryViewer;
