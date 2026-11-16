"use client";

import { useRef, useState } from "react";
import { Icon } from "./icons";

/** Copies text and drives a small toast. */
export function useCopy() {
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  async function copy(text: string, label: string) {
    try { if (text) await navigator.clipboard.writeText(text); setMessage(label); }
    catch { setMessage("Couldn't reach the clipboard"); }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(""), 2200);
  }
  const toast = <div className={"toast" + (message ? " is-visible" : "")} role="status" aria-live="polite"><Icon name="check" size={14} />{message}</div>;
  return { copy, toast };
}
