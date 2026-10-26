import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ExpertiseSection } from "@/components/sections/ExpertiseSection";
import { FeaturedProjectsSection } from "@/components/sections/FeaturedProjectsSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { getDictionary } from "@/data/dictionaries";
import { site } from "@/data/site";
import { getLocale } from "@/i18n/server";
import { getContactChannels } from "@/lib/contact";
import { getProfile } from "@/lib/profile";

async function PersonJsonLd() {
  const locale = await getLocale();
  const profile = await getProfile(locale);
  const sameAs = getContactChannels(profile.contact, getDictionary(locale).contact.channels)
    .filter((channel) => channel.external && channel.href)
    .map((channel) => channel.href);

  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.summary,
    url: new URL(`/${locale}`, site.url).toString(),
    knowsAbout: profile.strengths.map((strength) => strength.label),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  return (
    <script
      type="application/ld+json"
      // Admin-managed data; "<" is escaped to keep the script block closed.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export default function HomePage() {
  return (
    <>
      <PersonJsonLd />
      <HeroSection />
      <AboutSection />
      <FeaturedProjectsSection />
      <ExpertiseSection />
      <ExperienceSection />
      <ContactSection />
    </>
  );
}
