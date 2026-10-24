import { NotFoundView } from "@/components/ui/NotFoundView";
import { content } from "@/data/content";

export default function ProjectNotFound() {
  return <NotFoundView title={content.notFound.projectTitle} body={content.notFound.projectBody} />;
}
