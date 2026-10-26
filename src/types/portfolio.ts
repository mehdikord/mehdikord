import type { strengthIcons } from "@/data/options";

/**
 * Content model for the portfolio. Personal and project content is stored in
 * the database (managed from the admin panel), read through `src/lib/*` and
 * typed here, so presentation components never hardcode copy.
 */

export interface LinkAction {
  label: string;
  href: string;
}

/** One visual line of the hero headline, split into wrap-safe segments. */
export interface HeadlineSegment {
  text: string;
  /** Renders in the editorial serif accent. */
  emphasis?: boolean;
}

export type HeadlineLine = readonly HeadlineSegment[];

/** Icon keys for key strengths; mapped to Lucide icons in `StrengthList`. */
export type StrengthIcon = (typeof strengthIcons)[number];

export interface Strength {
  icon: StrengthIcon;
  label: string;
}

export interface Principle {
  title: string;
  body: string;
}

/**
 * Contact values. Leave a value as an empty string when it is unknown — the
 * UI omits unset channels in production and flags them in development.
 */
export interface ContactDetails {
  /** e.g. "hello@example.com" */
  email: string;
  /** International format, e.g. "+44 20 7946 0000" */
  phone: string;
  /** Telegram username without "@", e.g. "username" */
  telegram: string;
  /** Full profile URL, e.g. "https://www.linkedin.com/in/username" */
  linkedin: string;
  /** Instagram username without "@", e.g. "username" */
  instagram: string;
}

export interface Profile {
  name: string;
  /** Used for the wordmark monogram. */
  initials: string;
  title: string;
  location: string;
  /** One-sentence positioning used in metadata and the footer. */
  summary: string;
  /** Lead paragraph followed by supporting paragraphs. */
  bio: readonly string[];
  philosophy: readonly Principle[];
  strengths: readonly Strength[];
  yearsOfExperience: number;
  availability: {
    available: boolean;
    label: string;
  };
  hero: {
    headline: readonly HeadlineLine[];
    description: string;
    primaryCta: LinkAction;
    secondaryCta: LinkAction;
    signature: readonly string[];
    /** Background video and its poster. Empty strings fall back to CSS artwork. */
    media: { video: string; poster: string };
  };
  contact: ContactDetails;
}

export interface SiteConfig {
  /** Absolute production URL, used for canonical URLs, sitemap and OG tags. */
  url: string;
}

/* ── Projects ───────────────────────────────────────────────────────────── */

/** Category slug, e.g. "crm". Categories are managed in the admin panel. */
export type ProjectCategoryId = string;

export interface ProjectCategory {
  id: ProjectCategoryId;
  label: string;
}

/** Localised project text; everything else is shared across languages. */
export type ProjectTranslation = Pick<
  Project,
  "shortDescription" | "fullDescription" | "role" | "highlights" | "responsibilities"
> & {
  /** Only when the product name itself differs by language. */
  title?: string;
  caseStudy?: CaseStudy;
};

/** A real screenshot uploaded from the admin panel. */
export interface ProjectImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface CaseStudyNote {
  title: string;
  detail: string;
}

export interface CaseStudy {
  /** Industry and product context. */
  context: string;
  challenges: readonly CaseStudyNote[];
  decisions: readonly CaseStudyNote[];
  implementation?: readonly string[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  /** One or more paragraphs. */
  fullDescription: readonly string[];
  category: ProjectCategoryId;
  /** Category name in the current language. */
  categoryLabel: string;
  role: string;
  /** Display period, e.g. "2024" or "2022 — 2023". */
  period: string;
  technologies: readonly string[];
  /** Public URL of the live product. Empty string when not public. */
  liveUrl: string;
  featured: boolean;
  /** Uploaded cover screenshot. `null` falls back to the default website image. */
  coverImage: ProjectImage | null;
  gallery: readonly ProjectImage[];
  highlights: readonly string[];
  responsibilities: readonly string[];
  caseStudyAvailable: boolean;
  caseStudy?: CaseStudy;
}

/* ── Experience & skills ────────────────────────────────────────────────── */

export interface ExperienceEntry {
  id: string;
  company: string;
  /** Short descriptor shown beside the company, e.g. "B2B SaaS". */
  companyContext?: string;
  position: string;
  /** "YYYY-MM" */
  start: string;
  /** "YYYY-MM", or `null` for a current role. */
  end: string | null;
  location?: string;
  description: string;
  responsibilities: readonly string[];
  technologies: readonly string[];
}

export interface SkillGroup {
  id: string;
  title: string;
  annotation: string;
  items: readonly string[];
}

export type ExperienceTranslation = Pick<
  ExperienceEntry,
  "company" | "companyContext" | "position" | "location" | "description" | "responsibilities"
>;

export type SkillGroupTranslation = Pick<SkillGroup, "title" | "annotation" | "items">;
