import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Fields every page needs for SEO. */
const seo = {
  /** <title> — aim for 50–60 characters, "[Service] in [Town], PA | Uncle Joe's Roofing" */
  title: z.string(),
  /** Meta description — aim for 140–160 characters */
  description: z.string(),
  /** The single H1 on the page */
  h1: z.string(),
  /** Open Graph image in /public/og/, e.g. "/og/roof-replacement.png" */
  ogImage: z.string().default('/og/default.png'),
  /** Photo key from src/assets/photos/ (file name without extension), used in the page hero. */
  image: z.string().optional(),
  /** Alt text for that photo. */
  imageAlt: z.string().optional(),
};

const faq = z.object({ q: z.string(), a: z.string() });

const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/services' }),
  schema: z.object({
    ...seo,
    order: z.number(),
    icon: z.enum(['replace', 'repair', 'inspect', 'solar']),
    /** Shown on cards on the home page */
    cardTitle: z.string(),
    cardSummary: z.string(),
    /** Short paragraph under the H1 */
    intro: z.string(),
    /** "What's included" checklist */
    highlights: z.array(z.string()).default([]),
    /** "How it works" steps, shown on the service page and reused on the ads landing page */
    steps: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
    /** Shown in the nav-less card grid; set false to hide from the home page */
    showOnHome: z.boolean().default(true),
    faqs: z.array(faq).default([]),
  }),
});

const towns = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/towns' }),
  schema: z.object({
    ...seo,
    name: z.string(),
    order: z.number(),
    /** One-line summary for the service-areas index and home page */
    summary: z.string(),
    intro: z.string(),
    /** Typical housing stock — shown as a short list */
    housing: z.array(z.string()),
    /** Neighborhoods / landmarks we mention — shown as tags */
    landmarks: z.array(z.string()),
    faqs: z.array(faq).default([]),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    ...seo,
    intro: z.string().optional(),
    faqs: z.array(faq).default([]),
    // Home page sections (only used by home.md)
    hero: z
      .object({ subheading: z.string(), points: z.array(z.string()) })
      .optional(),
    whyUs: z
      .object({
        heading: z.string(),
        items: z.array(z.object({ title: z.string(), text: z.string() })),
      })
      .optional(),
    storyTeaser: z.object({ heading: z.string(), text: z.string() }).optional(),
    serviceArea: z.object({ heading: z.string(), text: z.string() }).optional(),
    reviews: z.object({ heading: z.string(), text: z.string() }).optional(),
    finalCta: z.object({ heading: z.string(), text: z.string() }).optional(),
    lastUpdated: z.string().optional(),
    // Ads landing page sections (lp-roof-replacement.md)
    lp: z
      .object({
        /** Sub-heading after the seasonal deadline sentence */
        subheading: z.string(),
        trust: z.array(z.string()),
        /** Questions (by exact text) to reuse from the roof-replacement service FAQs */
        faqFrom: z.array(z.string()),
        ownerText: z.string(),
      })
      .optional(),
    // Cost page sections (roof-replacement-cost.md)
    cost: z
      .object({
        drivers: z.array(z.object({ title: z.string(), text: z.string() })),
        whyHeading: z.string(),
        why: z.array(z.string()),
      })
      .optional(),
  }),
});

export const collections = { services, towns, pages };
