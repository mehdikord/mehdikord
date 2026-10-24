# Portfolio — Senior Backend Engineer (PHP & Laravel)

A cinematic, frontend-only portfolio built with Next.js 16 (App Router, Cache Components), React 19, TypeScript (strict), Tailwind CSS 4 and Motion.

## Run it

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build && pnpm start   # production
pnpm check        # typecheck + lint + production build
```

Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://example.com`) before deploying so canonical URLs, Open Graph tags, `robots.txt` and `sitemap.xml` point at the real domain.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Hero, About, Selected Work, Expertise, Experience, Contact |
| `/projects` | Full project index with category filters (`?category=saas`) |
| `/projects/[slug]` | Case study, or project overview when no case study is published |

## Replacing the mock content

All content is centralised in `src/data/` and typed in `src/types/portfolio.ts`. Components never hardcode personal data.

1. **Profile & contact — `src/data/profile.ts`.**
   Name, initials (wordmark), title, bio, philosophy, strengths, years of experience, availability and hero copy.
   Contact values start empty. Fill in `email`, `phone`, `telegram` (username), `linkedin` (full URL) and `instagram` (username).
   Unset channels show as dashed "Not configured" rows in development and are omitted in production. Valid values become `mailto:`, `tel:` or external links automatically.
2. **Projects — `src/data/projects.ts`.**
   Every project is a fictional placeholder; replace or remove freely. Array order is display order, and `featured: true` puts a project on the homepage, where the first eight get the editorial layouts.
   - `liveUrl`: leave `""` when the product isn't public, and the live link is hidden.
   - `coverImage` / `gallery`: put screenshots in `public/projects/<slug>/` and reference them with `width`/`height`. Without a cover, an original illustrative interface preview (`preview.kind`, `preview.accent`) is shown and labelled "Illustrative preview".
   - `caseStudyAvailable: true` plus a `caseStudy` object renders the full case-study template. Otherwise the page shows an honest overview.
   - Slugs, ids, categories and URLs are validated at build time (`src/lib/projects.ts`).
3. **Experience — `src/data/experience.ts`.** Company names are placeholders describing the kind of organisation. Dates use `YYYY-MM`, and `end: null` marks the current role.
4. **Skills — `src/data/skills.ts`.** Grouped capabilities, without proficiency scores.
5. **Interface copy — `src/data/content.ts`.** Section titles, labels and calls to action. Swap this module to localise (e.g. to Persian).
6. **Hero media — `src/data/media.ts`.** The supplied video and poster URLs.

## Architecture notes

- **Server components by default.** Client components are limited to motion wrappers (`src/components/motion`), the navbar and mobile menu, hero video, timeline progress and the project filter.
- **Hero video.** The clip's last frame doesn't match its first, so two stacked `<video>` elements crossfade at the loop point (`src/hooks/use-crossfade-loop.ts`).
  - Playback is muted, inline and starts programmatically.
  - It pauses when the tab is hidden or the hero is off-screen, and is skipped entirely for `prefers-reduced-motion` and Data Saver.
  - Layers fall back in order: video → poster → pure-CSS globe artwork, so a media failure never shows a black screen.
- **Motion.** `LazyMotion` + `domAnimation` keeps the bundle small, and `MotionConfig reducedMotion="user"` honours the OS setting site-wide. Content stays visible without JavaScript via a `<noscript>` override.
- **No 3D library.** The supplied video already provides the globe, and the architecture diagram in About is a lightweight animated SVG. Three.js would add significant JavaScript without a matching gain.
