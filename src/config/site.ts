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
  /** Signs the Our Story page. */
  ownerName: '[OWNER NAME — PENDING]',
  phone: {
    /** As shown on the site. Must match Google Business Profile exactly. */
    display: '610-651-3778',
    /** E.164 format for tel: links and schema, e.g. +12155550123 */
    e164: '+16106513778',
  },
  email: '[EMAIL — PENDING]',
  address: {
    /** Must match Google Business Profile exactly. */
    street: '[OFFICE STREET ADDRESS — PENDING]',
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
export const serviceAreas = ['conshohocken', 'blue-bell', 'malvern', 'paoli'] as const;

/** Nearby towns we also serve (mentioned in copy and schema, no dedicated page). */
export const nearbyTowns = ['King of Prussia', 'Plymouth Meeting', 'Wayne', 'Berwyn', 'Devon', 'Ambler', 'Lafayette Hill', 'Exton'];

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

/** "Meet the owner" section. Add a real photo key (src/assets/photos/) and a short, true bio. */
export const owner = {
  name: site.ownerName,
  role: 'Owner, Uncle Joe\'s Roofing',
  photo: '',
  blurb: '[OWNER BIO — PENDING] Two or three plain sentences: how long you have been roofing, where you grew up, why you started Uncle Joe\'s.',
};

export const telHref = `tel:${site.phone.e164}`;
export const fullAddress = `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`;
