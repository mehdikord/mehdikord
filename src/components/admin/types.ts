import type { Locale } from "@/i18n/config";
import type { CaseStudyNote } from "@/types/portfolio";

/** Records as the admin forms edit them: ids as strings, text per locale. */

export type Localized<T> = Record<Locale, T>;

export interface ProfileItem {
  initials: string;
  yearsOfExperience: number;
  isAvailable: boolean;
  email: string;
  phone: string;
  telegram: string;
  linkedin: string;
  instagram: string;
  heroVideoUrl: string;
  heroPosterUrl: string;
  primaryCtaHref: string;
  secondaryCtaHref: string;
  text: Localized<{
    name: string;
    title: string;
    location: string;
    summary: string;
    bio: string[];
    availabilityLabel: string;
    /** In admin notation, see `parseHeadline`. */
    heroHeadline: string;
    heroDescription: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    signature: string[];
  }>;
}

export interface PrincipleItem {
  id: string;
  sortOrder: number;
  text: Localized<{ title: string; body: string }>;
}

export interface StrengthItem {
  id: string;
  icon: string;
  sortOrder: number;
  text: Localized<{ label: string }>;
}

export interface CategoryItem {
  id: string;
  slug: string;
  sortOrder: number;
  projectCount: number;
  text: Localized<{ label: string }>;
}

export interface ProjectImageItem {
  id: string;
  path: string;
  alt: string;
  width: number;
  height: number;
  isCover: boolean;
}

export interface ProjectItem {
  id: string;
  projectCategoryId: string;
  slug: string;
  period: string;
  technologies: string[];
  liveUrl: string;
  isFeatured: boolean;
  caseStudyAvailable: boolean;
  sortOrder: number;
  images: ProjectImageItem[];
  text: Localized<{
    title: string;
    shortDescription: string;
    fullDescription: string[];
    role: string;
    highlights: string[];
    responsibilities: string[];
    caseStudyContext: string;
    caseStudyChallenges: CaseStudyNote[];
    caseStudyDecisions: CaseStudyNote[];
    caseStudyImplementation: string[];
  }>;
}

export interface ExperienceItem {
  id: string;
  startMonth: string;
  endMonth: string;
  /** "/uploads/..." or "" when no logo has been uploaded. */
  logoUrl: string;
  technologies: string[];
  sortOrder: number;
  text: Localized<{
    company: string;
    companyContext: string;
    position: string;
    location: string;
    description: string;
    responsibilities: string[];
  }>;
}

export interface SkillGroupItem {
  id: string;
  sortOrder: number;
  text: Localized<{ title: string; annotation: string; items: string[] }>;
}

export interface Option {
  value: string;
  label: string;
}
