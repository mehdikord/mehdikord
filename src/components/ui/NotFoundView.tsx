import { ButtonLink } from "@/components/ui/ButtonLink";
import { content } from "@/data/content";

/** Shared 404 composition for the app and for unknown project slugs. */
export function NotFoundView({ title, body }: { title: string; body: string }) {
  const copy = content.notFound;
  return (
    <section className="relative isolate flex min-h-svh items-center overflow-hidden pt-(--nav-h)">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="hairline-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000,transparent_75%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_50%_55%,rgb(130_87_255/0.16),transparent_70%)]" />
      </div>
      <div className="container-page py-24">
        <p className="label-mono text-accent">Error {copy.code}</p>
        <p
          aria-hidden
          className="mt-6 bg-gradient-to-b from-fg/25 to-fg/0 bg-clip-text text-[clamp(7rem,28vw,22rem)] leading-[0.8] font-semibold tracking-[-0.07em] text-transparent"
        >
          {copy.code}
        </p>
        <h1 className="text-headline mt-8 max-w-[18ch] text-balance">{title}</h1>
        <p className="mt-6 max-w-md text-fg-muted">{body}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/" icon="none">
            {copy.home}
          </ButtonLink>
          <ButtonLink href="/projects" variant="secondary" icon="none">
            {copy.projects}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
