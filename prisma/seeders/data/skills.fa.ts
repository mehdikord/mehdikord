import type { SkillGroupTranslation } from "@/types/portfolio";

/** Persian text for each group in `skills.ts`, keyed by id. */
export const skillsFa: Record<string, SkillGroupTranslation> = {
  backend: {
    title: "مهندسی بک‌اند",
    annotation: "تخصص اصلی",
    items: ["PHP 8.x", "لاراول", "Eloquent ORM", "صف‌ها و Horizon", "رویدادها و لیسنرها", "Laravel Octane", "تست با Pest و PHPUnit"],
  },
  architecture: {
    title: "معماری و مقیاس‌پذیری",
    annotation: "سیستم‌هایی که رشد می‌کنند",
    items: ["مونولیت ماژولار", "طراحی دامنه‌محور (DDD)", "مرزبندی سرویس‌ها", "استراتژی‌های کش", "پردازش غیرهمزمان", "چندمستأجری"],
  },
  data: {
    title: "پایگاه‌داده و زیرساخت",
    annotation: "داده‌ای که دوام می‌آورد",
    items: ["MySQL", "PostgreSQL", "Redis", "بهینه‌سازی کوئری و ایندکس", "Docker", "Linux و Nginx", "پایپلاین CI/CD"],
  },
  api: {
    title: "توسعه API و یکپارچه‌سازی",
    annotation: "قراردادها و کانکتورها",
    items: ["طراحی RESTful API", "وب‌هوک", "OAuth 2.0", "درگاه‌های پرداخت", "SDKهای سرویس‌های ثالث", "نسخه‌بندی API"],
  },
  frontend: {
    title: "همکاری با فرانت‌اند",
    annotation: "در سراسر استک",
    items: ["Vue.js", "Inertia.js", "TypeScript", "Tailwind CSS", "جریان کاری API-first"],
  },
  practice: {
    title: "امنیت و اصول مهندسی",
    annotation: "شیوه انجام کار",
    items: ["احراز هویت و سطح دسترسی", "اصول OWASP", "بازبینی کد", "رهبری فنی", "توسعه با کمک هوش مصنوعی", "مستندسازی"],
  },
};
