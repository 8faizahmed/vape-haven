// Shared page scroll lock for overlays (cart, menu, search, filters). Smooth
// scrolling listens for these events so the page can't scroll behind a dialog,
// and html[data-overlay] lets CSS dim the page itself (see globals.css).

let locks = 0;

export const SCROLL_LOCK_EVENT = "vh:scroll-lock-change";

export function lockScroll() {
  locks++;
  document.documentElement.style.overflow = "hidden";
  document.documentElement.dataset.overlay = "";
  window.dispatchEvent(new Event(SCROLL_LOCK_EVENT));
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    document.documentElement.style.overflow = "";
    delete document.documentElement.dataset.overlay;
  }
  window.dispatchEvent(new Event(SCROLL_LOCK_EVENT));
}

export const isScrollLocked = () => locks > 0;
