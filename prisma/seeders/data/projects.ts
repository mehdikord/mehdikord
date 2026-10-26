import type { Locale } from "@/i18n/config";
import type { Project, ProjectCategoryId } from "@/types/portfolio";

/**
 * Initial project catalogue seeded into `project_categories` and `projects`
 * (with their translations). After seeding, manage projects in the admin
 * panel. All names and descriptions are FICTIONAL PLACEHOLDERS. Array order
 * becomes `sort_order`. Text here is English; Persian translations live in
 * `projects.fa.ts`, keyed by project id.
 */

/** Category ids in display order, with a label per language. */
export const projectCategories: readonly { id: ProjectCategoryId; label: Record<Locale, string> }[] = [
  { id: "crm", label: { en: "CRM", fa: "CRM" } },
  { id: "commerce", label: { en: "E-commerce", fa: "فروشگاهی" } },
  { id: "real-estate", label: { en: "Real Estate", fa: "املاک" } },
  { id: "saas", label: { en: "SaaS", fa: "SaaS" } },
  { id: "business", label: { en: "Business Systems", fa: "سیستم‌های تجاری" } },
  { id: "data", label: { en: "Data Platforms", fa: "پلتفرم‌های داده" } },
  { id: "recruitment", label: { en: "Recruitment", fa: "استخدام" } },
  { id: "internal", label: { en: "Internal Tools", fa: "ابزارهای داخلی" } },
];

export const projects: readonly Omit<Project, "categoryLabel">[] = [
  {
    id: "p-01",
    slug: "atlas-crm",
    title: "Atlas CRM",
    shortDescription:
      "A multi-tenant CRM for B2B sales teams — pipelines, accounts, activity tracking and role-based workspaces.",
    fullDescription: [
      "Atlas is an enterprise CRM used by sales organisations to manage accounts, deals and customer communication across multiple teams and regions.",
      "The platform combines configurable pipelines with a detailed activity timeline, granular permissions and integrations with email, calendar and telephony providers — all served from a single multi-tenant Laravel codebase.",
    ],
    category: "crm",
    role: "Lead Backend Engineer",
    period: "2024 — 2025",
    technologies: ["PHP 8.3", "Laravel 11", "MySQL", "Redis", "Laravel Horizon", "Vue.js", "Docker"],
    liveUrl: "",
    featured: true,
    coverImage: null,
    gallery: [],
    highlights: [
      "Tenant isolation enforced at the query layer rather than in controllers",
      "Configurable pipelines and custom fields without schema changes per tenant",
      "Activity timeline aggregating email, calls and notes into one stream",
    ],
    responsibilities: [
      "Defined the modular architecture and module boundaries",
      "Designed the multi-tenant data model and permission system",
      "Built the integration layer for email, calendar and telephony providers",
      "Reviewed code and mentored backend engineers on the team",
    ],
    caseStudyAvailable: true,
    caseStudy: {
      context:
        "B2B sales teams needed one workspace for accounts, deals and communication, with each customer organisation fully isolated and able to adapt pipelines to its own sales process.",
      challenges: [
        {
          title: "Isolation without duplication",
          detail:
            "Every tenant needed strict data isolation while sharing one codebase and one deployment, so a missed scope could never leak another organisation's records.",
        },
        {
          title: "Flexible schema per customer",
          detail:
            "Sales processes differ widely between customers. Pipelines, stages and custom fields had to be configurable without per-tenant migrations.",
        },
        {
          title: "Unreliable third-party APIs",
          detail:
            "Email and calendar providers rate-limit, time out and change behaviour. Synchronisation had to be resilient and observable.",
        },
      ],
      decisions: [
        {
          title: "Global tenant scopes with explicit escape hatches",
          detail:
            "Tenant filtering lives in Eloquent global scopes applied by a base model. Bypassing it requires an explicit, auditable call — safe by default.",
        },
        {
          title: "Typed custom fields stored as validated JSON",
          detail:
            "Field definitions are versioned per tenant and values are validated against them, keeping flexible data queryable and predictable.",
        },
        {
          title: "Queued, idempotent synchronisation jobs",
          detail:
            "Provider sync runs in isolated Horizon queues with retries, backoff and idempotency keys, so failures are contained and safely repeatable.",
        },
      ],
      implementation: [
        "Domain modules (Accounts, Deals, Activities, Integrations) with their own service providers, routes and tests",
        "Policies and permission sets resolved per workspace role",
        "Event-driven activity timeline fed by domain events",
        "Feature tests covering tenant boundaries for every module",
      ],
    },
  },
  {
    id: "p-02",
    slug: "maison-commerce",
    title: "Maison Commerce",
    shortDescription:
      "A headless commerce platform for a multi-brand retailer — catalogue, checkout, inventory and order orchestration.",
    fullDescription: [
      "Maison is a headless e-commerce backend serving several storefronts from one catalogue, inventory and order pipeline.",
      "The system handles product modelling with variants and bundles, cart and checkout logic, payment provider integration and the order lifecycle from placement to fulfilment.",
    ],
    category: "commerce",
    role: "Senior Backend Engineer",
    period: "2023 — 2024",
    technologies: ["PHP 8.2", "Laravel 10", "PostgreSQL", "Redis", "Elasticsearch", "REST & webhooks", "Vue.js"],
    liveUrl: "",
    featured: true,
    coverImage: null,
    gallery: [],
    highlights: [
      "One catalogue and inventory serving multiple storefronts",
      "Checkout modelled as an explicit state machine",
      "Payment and shipping providers behind swappable adapters",
    ],
    responsibilities: [
      "Designed the catalogue, pricing and inventory data model",
      "Implemented checkout and the order lifecycle state machine",
      "Integrated payment, shipping and ERP providers",
      "Optimised catalogue search and high-traffic read paths",
    ],
    caseStudyAvailable: true,
    caseStudy: {
      context:
        "A retailer operating several brands wanted one commerce backend behind multiple storefronts, replacing separate shops that had drifted apart in data and behaviour.",
      challenges: [
        {
          title: "Inventory consistency under concurrency",
          detail:
            "Multiple storefronts reserve the same stock simultaneously, so overselling had to be prevented without serialising every checkout.",
        },
        {
          title: "Complex product modelling",
          detail:
            "Variants, bundles and brand-specific pricing needed to coexist in one catalogue without special cases spreading through the code.",
        },
        {
          title: "Provider diversity",
          detail:
            "Each brand used different payment and shipping providers, with different failure modes and webhook semantics.",
        },
      ],
      decisions: [
        {
          title: "Reservations with expiry instead of immediate decrements",
          detail:
            "Checkout places time-boxed stock reservations using row-level locks; expired reservations are released by a scheduled job.",
        },
        {
          title: "Order lifecycle as a state machine",
          detail:
            "Allowed transitions are declared in one place, making invalid states unrepresentable and every transition auditable.",
        },
        {
          title: "Adapter interfaces for providers",
          detail:
            "Payment and shipping integrations implement shared contracts, with webhook handling normalised into internal domain events.",
        },
      ],
      implementation: [
        "Search indexing pipeline from PostgreSQL to Elasticsearch via queued jobs",
        "Versioned REST API consumed by multiple storefront frontends",
        "Signed, idempotent webhook processing",
        "Price calculation isolated in a pure, heavily tested service",
      ],
    },
  },
  {
    id: "p-03",
    slug: "keystone-estates",
    title: "Keystone Estates",
    shortDescription:
      "A property listing and agency platform with map search, saved searches, enquiries and an agent back office.",
    fullDescription: [
      "Keystone is a real estate platform connecting buyers and renters with agencies, combining a public listing site with a back office for agents.",
      "Core capabilities include geospatial search, saved searches with alerts, enquiry routing to the right agent and media management for listings.",
    ],
    category: "real-estate",
    role: "Backend Engineer",
    period: "2022 — 2023",
    technologies: ["PHP 8.1", "Laravel 9", "MySQL (spatial)", "Redis", "Meilisearch", "Vue.js", "S3"],
    liveUrl: "",
    featured: false,
    coverImage: null,
    gallery: [],
    highlights: [
      "Geospatial queries for radius and polygon map search",
      "Saved searches with scheduled alert notifications",
      "Enquiry routing based on agency and listing ownership",
    ],
    responsibilities: [
      "Built the listing search API including geospatial filtering",
      "Implemented saved searches and notification scheduling",
      "Designed the agent back office permissions",
      "Set up media upload and processing pipeline",
    ],
    caseStudyAvailable: false,
  },
  {
    id: "p-05",
    slug: "ledgerline-erp",
    title: "Ledgerline",
    shortDescription:
      "A business management system covering orders, invoicing, inventory and reporting for a distribution company.",
    fullDescription: [
      "Ledgerline replaced a collection of spreadsheets and legacy tools with one system for orders, invoicing, stock and reporting.",
      "The application is a modular monolith in Laravel, designed so each business area can evolve independently while sharing one consistent data model.",
    ],
    category: "business",
    role: "Software Architect & Lead Developer",
    period: "2021 — 2022",
    technologies: ["PHP 8.0", "Laravel 8", "MySQL", "Redis", "Vue.js", "Laravel Excel", "Docker"],
    liveUrl: "",
    featured: false,
    coverImage: null,
    gallery: [],
    highlights: [
      "Modular monolith with explicit inter-module contracts",
      "Heavy reporting moved off the transactional path",
      "Incremental migration from legacy tools",
    ],
    responsibilities: [
      "Led architecture and technical direction",
      "Modelled orders, invoicing and inventory domains",
      "Planned and executed data migration from legacy sources",
      "Built reporting and export features",
    ],
    caseStudyAvailable: true,
    caseStudy: {
      context:
        "A distribution company ran daily operations across disconnected spreadsheets and ageing tools, making stock, orders and invoices hard to reconcile.",
      challenges: [
        {
          title: "Migrating without stopping the business",
          detail:
            "Operations couldn't pause for a big-bang switch, so the new system had to run alongside legacy processes during transition.",
        },
        {
          title: "Reporting load on the primary database",
          detail:
            "Management reports scanned large ranges of transactional data and competed with day-to-day order entry.",
        },
        {
          title: "Many intertwined business rules",
          detail:
            "Pricing, discounts, stock movements and invoicing rules depended on each other in ways that were rarely documented.",
        },
      ],
      decisions: [
        {
          title: "Modular monolith over microservices",
          detail:
            "One deployable with strict module boundaries gave clear ownership without the operational overhead of distributed services.",
        },
        {
          title: "Read models for reporting",
          detail:
            "Reports read from pre-aggregated tables updated by queued jobs, keeping heavy queries away from order entry.",
        },
        {
          title: "Domain-by-domain rollout",
          detail:
            "Inventory moved first, then orders, then invoicing — each with import scripts and reconciliation checks.",
        },
      ],
      implementation: [
        "Module contracts expressed as interfaces and domain events",
        "Import pipeline with validation reports for legacy data",
        "Role-based access for warehouse, sales and finance teams",
        "Spreadsheet exports generated asynchronously",
      ],
    },
  },
  {
    id: "p-04",
    slug: "cadence-billing",
    title: "Cadence Billing",
    shortDescription:
      "Subscription and billing infrastructure for a SaaS product — plans, usage metering, invoicing and dunning.",
    fullDescription: [
      "Cadence is the billing core of a SaaS product: it manages plans, trials, upgrades and downgrades, metered usage and invoice generation.",
      "It integrates with a payment provider for charges while keeping the product's own ledger as the source of truth for entitlements and invoices.",
    ],
    category: "saas",
    role: "Senior Backend Engineer",
    period: "2023",
    technologies: ["PHP 8.2", "Laravel 10", "Laravel Cashier", "PostgreSQL", "Redis", "Stripe API"],
    liveUrl: "",
    featured: false,
    coverImage: null,
    gallery: [],
    highlights: [
      "Plan changes with proration handled consistently",
      "Usage metering aggregated asynchronously",
      "Entitlements derived from an internal ledger",
    ],
    responsibilities: [
      "Designed the subscription and entitlement model",
      "Implemented usage metering and invoice generation",
      "Built webhook handling and payment failure recovery",
      "Wrote the test suite around billing edge cases",
    ],
    caseStudyAvailable: true,
    caseStudy: {
      context:
        "A growing SaaS product had outgrown hand-managed plans. It needed self-service upgrades, usage-based pricing and invoices finance could trust.",
      challenges: [
        {
          title: "Correctness above all",
          detail:
            "Billing errors erode trust immediately. Proration, trials and plan changes had many edge cases that needed deterministic handling.",
        },
        {
          title: "High-volume usage events",
          detail:
            "Usage events arrive continuously and must be aggregated without slowing down the product's request path.",
        },
        {
          title: "Two sources of truth",
          detail:
            "The payment provider and the product both hold billing state, which can diverge when webhooks are delayed or retried.",
        },
      ],
      decisions: [
        {
          title: "Internal ledger as the source of truth",
          detail:
            "Entitlements and invoices derive from the product's own ledger; the payment provider is treated as an execution layer and reconciled.",
        },
        {
          title: "Asynchronous metering pipeline",
          detail:
            "Usage events are written cheaply and aggregated by queued workers into billing periods, keeping the hot path fast.",
        },
        {
          title: "Exhaustive tests for money paths",
          detail:
            "Proration and plan transitions are covered by table-driven tests that make every edge case explicit.",
        },
      ],
      implementation: [
        "Money handled as integer minor units with a dedicated value object",
        "Idempotent webhook processing with replay support",
        "Scheduled reconciliation between ledger and provider",
        "Dunning workflow with configurable retry schedule",
      ],
    },
  },
  {
    id: "p-06",
    slug: "prism-insights",
    title: "Prism Insights",
    shortDescription:
      "A data-heavy analytics product that ingests operational events and turns them into dashboards and scheduled reports.",
    fullDescription: [
      "Prism collects operational events from client systems and turns them into dashboards, segment analysis and scheduled reports.",
      "The backend focuses on reliable ingestion, efficient aggregation and an API that serves interactive charts without overloading the database.",
    ],
    category: "data",
    role: "Senior Backend Engineer",
    period: "2024",
    technologies: ["PHP 8.3", "Laravel 11", "PostgreSQL", "TimescaleDB", "Redis", "Laravel Octane"],
    liveUrl: "",
    featured: false,
    coverImage: null,
    gallery: [],
    highlights: [
      "Batched ingestion endpoint with validation and back-pressure",
      "Time-bucketed aggregates for interactive charts",
      "Scheduled reports rendered and delivered asynchronously",
    ],
    responsibilities: [
      "Designed the ingestion API and event schema",
      "Implemented aggregation jobs and query endpoints",
      "Tuned database indexes and query plans",
      "Built scheduled report generation",
    ],
    caseStudyAvailable: false,
  },
  {
    id: "p-07",
    slug: "talentflow-ats",
    title: "Talentflow",
    shortDescription:
      "An applicant tracking system with job publishing, candidate pipelines, interview scheduling and team feedback.",
    fullDescription: [
      "Talentflow helps hiring teams publish roles, move candidates through stages, coordinate interviews and collect structured feedback.",
      "The backend manages candidate data with privacy requirements in mind, integrates with job boards and calendars, and powers collaborative review.",
    ],
    category: "recruitment",
    role: "Backend Engineer",
    period: "2022",
    technologies: ["PHP 8.1", "Laravel 9", "MySQL", "Redis", "Vue.js", "Google Calendar API"],
    liveUrl: "",
    featured: false,
    coverImage: null,
    gallery: [],
    highlights: [
      "Configurable hiring stages per role",
      "Interview scheduling integrated with team calendars",
      "Data retention policies for candidate information",
    ],
    responsibilities: [
      "Built candidate pipeline and stage transition APIs",
      "Integrated calendar availability and scheduling",
      "Implemented retention and anonymisation jobs",
      "Developed feedback and scorecard features",
    ],
    caseStudyAvailable: false,
  },
  {
    id: "p-08",
    slug: "relay-ops-console",
    title: "Relay Ops Console",
    shortDescription:
      "An internal operations console for automating support and back-office workflows across company systems.",
    fullDescription: [
      "Relay is an internal tool that lets operations teams compose automated workflows — triggers, conditions and actions — that span several internal and external systems.",
      "It replaced a set of fragile scripts with a visible, auditable workflow engine and a console for monitoring and retrying runs.",
    ],
    category: "internal",
    role: "Lead Backend Engineer",
    period: "2025",
    technologies: ["PHP 8.4", "Laravel 12", "PostgreSQL", "Redis", "Laravel Horizon", "Inertia.js", "Vue.js"],
    liveUrl: "",
    featured: true,
    coverImage: null,
    gallery: [],
    highlights: [
      "Workflows defined as data and executed by a queue-driven engine",
      "Every run recorded with step-level inputs and outputs",
      "Safe retries and manual intervention from the console",
    ],
    responsibilities: [
      "Designed the workflow engine and execution model",
      "Built the connector framework for internal systems",
      "Implemented run history, auditing and retries",
      "Coordinated with operations teams on requirements",
    ],
    caseStudyAvailable: true,
    caseStudy: {
      context:
        "Operations teams relied on scattered scripts and manual steps to move data between support, billing and internal systems, with little visibility when something failed.",
      challenges: [
        {
          title: "Visibility of failures",
          detail:
            "When a script failed halfway, nobody knew which steps had run, making recovery manual and risky.",
        },
        {
          title: "Extensibility for new systems",
          detail:
            "New integrations were requested regularly and each previously required bespoke code paths.",
        },
        {
          title: "Safe re-execution",
          detail:
            "Retrying a workflow could duplicate side effects such as emails or refunds if steps weren't designed for it.",
        },
      ],
      decisions: [
        {
          title: "Workflows as versioned data",
          detail:
            "Definitions are stored as versioned JSON graphs; each run pins the version it started with, so edits never affect in-flight work.",
        },
        {
          title: "Step-level persistence",
          detail:
            "Each step's input, output and status is persisted, enabling precise resumption from the failed step instead of a full restart.",
        },
        {
          title: "Connector contracts with idempotency",
          detail:
            "Connectors implement a shared interface and receive idempotency keys, making retries safe by design.",
        },
      ],
      implementation: [
        "Queue-driven executor with per-connector rate limiting",
        "Inertia.js + Vue console for building and monitoring workflows",
        "Audit log of every manual intervention",
        "Connector test harness with recorded fixtures",
      ],
    },
  },
  {
    id: "p-09",
    slug: "wayfarer-dispatch",
    title: "Wayfarer Dispatch",
    shortDescription:
      "A dispatch and tracking tool for a delivery operation — job assignment, driver status and route visibility.",
    fullDescription: [
      "Wayfarer coordinates delivery jobs between dispatchers and drivers, showing job status and driver positions on a live map.",
      "The backend exposes APIs for the driver mobile app and the dispatcher console, with real-time updates broadcast over websockets.",
    ],
    category: "internal",
    role: "Backend Engineer",
    period: "2021",
    technologies: ["PHP 8.0", "Laravel 8", "MySQL", "Redis", "Laravel Echo", "Pusher protocol"],
    liveUrl: "",
    featured: false,
    coverImage: null,
    gallery: [],
    highlights: [
      "Real-time job and driver status via websockets",
      "Assignment rules configurable by dispatchers",
      "Mobile API designed for intermittent connectivity",
    ],
    responsibilities: [
      "Built the driver app API and authentication",
      "Implemented real-time broadcasting of job status",
      "Developed assignment and scheduling logic",
    ],
    caseStudyAvailable: false,
  },
  {
    id: "p-10",
    slug: "clinicore",
    title: "Clinicore",
    shortDescription:
      "A clinic management system for appointments, patient records, billing and staff scheduling.",
    fullDescription: [
      "Clinicore supports the daily operation of multi-location clinics: appointment booking, patient records, invoicing and staff rotas.",
      "Particular care went into access control and audit logging, given the sensitivity of the data involved.",
    ],
    category: "business",
    role: "Backend Engineer",
    period: "2020 — 2021",
    technologies: ["PHP 7.4", "Laravel 7", "MySQL", "Redis", "Vue.js"],
    liveUrl: "",
    featured: false,
    coverImage: null,
    gallery: [],
    highlights: [
      "Fine-grained access control for clinical and admin roles",
      "Audit logging of record access and changes",
      "Appointment booking across locations and practitioners",
    ],
    responsibilities: [
      "Implemented appointment scheduling and availability",
      "Built role-based access control and audit logs",
      "Developed invoicing and payment tracking",
    ],
    caseStudyAvailable: false,
  },
  {
    id: "p-11",
    slug: "lumen-learning",
    title: "Lumen Learning",
    shortDescription:
      "A learning platform for course delivery, progress tracking and cohort management for corporate training.",
    fullDescription: [
      "Lumen delivers structured courses to corporate learners, tracking progress and completion across cohorts and teams.",
      "The backend handles content structure, enrolment, progress events and reporting for training managers.",
    ],
    category: "saas",
    role: "PHP Developer",
    period: "2019 — 2020",
    technologies: ["PHP 7.3", "Laravel 6", "MySQL", "Redis", "Vue.js"],
    liveUrl: "",
    featured: false,
    coverImage: null,
    gallery: [],
    highlights: [
      "Course, module and lesson hierarchy with prerequisites",
      "Progress tracking from granular learner events",
      "Cohort reporting for training managers",
    ],
    responsibilities: [
      "Built enrolment and progress tracking APIs",
      "Implemented reporting exports",
      "Maintained and refactored legacy modules",
    ],
    caseStudyAvailable: false,
  },
  {
    id: "p-12",
    slug: "quorum-memberships",
    title: "Quorum Memberships",
    shortDescription:
      "A membership platform for associations — member directories, renewals, events and payments.",
    fullDescription: [
      "Quorum gives professional associations one place to manage members, renewals, event registrations and payments.",
      "The system automates renewal reminders and keeps membership status in sync with payments.",
    ],
    category: "saas",
    role: "PHP Developer",
    period: "2018 — 2019",
    technologies: ["PHP 7.2", "Laravel 5.8", "MySQL", "jQuery", "Payment gateway API"],
    liveUrl: "",
    featured: false,
    coverImage: null,
    gallery: [],
    highlights: [
      "Automated renewal reminders and status updates",
      "Event registration with capacity management",
      "Searchable member directory with privacy controls",
    ],
    responsibilities: [
      "Developed membership and renewal features",
      "Integrated the payment gateway",
      "Built event registration flows",
    ],
    caseStudyAvailable: false,
  },
];
