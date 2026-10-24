import type { CSSProperties, ComponentType } from "react";

import { cn } from "@/lib/utils";
import type { PreviewAccent, PreviewKind, ProjectPreview as PreviewConfig } from "@/types/portfolio";

import { BillingPreview, CrmPreview, RecruitingPreview, TablePreview } from "./previews/business-previews";
import { AnalyticsPreview, CommercePreview, MapPreview, WorkflowPreview } from "./previews/product-previews";

const compositions: Record<PreviewKind, ComponentType> = {
  crm: CrmPreview,
  commerce: CommercePreview,
  map: MapPreview,
  billing: BillingPreview,
  table: TablePreview,
  analytics: AnalyticsPreview,
  recruiting: RecruitingPreview,
  workflow: WorkflowPreview,
};

const accents: Record<PreviewAccent, { a: string; b: string; soft: string }> = {
  violet: { a: "#9b7bff", b: "#6a45ff", soft: "rgb(155 123 255 / 0.16)" },
  indigo: { a: "#7f86ff", b: "#4f46e5", soft: "rgb(127 134 255 / 0.16)" },
  iris: { a: "#b48cff", b: "#7c3aed", soft: "rgb(180 140 255 / 0.16)" },
  orchid: { a: "#d08cff", b: "#9d4edd", soft: "rgb(208 140 255 / 0.16)" },
  azure: { a: "#7ea6ff", b: "#3f5bd9", soft: "rgb(126 166 255 / 0.16)" },
};

const darkTheme = {
  "--pv-frame": "#09080e",
  "--pv-shadow": "0 0 0 1px rgb(255 255 255 / 0.09), 0 40px 80px -24px rgb(0 0 0 / 0.75)",
  "--pv-bg": "#0b0a11",
  "--pv-panel": "#12111a",
  "--pv-raised": "#17161f",
  "--pv-line": "rgb(255 255 255 / 0.07)",
  "--pv-bar": "rgb(255 255 255 / 0.09)",
  "--pv-bar-strong": "rgb(255 255 255 / 0.2)",
  "--pv-text": "rgb(244 244 246 / 0.88)",
  "--pv-muted": "rgb(244 244 246 / 0.42)",
};

const lightTheme = {
  "--pv-frame": "#e6e4ef",
  "--pv-shadow": "0 0 0 1px rgb(12 11 18 / 0.08), 0 30px 60px -24px rgb(12 11 18 / 0.35)",
  "--pv-bg": "#f6f5fa",
  "--pv-panel": "#ffffff",
  "--pv-raised": "#eeecf5",
  "--pv-line": "rgb(12 11 18 / 0.08)",
  "--pv-bar": "rgb(12 11 18 / 0.08)",
  "--pv-bar-strong": "rgb(12 11 18 / 0.2)",
  "--pv-text": "rgb(12 11 18 / 0.86)",
  "--pv-muted": "rgb(12 11 18 / 0.46)",
};

interface ProjectPreviewProps {
  preview: PreviewConfig;
  title: string;
  className?: string;
}

/**
 * Original, illustrative interface composition for a project, rendered as a
 * 16:10 product window floating on an accent-tinted backdrop.
 */
export function ProjectPreview({ preview, title, className }: ProjectPreviewProps) {
  const Composition = compositions[preview.kind];
  const accent = accents[preview.accent];
  const style = {
    ...(preview.light ? lightTheme : darkTheme),
    "--pa": accent.a,
    "--pb": accent.b,
    "--ps": accent.soft,
  } as CSSProperties;

  return (
    <div role="img" aria-label={`Illustrative interface preview of ${title}`} className={cn("preview-frame", className)} style={style}>
      <div className="preview-canvas font-sans select-none" aria-hidden>
        <Composition />
      </div>
    </div>
  );
}
