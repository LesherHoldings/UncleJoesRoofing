import { site, fullAddress, nearbyTowns } from '../config/site';

/** Towns with their own page, and the county each sits in. */
const towns: { name: string; county: string }[] = [
  { name: 'Conshohocken', county: 'Montgomery County' },
  { name: 'Blue Bell', county: 'Montgomery County' },
  { name: 'Malvern', county: 'Chester County' },
  { name: 'Paoli', county: 'Chester County' },
];
const townNames = [...towns.map((t) => t.name), ...nearbyTowns];

/** True for config values that still carry a [… — PENDING] placeholder; those are kept out of structured data. */
const pending = (v: string) => /PENDING|PLACEHOLDER/.test(v);

/** RoofingContractor JSON-LD, built entirely from src/config/site.ts. */
export function businessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RoofingContractor',
    '@id': `${site.url}/#business`,
    name: site.name,
    legalName: site.legalName,
    slogan: site.tagline,
    url: site.url,
    logo: `${site.url}/icon-512.png`,
    image: `${site.url}/og/default.png`,
    telephone: site.phone.e164,
    ...(pending(site.email) ? {} : { email: site.email }),
    address: {
      '@type': 'PostalAddress',
      ...(pending(site.address.street) ? {} : { streetAddress: site.address.street }),
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    ...(site.geo ? { geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng } } : {}),
    areaServed: [
      ...towns.map((t) => ({
        '@type': 'City',
        name: `${t.name}, PA`,
        containedInPlace: { '@type': 'AdministrativeArea', name: `${t.county}, PA` },
      })),
      ...nearbyTowns.map((name) => ({ '@type': 'City', name: `${name}, PA` })),
      { '@type': 'AdministrativeArea', name: 'Montgomery County, PA' },
      { '@type': 'AdministrativeArea', name: 'Chester County, PA' },
    ],
    // Hours are published only once the stand-in labels are replaced (see README → Placeholders).
    ...(site.hours.some((h) => pending(h.label)) ? {} : { openingHoursSpecification: site.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.schemaDays,
      opens: h.opens,
      closes: h.closes,
    })) }),
    priceRange: '$$',
    knowsAbout: ['Roof replacement', 'Roof repair', 'Roof inspection', 'Asphalt shingle roofing', 'Solar-ready roofing'],
    sameAs: Object.values(site.social).filter(Boolean),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: new URL(item.path, site.url).href,
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function serviceSchema(name: string, description: string, path: string, areaName?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: name,
    name,
    description,
    url: new URL(path, site.url).href,
    provider: { '@id': `${site.url}/#business` },
    areaServed: areaName
      ? { '@type': 'City', name: `${areaName}, PA` }
      : townNames.map((n) => ({ '@type': 'City', name: `${n}, PA` })),
  };
}

export { fullAddress };
