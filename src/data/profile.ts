import type { Profile, SiteConfig } from "@/types/portfolio";

/**
 * Personal profile — the single source for name, positioning, availability
 * and contact details. Replace the placeholder values with real information.
 *
 * NOTE: The name below was derived from the project folder name and should be
 * confirmed. Contact values are intentionally empty until real details exist.
 */
export const profile: Profile = {
  name: "Mehdi Kord",
  initials: "MK",
  title: "Senior Backend Engineer · PHP & Laravel",
  location: "Available for remote work worldwide",
  summary:
    "Senior backend engineer specialising in PHP and Laravel — designing the architecture, APIs and data models behind complex, scalable business software.",
  bio: [
    "I design and build the backend systems that business-critical products depend on — the APIs, data models, queues and integrations that have to keep working long after launch day.",
    "For more than eight years I have worked primarily in PHP and Laravel, moving from feature development to owning architecture: shaping modular codebases, modelling complex domains, and making the trade-offs that keep systems fast, secure and maintainable as teams and traffic grow.",
    "I work closely with frontend engineers — often in Vue.js — and with product teams, translating ambiguous requirements into clear boundaries and predictable software. Increasingly, I use AI-assisted workflows to move faster without lowering the bar on review, testing and design.",
  ],
  philosophy: [
    {
      title: "Boundaries before features",
      body: "Clear module boundaries and explicit contracts make a system easier to change than any clever abstraction.",
    },
    {
      title: "Boring where it matters",
      body: "Proven tools for the critical path; experimentation where the cost of being wrong is small.",
    },
    {
      title: "Readable at 3 a.m.",
      body: "Code, logs and data models should explain themselves to whoever is on call — including future me.",
    },
  ],
  strengths: [
    "PHP & Laravel",
    "Backend architecture",
    "API design",
    "Database modelling & optimisation",
    "Modular application architecture",
    "Scalable business systems",
    "Authentication & authorisation",
    "Application security",
    "Third-party integrations",
    "Performance optimisation",
    "Technical leadership",
    "Vue.js & frontend collaboration",
    "AI-assisted development",
  ],
  yearsOfExperience: 8,
  availability: {
    available: true,
    label: "Open to new opportunities",
  },
  hero: {
    headline: [
      [{ text: "Engineering" }, { text: "systems." }],
      [{ text: "Building" }, { text: "what scales.", emphasis: true }],
    ],
    description:
      "Senior PHP & Laravel engineer with 8+ years of experience in backend architecture, scalable applications and complex software systems.",
    primaryCta: { label: "Explore My Work", href: "#work" },
    secondaryCta: { label: "Let's Talk", href: "#contact" },
    signature: ["PHP", "Laravel", "System Architecture"],
  },
  contact: {
    email: "",
    phone: "",
    telegram: "",
    linkedin: "",
    instagram: "",
  },
};

/** Site-wide settings. Set `url` to the production domain before deploying. */
export const site: SiteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en",
};
