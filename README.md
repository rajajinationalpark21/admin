# Jungle Safari — Admin Panel

React 18 + MUI admin panel for the Rajaji National Park safari website. It edits every page's content and SEO, manages blogs, bookings, inquiries and reviews, and handles admin accounts. Everything is saved through the backend API (`../backend`).

## Run locally

```bash
npm install
cp .env.example .env    # VITE_API_BASE=http://localhost:4000/api
npm run dev             # http://127.0.0.1:5173
```

## Environment variables

| Variable | Purpose |
|---|---|
| `VITE_API_BASE` | Backend API base URL. If unset, the code falls back to the production API, so set it for local work |
| `VITE_SITE_URL` | Public website address for the "View page" button (defaults to the current Vercel site) |

## Scripts

`npm run dev` · `npm run build` · `npm run lint` (ESLint, zero warnings allowed) · `npm run preview`

## Where things are edited

| Sidebar | What it edits |
|---|---|
| 1–10 page editors | Page-specific fields (zones, fees, rules, FAQ, …) |
| 11. Page Documents & SEO | Each page's heading, client document (block editor), photo gallery, URL and SEO |
| Bookings / Inquiries / Blog / Reviews | Operational data |
| Settings → Website Details | Contact details, social links, footer, booking wording, site menu |
| Settings → Manage Users | Admin accounts. Only the panel **owner** can add, remove or promote admins |
| Settings → Activity Log | Who changed what (owner only) |

How saving works (`components/content/useSectionContent.js`):
- **Only changes are sent.** Save posts just the fields you changed, and the server merges them into the section.
- **A failed load blocks saving.** If a page's content didn't load, Save stays off until you reload, so live content can't be overwritten with blanks.
- **Cleared fields stay cleared.** They don't refill with default text.

## Layout

```
src/
  pages/                    route screens; pageEditors/ for website pages
  components/content/       shared editor parts (useSectionContent, DocBlocksEditor, SeoFields, NavigationEditor, ActivityLog)
  components/common/        layout (Sidebar, Header, BottomNav), image upload fields
  constants/                endpoints, pageDocuments (which page uses which CMS fields)
  api/apiClient.js          axios with the admin token
```

## Deploy

Vercel builds `npm run build` from `main`. `vercel.json` adds security headers: the panel can't be embedded in another site.
