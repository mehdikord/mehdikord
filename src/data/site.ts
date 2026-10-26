import type { SiteConfig } from "@/types/portfolio";

/** Site-wide settings. Set `NEXT_PUBLIC_SITE_URL` to the production domain before deploying. */
export const site: SiteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};
