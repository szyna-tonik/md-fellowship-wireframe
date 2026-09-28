/**
 * smooth-scroll.js — wheel-only page smoothing, no dependencies.
 *
 * Extracted from the Colmez LP. It is NOT a scroll hijacker and NOT a virtual
 * scroller: the page keeps its real scroll position, so anchors, position:
 * sticky, position: fixed, IntersectionObserver, the scrollbar and devtools all
 * keep working. The mouse wheel simply gets an eased follow instead of a jump.
 *
 * WHY THIS AND NOT LENIS / LOCOMOTIVE
 * Those translate the page inside a fake viewport: that breaks `position:
 * sticky`, costs a transform repaint every frame and needs a resize/observer
 * dance to stay in sync. This calls window.scrollTo(). Nothing native breaks.
 *
 * WHAT IT DELIBERATELY DOES NOT TOUCH
 * Scrollbar drag, keyboard, touch and programmatic scrollTo stay 100% native.
 * Only the wheel is eased. If anything else moves the page it detects that and
 * resyncs instead of fighting it.
 *
 * USAGE — standalone (runs its own rAF loop)
 *   import { createSmoothScroll } from './smooth-scroll.js';
 *   createSmoothScroll();
 *
 * USAGE — you already have a rAF loop (use this if you animate on scroll)
 *   const ss = createSmoothScroll({ autoRun: false });
 *   let last = 0;
 *   function loop(ts) {
 *     const dt = Math.min(0.05, (ts - last) / 1000 || 0.016); last = ts;
 *     const driving = ss.step(dt);      // true while the wheel is easing
 *     // ...your scroll-driven animation here — see DOUBLE-LAG below
 *     requestAnimationFrame(loop);
 *   }
 *   requestAnimationFrame(loop);
 *
 * DOUBLE-LAG — the one thing people get wrong
 * If your animations also ease their own progress value, you are smoothing a
 * value that is already smoothed and everything turns to syrup. Use `driving`:
 *
 *   const P = rawProgress();                 // 0..1 from getBoundingClientRect
 *   if (driving) Ps = P;                     // already eased -> take it raw
 *   else Ps += (P - Ps) * (1 - Math.exp(-dt * 6.5));   // native input -> ease
 *
 * That way wheel and non-wheel input feel identical.
 *
 * CSS
 * Do NOT set `scroll-behavior: smooth` on html/body — it fights this.
 * `overscroll-behavior: none` on <html> is usually what you want alongside.
 */

export function createSmoothScroll(options = {}) {
  const {
    // Easing stiffness. Higher = snappier, lower = floatier.
    // 6.5 is the Colmez value; 8-12 is tighter, 4-5 is very floaty.
    stiffness = 6.5,
    // Skip on touch/small screens: native momentum scrolling is already good
    // and overriding it on a phone feels broken.
    disableBelow = 768,
    // Respect the OS "reduce motion" setting.
    respectReducedMotion = true,
    // false = you drive it from your own rAF loop via .step(dt)
    autoRun = true,
    // Guard so nothing moves while a preloader/intro owns the screen.
    isLocked = () => false,
  } = options;

  const reduced = respectReducedMotion
    && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const disabled = reduced || matchMedia(`(max-width: ${disableBelow - 1}px)`).matches;

  let target = 0, current = 0, primed = false, raf = 0, last = 0;

  function onWheel(e) {
    // ctrlKey = trackpad pinch-zoom; never touch it.
    if (disabled || e.ctrlKey) return;
    e.preventDefault();
    if (isLocked()) return;

    // Prime from the live position, not 0 — the page may already be scrolled
    // (reload mid-page, deep link).
    if (!primed) { target = current = window.scrollY; primed = true; }

    // deltaMode: 0 = pixels, 1 = lines, 2 = pages. Firefox reports lines.
    const d = e.deltaMode === 1 ? e.deltaY * 33
            : e.deltaMode === 2 ? e.deltaY * window.innerHeight
            : e.deltaY;

    const max = document.documentElement.scrollHeight - window.innerHeight;
    target = Math.max(0, Math.min(max, target + d));
  }

  /**
   * Advance one frame. Returns true while it is actually driving the scroll —
   * that is the flag you feed to your animation easing (see DOUBLE-LAG).
   */
  function step(dt) {
    if (!primed || disabled) return false;

    const y = window.scrollY;

    // Something else moved the page (scrollbar, keys, anchor, touch, devtools).
    // Hand control back and resync rather than starting a tug-of-war.
    if (Math.abs(y - current) > 1.5) { current = target = y; return false; }

    // Close enough — snap and stop, so we are not calling scrollTo forever.
    if (Math.abs(target - current) < 0.4) { current = target; return false; }

    // Frame-rate independent exponential ease. Do NOT write `+= diff * 0.1`:
    // that is tied to frame rate and runs ~2x faster on a 120Hz display.
    current += (target - current) * (1 - Math.exp(-dt * stiffness));
    window.scrollTo(0, current);
    return true;
  }

  function loop(ts) {
    const dt = Math.min(0.05, (ts - last) / 1000 || 0.016); // clamp tab-switch spikes
    last = ts;
    step(dt);
    raf = requestAnimationFrame(loop);
  }

  // passive:false is required — we call preventDefault().
  window.addEventListener('wheel', onWheel, { passive: false });
  if (autoRun) raf = requestAnimationFrame(loop);

  return {
    step,
    get isDriving() { return primed && Math.abs(target - current) >= 0.4; },
    /** Jump without easing (e.g. after a layout change). */
    resync() { target = current = window.scrollY; },
    destroy() {
      window.removeEventListener('wheel', onWheel);
      if (raf) cancelAnimationFrame(raf);
    },
  };
}
