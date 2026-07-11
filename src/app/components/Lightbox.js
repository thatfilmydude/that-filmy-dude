"use client";

import { useState } from "react";

function getFullQualityUrl(url) {
  if (!url.includes("res.cloudinary.com")) {
    return url;
  }
  return url.replace("/upload/", "/upload/q_100/");
}

export default function Lightbox({ images }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [downloading, setDownloading] = useState(false);

  function openImage(i) {
    setActiveIndex(i);
  }

  function closeImage() {
    setActiveIndex(null);
  }

  function stopClick(e) {
    e.stopPropagation();
  }

  function nextImage(e) {
    e.stopPropagation();
    setActiveIndex(function (i) {
      return (i + 1) % images.length;
    });
  }

  function prevImage(e) {
    e.stopPropagation();
    setActiveIndex(function (i) {
      return (i - 1 + images.length) % images.length;
    });
  }

  async function forceDownload(url, filename) {
    setDownloading(true);
    try {
      const fullQualityUrl = getFullQualityUrl(url);
      const res = await fetch(fullQualityUrl);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      window.open(url, "_blank");
    }
    setDownloading(false);
  }

  function handleDownloadClick(e) {
    e.stopPropagation();
    const img = images[activeIndex];
    const filename = img.caption.replace(/[^a-z0-9]+/gi, "-").toLowerCase() + "-" + (activeIndex + 1) + ".jpg";
    forceDownload(img.src, filename);
  }

  const bulbs = Array.from({ length: 14 });

  return (
    <>
      <div className="bg-surface rounded-md p-2.5">
        <div className="flex gap-1 px-2 mb-1">
          {bulbs.map(function (_, i) { return <span key={i} className="w-2 h-2 bg-gold rounded-[1px]" />; })}
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory">
          {images.map(function (img, i) {
            return (
              <button key={i} onClick={function () { openImage(i); }} className="relative w-32 sm:w-40 aspect-[3/4] flex-shrink-0 rounded-sm overflow-hidden border border-cream/10 hover:border-gold/50 transition snap-start">
                <img src={img.src} alt={img.caption} className="w-full h-full object-cover" style={{ imageOrientation: "from-image" }} />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2.5">
                  <span className="font-mono text-[10px] tracking-wider uppercase text-cream">{img.caption}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex gap-1 px-2 mt-1">
          {bulbs.map(function (_, i) { return <span key={i} className="w-2 h-2 bg-gold rounded-[1px]" />; })}
        </div>
      </div>

      {activeIndex !== null ? (
        <div onClick={closeImage} className="fixed inset-0 z-50 bg-backdrop/95 flex items-center justify-center p-6 cursor-zoom-out">
          <div className="absolute top-6 right-6 flex gap-3">
            <button onClick={handleDownloadClick} disabled={downloading} className="font-mono text-xs tracking-widest uppercase text-backdrop bg-gold px-4 py-2 rounded-sm font-bold hover:opacity-90 transition disabled:opacity-50">
              {downloading ? "Preparing..." : "Download"}
            </button>
            <button onClick={closeImage} className="font-mono text-xs tracking-widest uppercase text-cream border border-cream/20 px-4 py-2 rounded-sm hover:border-gold hover:text-gold transition">Close</button>
          </div>

          {images.length > 1 ? (
            <button onClick={prevImage} className="absolute left-4 md:left-8 font-display text-4xl text-cream/60 hover:text-gold transition">&larr;</button>
          ) : null}

          <img src={images[activeIndex].src} alt={images[activeIndex].caption} onClick={stopClick} className="max-h-[85vh] max-w-full rounded-lg border border-cream/10" style={{ imageOrientation: "from-image" }} />

          {images.length > 1 ? (
            <button onClick={nextImage} className="absolute right-4 md:right-8 font-display text-4xl text-cream/60 hover:text-gold transition">&rarr;</button>
          ) : null}

          <span className="absolute bottom-6 font-mono text-xs tracking-widest uppercase text-gold">
            {images[activeIndex].caption} - {activeIndex + 1}/{images.length}
          </span>
        </div>
      ) : null}
    </>
  );
}
