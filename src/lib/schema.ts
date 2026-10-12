/**
 * Structured data (JSON-LD) for every page, built from src/config/site.ts.
 *
 * Each page gets ONE <script type="application/ld+json"> holding a single @graph in which the
 * business, the website, the page, its breadcrumb, the owner and any page-level service all
 * reference each other by @id. Values still carrying a [… — PENDING] placeholder are left out,
 * so nothing unverified is ever published as fact. `npm run check:schema` validates the output.
 */
import { site, fullAddress, nearbyTowns, serviceAreas, owner } from '../config/site';
import { plainText } from './inline';

type County = 'Montgomery County' | 'Chester County';

/** Towns with their own page, the county each sits in, and its English Wikipedia article (for sameAs). */
export const towns: { slug: string; name: string; county: County; wiki: string }[] = [
  { slug: 'conshohocken', name: 'Conshohocken', county: 'Montgomery County', wiki: 'Conshohocken,_Pennsylvania' },
  { slug: 'blue-bell', name: 'Blue Bell', county: 'Montgomery County', wiki: 'Blue_Bell,_Pennsylvania' },
  { slug: 'malvern', name: 'Malvern', county: 'Chester County', wiki: 'Malvern,_Pennsylvania' },
  { slug: 'paoli', name: 'Paoli', county: 'Chester County', wiki: 'Paoli,_Pennsylvania' },
  { slug: 'west-conshohocken', name: 'West Conshohocken', county: 'Montgomery County', wiki: 'West_Conshohocken,_Pennsylvania' },
  { slug: 'plymouth-meeting', name: 'Plymouth Meeting', county: 'Montgomery County', wiki: 'Plymouth_Meeting,_Pennsylvania' },
  { slug: 'lafayette-hill', name: 'Lafayette Hill', county: 'Montgomery County', wiki: 'Lafayette_Hill,_Pennsylvania' },
  { slug: 'king-of-prussia', name: 'King of Prussia', county: 'Montgomery County', wiki: 'King_of_Prussia,_Pennsylvania' },
  { slug: 'ambler', name: 'Ambler', county: 'Montgomery County', wiki: 'Ambler,_Pennsylvania' },
];

/** Nearby towns without a page (from site.ts), with a county where it is unambiguous. Wayne spans three counties. */
const nearbyCounty: Record<string, County> = {
  Berwyn: 'Chester County',
  Devon: 'Chester County',
  Exton: 'Chester County',
  'Gulph Mills': 'Montgomery County',
  Norristown: 'Montgomery County',
  'Fort Washington': 'Montgomery County',
  Lansdale: 'Montgomery County',
};
const counties: { name: County; wiki: string }[] = [
  { name: 'Montgomery County', wiki: 'Montgomery_County,_Pennsylvania' },
  { name: 'Chester County', wiki: 'Chester_County,_Pennsylvania' },
];
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

/** The four services, in the order they appear on the site. */
const services = [
  {
    slug: 'roof-replacement',
    name: 'Roof Replacement',
    serviceType: 'Roof replacement',
    description: 'Full tear-off asphalt shingle roof replacement for homes in Montgomery and Chester County, PA.',
  },
  {
    slug: 'roof-repair',
    name: 'Roof Repair',
    serviceType: 'Roof repair',
    description: 'Roof leak repair, storm damage repair and emergency tarping for asphalt shingle roofs in Montgomery and Chester County, PA.',
  },
  {
    slug: 'free-roof-inspection',
    name: 'Free Roof Inspection',
    serviceType: 'Roof inspection',
    description: 'A free, no-obligation roof inspection with photos of what we find, for homes in Montgomery and Chester County, PA.',
  },
  {
    slug: 'solar-ready-roofs',
    name: 'Solar-Ready Roofs',
    serviceType: 'Solar-ready roof replacement',
    description: 'Asphalt shingle roof replacement prepared for future solar panels. Panels are installed by a solar company, not by us.',
  },
];

/** True for config values that still carry a placeholder; those are kept out of structured data. */
const pending = (v: string) => !v || /PENDING|PLACEHOLDER/.test(v);
const abs = (path: string) => new URL(path, site.url).href;

export const ids = {
  business: `${site.url}/#business`,
  website: `${site.url}/#website`,
  owner: `${site.url}/#owner`,
  logo: `${site.url}/#logo`,
  service: (slug: string) => `${abs(`/${slug}/`)}#service`,
  townService: (slug: string) => `${abs(`/service-areas/${slug}/`)}#service`,
  /** A town or county, by slug ("conshohocken", "montgomery-county"). */
  place: (slug: string) => `${site.url}/#place-${slug}`,
};

const WIKI = 'https://en.wikipedia.org/wiki/';

/**
 * One node per place the business serves: the two counties and every town, each with an @id so
 * areaServed, spatialCoverage and containedInPlace can reference them instead of repeating inline
 * copies. Wikipedia sameAs links are the standard "<Town>,_Pennsylvania" articles.
 */
export function placeNodes() {
  const countyNodes = counties.map((c) => ({
    '@type': 'AdministrativeArea',
    '@id': ids.place(slugify(c.name)),
    name: `${c.name}, PA`,
    alternateName: c.name,
    sameAs: WIKI + c.wiki,
    containedInPlace: { '@type': 'State', name: 'Pennsylvania' },
  }));
  const cityNode = (name: string, county?: County, wiki?: string) => ({
    '@type': 'City',
    '@id': ids.place(slugify(name)),
    name: `${name}, PA`,
    alternateName: name,
    ...(wiki ? { sameAs: WIKI + wiki } : {}),
    ...(county ? { containedInPlace: { '@id': ids.place(slugify(county)) } } : {}),
  });
  return [
    ...countyNodes,
    ...towns.map((t) => cityNode(t.name, t.county, t.wiki)),
    ...nearbyTowns.map((n) => cityNode(n, nearbyCounty[n])),
  ];
}

/** Everywhere the business works, as references to the place nodes above. */
export const areaServed = [
  ...towns.map((t) => ({ '@id': ids.place(t.slug) })),
  ...nearbyTowns.map((n) => ({ '@id': ids.place(slugify(n)) })),
  ...counties.map((c) => ({ '@id': ids.place(slugify(c.name)) })),
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
    url: abs('/'),
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
    contactPoint: [{ '@type': 'ContactPoint', telephone: site.phone.e164, contactType: 'customer service' }],
    logo: { '@id': ids.logo },
    /** Representative photos (not the logo, which is `logo`). Swap in real job photos when there are some. */
    image: [abs('/og/default.png'), abs('/people/joe-lesher.jpg')],
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'PA Home Improvement Contractor Registration',
      value: site.hicNumber,
    },
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'registration',
      name: `Pennsylvania Home Improvement Contractor Registration ${site.hicNumber}`,
      identifier: site.hicNumber,
      recognizedBy: { '@type': 'GovernmentOrganization', name: 'Pennsylvania Office of Attorney General' },
    },
    naics: '238160',
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
    },
    ...(social.length ? { sameAs: social } : {}),
    ...(site.social.googleBusinessProfile ? { hasMap: site.social.googleBusinessProfile } : {}),
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
    url: abs('/'),
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
  const town = towns.find((t) => opts.path === `/service-areas/${t.slug}/`);
  return {
    '@type': types.length === 1 ? types[0] : types,
    '@id': `${url}#webpage`,
    url,
    name: opts.title,
    description: opts.description,
    inLanguage: 'en-US',
    isPartOf: { '@id': ids.website },
    /** What the page is about: its Service when it has one, otherwise the business. */
    about: { '@id': opts.mainEntityId ?? ids.business },
    ...(town ? { spatialCoverage: { '@id': ids.place(town.slug) } } : {}),
    primaryImageOfPage: { '@type': 'ImageObject', url: abs(opts.ogImage), width: 1200, height: 630 },
    ...(opts.hasBreadcrumb ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
    ...(opts.type === 'CollectionPage'
      ? {
          hasPart: towns.map((t) => ({
            '@type': 'WebPage',
            '@id': `${abs(`/service-areas/${t.slug}/`)}#webpage`,
            url: abs(`/service-areas/${t.slug}/`),
            name: `Roofing in ${t.name}, PA`,
          })),
        }
      : {}),
    ...(opts.type === 'AboutPage' && !pending(site.ownerName) ? { mentions: { '@id': ids.owner } } : {}),
    ...(opts.faqs?.length
      ? {
          mainEntity: opts.faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: plainText(f.a) },
          })),
        }
      : opts.mainEntityId?.startsWith(url) // only when the Service belongs to this page (not /book/)
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
export function serviceNode(slug: string) {
  const s = services.find((x) => x.slug === slug);
  if (!s) throw new Error(`Unknown service "${slug}"`);
  const free = slug === 'free-roof-inspection';
  return {
    '@type': 'Service',
    '@id': ids.service(slug),
    name: s.name,
    serviceType: s.serviceType,
    description: s.description,
    url: abs(`/${slug}/`),
    mainEntityOfPage: abs(`/${slug}/`),
    provider: { '@id': ids.business },
    areaServed,
    ...(free
      ? { offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', url: abs('/book/'), description: 'Free roof inspection with photos' } }
      : {}),
  };
}

/** A town page's Service node: roofing services offered in that town. */
export function townServiceNode(slug: string) {
  const t = towns.find((x) => x.slug === slug);
  if (!t) throw new Error(`Unknown town "${slug}"`);
  return {
    '@type': 'Service',
    '@id': ids.townService(slug),
    name: `Roofing services in ${t.name}, PA`,
    serviceType: 'Roofing',
    description: `Asphalt shingle roof replacement, roof repair and free roof inspections for homes in ${t.name}, PA.`,
    url: abs(`/service-areas/${slug}/`),
    mainEntityOfPage: abs(`/service-areas/${slug}/`),
    provider: { '@id': ids.business },
    areaServed: { '@id': ids.place(slug) },
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
  const nodes: object[] = [businessNode(), logoNode(), websiteNode(), ...placeNodes()];
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
