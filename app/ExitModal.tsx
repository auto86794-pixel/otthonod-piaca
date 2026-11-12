"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "exitModalShown";

export default function ExitModal() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const shownRef = useRef(false);

  useEffect(() => {
    if (pathname !== "/" || shownRef.current) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      // Tiltott tárhely esetén a komponens élettartama alatt marad egyszeri.
    }
    let armed = true;
    let lastY = window.scrollY;
    let lastTime = performance.now();
    let furthestY = lastY;
    const touchDevice = window.matchMedia("(pointer: coarse)").matches;

    function show() {
      if (!armed || document.visibilityState !== "visible") return;
      const active = document.activeElement;
      if (active?.closest("input, textarea, select, [contenteditable], .chat-panel, dialog[open]")) return;
      armed = false;
      shownRef.current = true;
      try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* tárhely nélkül is működik */ }
      setOpen(true);
    }
    function onMouseOut(event: MouseEvent) {
      if (!touchDevice && event.relatedTarget === null && event.clientY <= 0) show();
    }
    function onScroll() {
      const now = performance.now();
      const y = window.scrollY;
      furthestY = Math.max(furthestY, y);
      const speed = (lastY - y) / Math.max(now - lastTime, 1);
      if (touchDevice && furthestY >= 300 && y <= 120 && speed > 1.2) show();
      lastY = y;
      lastTime = now;
    }
    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("scroll", onScroll, { passive: true });
    const timer = window.setTimeout(() => { armed = false; }, 15_000);
    return () => {
      armed = false;
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function close() { setOpen(false); }
  function scrollToForm() {
    close();
    const form = document.getElementById("kapcsolat");
    form?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    const firstInput = form?.querySelector<HTMLInputElement>('input[name="name"]');
    window.requestAnimationFrame(() => firstInput?.focus({ preventScroll: true }));
  }

  if (!open || pathname !== "/") return null;
  return (
    <dialog ref={dialogRef} className="exit-overlay" aria-labelledby="exit-title" aria-describedby="exit-description"
      onCancel={(event) => { event.preventDefault(); close(); }} onClose={close}
      onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div className="exit-modal">
        <button type="button" className="exit-close" onClick={close} aria-label="Bezárás" autoFocus>×</button>
        <span className="exit-emoji" aria-hidden="true">🏡</span>
        <h3 id="exit-title">Mielőtt elmész…</h3>
        <p id="exit-description">Szeretnéd tudni, <strong>mennyit érhet a lakásod?</strong> Kérj visszahívást az ingyenes, személyes értékbecslés egyeztetéséhez.</p>
        <button type="button" className="button primary" onClick={scrollToForm}>Ingyenes értékbecslést kérek</button>
        <button type="button" className="exit-later" onClick={close}>Most nem kérem</button>
      </div>
    </dialog>
  );
}
