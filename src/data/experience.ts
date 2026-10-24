import type { ExperienceEntry } from "@/types/portfolio";

/**
 * Career timeline, most recent first. Company names are PLACEHOLDERS
 * describing the type of organisation — replace them with real employers,
 * positions and dates. Dates use "YYYY-MM"; `end: null` marks a current role.
 */
export const experience: readonly ExperienceEntry[] = [
  {
    id: "exp-04",
    company: "Product Company",
    companyContext: "B2B SaaS",
    position: "Lead Backend Engineer",
    start: "2023-06",
    end: null,
    location: "Remote",
    description:
      "Own the backend architecture of a multi-tenant SaaS platform and lead a small team of backend engineers.",
    responsibilities: [
      "Set architectural direction and module boundaries for the core platform",
      "Lead design reviews and define engineering standards",
      "Mentor engineers and coordinate closely with frontend and product",
      "Introduce AI-assisted workflows alongside rigorous code review",
    ],
    technologies: ["PHP 8.3", "Laravel 11", "PostgreSQL", "Redis", "Horizon", "Vue.js", "Docker"],
  },
  {
    id: "exp-03",
    company: "Commerce Group",
    companyContext: "Retail & e-commerce",
    position: "Senior Backend Engineer",
    start: "2021-03",
    end: "2023-05",
    location: "Hybrid",
    description:
      "Designed and built commerce and billing services powering several customer-facing storefronts.",
    responsibilities: [
      "Designed catalogue, checkout and order lifecycle services",
      "Integrated payment, shipping and ERP providers",
      "Improved performance of high-traffic read paths",
      "Drove adoption of automated testing for critical flows",
    ],
    technologies: ["PHP 8", "Laravel", "PostgreSQL", "Elasticsearch", "Redis", "REST APIs"],
  },
  {
    id: "exp-02",
    company: "Digital Product Studio",
    companyContext: "Agency",
    position: "PHP / Laravel Developer",
    start: "2019-04",
    end: "2021-02",
    location: "On-site",
    description:
      "Built web applications and business systems for clients across real estate, healthcare and education.",
    responsibilities: [
      "Delivered full projects from data model to production",
      "Built REST APIs consumed by Vue.js frontends and mobile apps",
      "Implemented authentication, roles and permissions",
      "Maintained and modernised legacy PHP codebases",
    ],
    technologies: ["PHP 7", "Laravel", "MySQL", "Vue.js", "Redis", "Git"],
  },
  {
    id: "exp-01",
    company: "Software Agency",
    companyContext: "Web development",
    position: "Junior PHP Developer",
    start: "2018-01",
    end: "2019-03",
    location: "On-site",
    description:
      "Started professionally building and maintaining PHP websites and internal tools, and adopted Laravel as the primary framework.",
    responsibilities: [
      "Built features for client websites and admin panels",
      "Wrote database migrations and queries",
      "Fixed bugs and supported production systems",
    ],
    technologies: ["PHP", "Laravel", "MySQL", "jQuery", "HTML & CSS"],
  },
];
