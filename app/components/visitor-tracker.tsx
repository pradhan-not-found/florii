"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Set on the first page of each page load; cleared only by a real reload. */
let countedThisLoad = false;

export function VisitorTracker() {
  const pathname = usePathname();
  const previous = useRef<string | null>(null);
  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    if (!pathname || pathname === "/admin" || pathname.startsWith("/admin/")) return;
    if (navigator.doNotTrack === "1" || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return;
    let visitorId: string, first = false;
    try {
      visitorId = localStorage.getItem("florii-visitor-id") || crypto.randomUUID();
      localStorage.setItem("florii-visitor-id", visitorId);
      // every page load counts once (opening the site, a new tab, a reload); moving between pages inside the site doesn't
      first = !countedThisLoad;
      countedThisLoad = true;
    } catch { return; }
    void fetch("/api/visitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId, eventId: crypto.randomUUID(), first, path: pathname, referrer: first ? document.referrer : "",
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
