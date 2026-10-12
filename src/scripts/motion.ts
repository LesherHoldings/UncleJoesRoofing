/**
 * Subtle-motion controller.
 * - Elements with [data-motion] get `.is-visible` while on screen, which lets their CSS
 *   background animations run (they are paused otherwise, so off-screen sections cost nothing).
 * - `.reveal` elements fade/slide in once when they first scroll into view.
 * Users with prefers-reduced-motion get everything shown immediately with no animation (CSS handles it too).
 */
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const targets = document.querySelectorAll<HTMLElement>('[data-motion], .reveal');

if (reduce || !('IntersectionObserver' in window)) {
  targets.forEach((el) => el.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        if (el.classList.contains('reveal')) {
          if (entry.isIntersecting) {
            el.classList.add('is-visible');
            io.unobserve(el);
          }
        } else {
          el.classList.toggle('is-visible', entry.isIntersecting);
        }
      }
    },
    { rootMargin: '120px 0px', threshold: 0.02 },
  );
  targets.forEach((el) => io.observe(el));
  // Safety net: if the observer never fires (odd embeds, print, very old browsers), show everything.
  setTimeout(() => document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => el.classList.add('is-visible')), 2500);
}
