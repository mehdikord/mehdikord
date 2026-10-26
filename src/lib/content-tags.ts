/**
 * Cache tags for site content. Public reads are cached with these tags and
 * the admin panel expires them after every change, so pages stay static
 * until content actually changes.
 */
export const contentTags = {
  /** Profile, engineering principles and key strengths. */
  profile: "content:profile",
  /** Project categories, projects and their images. */
  projects: "content:projects",
  /** Experience timeline and skill groups. */
  career: "content:career",
} as const;

export type ContentTag = (typeof contentTags)[keyof typeof contentTags];
