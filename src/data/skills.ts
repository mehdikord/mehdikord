import type { SkillGroup } from "@/types/portfolio";

/** Technical capabilities grouped by the problems they solve. */
export const skillGroups: readonly SkillGroup[] = [
  {
    id: "backend",
    title: "Backend Engineering",
    annotation: "Primary craft",
    items: ["PHP 8.x", "Laravel", "Eloquent ORM", "Queues & Horizon", "Events & listeners", "Laravel Octane", "Testing with Pest & PHPUnit"],
  },
  {
    id: "architecture",
    title: "Architecture & Scalability",
    annotation: "Systems that grow",
    items: ["Modular monoliths", "Domain-driven design", "Service boundaries", "Caching strategies", "Async processing", "Multi-tenancy"],
  },
  {
    id: "data",
    title: "Databases & Infrastructure",
    annotation: "Data that holds up",
    items: ["MySQL", "PostgreSQL", "Redis", "Query & index optimisation", "Docker", "Linux & Nginx", "CI/CD pipelines"],
  },
  {
    id: "api",
    title: "API Development & Integrations",
    annotation: "Contracts & connectors",
    items: ["RESTful API design", "Webhooks", "OAuth 2.0", "Payment providers", "Third-party SDKs", "API versioning"],
  },
  {
    id: "frontend",
    title: "Frontend Collaboration",
    annotation: "Across the stack",
    items: ["Vue.js", "Inertia.js", "TypeScript", "Tailwind CSS", "API-first workflows"],
  },
  {
    id: "practice",
    title: "Security & Engineering Practice",
    annotation: "How the work is done",
    items: ["Authentication & authorisation", "OWASP practices", "Code review", "Technical leadership", "AI-assisted development", "Documentation"],
  },
];
