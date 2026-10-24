import type { Metadata } from "next";

import { NotFoundView } from "@/components/ui/NotFoundView";
import { content } from "@/data/content";

export const metadata: Metadata = {
  title: content.notFound.title,
  robots: { index: false },
};

export default function NotFound() {
  return <NotFoundView title={content.notFound.title} body={content.notFound.body} />;
}
