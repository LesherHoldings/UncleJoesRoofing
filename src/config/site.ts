/**
 * SITE CONFIG — the one place for business facts and placeholders.
 *
 * Every value marked PENDING must be replaced before launch.
 * `npm run check:placeholders` lists any that are left (it also runs before every build).
 *
 * IMPORTANT: phone and address must match the Google Business Profile EXACTLY
 * (same formatting, same suite/unit style), or local search rankings suffer.
 */

export const site = {
  name: "Uncle Joe's Roofing",
  tagline: 'Call Your Uncle.',
  /** Legal entity that owns the DBA. Confirm exact registered name (LLC/Inc.). */
  legalName: 'Fortress Siding',
  dbaLine: "Uncle Joe's Roofing is a DBA of Fortress Siding.",
  url: 'https://unclejoesroofing.com',

  // ---------------------------------------------------------------- PLACEHOLDERS
  /** Signs the Our Story page and the "Meet the owner" section. */
  ownerName: 'Joe Lesher',
  phone: {
    /** As shown on the site. Must match Google Business Profile exactly. */
    display: '610-651-3778',
    /** E.164 format for tel: links and schema, e.g. +12155550123 */
    e164: '+16106513778',
  },
  email: '[EMAIL — PENDING]',
  /** Service-area business: no street address is published anywhere. Leave `street` empty. */
  address: {
    street: '',
    city: 'Blue Bell',
    region: 'PA',
    postalCode: '19422',
    country: 'US',
  },
  /** Office map pin for schema (decimal degrees), from Google Business Profile. null = omitted. */
  geo: null as { lat: number; lng: number } | null,
  /** How the service area is described in copy. */
  region: 'Montgomery & Chester County, PA',
  /** PA Home Improvement Contractor registration — legally required in the footer. */
  hicNumber: 'PA203681',
  /** Business hours. Used in the footer, contact page and schema. Confirm against GBP. */
  hours: [
    { days: 'Monday–Friday', schemaDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '17:00', label: '[HOURS — PENDING] 8am–5pm' },
    { days: 'Saturday', schemaDays: ['Saturday'], opens: '09:00', closes: '13:00', label: '[HOURS — PENDING] 9am–1pm' },
  ],
  financing: {
    partner: '[FINANCING PARTNER — PENDING]',
    /** Link to the partner's application page, or leave '' to hide the button. */
    applyUrl: '',
  },
  /** Credential badges on the home page and service pages. Replace each with a real credential, or delete it. */
  credentials: ['[CERTIFICATION — PENDING]', '[INSURANCE DETAILS — PENDING]'],
  /** Warranty summary shown on the Roof Replacement page. */
  warranty: '[WARRANTY TERMS — PENDING] Describe the manufacturer warranty and your workmanship warranty here.',
  /**
   * Customer reviews (home page). Use ONLY real reviews, with the customer's permission.
   * Set verified: true on real ones. Never invent reviews, names or counts.
   */
  reviews: [
    { quote: '[REVIEW PLACEHOLDER] Replace with a real customer review, used with permission.', name: '[CUSTOMER NAME]', town: 'Conshohocken', service: 'Roof replacement', verified: false },
    { quote: '[REVIEW PLACEHOLDER] Replace with a real customer review, used with permission.', name: '[CUSTOMER NAME]', town: 'Blue Bell', service: 'Roof repair', verified: false },
    { quote: '[REVIEW PLACEHOLDER] Replace with a real customer review, used with permission.', name: '[CUSTOMER NAME]', town: 'Malvern', service: 'Free roof inspection', verified: false },
  ],
  /** Google Business Profile review link (for the reviews section). '' hides the button. */
  reviewsUrl: '',
  social: {
    /** Google Business Profile share link (https://g.page/… or maps.app.goo.gl/…). Feeds sameAs and hasMap in the schema. */
    googleBusinessProfile: '',
    facebook: '',
    instagram: '',
  },

  // ------------------------------------------------- GOHIGHLEVEL (LeadConnector)
  ghl: {
    /** Lead form shown on service, town, inspection and contact pages. */
    form: { id: 'W7t6IrZEsKjj6mAaekfQ', name: 'Unc Joe’s Main Site', height: 677 },
    /** Booking calendar shown on /book/ (discovery.unclejoesroofing.com links there). */
    calendar: { id: 'hX0wQY77NfxFcO3G5Hu7' },
    embedScript: 'https://link.msgsndr.com/js/form_embed.js',
  },
  /** Brand name used for the SMS program in the Terms and Privacy pages (A2P 10DLC). */
  smsProgramName: "Uncle Joe's Roofing",

  // ----------------------------------------------------- ENVIRONMENT VARIABLES
  // Set these in Vercel → Project → Settings → Environment Variables (and in .env locally).
  // PUBLIC_GA4_ID — GA4 measurement ID, e.g. G-XXXXXXXXXX. Empty = analytics off.
  //   Read in src/components/Analytics.astro.
} as const;

/** Service-area towns, in display order. Each has a markdown file in src/content/towns/. */
export const serviceAreas = ['conshohocken', 'blue-bell', 'malvern', 'paoli', 'west-conshohocken', 'plymouth-meeting', 'lafayette-hill', 'king-of-prussia', 'ambler'] as const;

/** Nearby towns we also serve (mentioned in copy and schema, no dedicated page). */
export const nearbyTowns = ['Wayne', 'Berwyn', 'Devon', 'Exton', 'Gulph Mills', 'Norristown', 'Fort Washington', 'Lansdale'];

/** Where every "Book" button goes. */
export const bookHref = '/book/';

/** Main menu. Keep it short — the rest lives in the footer and in-page links. */
export const nav = [
  { label: 'Roof Replacement', href: '/roof-replacement/' },
  { label: 'Roof Repair', href: '/roof-repair/' },
  { label: 'Pricing & Warranties', href: '/pricing-and-warranties/' },
  { label: 'Service Areas', href: '/service-areas/' },
  { label: 'Our Story', href: '/our-story/' },
  { label: 'Contact', href: '/contact/' },
];

/** Footer "Services" column, in order. */
export const footerServices = [
  { label: 'Book a Free Inspection', href: '/book/' },
  { label: 'Roof Replacement', href: '/roof-replacement/' },
  { label: 'Roof Repair', href: '/roof-repair/' },
  { label: 'Free Roof Inspection', href: '/free-roof-inspection/' },
  { label: 'Solar-Ready Roofs', href: '/solar-ready-roofs/' },
  { label: 'What to Expect on Install Day', href: '/what-to-expect/' },
  { label: 'Pricing & Warranties', href: '/pricing-and-warranties/' },
  { label: 'What a New Roof Costs', href: '/roof-replacement-cost/' },
  { label: 'Financing', href: '/financing/' },
];

/** Our Work gallery (home page + Our Story). Use ONLY real job photos you have the right to use.
 *  before/after are photo keys from src/assets/photos/. Leave '' to show a "coming soon" slot. */
export const gallery: { before: string; after: string; caption: string; town: string }[] = [
  { before: '', after: '', caption: '[JOB PHOTO — PENDING] Roof replacement', town: 'Blue Bell' },
  { before: '', after: '', caption: '[JOB PHOTO — PENDING] Roof replacement', town: 'Conshohocken' },
  { before: '', after: '', caption: '[JOB PHOTO — PENDING] Roof repair', town: 'Malvern' },
  { before: '', after: '', caption: '[JOB PHOTO — PENDING] Roof replacement', town: 'Paoli' },
];

/** "Meet the owner" section (home page and Our Story). Keep the bio in the owner's own words and only true facts. */
export const owner = {
  name: site.ownerName,
  role: 'Owner, Uncle Joe\'s Roofing',
  /** Photo key from src/assets/photos/ */
  photo: 'owner-joe',
  photoAlt: 'Joe Lesher, owner of Uncle Joe\'s Roofing, standing in front of a brick two-story home',
  /** Short paragraphs, first person. */
  blurb: [
    "I'm an Army veteran who served in Iraq, and I've spent more than ten years in home improvement, including six years owning and running my own roofing company. I've seen this trade done right and done wrong. Uncle Joe's exists to do it right: honest pricing, clean job sites, and a roof built to protect your family for decades.",
    'My family and I make our home here in the Conshohocken area, and these are our neighbors. When you need a roof done right, call your uncle.',
  ],
  /** Quick facts shown as a checklist. */
  facts: ['U.S. Army veteran — served in Iraq', 'More than ten years in home improvement', 'Six years owning and running a roofing company'],
};

export const telHref = `tel:${site.phone.e164}`;
export const fullAddress = `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`;

/**
 * True while a config value still carries a placeholder ([… — PENDING], [REVIEW PLACEHOLDER], [CUSTOMER NAME]).
 * Components use this to hide a section until the real content is filled in here.
 */
export const isPlaceholder = (v: string | undefined | null) => !v || /PENDING|PLACEHOLDER|\[CUSTOMER NAME\]/.test(v);

/**
 * Seasonal campaign copy, used by /lp/roof-replacement/ and /roof-replacement-cost/.
 * Set `enabled: false` to turn the whole thing off in one place, or edit the text and date here.
 */
export const offer = {
  enabled: true,
  /** Landing page H1 while the offer runs */
  headline: 'New Roof Before Winter.',
  /** First sentence of the landing page sub-heading (the deadline) */
  deadlineText: 'Book by Nov 15 to get on the schedule before the holidays.',
  /** Fallback box for people who can't make the deadline */
  fallbackHeading: 'Missed the winter window?',
  fallbackText: "Book now to lock in today's price and get first spot in spring.",
  /** Used when enabled is false */
  offHeadline: 'Roof Replacement Done Right.',
};
