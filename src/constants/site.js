// The public website. Set VITE_SITE_URL in the admin's Vercel project once the
// main domain is live; until then the current site is used.
export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://rajajinationalparkdemo.vercel.app").replace(/\/+$/, "");
