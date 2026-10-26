import { ArrowUpRight, Mail, Phone } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

import { ContactBackdrop } from "@/components/contact/ContactBackdrop";
import { CopyEmailButton } from "@/components/contact/CopyEmailButton";
import { SpotlightCard } from "@/components/contact/SpotlightCard";
import { MaskedHeading } from "@/components/motion/MaskedHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { InstagramIcon, LinkedInIcon, TelegramIcon } from "@/components/ui/BrandIcons";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StatusDot } from "@/components/ui/StatusDot";
import { getDictionary } from "@/data/dictionaries";
import { pad } from "@/i18n/format";
import { getLocale } from "@/i18n/server";
import { getContactChannels, type ContactChannel, type ContactChannelId } from "@/lib/contact";
import { getProfile } from "@/lib/profile";
import { cn } from "@/lib/utils";

const icons: Record<ContactChannelId, ComponentType<SVGProps<SVGSVGElement>>> = {
  email: Mail,
  phone: Phone,
  telegram: TelegramIcon,
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
};

// Unset channels are flagged during development and omitted in production.
const showPlaceholders = process.env.NODE_ENV !== "production";

function ChannelCard({ channel, notConfigured, newTab }: { channel: ContactChannel; notConfigured: string; newTab: string }) {
  const Icon = icons[channel.id];
  const configured = channel.href !== null;

  const body = (
    <>
      <span className="flex items-start justify-between gap-4">
        <span
          className={cn(
            "inline-flex size-11 items-center justify-center rounded-full ring-1 transition-[background-color,color,rotate] duration-500 ease-out-expo",
            configured
              ? "bg-accent-soft text-accent ring-accent/25 group-hover:-rotate-8 group-hover:bg-accent group-hover:text-ink-950"
              : "bg-white/[0.03] text-fg-subtle ring-line",
          )}
        >
          <Icon className="size-5" strokeWidth={1.6} />
        </span>
        {configured ? (
          <ArrowUpRight
            aria-hidden
            className="size-4 text-fg-subtle transition-[translate,color] duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
            strokeWidth={1.75}
          />
        ) : null}
      </span>
      <span className="mt-8 block">
        <span className="label-mono block text-fg-subtle">{channel.label}</span>
        {configured ? (
          <span dir="ltr" className="mt-1.5 block truncate text-start font-medium text-fg rtl:text-end">
            {channel.display}
          </span>
        ) : (
          <span className="mt-1.5 block text-xs text-pretty text-fg-subtle italic">{notConfigured}</span>
        )}
      </span>
    </>
  );

  const cardClass = cn(
    "group relative block h-full rounded-lg border p-5 transition-[translate,border-color,background-color] duration-500 ease-out-expo",
    configured
      ? "border-line bg-ink-900/60 backdrop-blur-sm hover:-translate-y-1 hover:border-transparent"
      : "border-dashed border-line-strong bg-ink-900/30",
  );

  return (
    <SpotlightCard className="h-full rounded-lg">
      {configured ? (
        <a
          href={channel.href ?? undefined}
          className={cardClass}
          {...(channel.external
            ? { target: "_blank", rel: "noopener noreferrer", "aria-label": `${channel.label}: ${channel.display} (${newTab})` }
            : {})}
        >
          {body}
        </a>
      ) : (
        <div className={cardClass}>{body}</div>
      )}
    </SpotlightCard>
  );
}

export async function ContactSection() {
  const locale = await getLocale();
  const copy = getDictionary(locale).contact;
  const profile = await getProfile(locale);
  const channels = getContactChannels(profile.contact, copy.channels);
  const email = channels.find((channel) => channel.id === "email");
  const visibleChannels = channels.filter((channel) => channel.href || showPlaceholders);

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden pt-(--section-y) pb-44 md:pb-56">
      <ContactBackdrop />

      <div className="container-page">
        <Reveal still className="label-mono flex items-center gap-4 text-fg-subtle">
          <span className="text-accent">{copy.index}</span>
          <span>{copy.label}</span>
          <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-line to-transparent rtl:bg-gradient-to-l" />
        </Reveal>

        <div className="mx-auto mt-16 flex max-w-5xl flex-col items-center text-center md:mt-24">
          <Reveal still>
            <p className="label-mono inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-ink-950/50 px-4 py-2 text-fg-muted backdrop-blur-md">
              <StatusDot active={profile.availability.available} />
              {profile.availability.label}
            </p>
          </Reveal>

          <MaskedHeading
            id="contact-title"
            lines={copy.title}
            className="mt-8 text-[clamp(2.75rem,1.4rem+6vw,7.5rem)] leading-[0.95] font-semibold tracking-[-0.05em] text-balance"
          />

          <Reveal delay={0.15}>
            <p className="text-lead mx-auto mt-8 max-w-2xl text-pretty text-fg-muted">{copy.intro}</p>
          </Reveal>

          <Reveal delay={0.25} className="mt-10 flex flex-col items-center gap-4">
            {email?.href ? (
              <>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <ButtonLink href={email.href} icon="up-right">
                    {copy.emailCta}
                  </ButtonLink>
                  <CopyEmailButton email={email.display} labels={{ copy: copy.copyEmail, copied: copy.copied }} />
                </div>
                <a
                  href={email.href}
                  dir="ltr"
                  className="font-mono text-sm text-fg-subtle underline decoration-line-strong underline-offset-4 transition-colors hover:text-fg hover:decoration-accent"
                >
                  {email.display}
                </a>
              </>
            ) : (
              <p className="rounded-full border border-dashed border-line-strong px-5 py-2.5 text-sm text-fg-subtle">
                {copy.noChannels}
              </p>
            )}
          </Reveal>
        </div>

        {visibleChannels.length > 0 ? (
          <div className="mt-20 md:mt-28">
            <Reveal still>
              <h3 className="label-mono text-center text-fg-subtle">{copy.channelsLabel}</h3>
            </Reveal>
            <RevealGroup
              as="ul"
              interval={0.06}
              className={cn(
                "mx-auto mt-6 grid gap-3 sm:grid-cols-2",
                visibleChannels.length >= 5 ? "lg:grid-cols-5" : visibleChannels.length === 4 ? "lg:grid-cols-4" : "max-w-4xl lg:grid-cols-3",
              )}
            >
              {visibleChannels.map((channel, index) => (
                <RevealItem
                  as="li"
                  key={channel.id}
                  className={cn(index === 0 && visibleChannels.length % 2 === 1 && "sm:col-span-2 lg:col-span-1")}
                >
                  <ChannelCard channel={channel} notConfigured={copy.notConfigured} newTab={copy.opensInNewTab} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        ) : null}

        <div className="mt-20 md:mt-28">
          <Reveal still>
            <h3 className="label-mono text-center text-fg-subtle">{copy.stepsLabel}</h3>
          </Reveal>
          <RevealGroup as="ol" interval={0.1} className="relative mx-auto mt-8 grid max-w-5xl gap-10 md:grid-cols-3 md:gap-8">
            {/* Connector line through the step markers. */}
            <span
              aria-hidden
              className="absolute inset-x-[16%] top-5 hidden h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent md:block"
            />
            {copy.steps.map((step, index) => (
              <RevealItem as="li" key={step.title} className="relative flex flex-col items-center text-center">
                <span className="relative inline-flex size-10 items-center justify-center rounded-full border border-accent/40 bg-ink-950 font-mono text-xs text-accent shadow-[0_0_0_6px_rgb(5_5_7)]">
                  {pad(locale, index + 1)}
                </span>
                <h4 className="mt-5 text-lg font-medium tracking-tight">{step.title}</h4>
                <p className="mt-2 max-w-xs text-sm text-pretty text-fg-muted">{step.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
