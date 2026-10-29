import type { HeadlineSegment } from "@/types/portfolio";

/**
 * English interface copy — section titles, labels and calls to action.
 * `fa.ts` must provide the same keys (enforced by the `Dictionary` type).
 * Strings with `{placeholders}` are filled with `interpolate()`.
 */

type Title = readonly HeadlineSegment[];

export const en = {
  nav: {
    primaryLabel: "Primary",
    items: {
      top: "Home",
      about: "About",
      work: "Selected Work",
      experience: "Experience",
      contact: "Contact",
    },
    allProjects: "All projects",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    skipToContent: "Skip to content",
    home: "home",
  },
  language: {
    label: "Language",
    switchTo: "Switch to {language}",
  },
  theme: {
    switchTo: "Switch to {theme} theme",
    light: "light",
    dark: "dark",
  },
  hero: {
    scrollCue: "Scroll",
    yearsSuffix: "years",
  },
  about: {
    index: "01",
    label: "About",
    title: [{ text: "The engineer behind" }, { text: "the systems.", emphasis: true }] as Title,
    philosophyLabel: "Engineering philosophy",
    strengthsLabel: "Key strengths",
    strengthsIntro: "Where I add the most value to a team and a codebase.",
    coreStrength: "Core specialism",
    stats: {
      years: "Years of professional programming",
      projects: "Projects in this portfolio",
      domains: "Product domains represented",
    },
    diagramLabel: "Fig. 01 — A typical system I design",
    diagramLive: "live path",
    diagramCaption:
      "Request path of a modular Laravel platform: stateless app nodes behind a load balancer, queued work handled by isolated workers, a cached read path and a replicated primary database.",
  },
  work: {
    index: "02",
    label: "Selected Work",
    title: [{ text: "Selected work," }, { text: "built to carry weight.", emphasis: true }] as Title,
    intro:
      "Three products from the archive — platforms with real users, real data and real constraints. The full index holds the rest.",
    caseStudy: "Read case study",
    overview: "View project",
    liveSite: "Visit live site",
    exploreAll: "Explore all projects",
    shownCount: "{shown} of {total} projects",
    exploreAllHint: "Full index with filters",
    previewNotice: "Default image",
    previewAria: "Default preview image for {title}",
    indexPrefix: "P/",
    roleLabel: "Role",
    stackLabel: "Stack",
    panelHint: "Select a project to expand it",
  },
  expertise: {
    index: "03",
    label: "Expertise",
    title: [{ text: "Technical" }, { text: "range.", emphasis: true }] as Title,
    intro: "The tools and practices I reach for, grouped by the problems they solve.",
    moduleLabel: "Module",
    capabilities: "{count} capabilities",
    listLabel: "Areas of expertise",
    stageLabel: "Capabilities in {title}",
  },
  experience: {
    index: "04",
    label: "Experience",
    title: [{ text: "A career of" }, { text: "compounding depth.", emphasis: true }] as Title,
    intro:
      "From shipping features to owning architecture — each role added scope, responsibility and a longer view of what makes software last.",
    present: "Present",
    responsibilitiesLabel: "Responsibilities",
    technologiesLabel: "Technologies",
  },
  contact: {
    index: "05",
    label: "Contact",
    title: [{ text: "Have a system" }, { text: "that needs to scale?", emphasis: true }] as Title,
    intro:
      "I'm interested in senior and lead backend roles, architecture work and ambitious products that need a dependable engineering partner. Tell me what you're building.",
    emailCta: "Write me an email",
    channelsLabel: "Direct channels",
    channels: {
      email: "Email",
      phone: "Phone",
      telegram: "Telegram",
      linkedin: "LinkedIn",
      instagram: "Instagram",
    },
    opensInNewTab: "opens in a new tab",
    notConfigured: "Not configured — set in src/data/profile.ts",
    copyEmail: "Copy email address",
    copied: "Copied",
    stepsLabel: "How we'd start",
    steps: [
      { title: "Share the context", body: "A few lines about the product, the team and where the system is today." },
      { title: "A focused call", body: "We talk through goals, constraints and where I can add the most value." },
      { title: "A clear next step", body: "You get a concrete proposal: scope, approach and how we'd work together." },
    ],
    noChannels: "Contact details will be published here soon.",
  },
  footer: {
    navigationLabel: "Footer",
    backToTop: "Back to top",
    rights: "All rights reserved.",
    builtWith: "Designed & engineered with Next.js",
  },
  projectsPage: {
    metaTitle: "Projects",
    label: "Index",
    title: [{ text: "All" }, { text: "projects.", emphasis: true }] as Title,
    intro:
      "A complete index of selected work across commerce, SaaS, enterprise and internal platforms. Filter by domain, then open any project for its overview or full case study.",
    backHome: "Back to home",
    filterLabel: "Filter projects by category",
    all: "All",
    projectsNoun: "projects",
    domainsNoun: "domains",
    emptyTitle: "Nothing in this category yet.",
    emptyBody: "No projects match the selected filter.",
    reset: "Show all projects",
    caseStudyTag: "Case study",
  },
  caseStudy: {
    back: "All projects",
    overview: "Overview",
    context: "Context",
    role: "Role",
    category: "Domain",
    period: "Period",
    stack: "Technologies",
    responsibilities: "Responsibilities",
    highlights: "Highlights",
    challenges: "Technical challenges",
    decisions: "Architectural decisions",
    implementation: "Implementation notes",
    gallery: "Interface",
    overviewOnly:
      "A detailed case study for this project hasn't been published yet. Here's an overview of the product and my role.",
    previous: "Previous project",
    next: "Next project",
    live: "Visit live site",
    caseStudyLabel: "Case study",
    liveLabel: "Live",
    projectNavigation: "Project navigation",
    overviewLabel: "Project overview",
  },
  notFound: {
    code: "404",
    errorLabel: "Error",
    title: "This route doesn't resolve.",
    body: "The page you're looking for doesn't exist or has moved.",
    home: "Back to home",
    projects: "Browse all projects",
    projectTitle: "Project not found.",
    projectBody: "There's no project at this address. It may have been renamed or removed.",
  },
};

export type Dictionary = typeof en;
