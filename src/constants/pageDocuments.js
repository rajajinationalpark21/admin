// Every website page whose client document, header and SEO settings are edited
// in the "Page Documents" editor. `fields` maps each editable setting to the
// field of the CMS section that stores it; unlisted settings use their own name.

const HUB_FIELDS = {
  title: null, subtitle: null, heroBanner: "hubHeroBanner", heroImages: "hubHeroImages",
  docTitle: "hubDocTitle", docBlocks: "hubDocBlocks", slug: "hubSlug",
  seoTitle: "hubSeoTitle", metaDescription: "hubMetaDescription", keywords: "hubKeywords",
  heroImageAlt: null, galleryTitle: null, galleryImages: "hubGalleryImages",
};
const HOME_FIELDS = { title: "heroTitle", subtitle: "heroSubtitle", docTitle: null, docBlocks: null, slug: null };
const ZONE_FIELDS = { title: "name", subtitle: "tag", heroBanner: "heroImage" };

export const PAGE_DOCUMENTS = [
  { id: "home", group: "Home", label: "Home page", section: "home", fields: HOME_FIELDS, path: "/" },
  { id: "about", group: "Home", label: "About Rajaji (About page document)", section: "about", path: "/about" },
  { id: "tickets", group: "Tickets", label: "Tickets, Entry Fees & Safari Charges", section: "tickets" },
  { id: "terms", group: "Tickets", label: "Terms & Conditions", section: "parkRules" },
  { id: "zones", group: "Safari Zones", label: "Safari Zones overview", section: "safari", fields: { docTitle: null, docBlocks: null } },
  // One entry per zone is added from the CMS (see zonePages below).
  { id: "activities", group: "Activities", label: "Activities overview", section: "activities" },
  { id: "jeepSafari", group: "Activities", label: "Jungle Safari / Jeep Safari", section: "jeepSafari" },
  { id: "birdWatching", group: "Activities", label: "Bird Watching", section: "birdWatching" },
  { id: "stay", group: "Activities", label: "Stay in Rajaji", section: "stay" },
  { id: "rafting", group: "Activities", label: "Rafting", section: "rafting" },
  { id: "trekking", group: "Activities", label: "Trekking in Rajaji", section: "trekking" },
  { id: "wildlife", group: "Wildlife", label: "Wildlife & Biodiversity (main page)", section: "fauna", fields: HUB_FIELDS },
  { id: "mammals", group: "Wildlife", label: "Mammals of Rajaji", section: "fauna" },
  { id: "birds", group: "Wildlife", label: "Birds of Rajaji", section: "birds" },
  { id: "butterflies", group: "Wildlife", label: "Butterflies of Rajaji", section: "butterflies" },
  { id: "reptiles", group: "Wildlife", label: "Reptiles of Rajaji", section: "reptiles" },
  { id: "flora", group: "Wildlife", label: "Flora of Rajaji", section: "flora" },
  {
    id: "howToReach", group: "Visitor information", label: "How to Reach", section: "howToReach",
    images: [{ key: "mapImage", altKey: "mapImageAlt", label: "Route map (shown above the directions)" }],
  },
  { id: "booking", group: "Visitor information", label: "Book Now", section: "booking", fields: { title: "heroTitle", subtitle: "heroSubtitle" } },
  { id: "faqs", group: "Visitor information", label: "FAQ", section: "faqs" },
];

export const FIELD_NAMES = [
  "title", "subtitle", "heroBanner", "heroImages", "docTitle", "docBlocks", "slug",
  "seoTitle", "metaDescription", "keywords", "heroImageAlt", "galleryTitle", "galleryImages",
];

/** The section field for each setting; null means the page has no such setting. */
export function fieldKeys(page) {
  const overrides = page.fields || {};
  return Object.fromEntries(FIELD_NAMES.map((name) => [name, name in overrides ? overrides[name] : name]));
}

/** One page per safari zone, in the zones' order. */
export function zonePages(zones) {
  return (zones || []).map((zone, index) => ({
    id: `zone:${zone.slug}`,
    group: "Safari Zones",
    label: zone.name || zone.slug,
    section: "safari",
    zoneIndex: index,
    fields: ZONE_FIELDS,
  }));
}
