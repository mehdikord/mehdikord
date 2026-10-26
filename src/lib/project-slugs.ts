/**
 * Reserved slug whose page is prerendered as the project 404. The proxy
 * rewrites unknown project URLs to it so they return a real 404 status.
 */
export const MISSING_PROJECT_SLUG = "not-found";

/** Lowercase words joined by single hyphens, e.g. "atlas-crm". */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
