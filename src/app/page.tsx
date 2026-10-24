import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ExpertiseSection } from "@/components/sections/ExpertiseSection";
import { FeaturedProjectsSection } from "@/components/sections/FeaturedProjectsSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { profile, site } from "@/data/profile";
import { getContactChannels } from "@/lib/contact";

function PersonJsonLd() {
  const sameAs = getContactChannels(profile.contact)
    .filter((channel) => channel.external && channel.href)
    .map((channel) => channel.href);

  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.summary,
    url: site.url,
    knowsAbout: profile.strengths,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  return (
    <script
      type="application/ld+json"
      // Static, trusted data; "<" is escaped to keep the script block closed.
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
