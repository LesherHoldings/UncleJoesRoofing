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
    },
  },
  integrations: [
    sitemap({
      // Thank-you pages are only reached after a form/booking — keep them out of search.
      filter: (page) => !page.includes('/thank-you/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
