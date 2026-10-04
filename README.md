# Dunna Nitin, portfolio

Personal site for Dunna Nitin, a backend-focused full-stack engineer. It is built to serve four kinds of visitor at once:

| Visitor | Path through the site |
| --- | --- |
| Recruiter | Home → **Résumé** (`/resume`): one page, PDF download, print-ready |
| Engineering manager | Home → **case studies** (`/work/*`): interactive architecture, decisions, stack, source links |
| Founder or client | Home → **Build with me** (`/build`) → **Contact** (`/contact?intent=project`) |
| Developer | The case-study interactives, this repository, and the site's own performance and accessibility |

## Stack

- **Next.js 16** (App Router, React 19, Turbopack), **TypeScript** in strict mode
- **Tailwind CSS 4**, configured CSS-first in `src/app/globals.css` (tokens, type scale, motion, print rules)
- **Zod 4**: one schema validates the contact form in the browser and in the route handler
- **Vitest** for unit tests
- No UI kit, no animation library, no analytics, no cookies. Fonts are self-hosted through `next/font`.

## Project structure

```
src/
  app/                      routes (all static except /contact and /api/contact)
    page.tsx                home
    work/[slug]/            case studies + per-project Open Graph images
    build/                  for founders and clients
    resume/                 recruiter one-pager (prints cleanly)
    contact/                intent-aware enquiry form
    api/contact/route.ts    validation, honeypot, rate limit, Resend delivery
    opengraph-image.tsx     generated social card
    sitemap.ts, robots.ts, icon.svg, not-found.tsx
  content/                  ← all claims live here; edit data, not components
    profile.ts              contact details, skills, education, certificates, achievements
    projects.ts             case-study content and résumé bullets
    lifecycle.ts            the hero's "schema to deploy" rail
  components/
    home/                   hero, lifecycle rail, audience paths, work, about, CTA
    diagrams/               interactive and static system diagrams
    work/                   case-study navigation and metric rows
    contact/                contact form
    site/                   header, footer, theme toggle
    ui/                     icons, segmented control, copy-email, print button
  lib/
    contact-schema.ts       shared validation + email formatting (tested)
    image-metrics.ts        Laplacian variance, Immerkær noise, Gaussian blur (tested)
    hooks.ts                reduced-motion and step-sequencer hooks
```

## Editing content

Everything the site claims comes from the résumé and lives in `src/content`. To update:

- **New project:** add an entry to `projects.ts`. Set `tier: "flagship"` to feature it on the home page. `brief` holds the three short lines (problem, approach, outcome) shown on the home page; `problem` and `approach` are the longer case-study versions. To give it an interactive section, add a component under `components/diagrams` and register it in `deepDives` in `src/app/work/[slug]/page.tsx`.
- **Writing rule:** every claim must be backed by the résumé. Say what was built; don't invent why. Label diagrams that simplify as simplified, and keep a number's qualifier next to it wherever it appears.
- **Live demo:** set `liveUrl` on the project; the case-study header picks it up.
- **New skill:** add it to `skills` in `profile.ts`. If a project proves it, add a `proof` line to the matching stage in `lifecycle.ts`.
- **Résumé PDF:** replace `public/Dunna-Nitin-Resume.pdf` (keep the filename, or update `profile.resumePdf`).
- **Phone number:** it is kept in `profile.ts` but not shown (`showPhone: false`) to avoid scraping. It is still in the PDF.

## Running locally

```bash
npm install
npm run dev
```

Full check (typecheck, lint, tests, production build):

```bash
npm run check
```

## Contact form delivery

The form posts to `/api/contact`, which checks, in order: same origin, body size, honeypot, a per-IP rate limit (5 per 10 minutes), the shared Zod schema, and a minimum fill time. It then sends through [Resend](https://resend.com).

Copy `.env.example` to `.env.local` and set:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin, used for metadata, sitemap and Open Graph |
| `RESEND_API_KEY` | Resend API key |
| `CONTACT_TO_EMAIL` | Where enquiries arrive |
| `CONTACT_FROM_EMAIL` | Sender on a domain verified in Resend |

Without these, the endpoint answers `503 not_configured` and the form offers to open a pre-filled email instead. Nothing the visitor typed is lost.

## Deploying

Built for Vercel (zero config). Set the environment variables above in the project settings. Any Node 20.9+ host works with `npm run build && npm start`.

The rate limiter is in memory, so on a multi-instance deployment each instance counts separately. Swap in a shared store if that ever matters.

## Quality bar

- Accessibility: semantic landmarks, one `h1` per page, a skip link, visible focus, an ARIA tab pattern on the lifecycle rail, native radios behind every segmented control, labelled form fields with associated errors, and live regions for diagram outcomes.
- Motion: one orchestrated moment on load (the lifecycle rail). Everything else responds to the visitor. `prefers-reduced-motion` turns animation off globally, and the diagram stepper jumps to the result.
- Security headers, including a production Content-Security-Policy, in `next.config.ts`.
- Light and dark themes from one token set, with no flash on load.
