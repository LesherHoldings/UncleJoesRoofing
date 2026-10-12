/**
 * Structured data (JSON-LD) for every page, built from src/config/site.ts.
 *
 * Each page gets ONE <script type="application/ld+json"> holding a single @graph in which the
 * business, the website, the page, its breadcrumb, the owner and any page-level service all
 * reference each other by @id. Values still carrying a [… — PENDING] placeholder are left out,
 * so nothing unverified is ever published as fact. `npm run check:schema` validates the output.
 */
import { site, fullAddress, nearbyTowns, serviceAreas, owner } from '../config/site';

/** Towns with their own page, and the county each sits in. */
export const towns: { slug: string; name: string; county: string }[] = [
  { slug: 'conshohocken', name: 'Conshohocken', county: 'Montgomery County' },
  { slug: 'blue-bell', name: 'Blue Bell', county: 'Montgomery County' },
  { slug: 'malvern', name: 'Malvern', county: 'Chester County' },
  { slug: 'paoli', name: 'Paoli', county: 'Chester County' },
];

/** The four services, in the order they appear on the site. */
const services = [
  { slug: 'roof-replacement', name: 'Roof Replacement', serviceType: 'Roof replacement' },
  { slug: 'roof-repair', name: 'Roof Repair', serviceType: 'Roof repair' },
  { slug: 'free-roof-inspection', name: 'Free Roof Inspection', serviceType: 'Roof inspection' },
  { slug: 'solar-ready-roofs', name: 'Solar-Ready Roofs', serviceType: 'Solar-ready roof replacement' },
];

/** True for config values that still carry a placeholder; those are kept out of structured data. */
const pending = (v: string) => /PENDING|PLACEHOLDER/.test(v);
const abs = (path: string) => new URL(path, site.url).href;

export const ids = {
  business: `${site.url}/#business`,
  website: `${site.url}/#website`,
  owner: `${site.url}/#owner`,
  logo: `${site.url}/#logo`,
  service: (slug: string) => `${abs(`/${slug}/`)}#service`,
  townService: (slug: string) => `${abs(`/service-areas/${slug}/`)}#service`,
};

const city = (name: string, county?: string) => ({
  '@type': 'City',
  name: `${name}, PA`,
  ...(county ? { containedInPlace: { '@type': 'AdministrativeArea', name: `${county}, PA` } } : {}),
});

/** Everywhere the business works, as schema.org places. */
export const areaServed = [
  ...towns.map((t) => city(t.name, t.county)),
  ...nearbyTowns.map((n) => city(n)),
  { '@type': 'AdministrativeArea', name: 'Montgomery County, PA' },
  { '@type': 'AdministrativeArea', name: 'Chester County, PA' },
];

/** The business itself (RoofingContractor is a LocalBusiness subtype). Same on every page. */
export function businessNode() {
  const social = Object.values(site.social).filter(Boolean);
  const hoursReady = !site.hours.some((h) => pending(h.label));
  return {
    '@type': 'RoofingContractor',
    '@id': ids.business,
    name: site.name,
    alternateName: "Uncle Joe's",
    legalName: site.legalName,
    slogan: site.tagline,
    description:
      'Veteran-owned, owner-led roofing company in Blue Bell, PA. Asphalt shingle roof replacement, roof repair and free roof inspections for Conshohocken, Blue Bell, Malvern, Paoli and nearby Montgomery and Chester County towns.',
    url: site.url,
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
    areaServed,
    ...(hoursReady
      ? {
          openingHoursSpecification: site.hours.map((h) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: h.schemaDays,
            opens: h.opens,
            closes: h.closes,
          })),
        }
      : {}),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: site.phone.e164,
        contactType: 'customer service',
        areaServed: 'US',
        availableLanguage: 'English',
      },
    ],
    logo: { '@id': ids.logo },
    image: [abs('/og/default.png')],
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'PA Home Improvement Contractor Registration',
      value: site.hicNumber,
    },
    naics: '238160',
    priceRange: '$$',
    ...(pending(site.ownerName) ? {} : { founder: { '@id': ids.owner } }),
    knowsAbout: ['Roof replacement', 'Roof repair', 'Roof inspection', 'Asphalt shingle roofing', 'Roof leak repair', 'Solar-ready roofing'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Roofing services',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', '@id': ids.service(s.slug), name: s.name, url: abs(`/${s.slug}/`) },
      })),
    },
    makesOffer: {
      '@type': 'Offer',
      name: 'Free roof inspection',
      description: 'A free, no-obligation roof inspection with photos of what we find.',
      price: '0',
      priceCurrency: 'USD',
      url: abs('/book/'),
      itemOffered: { '@id': ids.service('free-roof-inspection') },
      areaServed,
    },
    ...(social.length ? { sameAs: social } : {}),
  };
}

export function logoNode() {
  return {
    '@type': 'ImageObject',
    '@id': ids.logo,
    url: abs('/icon-512.png'),
    contentUrl: abs('/icon-512.png'),
    width: 512,
    height: 512,
    caption: `${site.name} logo`,
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': ids.website,
    name: site.name,
    url: site.url,
    inLanguage: 'en-US',
    publisher: { '@id': ids.business },
  };
}

/** The owner, only once a real name is in the config. */
export function ownerNode() {
  if (pending(site.ownerName)) return null;
  return {
    '@type': 'Person',
    '@id': ids.owner,
    name: site.ownerName,
    jobTitle: 'Owner',
    worksFor: { '@id': ids.business },
    description: 'U.S. Army veteran with more than ten years in home improvement, including six years owning and running a roofing company.',
    image: abs('/people/joe-lesher.jpg'),
    knowsAbout: ['Asphalt shingle roofing', 'Roof replacement', 'Roof repair'],
    homeLocation: { '@type': 'Place', name: 'Conshohocken, PA' },
    url: abs('/our-story/'),
  };
}

export type PageType = 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage';

export function webPageNode(opts: {
  path: string;
  title: string;
  description: string;
  ogImage: string;
  type?: PageType;
  faqs?: { q: string; a: string }[];
  mainEntityId?: string;
  hasBreadcrumb: boolean;
}) {
  const url = abs(opts.path);
  const types: string[] = [opts.type ?? 'WebPage'];
  if (opts.faqs?.length) types.push('FAQPage');
  return {
    '@type': types.length === 1 ? types[0] : types,
    '@id': `${url}#webpage`,
    url,
    name: opts.title,
    description: opts.description,
    inLanguage: 'en-US',
    isPartOf: { '@id': ids.website },
    about: { '@id': ids.business },
    primaryImageOfPage: { '@type': 'ImageObject', url: abs(opts.ogImage), width: 1200, height: 630 },
    ...(opts.hasBreadcrumb ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
    ...(opts.faqs?.length
      ? {
          mainEntity: opts.faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }
      : opts.mainEntityId
        ? { mainEntity: { '@id': opts.mainEntityId } }
        : opts.type === 'AboutPage'
          ? { mainEntity: { '@id': ids.business } }
          : {}),
  };
}

export function breadcrumbNode(path: string, items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${abs(path)}#breadcrumb`,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

/** A service page's Service node (roof replacement, repair, inspection, solar-ready). */
export function serviceNode(slug: string, description: string) {
  const s = services.find((x) => x.slug === slug);
  if (!s) throw new Error(`Unknown service "${slug}"`);
  const free = slug === 'free-roof-inspection';
  return {
    '@type': 'Service',
    '@id': ids.service(slug),
    name: s.name,
    serviceType: s.serviceType,
    description,
    url: abs(`/${slug}/`),
    provider: { '@id': ids.business },
    areaServed,
    ...(free
      ? { offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', url: abs('/book/'), description: 'Free roof inspection with photos' } }
      : {}),
  };
}

/** A town page's Service node: roofing services offered in that town. */
export function townServiceNode(slug: string, description: string) {
  const t = towns.find((x) => x.slug === slug);
  if (!t) throw new Error(`Unknown town "${slug}"`);
  return {
    '@type': 'Service',
    '@id': ids.townService(slug),
    name: `Roofing services in ${t.name}, PA`,
    serviceType: 'Roofing',
    description,
    url: abs(`/service-areas/${slug}/`),
    provider: { '@id': ids.business },
    areaServed: city(t.name, t.county),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `Roofing services in ${t.name}`,
      itemListElement: services.map((s) => ({ '@type': 'Offer', itemOffered: { '@id': ids.service(s.slug) } })),
    },
  };
}

/** Assemble the page graph. Extra nodes (Service etc.) come from the page. */
export function pageGraph(opts: {
  path: string;
  title: string;
  description: string;
  ogImage: string;
  type?: PageType;
  faqs?: { q: string; a: string }[];
  breadcrumbs?: { name: string; path: string }[];
  mainEntityId?: string;
  extra?: object[];
}) {
  const crumbs = opts.breadcrumbs?.length ? [{ name: 'Home', path: '/' }, ...opts.breadcrumbs] : null;
  const nodes: object[] = [businessNode(), logoNode(), websiteNode()];
  const o = ownerNode();
  if (o) nodes.push(o);
  nodes.push(
    webPageNode({
      path: opts.path,
      title: opts.title,
      description: opts.description,
      ogImage: opts.ogImage,
      type: opts.type,
      faqs: opts.faqs,
      mainEntityId: opts.mainEntityId,
      hasBreadcrumb: Boolean(crumbs),
    }),
  );
  if (crumbs) nodes.push(breadcrumbNode(opts.path, crumbs));
  for (const n of opts.extra ?? []) nodes.push(n);
  return { '@context': 'https://schema.org', '@graph': nodes };
}

export { fullAddress, serviceAreas, owner };
