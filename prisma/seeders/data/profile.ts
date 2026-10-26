import type { Locale } from "@/i18n/config";
import type { ContactDetails, Profile } from "@/types/portfolio";

import { heroMedia } from "./media";

/**
 * Initial profile content seeded into `profiles` / `profile_translations`.
 * After seeding, edit it in the admin panel. Language-independent values
 * (contact, years, links) are defined once in `shared` and reused by each locale.
 */

const contact: ContactDetails = {
  /** e.g. "hello@example.com" */
  email: "",
  /** International format, e.g. "+98 912 000 0000" */
  phone: "",
  /** Telegram username without "@" */
  telegram: "",
  /** Full profile URL, e.g. "https://www.linkedin.com/in/username" */
  linkedin: "",
  /** Instagram username without "@" */
  instagram: "",
};

const shared = {
  initials: "MK",
  yearsOfExperience: 8,
  contact,
  available: true,
  ctaTargets: { primary: "#work", secondary: "#contact" },
  signature: ["PHP", "Laravel", "System Architecture"],
} as const;

const en: Profile = {
  name: "Mehdi Kord",
  initials: shared.initials,
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
    { icon: "code", label: "PHP & Laravel" },
    { icon: "architecture", label: "Backend architecture" },
    { icon: "api", label: "API design" },
    { icon: "database", label: "Database modelling & optimisation" },
    { icon: "modules", label: "Modular application architecture" },
    { icon: "scale", label: "Scalable business systems" },
    { icon: "auth", label: "Authentication & authorisation" },
    { icon: "security", label: "Application security" },
    { icon: "integrations", label: "Third-party integrations" },
    { icon: "performance", label: "Performance optimisation" },
    { icon: "leadership", label: "Technical leadership" },
    { icon: "frontend", label: "Vue.js & frontend collaboration" },
    { icon: "ai", label: "AI-assisted development" },
  ],
  yearsOfExperience: shared.yearsOfExperience,
  availability: { available: shared.available, label: "Open to new opportunities" },
  hero: {
    headline: [
      [{ text: "Engineering" }, { text: "systems." }],
      [{ text: "Building" }, { text: "what scales.", emphasis: true }],
    ],
    description:
      "Senior PHP & Laravel engineer with 8+ years of experience in backend architecture, scalable applications and complex software systems.",
    primaryCta: { label: "Explore My Work", href: shared.ctaTargets.primary },
    secondaryCta: { label: "Let's Talk", href: shared.ctaTargets.secondary },
    signature: shared.signature,
    media: heroMedia,
  },
  contact: shared.contact,
};

const fa: Profile = {
  name: "مهدی کرد",
  initials: shared.initials,
  title: "مهندس ارشد بک‌اند · PHP و لاراول",
  location: "آماده همکاری دورکاری در سراسر دنیا",
  summary:
    "مهندس ارشد بک‌اند با تخصص PHP و لاراول — طراح معماری، APIها و مدل‌های داده نرم‌افزارهای تجاری پیچیده و مقیاس‌پذیر.",
  bio: [
    "سیستم‌های بک‌اندی را طراحی و پیاده‌سازی می‌کنم که محصولات حیاتی کسب‌وکار به آن‌ها وابسته‌اند — APIها، مدل‌های داده، صف‌ها و یکپارچه‌سازی‌هایی که باید مدت‌ها پس از روز انتشار هم بی‌نقص کار کنند.",
    "بیش از هشت سال است که عمدتاً با PHP و لاراول کار می‌کنم؛ مسیری از توسعه فیچر تا مالکیت معماری: شکل‌دادن به کدبیس‌های ماژولار، مدل‌سازی دامنه‌های پیچیده و انتخاب بده‌بستان‌هایی که سیستم را با رشد تیم و ترافیک، سریع، امن و قابل‌نگهداری نگه می‌دارد.",
    "با مهندسان فرانت‌اند — اغلب در Vue.js — و تیم‌های محصول همکاری نزدیک دارم و نیازمندی‌های مبهم را به مرزهای روشن و نرم‌افزار قابل‌پیش‌بینی تبدیل می‌کنم. همچنین از جریان‌های کاری مبتنی بر هوش مصنوعی استفاده می‌کنم تا سریع‌تر پیش بروم، بدون آنکه استاندارد بازبینی، تست و طراحی پایین بیاید.",
  ],
  philosophy: [
    {
      title: "اول مرزها، بعد فیچرها",
      body: "مرزهای روشن بین ماژول‌ها و قراردادهای صریح، تغییر سیستم را از هر انتزاع هوشمندانه‌ای ساده‌تر می‌کنند.",
    },
    {
      title: "ساده و مطمئن، آن‌جا که مهم است",
      body: "ابزارهای امتحان‌پس‌داده برای مسیرهای حیاتی؛ آزمایش در جایی که هزینه اشتباه کم است.",
    },
    {
      title: "خوانا حتی ساعت ۳ بامداد",
      body: "کد، لاگ و مدل داده باید خودشان را برای هر کسی که آنکال است توضیح دهند — حتی برای خودِ آینده‌ام.",
    },
  ],
  strengths: [
    { icon: "code", label: "PHP و لاراول" },
    { icon: "architecture", label: "معماری بک‌اند" },
    { icon: "api", label: "طراحی API" },
    { icon: "database", label: "مدل‌سازی و بهینه‌سازی پایگاه‌داده" },
    { icon: "modules", label: "معماری ماژولار" },
    { icon: "scale", label: "سیستم‌های تجاری مقیاس‌پذیر" },
    { icon: "auth", label: "احراز هویت و سطح دسترسی" },
    { icon: "security", label: "امنیت اپلیکیشن" },
    { icon: "integrations", label: "یکپارچه‌سازی با سرویس‌های ثالث" },
    { icon: "performance", label: "بهینه‌سازی کارایی" },
    { icon: "leadership", label: "رهبری فنی" },
    { icon: "frontend", label: "Vue.js و همکاری با فرانت‌اند" },
    { icon: "ai", label: "توسعه با کمک هوش مصنوعی" },
  ],
  yearsOfExperience: shared.yearsOfExperience,
  availability: { available: shared.available, label: "آماده همکاری‌های جدید" },
  hero: {
    headline: [
      [{ text: "مهندسی" }, { text: "سیستم‌ها." }],
      [{ text: "ساختن" }, { text: "برای رشد.", emphasis: true }],
    ],
    description:
      "مهندس ارشد PHP و لاراول با بیش از ۸ سال تجربه در معماری بک‌اند، اپلیکیشن‌های مقیاس‌پذیر و سیستم‌های نرم‌افزاری پیچیده.",
    primaryCta: { label: "مشاهده نمونه‌کارها", href: shared.ctaTargets.primary },
    secondaryCta: { label: "گفت‌وگو کنیم", href: shared.ctaTargets.secondary },
    signature: ["PHP", "لاراول", "معماری سیستم"],
    media: heroMedia,
  },
  contact: shared.contact,
};

export const profiles: Record<Locale, Profile> = { en, fa };
