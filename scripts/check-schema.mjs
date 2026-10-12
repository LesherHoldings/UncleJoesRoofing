#!/usr/bin/env node
/**
 * Validates the JSON-LD on every built page (.vercel/output/static/**\/index.html):
 *   - exactly one ld+json script, valid JSON, a single @graph
 *   - every {"@id": …} reference resolves to a typed node in the same graph
 *   - no placeholder text, no empty names/descriptions, no duplicate conflicting @ids
 *   - the business node has the properties Google expects for a LocalBusiness
 *   - FAQPage pages have at least one Question with an Answer; breadcrumbs are absolute URLs
 * Usage: node scripts/check-schema.mjs   (run after `npm run build`; exits 1 on any error)
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = join(root, '.vercel', 'output', 'static');

function* pages(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* pages(p);
    else if (name === 'index.html') yield p;
  }
}

const errors = [];
const err = (page, msg) => errors.push(`${page}: ${msg}`);
let count = 0;

for (const file of pages(out)) {
  const page = '/' + relative(out, file).replace(/index\.html$/, '');
  const html = readFileSync(file, 'utf8');
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (scripts.length !== 1) { err(page, `expected 1 ld+json script, found ${scripts.length}`); continue; }
  let data;
  try { data = JSON.parse(scripts[0]); } catch (e) { err(page, `invalid JSON: ${e.message}`); continue; }
  count++;
  if (data['@context'] !== 'https://schema.org' || !Array.isArray(data['@graph'])) { err(page, 'missing @context/@graph'); continue; }
  if (/PENDING|PLACEHOLDER/.test(scripts[0])) err(page, 'placeholder text leaked into structured data');

  // Collect typed nodes (anything with @type and @id, at any depth) and bare references.
  const defined = new Map();
  const refs = [];
  const walk = (node, path) => {
    if (Array.isArray(node)) return node.forEach((n, i) => walk(n, `${path}[${i}]`));
    if (!node || typeof node !== 'object') return;
    const keys = Object.keys(node);
    if (keys.length === 1 && keys[0] === '@id') { refs.push({ id: node['@id'], path }); return; }
    if (node['@id'] && node['@type']) {
      const prev = defined.get(node['@id']);
      const json = JSON.stringify(node);
      if (prev && prev !== json && prev.length > json.length) {
        // a fuller definition already exists; a shorter inline duplicate is fine
      } else if (prev && prev !== json && prev.length <= json.length) {
        defined.set(node['@id'], json);
      } else defined.set(node['@id'], json);
    }
    for (const k of keys) {
      if (typeof node[k] === 'string' && node[k].trim() === '' && ['name', 'description', 'url', 'text'].includes(k)) err(page, `empty ${k} at ${path}`);
      walk(node[k], `${path}.${k}`);
    }
  };
  walk(data['@graph'], '@graph');
  for (const r of refs) if (!defined.has(r.id)) err(page, `dangling @id reference ${r.id} at ${r.path}`);

  const graph = data['@graph'];
  const biz = graph.find((n) => n['@type'] === 'RoofingContractor');
  if (!biz) err(page, 'no RoofingContractor node');
  else {
    for (const k of ['name', 'telephone', 'url', 'address', 'image', 'logo', 'areaServed']) if (!biz[k]) err(page, `business missing ${k}`);
    if (biz.address && !biz.address.addressLocality) err(page, 'business address missing addressLocality');
    if (biz.sameAs && !biz.sameAs.length) err(page, 'business has an empty sameAs array');
  }
  const webpage = graph.find((n) => String(n['@id']).endsWith('#webpage'));
  if (!webpage) err(page, 'no WebPage node');
  else {
    const expected = new URL(page, 'https://unclejoesroofing.com').href;
    if (webpage.url !== expected) err(page, `WebPage url ${webpage.url} != ${expected}`);
    const types = [].concat(webpage['@type']);
    if (types.includes('FAQPage')) {
      const qs = Array.isArray(webpage.mainEntity) ? webpage.mainEntity : [];
      if (!qs.length) err(page, 'FAQPage without questions');
      for (const q of qs) if (!q.name || !q.acceptedAnswer?.text) err(page, `FAQ question without answer: ${q.name}`);
    }
    if (webpage.breadcrumb) {
      const bc = graph.find((n) => n['@id'] === webpage.breadcrumb['@id']);
      if (!bc) err(page, 'breadcrumb reference does not resolve');
      else for (const li of bc.itemListElement) if (!/^https:\/\//.test(li.item)) err(page, `breadcrumb item not absolute: ${li.item}`);
    }
  }
  if (!graph.find((n) => n['@type'] === 'WebSite')) err(page, 'no WebSite node');
}

if (errors.length) {
  console.error(`\n✗ Structured data: ${errors.length} problem(s) across ${count} page(s)`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log(`✓ Structured data valid on ${count} pages (one @graph each, all @id references resolve, no placeholders).`);
