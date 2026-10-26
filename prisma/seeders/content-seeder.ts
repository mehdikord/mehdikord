import type { PrismaClient } from "@/generated/prisma/client";
import { locales, type Locale } from "@/i18n/config";

import { experienceFa } from "./data/experience.fa";
import { experience } from "./data/experience";
import { profiles } from "./data/profile";
import { projectsFa } from "./data/projects.fa";
import { projectCategories, projects } from "./data/projects";
import { skillsFa } from "./data/skills.fa";
import { skillGroups } from "./data/skills";

function translation<T>(translations: Record<string, T>, id: string, label: string): T {
  const value = translations[id];
  if (!value) throw new Error(`${label} "${id}" is missing its Persian translation`);
  return value;
}

/** One translation row per locale, built from a function of the locale. */
function perLocale<T>(build: (locale: Locale) => T): { create: (T & { locale: Locale })[] } {
  return { create: locales.map((locale) => ({ locale, ...build(locale) })) };
}

async function seedProfile(db: PrismaClient) {
  const { en } = profiles;
  await db.profile.create({
    data: {
      initials: en.initials,
      yearsOfExperience: en.yearsOfExperience,
      isAvailable: en.availability.available,
      ...en.contact,
      heroVideoUrl: en.hero.media.video,
      heroPosterUrl: en.hero.media.poster,
      primaryCtaHref: en.hero.primaryCta.href,
      secondaryCtaHref: en.hero.secondaryCta.href,
      translations: perLocale((locale) => {
        const profile = profiles[locale];
        return {
          name: profile.name,
          title: profile.title,
          location: profile.location,
          summary: profile.summary,
          bio: [...profile.bio],
          availabilityLabel: profile.availability.label,
          heroHeadline: profile.hero.headline.map((line) => line.map((segment) => ({ ...segment }))),
          heroDescription: profile.hero.description,
          primaryCtaLabel: profile.hero.primaryCta.label,
          secondaryCtaLabel: profile.hero.secondaryCta.label,
          signature: [...profile.hero.signature],
        };
      }),
    },
  });

  for (const [index, principle] of profiles.en.philosophy.entries()) {
    await db.principle.create({
      data: {
        sortOrder: index + 1,
        translations: perLocale((locale) => {
          const text = profiles[locale].philosophy[index] ?? principle;
          return { title: text.title, body: text.body };
        }),
      },
    });
  }

  for (const [index, strength] of profiles.en.strengths.entries()) {
    await db.strength.create({
      data: {
        icon: strength.icon,
        sortOrder: index + 1,
        translations: perLocale((locale) => ({ label: (profiles[locale].strengths[index] ?? strength).label })),
      },
    });
  }
}

async function seedProjects(db: PrismaClient) {
  const categoryIds = new Map<string, bigint>();
  for (const [index, category] of projectCategories.entries()) {
    const row = await db.projectCategory.create({
      data: {
        slug: category.id,
        sortOrder: index + 1,
        translations: perLocale((locale) => ({ label: category.label[locale] })),
      },
    });
    categoryIds.set(category.id, row.id);
  }

  for (const [index, project] of projects.entries()) {
    const categoryId = categoryIds.get(project.category);
    if (!categoryId) throw new Error(`Project "${project.slug}" uses unknown category "${project.category}"`);
    const fa = translation(projectsFa, project.id, "Project");

    await db.project.create({
      data: {
        projectCategoryId: categoryId,
        slug: project.slug,
        period: project.period,
        technologies: [...project.technologies],
        liveUrl: project.liveUrl,
        isFeatured: project.featured,
        caseStudyAvailable: project.caseStudyAvailable,
        sortOrder: index + 1,
        translations: perLocale((locale) => {
          const text = locale === "fa" ? { ...project, ...fa, title: fa.title ?? project.title } : project;
          const study = project.caseStudy ? (locale === "fa" ? (fa.caseStudy ?? project.caseStudy) : project.caseStudy) : null;
          return {
            title: text.title,
            shortDescription: text.shortDescription,
            fullDescription: [...text.fullDescription],
            role: text.role,
            highlights: [...text.highlights],
            responsibilities: [...text.responsibilities],
            caseStudyContext: study?.context ?? null,
            caseStudyChallenges: study ? study.challenges.map((note) => ({ ...note })) : undefined,
            caseStudyDecisions: study ? study.decisions.map((note) => ({ ...note })) : undefined,
            caseStudyImplementation: study?.implementation ? [...study.implementation] : undefined,
          };
        }),
      },
    });
  }
}

async function seedCareer(db: PrismaClient) {
  for (const [index, entry] of experience.entries()) {
    const fa = translation(experienceFa, entry.id, "Experience entry");
    await db.experience.create({
      data: {
        startMonth: entry.start,
        endMonth: entry.end,
        technologies: [...entry.technologies],
        sortOrder: index + 1,
        translations: perLocale((locale) => {
          const text = locale === "fa" ? { ...entry, ...fa } : entry;
          return {
            company: text.company,
            companyContext: text.companyContext ?? "",
            position: text.position,
            location: text.location ?? "",
            description: text.description,
            responsibilities: [...text.responsibilities],
          };
        }),
      },
    });
  }

  for (const [index, group] of skillGroups.entries()) {
    const fa = translation(skillsFa, group.id, "Skill group");
    await db.skillGroup.create({
      data: {
        sortOrder: index + 1,
        translations: perLocale((locale) => {
          const text = locale === "fa" ? fa : group;
          return { title: text.title, annotation: text.annotation, items: [...text.items] };
        }),
      },
    });
  }
}

/**
 * Seeds the initial site content. Each part is skipped when its table already
 * has rows, so running the seeder again never duplicates or overwrites
 * content edited in the admin panel.
 */
export async function contentSeeder(db: PrismaClient): Promise<void> {
  const parts = [
    { label: "profile, principles & strengths", isEmpty: async () => (await db.profile.count()) === 0, seed: seedProfile },
    { label: "project categories & projects", isEmpty: async () => (await db.projectCategory.count()) === 0, seed: seedProjects },
    { label: "experience & skill groups", isEmpty: async () => (await db.experience.count()) === 0, seed: seedCareer },
  ];

  for (const part of parts) {
    if (!(await part.isEmpty())) {
      console.log(`  - ${part.label}: already seeded, skipped`);
      continue;
    }
    await db.$transaction(async (tx) => part.seed(tx as PrismaClient));
    console.log(`  ✓ ${part.label}`);
  }
}
