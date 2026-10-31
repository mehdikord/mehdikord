import { ArrowUpRight, Mail, Phone } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

import { ContactBackdrop } from "@/components/contact/ContactBackdrop";
import { CopyButton } from "@/components/contact/CopyButton";
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

/** Brand colour for each channel's icon tile and hover glow. */
const brands: Record<ContactChannelId, string> = {
  email: "linear-gradient(135deg, #8257ff, #6d6bff)",
  phone: "linear-gradient(135deg, #22c55e, #0ea5a4)",
  telegram: "linear-gradient(135deg, #2aabee, #1d8fd6)",
  linkedin: "linear-gradient(135deg, #0a66c2, #2f8ae6)",
  instagram: "linear-gradient(135deg, #f58529 0%, #dd2a7b 50%, #8134af 100%)",
};

const glows: Record<ContactChannelId, string> = {
  email: "#8257ff",
  phone: "#22c55e",
  telegram: "#2aabee",
  linkedin: "#0a66c2",
  instagram: "#dd2a7b",
};

/** Phone first (the primary call to action), then the rest in their usual order. */
const channelOrder: ContactChannelId[] = ["phone", "email", "telegram", "linkedin", "instagram"];

function ChannelCard({ channel, notConfigured, newTab }: { channel: ContactChannel; notConfigured: string; newTab: string }) {
  const Icon = icons[channel.id];
  const configured = channel.href !== null;

  const body = (
    <>
      {/* Brand-coloured glow that rises from the corner on hover. */}
      {configured ? (
        <span
          aria-hidden
          className="pointer-events-none absolute -top-12 -end-12 size-40 rounded-full opacity-0 blur-3xl transition-opacity duration-700 ease-out-quart group-hover:opacity-50"
          style={{ background: glows[channel.id] }}
        />
      ) : null}

      <span className="relative flex items-start justify-between gap-4">
        <span
          className={cn(
            "inline-flex size-12 items-center justify-center rounded-[0.9rem] shadow-[inset_0_1px_0_rgb(255_255_255/0.25)] transition-[rotate,scale,box-shadow] duration-500 ease-out-expo",
            configured
              ? "text-white group-hover:-rotate-6 group-hover:scale-105 group-hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.3),0_12px_30px_-10px_var(--glow)]"
              : "bg-tint/[0.04] text-fg-subtle ring-1 ring-line",
          )}
          style={configured ? ({ background: brands[channel.id], "--glow": glows[channel.id] } as React.CSSProperties) : undefined}
        >
          <Icon className="size-[1.35rem]" strokeWidth={1.75} />
        </span>
        {configured ? (
          <span className="inline-flex size-8 items-center justify-center rounded-full border border-line text-fg-subtle transition-[border-color,color,background-color] duration-500 ease-out-expo group-hover:border-transparent group-hover:bg-fg group-hover:text-ink-950">
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
              strokeWidth={1.75}
            />
          </span>
        ) : null}
      </span>

      <span className="relative mt-8 block">
        <span className="label-mono block text-fg-subtle">{channel.label}</span>
        {configured ? (
          <span dir="ltr" className="mt-1.5 block truncate text-start text-[0.9375rem] font-medium text-fg rtl:text-end">
            {channel.display}
          </span>
        ) : (
          <span className="mt-1.5 block text-xs text-pretty text-fg-subtle italic">{notConfigured}</span>
        )}
      </span>

      {/* Hairline that lights up in the brand colour. */}
      {configured ? (
        <span
          aria-hidden
          className="absolute inset-x-5 bottom-0 h-px origin-left scale-x-0 transition-transform duration-700 ease-out-expo group-hover:scale-x-100 rtl:origin-right"
          style={{ background: brands[channel.id] }}
        />
      ) : null}
    </>
  );

  const cardClass = cn(
    "group relative block h-full overflow-hidden rounded-lg p-5 transition-[translate,border-color,box-shadow] duration-500 ease-out-expo",
    configured ? "glass-card hover:-translate-y-1 hover:border-line-strong" : "rounded-lg border border-dashed border-line-strong bg-ink-900/30",
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
  const phone = channels.find((channel) => channel.id === "phone");
  const visibleChannels = channelOrder
    .map((id) => channels.find((channel) => channel.id === id))
    .filter((channel): channel is ContactChannel => channel !== undefined && (channel.href !== null || showPlaceholders));

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
            className="mt-8 text-[clamp(2.5rem,1.3rem+5vw,6.25rem)] leading-[0.95] font-semibold tracking-[-0.05em] text-balance"
          />

          <Reveal delay={0.15}>
            <p className="text-lead mx-auto mt-8 max-w-2xl text-pretty text-fg-muted">{copy.intro}</p>
          </Reveal>

          <Reveal delay={0.25} className="mt-10 flex flex-col items-center gap-5">
            {phone?.href ? (
              <>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <ButtonLink href={phone.href} icon="up-right">
                    {copy.callCta}
                  </ButtonLink>
                  <CopyButton value={phone.display} labels={{ copy: copy.copyPhone, copied: copy.copied }} />
                </div>
                <a
                  href={phone.href}
                  dir="ltr"
                  className="group inline-flex items-center gap-3 rounded-full border border-line bg-ink-950/40 py-2 ps-2.5 pe-5 backdrop-blur-md transition-[border-color,background-color] duration-300 hover:border-accent/50 hover:bg-accent-soft"
                >
                  <span className="inline-flex size-8 items-center justify-center rounded-full bg-signal/15 text-signal">
                    <Phone className="size-4" strokeWidth={1.75} />
                  </span>
                  <span className="font-mono text-[1.0625rem] font-medium tracking-wide text-fg tabular-nums">{phone.display}</span>
                </a>
                {email?.href ? (
                  <p className="label-mono text-fg-subtle">
                    {copy.orEmail}{" "}
                    <a
                      href={email.href}
                      dir="ltr"
                      className="font-mono normal-case tracking-normal text-fg-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-fg hover:decoration-accent"
                    >
                      {email.display}
                    </a>
                  </p>
                ) : null}
              </>
            ) : email?.href ? (
              <>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <ButtonLink href={email.href} icon="up-right">
                    {copy.emailCta}
                  </ButtonLink>
                  <CopyButton value={email.display} labels={{ copy: copy.copyEmail, copied: copy.copied }} />
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
                <span className="relative inline-flex size-10 items-center justify-center rounded-full border border-accent/40 bg-ink-950 font-mono text-xs text-accent shadow-[0_0_0_6px_var(--color-ink-950)]">
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
