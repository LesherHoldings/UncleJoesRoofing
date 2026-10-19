// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://unclejoesroofing.com',
  trailingSlash: 'always',
  // Every page is pre-rendered static HTML. The Vercel adapter handles trailing slashes
  // (/privacy → 308 → /privacy/) and long-term caching of built assets.
  output: 'static',
  adapter: vercel(),
  env: {
    schema: {
      // GA4 measurement ID (G-XXXXXXXXXX). Empty disables analytics.
      PUBLIC_GA4_ID: envField.string({ context: 'client', access: 'public', optional: true, default: '' }),
      // Google Ads tag for Uncle Joe's Roofing. Set PUBLIC_GOOGLE_ADS_ID='' in the environment to disable it.
      PUBLIC_GOOGLE_ADS_ID: envField.string({ context: 'client', access: 'public', optional: true, default: 'AW-18508719198' }),
      // Conversion label for the form conversion fired on /thank-you/ (the part after "AW-…/").
      PUBLIC_GOOGLE_ADS_FORM_LABEL: envField.string({ context: 'client', access: 'public', optional: true, default: '' }),
      // Conversion label for website call conversions (Google swaps the phone number on the page).
      PUBLIC_GOOGLE_ADS_CALL_LABEL: envField.string({ context: 'client', access: 'public', optional: true, default: 'gP6iCOiOzKIdEN7I0vlE' }),
    },
  },
  integrations: [
    sitemap({
      // Thank-you pages are only reached after a form/booking — keep them out of search.
      filter: (page) => !page.includes('/thank-you/') && !page.includes('/lp/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
