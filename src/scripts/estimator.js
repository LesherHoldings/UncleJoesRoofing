/**
 * Roof cost estimator for /roof-replacement-cost/.
 * Adjust the numbers here; the page table and the estimator both read from this file.
 * Ranges are typical full asphalt-shingle replacements in our area — every roof is measured
 * before a written quote.
 */
export const HOME_TYPES = [
  { id: 'twin', label: 'Twin / townhome (half)', low: 11000, high: 14000 },
  { id: 'colonial', label: 'Typical 2-story colonial or split-level', low: 22000, high: 27000 },
  { id: 'large', label: 'Larger home (3,000+ sq ft)', low: 30000, high: 36000 },
];

/** Multiplier by number of stories (2 is the baseline the ranges above assume). */
export const STORY_FACTOR = { 1: 0.95, 2: 1, 3: 1.08 };

/** Steep roofs (hard to walk, extra safety setup) add about this much. */
export const STEEP_FACTOR = 1.1;

/** Round to the nearest $500 so the estimate reads like a range, not a quote. */
const round = (n) => Math.round(n / 500) * 500;

export function estimate({ homeType, stories, steep }) {
  const type = HOME_TYPES.find((t) => t.id === homeType) ?? HOME_TYPES[1];
  const f = (STORY_FACTOR[stories] ?? 1) * (steep ? STEEP_FACTOR : 1);
  return { low: round(type.low * f), high: round(type.high * f) };
}

export const usd = (n) => '$' + n.toLocaleString('en-US');
export const range = (r) => `${usd(r.low)}–${usd(r.high)}`;
