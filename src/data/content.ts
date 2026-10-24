/**
 * Interface copy — section titles, labels and calls to action. Keeping these
 * strings together lets the portfolio be localised (e.g. to Persian) by
 * swapping this module without touching components.
 */

export type SectionId = "top" | "about" | "work" | "expertise" | "experience" | "contact";

export const navigation: ReadonlyArray<{ id: SectionId; label: string }> = [
  { id: "top", label: "Home" },
  { id: "about", label: "About" },
  { id: "work", label: "Selected Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export const content = {
  nav: {
    primaryLabel: "Primary",
    allProjects: "All projects",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    skipToContent: "Skip to content",
  },
  hero: {
    scrollCue: "Scroll",
    yearsSuffix: "years",
  },
  about: {
    index: "01",
    label: "About",
    title: [{ text: "The engineer behind" }, { text: "the systems.", emphasis: true }],
    philosophyLabel: "Engineering philosophy",
    strengthsLabel: "Key strengths",
    stats: {
      years: "Years of professional programming",
      projects: "Projects in this portfolio",
      domains: "Product domains represented",
    },
    diagramLabel: "Fig. 01 — A typical system I design",
    diagramCaption:
      "Request path of a modular Laravel platform: stateless app nodes behind a load balancer, queued work handled by isolated workers, a cached read path and a replicated primary database.",
  },
  work: {
    index: "02",
    label: "Selected Work",
    title: [{ text: "Products built to" }, { text: "carry weight.", emphasis: true }],
    intro:
      "Business platforms, commerce engines and internal tools — systems with real users, real data and real constraints. Each one shaped by decisions about architecture, data and long-term maintainability.",
    caseStudy: "Read case study",
    overview: "View project",
    liveSite: "Visit live site",
    exploreAll: "Explore All Projects",
    exploreAllHint: "Full index with filters",
    previewNotice: "Illustrative preview",
    roleLabel: "Role",
    stackLabel: "Stack",
  },
  expertise: {
    index: "03",
    label: "Expertise",
    title: [{ text: "Technical" }, { text: "range.", emphasis: true }],
    intro: "The tools and practices I reach for, grouped by the problems they solve.",
  },
  experience: {
    index: "04",
    label: "Experience",
    title: [{ text: "A career of" }, { text: "compounding depth.", emphasis: true }],
    intro:
      "From shipping features to owning architecture — each role added scope, responsibility and a longer view of what makes software last.",
    present: "Present",
    responsibilitiesLabel: "Responsibilities",
    technologiesLabel: "Technologies",
  },
  contact: {
    index: "05",
    label: "Contact",
    title: [{ text: "Have a system" }, { text: "that needs to scale?", emphasis: true }],
    intro:
      "I'm interested in senior and lead backend roles, architecture work and ambitious products that need a dependable engineering partner. Tell me what you're building.",
    emailCta: "Write me an email",
    channelsLabel: "Direct channels",
    notConfigured: "Not configured — set in src/data/profile.ts",
    noChannels: "Contact details will be published here soon.",
  },
  footer: {
    navigationLabel: "Footer",
    backToTop: "Back to top",
    rights: "All rights reserved.",
    builtWith: "Designed & engineered with Next.js",
  },
  projectsPage: {
    label: "Index",
    title: [{ text: "All" }, { text: "projects.", emphasis: true }],
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
    galleryNotice:
      "Illustrative compositions — real screenshots replace these once added to the project data.",
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
    title: "This route doesn't resolve.",
    body: "The page you're looking for doesn't exist or has moved.",
    home: "Back to home",
    projects: "Browse all projects",
    projectTitle: "Project not found.",
    projectBody: "There's no project at this address. It may have been renamed or removed.",
  },
} as const;
