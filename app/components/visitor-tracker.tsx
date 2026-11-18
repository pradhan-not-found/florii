"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Set once a page load has been counted; cleared only by a real reload. */
let countedThisLoad = false;

export function VisitorTracker() {
  const pathname = usePathname();
  const previous = useRef<string | null>(null);
  useEffect(() => {
    // one visit per page load (opening the site, a new tab, a reload); moving between pages adds nothing
    if (countedThisLoad || previous.current === pathname) return;
    previous.current = pathname;
    if (!pathname || pathname === "/admin" || pathname.startsWith("/admin/")) return;
    if (navigator.doNotTrack === "1" || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return;
    let visitorId: string;
    try {
      visitorId = localStorage.getItem("florii-visitor-id") || crypto.randomUUID();
      localStorage.setItem("florii-visitor-id", visitorId);
    } catch { visitorId = crypto.randomUUID(); }
    countedThisLoad = true;
    void fetch("/api/visitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId, eventId: crypto.randomUUID(), first: true, path: pathname, referrer: document.referrer,
        // the browser's own time zone and language tell us the country, with no prompt and no location access
        tz: (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return ""; } })(),
        lang: navigator.language || "",
      }),
      keepalive: true,
    }).then(r => r.ok ? r.json() : null).then(data => {
      if (typeof data?.count === "number") window.dispatchEvent(new CustomEvent("florii-visitors", { detail: data.count }));
    }).catch(() => {});
  }, [pathname]);
  return null;
}
