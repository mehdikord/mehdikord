import { ButtonLink } from "@/components/ui/ButtonLink";
import { getDictionary } from "@/data/dictionaries";
import { localePath } from "@/i18n/format";
import { getLocale } from "@/i18n/server";

/** Shared 404 composition for unknown routes and unknown project slugs. */
export async function NotFoundView({ variant = "page" }: { variant?: "page" | "project" }) {
  const locale = await getLocale();
  const copy = getDictionary(locale).notFound;
  const title = variant === "project" ? copy.projectTitle : copy.title;
  const body = variant === "project" ? copy.projectBody : copy.body;

  return (
    <section className="relative isolate flex min-h-svh items-center overflow-hidden pt-(--nav-h)">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="hairline-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000,transparent_75%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_50%_55%,rgb(130_87_255/0.16),transparent_70%)]" />
      </div>
      <div className="container-page py-24">
        <p className="label-mono text-accent">
          {copy.errorLabel} {copy.code}
        </p>
        <p
          aria-hidden
          className="display-name mt-6 bg-gradient-to-b from-fg/25 to-fg/0 bg-clip-text text-[clamp(7rem,28vw,22rem)] leading-[0.8] font-semibold tracking-[-0.07em] text-transparent"
        >
          {copy.code}
        </p>
        <h1 className="text-headline mt-8 max-w-[18ch] text-balance">{title}</h1>
        <p className="mt-6 max-w-md text-fg-muted">{body}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href={localePath(locale)} icon="none">
            {copy.home}
          </ButtonLink>
          <ButtonLink href={localePath(locale, "/projects")} variant="secondary" icon="none">
            {copy.projects}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
