import { cacheLife, cacheTag } from "next/cache";

import { pickOption, strengthIcons } from "@/data/options";
import type { Locale } from "@/i18n/config";
import { contentTags } from "@/lib/content-tags";
import { jsonHeadline, jsonStrings, pickTranslation } from "@/lib/translations";
import { db } from "@/server/db";
import type { Profile } from "@/types/portfolio";

/** The personal profile, engineering principles and key strengths in one language. */
export async function getProfile(locale: Locale): Promise<Profile> {
  "use cache";
  cacheTag(contentTags.profile);
  cacheLife("max");

  const [profile, principles, strengths] = await Promise.all([
    db.profile.findFirst({ include: { translations: true }, orderBy: { id: "asc" } }),
    db.principle.findMany({ include: { translations: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
    db.strength.findMany({ include: { translations: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
  ]);

  const text = profile && pickTranslation(profile.translations, locale);
  if (!profile || !text) throw new Error("The profile has not been created yet. Run `pnpm db:seed`.");

  return {
    name: text.name,
    initials: profile.initials,
    title: text.title,
    location: text.location,
    summary: text.summary,
    bio: jsonStrings(text.bio),
    philosophy: principles.flatMap((principle) => {
      const row = pickTranslation(principle.translations, locale);
      return row ? [{ title: row.title, body: row.body }] : [];
    }),
    strengths: strengths.flatMap((strength) => {
      const row = pickTranslation(strength.translations, locale);
      return row ? [{ icon: pickOption(strengthIcons, strength.icon), label: row.label }] : [];
    }),
    yearsOfExperience: profile.yearsOfExperience,
    availability: { available: profile.isAvailable, label: text.availabilityLabel },
    hero: {
      headline: jsonHeadline(text.heroHeadline),
      description: text.heroDescription,
      primaryCta: { label: text.primaryCtaLabel, href: profile.primaryCtaHref },
      secondaryCta: { label: text.secondaryCtaLabel, href: profile.secondaryCtaHref },
      signature: jsonStrings(text.signature),
      media: { video: profile.heroVideoUrl, poster: profile.heroPosterUrl },
    },
    contact: {
      email: profile.email,
      phone: profile.phone,
      telegram: profile.telegram,
      linkedin: profile.linkedin,
      instagram: profile.instagram,
    },
  };
}
