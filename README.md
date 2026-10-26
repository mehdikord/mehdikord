# Portfolio — Senior Backend Engineer (PHP & Laravel)

A cinematic, bilingual (English / فارسی) portfolio with an admin panel, built with Next.js 16 (App Router, Cache Components), React 19, TypeScript (strict), Tailwind CSS 4, Motion, MySQL and Prisma 7.

## Run it

Requires MySQL 8 and an empty database.

```bash
cp .env.example .env   # fill in DB_* and AUTH_SECRET (openssl rand -base64 32)
pnpm install           # also generates the Prisma client
pnpm db:migrate        # apply migrations (prisma migrate deploy)
pnpm db:seed           # admin user + the initial site content
pnpm dev               # http://localhost:3000
pnpm build && pnpm start   # production (the build reads content from the database)
pnpm check             # typecheck + lint + production build
```

`pnpm db:fresh` drops every table, re-runs the migrations and seeds again (like `migrate:fresh --seed`). `pnpm db:status` shows applied migrations.

Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://example.com`) before deploying so canonical URLs, Open Graph tags, `robots.txt` and `sitemap.xml` point at the real domain.

## Routes

Every page exists in both languages under a locale prefix: `/en/...` and `/fa/...`.

| Route | What it is |
| --- | --- |
| `/[lang]` | Hero, About, Selected Work (three featured projects), Expertise, Experience, Contact |
| `/[lang]/projects` | Full project index with category filters (`?category=saas`) |
| `/[lang]/projects/[slug]` | Case study, or project overview when no case study is published |
| `/administrator` | Admin panel (Persian, phone + password login at `/administrator/login`) |

Unprefixed URLs (`/`, `/projects`, …) are redirected by `src/proxy.ts`: an explicit choice from the header's language switcher (stored in the `NEXT_LOCALE` cookie) wins, then the browser's `Accept-Language`, then English. Unknown project slugs return a real 404.

## Content and the admin panel

All site content lives in MySQL and is edited at `/administrator`: profile and hero, engineering principles, key strengths, project categories, projects (with case studies and uploaded screenshots), experience and skill groups. Every entry is edited in both languages in one modal. Saving expires the cached public pages, so changes are live on the next visit.

- **Admin user.** `prisma/seeders/admin-user-seeder.ts` creates the administrator (re-running it resets that user's name and password).
- **Initial content.** `prisma/seeders/content-seeder.ts` imports the placeholder content in `prisma/seeders/data/`. Each part is skipped when its table already has rows, so seeding again never overwrites edits.
- **Project images.** Upload a screenshot in the project modal; it fills the same frames as before (cropped from the top, ideally 1600×1000 / 16:10). Without one, `public/images/project-placeholder.svg` is shown. Extra images go to the project page gallery via the “گالری” button.
- **Uploads** are stored in `storage/uploads/` (not committed) and served from `/uploads/...`. Back this folder up with the database.
- **Interface copy** (section titles, labels, calls to action) stays in code: `src/data/dictionaries/en.ts` and `fa.ts`.

### Database conventions

`prisma/schema.prisma` follows Laravel conventions: snake_case plural tables, `BIGINT UNSIGNED` ids and foreign keys, and `created_at` / `updated_at` on every table. Translatable entities have a `*_translations` table with one row per locale. Migrations in `prisma/migrations/` are one per table (`…_create_projects_table`). After changing the schema, run `pnpm prisma migrate dev --name <change>`.

### Adding another language

Add the code to `locales` in `src/i18n/config.ts` (with its direction and Intl tag) and add a dictionary in `src/data/dictionaries/`. The translation tables accept any locale code, but the admin actions and the seed data are currently written for `en` and `fa`, so extend those too.

## Architecture notes

- **Internationalisation.** `app/[lang]` is the root layout and sets `lang`/`dir` per language. Server Components read the locale with `getLocale()` (`next/root-params`); Client Components use `useLocale()`. Persian uses Vazirmatn, Persian digits and right-to-left layout through logical properties (`ps-`, `start-`, `border-s`, `rtl:` variants). Persian-specific typography rules (no letter-spacing, taller line-heights, a Persian replacement for the serif italic accent) are at the end of `globals.css`. The architecture diagram stays left-to-right in both languages.
- **Featured showcase.** On desktop, three projects sit in an expanding-panel rail (`FeaturedGallery`): hover, focus or click opens a panel. Each visual has a fixed width and is clipped by its panel, so expansion never re-lays out the preview. Small screens get a native swipeable card row.
- **Server components by default.** Client components are limited to motion wrappers (`src/components/motion`), the navbar and mobile menu, hero video, timeline progress, the project filter and the admin panel UI.
- **Data and caching.** Public reads (`src/lib/profile.ts`, `projects.ts`, `career.ts`) are `"use cache"` functions tagged per content area (`src/lib/content-tags.ts`), so pages prerender at build time. Admin Server Actions (`src/server/admin/actions/`) verify the session, validate with Zod and call `updateTag`. Admin auth is a signed, HTTP-only JWT cookie checked optimistically in `src/proxy.ts` and authoritatively in `src/server/auth.ts`.
- **Hero video.** The clip's last frame doesn't match its first, so two stacked `<video>` elements crossfade at the loop point (`src/hooks/use-crossfade-loop.ts`).
  - Playback is muted, inline and starts programmatically.
  - It pauses when the tab is hidden or the hero is off-screen, and is skipped entirely for `prefers-reduced-motion` and Data Saver.
  - Layers fall back in order: video → poster → pure-CSS globe artwork, so a media failure never shows a black screen.
- **Motion.** `LazyMotion` + `domAnimation` keeps the bundle small, and `MotionConfig reducedMotion="user"` honours the OS setting site-wide. Content stays visible without JavaScript via a `<noscript>` override.
- **No 3D library.** The supplied video already provides the globe, and the architecture diagram in About is a lightweight animated SVG. Three.js would add significant JavaScript without a matching gain.
