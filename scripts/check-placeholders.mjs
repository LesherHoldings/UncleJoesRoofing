#!/usr/bin/env node
/**
 * Lists every placeholder still in the site, plus missing environment variables.
 * Runs before every build (warning only — it never blocks a build).
 *   npm run check:placeholders            → warn
 *   npm run check:placeholders -- --strict → exit 1 if anything is left (use before launch)
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const strict = process.argv.includes('--strict');
const MARKERS = [/\[[^[\]\n]*(PENDING|PLACEHOLDER)[^[\]\n]*\]/g, /\[CUSTOMER NAME\]/g, /\+10000000000/g];
// Placeholders belong in src/config/site.ts only — content is scanned too, to catch strays.
const SCAN = ['src/config', 'src/content'];

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.(ts|md|json|mjs)$/.test(name)) yield p;
  }
}

const found = [];
for (const dir of SCAN) {
  for (const file of walk(join(root, dir))) {
    readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
      for (const re of MARKERS) {
        for (const m of line.matchAll(re)) found.push({ file: relative(root, file), line: i + 1, text: m[0] });
      }
    });
  }
}

// Environment variables: process env (Vercel) or a local .env file
const envFile = join(root, '.env');
const localEnv = existsSync(envFile) ? readFileSync(envFile, 'utf8') : '';
const hasEnv = (k) => Boolean(process.env[k]) || new RegExp(`^${k}=\\S+`, 'm').test(localEnv);
const missingEnv = ['PUBLIC_GA4_ID'].filter((k) => !hasEnv(k));

const yellow = (s) => (process.stdout.isTTY ? `\x1b[33m${s}\x1b[0m` : s);
if (!found.length && !missingEnv.length) {
  console.log('✓ No placeholders left.');
  process.exit(0);
}
console.log(yellow(`\n⚠  ${found.length} placeholder(s) still in the site:`));
for (const f of found) console.log(`   ${f.file}:${f.line}  ${f.text}`);
if (missingEnv.length) console.log(yellow(`⚠  Environment variables not set: ${missingEnv.join(', ')}`));
console.log('   See README.md → "Placeholders" before launch.\n');
process.exit(strict ? 1 : 0);
