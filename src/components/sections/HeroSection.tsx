import { HeroContent } from "@/components/hero/HeroContent";
import { HeroMedia } from "@/components/hero/HeroMedia";
import { HeroMeta } from "@/components/hero/HeroMeta";
import { heroMedia } from "@/data/media";
import { profile } from "@/data/profile";

export function HeroSection() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate flex min-h-svh flex-col overflow-hidden">
      <HeroMedia video={heroMedia.video} poster={heroMedia.poster} />

      <div className="container-page relative z-10 flex flex-1 flex-col items-center justify-center pt-[calc(var(--nav-h)+2.5rem)] pb-12 [@media(max-height:520px)]:pt-[calc(var(--nav-h)+1rem)]">
        <HeroContent hero={profile.hero} availability={profile.availability} />
      </div>

      <HeroMeta years={profile.yearsOfExperience} signature={profile.hero.signature} />
    </section>
  );
}
