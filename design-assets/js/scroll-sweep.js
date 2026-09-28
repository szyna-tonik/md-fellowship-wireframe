/**
 * scroll-sweep.js — scroll-synced per-word text sweep.
 * Pairs with smooth-scroll.js. No dependencies.
 *
 * Extracted from the Colmez LP. Words rise into place and a gold edge wipes
 * through them left-to-right, all driven by ONE normalized progress value so
 * the type stays locked to the scroll instead of running on its own timer.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE ARCHITECTURE (four parts, in order)
 *
 *   1. TRACK    scroll position -> one 0..1 value per section   (trackProgress)
 *   2. SYNC     smooth that value WITHOUT double-lag            (see below)
 *   3. TIMELINE map 0..1 onto per-word windows                  (seg + stagger)
 *   4. PAINT    write one CSS var per word                      (--fill)
 *
 * Everything hangs off a single number. That is what keeps the type welded to
 * the scroll: there is no second clock to drift against.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * 2. THE SYNC RULE — the part that actually matters
 *
 * With eased scrolling you have TWO places smoothing can happen: the scroll
 * itself, and the progress value. Do both and you get syrup. Do neither on
 * native input (scrollbar, keys) and the type snaps. The fix is to branch:
 *
 *   const driving = ss.step(dt);      // from smooth-scroll.js
 *   const P = trackProgress(section);
 *   if (driving)  Ps = P;             // scroll is already eased -> take it raw
 *   else          Ps += (P - Ps) * (1 - Math.exp(-dt * 6.5));  // ease here
 *   sweep.update(Ps);
 *
 * Use the SAME stiffness in both places (6.5) and wheel vs. non-wheel input
 * become indistinguishable. This is the whole trick.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * 4. THE PAINT MECHANIC
 *
 * Each word carries its OWN copy of the sweep gradient, clipped to the glyphs,
 * and JS only moves a single stop position (--fill from -24% to 124%):
 *
 *   .w {
 *     display: inline-block;
 *     color: transparent;
 *     -webkit-text-fill-color: transparent;
 *     background-image: linear-gradient(90deg,
 *       var(--lit)  0%,
 *       var(--lit)  var(--fill),
 *       var(--edge) calc(var(--fill) + var(--edge-w)),
 *       var(--rest) calc(var(--fill) + var(--tail-w)),
 *       var(--rest) 100%);
 *     -webkit-background-clip: text;
 *             background-clip: text;
 *     background-repeat: no-repeat;
 *   }
 *
 * Call .align() after layout/resize and the per-word gradients are stretched
 * and offset to the PARAGRAPH box, so separate elements read as one continuous
 * wipe across the whole block.
 *
 * See the GOTCHAS block at the bottom — three of them cost real debugging time.
 */

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const seg = (p, a, b) => clamp01((p - a) / (b - a));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const lerp = (a, b, t) => a + (b - a) * t;

// Deterministic per-word jitter. Same word always gets the same offset, so the
// animation is identical on every reload and reverses cleanly. Math.random()
// here would make the sweep shimmer differently on the way back up.
const hash01 = (i) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * 1. TRACK — a section's scroll progress as 0..1.
 * Works for a normal section (0 when its top hits the viewport bottom, 1 when
 * its bottom passes the top) and for a tall pinned/sticky stage.
 */
export function trackProgress(el, { pinned = false } = {}) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  if (pinned) {
    const track = el.offsetHeight - vh;
    return track > 0 ? clamp01(-r.top / track) : 0;
  }
  return clamp01((vh - r.top) / (vh + r.height));
}

/**
 * 3+4. Build a sweep over a set of word elements.
 *
 * @param words      selector or iterable of elements (each one word)
 * @param start      when the first word begins, in track progress (0..1)
 * @param spread     stagger span across all words
 * @param rise       per-word rise duration
 * @param fill       per-word wipe duration
 * @param fillDelay  gap between a word arriving and its wipe starting
 * @param travel     rise distance in px
 * @param jitter     deterministic randomness added to each word's fill start
 * @param restFill   --fill at rest; MUST be <= -(tail-w), see GOTCHA 2
 * @param counters   tick `<sup data-n="123">` inside its own word's window
 */
export function createSweep(words, options = {}) {
  const {
    start = 0.30, spread = 0.17,
    rise = 0.055, fill = 0.075, fillDelay = 0.018,
    travel = 38, jitter = 0.035,
    restFill = -24, endFill = 124,
    counters = true,
  } = options;

  const els = typeof words === 'string'
    ? [...document.querySelectorAll(words)] : [...words];

  const meta = els.map((el, i) => {
    const rs = start + (i / Math.max(1, els.length)) * spread;
    return {
      el,
      sup: counters ? el.querySelector('sup[data-n]') : null,
      rs,                                           // rise start
      fs: rs + fillDelay + hash01(i) * jitter,      // fill start
    };
  });

  let lastKey = -1;

  /** Stretch each word's gradient to the paragraph box so the wipe is continuous. */
  function align() {
    for (const m of meta) {
      const box = m.el.offsetParent ? m.el.parentElement : null;
      if (!box) continue;
      m.el.style.backgroundSize = `${box.clientWidth}px 100%`;
      m.el.style.backgroundPosition = `${-(m.el.offsetLeft - box.offsetLeft)}px 0`;
      if (m.sup) {
        m.sup.style.backgroundSize = `${m.el.clientWidth}px 100%`;
        m.sup.style.backgroundPosition = `${-(m.sup.offsetLeft - m.el.offsetLeft)}px 0`;
      }
    }
  }

  /** Feed this the SYNCED progress (see THE SYNC RULE at the top). */
  function update(P) {
    // Dirty check: identical progress means identical DOM, so skip the writes.
    // Cheap, and it keeps idle frames free.
    if (P === lastKey) return;
    lastKey = P;

    for (const m of meta) {
      const st = m.el.style;

      const tr = easeOut(seg(P, m.rs, m.rs + rise));
      st.opacity = tr.toFixed(3);
      // Drop the transform entirely once landed — a lingering translate3d
      // keeps the element on its own compositor layer for nothing.
      st.transform = tr >= 1 ? '' : `translate3d(0, ${((1 - tr) * travel).toFixed(1)}px, 0)`;

      const tf = seg(P, m.fs, m.fs + fill);
      st.setProperty('--fill', lerp(restFill, endFill, tf).toFixed(1) + '%');

      if (m.sup) {
        const v = String(Math.round(+m.sup.dataset.n * easeOut(tf))).padStart(3, '0');
        if (m.sup.textContent !== v) m.sup.textContent = v;
      }
    }
  }

  /** Jump to the finished state (reduced motion, or a deep link past it). */
  function finish() {
    for (const m of meta) {
      const st = m.el.style;
      st.opacity = '1'; st.transform = '';
      st.setProperty('--fill', endFill + '%');
      if (m.sup) m.sup.textContent = String(+m.sup.dataset.n).padStart(3, '0');
    }
    lastKey = -1;
  }

  align();
  return { update, align, finish, elements: els, meta };
}

/* ─────────────────────────────────────────────────────────────────────────
 * GOTCHAS — all three cost real debugging time on Colmez
 *
 * 1. PER-WORD GRADIENTS, NOT ONE ON THE PARENT.
 *    The obvious build is one gradient on the paragraph with background-clip:
 *    text. It mis-renders in Chromium as soon as the children are composited
 *    (and they are — they carry transforms). Give every word its own gradient
 *    copy and align them with .align(). That is what align() exists for.
 *
 * 2. REST FILL MUST BE <= -(TAIL WIDTH).
 *    With --tail-w: 34%, a rest --fill of -24% makes the gold stop clamp to 0
 *    and a thin gold sliver leaks down the left edge of every word before the
 *    sweep ever starts. Keep restFill <= -34 for a 34% tail. Easy to miss
 *    because it only shows on the untouched rest state.
 *
 * 3. PADDING/MARGIN PAIR FOR ASCENDERS.
 *    background-clip: text clips to the glyph box, so tall ascenders and
 *    descenders get sheared. Pad the background box and pull the layout back
 *    with an equal negative margin:
 *      padding: 0.14em 0 0.24em;  margin: -0.14em 0 -0.24em;
 *
 * 4. (bonus) DETERMINISTIC JITTER, NEVER Math.random().
 *    Scroll-driven animation is reversible. Random per-word offsets re-roll on
 *    every frame or every reload and the sweep shimmers inconsistently on the
 *    way back up. hash01(i) gives each word a stable offset forever.
 * ───────────────────────────────────────────────────────────────────────── */
