/** Homepage section anchors, in navigation order. Labels live in the dictionaries. */
export type SectionId = "top" | "about" | "work" | "expertise" | "experience" | "contact";

export const navigationSections = ["top", "about", "work", "experience", "contact"] as const satisfies readonly SectionId[];

export type NavigationSection = (typeof navigationSections)[number];
