import { site, fullAddress } from '../config/site';

const townNames = ['Yardley', 'Lower Makefield Township', 'Newtown', 'Langhorne', 'Middletown Township'];

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
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    areaServed: townNames.map((name) => ({
      '@type': 'City',
      name: `${name}, PA`,
      containedInPlace: { '@type': 'AdministrativeArea', name: 'Bucks County, PA' },
    })),
    openingHoursSpecification: site.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.schemaDays,
      opens: h.opens,
      closes: h.closes,
    })),
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
