import { HeroContent } from "@/components/hero/HeroContent";
import { HeroMedia } from "@/components/hero/HeroMedia";
import { HeroMeta } from "@/components/hero/HeroMeta";
import { getDictionary } from "@/data/dictionaries";
import { localizeDigits } from "@/i18n/format";
import { getLocale } from "@/i18n/server";
import { getProfile } from "@/lib/profile";

export async function HeroSection() {
  const locale = await getLocale();
  const profile = await getProfile(locale);
  const copy = getDictionary(locale).hero;

  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate flex min-h-svh flex-col overflow-hidden">
      <HeroMedia video={profile.hero.media.video} poster={profile.hero.media.poster} />

      <div className="container-page relative z-10 flex flex-1 flex-col items-center justify-center pt-[calc(var(--nav-h)+2.5rem)] pb-12 [@media(max-height:520px)]:pt-[calc(var(--nav-h)+1rem)]">
        <HeroContent hero={profile.hero} availability={profile.availability} />
      </div>

      <HeroMeta
        years={`${localizeDigits(locale, profile.yearsOfExperience)}+`}
        signature={profile.hero.signature}
        scrollCue={copy.scrollCue}
        yearsSuffix={copy.yearsSuffix}
      />
    </section>
  );
}
