# poolbar

A members' club where work meets water — heated pool, full kitchen, long bar, and the desk you actually want to sit at.

This repo is the marketing landing page. Next.js 16 App Router + Tailwind v4 + a server-action membership inquiry form.

## Develop

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

## Deploy

The site is set up for Vercel out of the box. Either:

- Push to GitHub and connect via the Vercel dashboard, or
- `vercel deploy` from the project root.

## Structure

- `app/page.tsx` — the landing page
- `app/inquire-form.tsx` — client component for the membership inquiry form
- `app/actions.ts` — server action handling the inquiry submission (currently logs to console; wire to Resend/Postmark/DB to make it real)
- `app/globals.css` — brand tokens and bespoke component styles
- `app/layout.tsx` — fonts (Anton / DM Sans / JetBrains Mono) and metadata
- `public/photo-hero.jpg` — hero photograph

## Brand

| Token | Hex |
|---|---|
| pool | `#1b6ba0` |
| pool-light | `#4a9dc9` |
| chrome | `#f2c744` |
| beige | `#e8d9bc` |
| teal | `#0c3a4f` |
| cream | `#faf3e3` |
| ink | `#0a0a0a` |

Display type: **Anton** (Druk Wide adjacent, free on Google Fonts).
Body: **DM Sans**. Meta strip: **JetBrains Mono**.

## To do

- Wire `inquireMembership` server action to a real email or storage backend.
- Replace `photo-hero.jpg` with custom photography or AI-generated Slim Aarons-style pool imagery.
- Add per-pillar photography (work / eat / drink / swim) as background imagery on the colored cards.
- Add a real favicon and `apple-touch-icon.png`.
- Add a sitemap and `robots.txt` once the public URL is decided.
