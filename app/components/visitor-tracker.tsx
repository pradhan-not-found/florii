"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

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
      // every visit counts once: the first page of each visit (a new tab or coming back later)
      first = !sessionStorage.getItem("florii-visit");
      if (first) sessionStorage.setItem("florii-visit", "1");
    } catch { return; }
    void fetch("/api/visitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId, eventId: crypto.randomUUID(), first, path: pathname, referrer: first ? document.referrer : "" }),
      keepalive: true,
    }).then(r => r.ok ? r.json() : null).then(data => {
      if (typeof data?.count === "number") window.dispatchEvent(new CustomEvent("florii-visitors", { detail: data.count }));
    }).catch(() => {});
  }, [pathname]);
  return null;
}
