import { HeroStage } from "@/components/hero/HeroStage";
import { getDictionary } from "@/data/dictionaries";
import { localizeDigits } from "@/i18n/format";
import { getLocale } from "@/i18n/server";
import { getProfile } from "@/lib/profile";

export async function HeroSection() {
  const locale = await getLocale();
  const profile = await getProfile(locale);
  const copy = getDictionary(locale).hero;

  return (
    <HeroStage
      kicker={profile.title}
      headline={profile.hero.headline}
      description={profile.hero.description}
      primaryCta={profile.hero.primaryCta}
      secondaryCta={profile.hero.secondaryCta}
      availability={profile.availability}
      rail={{
        years: `${localizeDigits(locale, profile.yearsOfExperience)}+`,
        yearsSuffix: copy.yearsSuffix,
        signature: profile.hero.signature,
        scrollCue: copy.scrollCue,
      }}
    />
  );
}
