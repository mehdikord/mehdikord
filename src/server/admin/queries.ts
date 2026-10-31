import "server-only";

import type {
  CategoryItem,
  ExperienceItem,
  Localized,
  Option,
  PrincipleItem,
  ProfileItem,
  ProjectItem,
  SkillGroupItem,
  StrengthItem,
} from "@/components/admin/types";
import { locales, type Locale } from "@/i18n/config";
import { jsonHeadline, jsonNotes, jsonStrings } from "@/lib/translations";
import { formatHeadline } from "@/server/admin/headline";
import { requireAdmin } from "@/server/auth";
import { db } from "@/server/db";

/**
 * Reads for the admin panel. Uncached on purpose: the panel always shows the
 * database as it is now. Each one verifies the session itself, so no caller
 * can read admin data without a signed-in administrator.
 */

const ordered = [{ sortOrder: "asc" as const }, { id: "asc" as const }];

/** Maps translation rows to a value per locale; missing locales get `empty`. */
function localized<R extends { locale: string }, T>(rows: readonly R[], map: (row: R) => T, empty: T): Localized<T> {
  return Object.fromEntries(
    locales.map((locale) => {
      const row = rows.find((candidate) => candidate.locale === locale);
      return [locale, row ? map(row) : empty];
    }),
  ) as Record<Locale, T>;
}

export async function getProfileItem(): Promise<ProfileItem | null> {
  await requireAdmin();
  const profile = await db.profile.findFirst({ include: { translations: true }, orderBy: { id: "asc" } });
  if (!profile) return null;

  return {
    initials: profile.initials,
    yearsOfExperience: profile.yearsOfExperience,
    isAvailable: profile.isAvailable,
    email: profile.email,
    phone: profile.phone,
    telegram: profile.telegram,
    linkedin: profile.linkedin,
    instagram: profile.instagram,
    heroVideoUrl: profile.heroVideoUrl,
    heroPosterUrl: profile.heroPosterUrl,
    primaryCtaHref: profile.primaryCtaHref,
    secondaryCtaHref: profile.secondaryCtaHref,
    text: localized(
      profile.translations,
      (row) => ({
        name: row.name,
        title: row.title,
        location: row.location,
        summary: row.summary,
        bio: jsonStrings(row.bio),
        availabilityLabel: row.availabilityLabel,
        heroHeadline: formatHeadline(jsonHeadline(row.heroHeadline)),
        heroDescription: row.heroDescription,
        primaryCtaLabel: row.primaryCtaLabel,
        secondaryCtaLabel: row.secondaryCtaLabel,
        signature: jsonStrings(row.signature),
      }),
      {
        name: "",
        title: "",
        location: "",
        summary: "",
        bio: [],
        availabilityLabel: "",
        heroHeadline: "",
        heroDescription: "",
        primaryCtaLabel: "",
        secondaryCtaLabel: "",
        signature: [],
      },
    ),
  };
}

export async function getPrincipleItems(): Promise<PrincipleItem[]> {
  await requireAdmin();
  const rows = await db.principle.findMany({ include: { translations: true }, orderBy: ordered });
  return rows.map((row) => ({
    id: row.id.toString(),
    sortOrder: row.sortOrder,
    text: localized(row.translations, (t) => ({ title: t.title, body: t.body }), { title: "", body: "" }),
  }));
}

export async function getStrengthItems(): Promise<StrengthItem[]> {
  await requireAdmin();
  const rows = await db.strength.findMany({ include: { translations: true }, orderBy: ordered });
  return rows.map((row) => ({
    id: row.id.toString(),
    icon: row.icon,
    sortOrder: row.sortOrder,
    text: localized(row.translations, (t) => ({ label: t.label }), { label: "" }),
  }));
}

export async function getCategoryItems(): Promise<CategoryItem[]> {
  await requireAdmin();
  const rows = await db.projectCategory.findMany({
    include: { translations: true, _count: { select: { projects: true } } },
    orderBy: ordered,
  });
  return rows.map((row) => ({
    id: row.id.toString(),
    slug: row.slug,
    sortOrder: row.sortOrder,
    projectCount: row._count.projects,
    text: localized(row.translations, (t) => ({ label: t.label }), { label: "" }),
  }));
}

export async function getCategoryOptions(): Promise<Option[]> {
  return (await getCategoryItems()).map((category) => ({
    value: category.id,
    label: category.text.fa.label || category.text.en.label || category.slug,
  }));
}

export async function getProjectItems(): Promise<ProjectItem[]> {
  await requireAdmin();
  const rows = await db.project.findMany({
    include: { translations: true, images: { orderBy: ordered } },
    orderBy: ordered,
  });
  return rows.map((row) => ({
    id: row.id.toString(),
    projectCategoryId: row.projectCategoryId.toString(),
    slug: row.slug,
    period: row.period,
    technologies: jsonStrings(row.technologies),
    liveUrl: row.liveUrl,
    isFeatured: row.isFeatured,
    caseStudyAvailable: row.caseStudyAvailable,
    sortOrder: row.sortOrder,
    images: row.images.map((image) => ({
      id: image.id.toString(),
      path: image.path,
      alt: image.alt,
      width: image.width,
      height: image.height,
      isCover: image.isCover,
    })),
    text: localized(
      row.translations,
      (t) => ({
        title: t.title,
        shortDescription: t.shortDescription,
        fullDescription: jsonStrings(t.fullDescription),
        role: t.role,
        highlights: jsonStrings(t.highlights),
        responsibilities: jsonStrings(t.responsibilities),
        caseStudyContext: t.caseStudyContext ?? "",
        caseStudyChallenges: jsonNotes(t.caseStudyChallenges),
        caseStudyDecisions: jsonNotes(t.caseStudyDecisions),
        caseStudyImplementation: jsonStrings(t.caseStudyImplementation),
      }),
      {
        title: "",
        shortDescription: "",
        fullDescription: [],
        role: "",
        highlights: [],
        responsibilities: [],
        caseStudyContext: "",
        caseStudyChallenges: [],
        caseStudyDecisions: [],
        caseStudyImplementation: [],
      },
    ),
  }));
}

export async function getExperienceItems(): Promise<ExperienceItem[]> {
  await requireAdmin();
  const rows = await db.experience.findMany({ include: { translations: true }, orderBy: ordered });
  return rows.map((row) => ({
    id: row.id.toString(),
    startMonth: row.startMonth,
    endMonth: row.endMonth ?? "",
    logoUrl: row.logoUrl,
    technologies: jsonStrings(row.technologies),
    sortOrder: row.sortOrder,
    text: localized(
      row.translations,
      (t) => ({
        company: t.company,
        companyContext: t.companyContext,
        position: t.position,
        location: t.location,
        description: t.description,
        responsibilities: jsonStrings(t.responsibilities),
      }),
      { company: "", companyContext: "", position: "", location: "", description: "", responsibilities: [] },
    ),
  }));
}

export async function getSkillGroupItems(): Promise<SkillGroupItem[]> {
  await requireAdmin();
  const rows = await db.skillGroup.findMany({ include: { translations: true }, orderBy: ordered });
  return rows.map((row) => ({
    id: row.id.toString(),
    sortOrder: row.sortOrder,
    text: localized(row.translations, (t) => ({ title: t.title, annotation: t.annotation, items: jsonStrings(t.items) }), {
      title: "",
      annotation: "",
      items: [],
    }),
  }));
}

export async function getDashboardCounts() {
  await requireAdmin();
  const [projects, featured, categories, experience, skillGroups, principles, strengths, images] = await Promise.all([
    db.project.count(),
    db.project.count({ where: { isFeatured: true } }),
    db.projectCategory.count(),
    db.experience.count(),
    db.skillGroup.count(),
    db.principle.count(),
    db.strength.count(),
    db.projectImage.count(),
  ]);
  return { projects, featured, categories, experience, skillGroups, principles, strengths, images };
}
