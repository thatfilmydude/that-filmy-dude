"use client";

import { useEffect } from "react";

// Sends an "affiliate_click" event to GA4 whenever someone clicks an affiliate link.
// GA itself is loaded by <GoogleAnalytics /> in layout.js, so this only listens for clicks.
export default function AffiliateTracker() {
  useEffect(function () {
    function onClick(e) {
      const a = e.target && e.target.closest ? e.target.closest("a") : null;
      if (!a || !a.href) return;
      const rel = a.getAttribute("rel") || "";
      if (rel.indexOf("sponsored") === -1) return;
      if (typeof window.gtag === "function") {
        window.gtag("event", "affiliate_click", {
          link_url: a.href,
          link_text: (a.textContent || "").trim().slice(0, 80),
          page_path: window.location.pathname,
        });
      }
    }

    document.addEventListener("click", onClick);
    return function () {
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
