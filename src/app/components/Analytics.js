"use client";

import Script from "next/script";
import { useEffect } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function Analytics() {
  useEffect(function () {
    if (!GA_ID) return;

    // Sends an "affiliate_click" event whenever someone clicks an affiliate link.
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

  if (!GA_ID) return null;

  return (
    <>
      <Script src={"https://www.googletagmanager.com/gtag/js?id=" + GA_ID} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {"window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','" + GA_ID + "');"}
      </Script>
    </>
  );
}
