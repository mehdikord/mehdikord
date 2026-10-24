import { ArrowUpRight, Mail, Phone } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

import { MaskedHeading } from "@/components/motion/MaskedHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { InstagramIcon, LinkedInIcon, TelegramIcon } from "@/components/ui/BrandIcons";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StatusDot } from "@/components/ui/StatusDot";
import { content } from "@/data/content";
import { profile } from "@/data/profile";
import { getContactChannels, type ContactChannelId } from "@/lib/contact";
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

export function ContactSection() {
  const copy = content.contact;
  const channels = getContactChannels(profile.contact);
  const email = channels.find((channel) => channel.id === "email");
  const visibleChannels = channels.filter((channel) => channel.href || showPlaceholders);

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden border-t border-line py-(--section-y)">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(ellipse_60%_70%_at_50%_100%,rgb(130_87_255/0.20),transparent_70%)]" />
        <div className="hairline-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_100%,#000,transparent_75%)]" />
      </div>

      <div className="container-page">
        <Reveal still className="label-mono flex items-center gap-4 text-fg-subtle">
          <span className="text-accent">{copy.index}</span>
          <span>{copy.label}</span>
          <span aria-hidden className="h-px flex-1 bg-line" />
          <span className="inline-flex items-center gap-2">
            <StatusDot active={profile.availability.available} />
            <span className="hidden sm:inline">{profile.availability.label}</span>
          </span>
        </Reveal>

        <MaskedHeading
          id="contact-title"
          lines={copy.title}
          className="mt-12 max-w-[14ch] text-[clamp(2.75rem,1.4rem+6.2vw,8rem)] leading-[0.95] font-semibold tracking-[-0.05em] md:mt-16"
        />

        <div className="mt-16 grid gap-16 md:mt-24 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-lead max-w-md text-pretty text-fg-muted">{copy.intro}</p>
            </Reveal>
            <Reveal delay={0.1} className="mt-10">
              {email?.href ? (
                <div className="flex flex-col items-start gap-6">
                  <ButtonLink href={email.href} icon="up-right">
                    {copy.emailCta}
                  </ButtonLink>
                  <a
                    href={email.href}
                    className="text-[clamp(1.25rem,1rem+1.2vw,2rem)] font-medium tracking-tight break-all underline decoration-line-strong decoration-1 underline-offset-[0.3em] transition-colors hover:decoration-accent"
                  >
                    {email.display}
                  </a>
                </div>
              ) : !showPlaceholders && visibleChannels.length === 0 ? (
                <p className="text-fg-subtle">{copy.noChannels}</p>
              ) : null}
            </Reveal>
          </div>

          {visibleChannels.length > 0 ? (
            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal still>
                <h3 className="label-mono text-fg-subtle">{copy.channelsLabel}</h3>
              </Reveal>
              <RevealGroup as="ul" className="mt-5 border-t border-line">
                {visibleChannels.map((channel) => {
                  const Icon = icons[channel.id];
                  const inner = (
                    <>
                      <span className="flex items-center gap-4">
                        <Icon className="size-5 shrink-0 text-fg-subtle transition-colors duration-300 group-hover:text-accent" strokeWidth={1.6} />
                        <span className="label-mono text-fg-subtle">{channel.label}</span>
                      </span>
                      <span className="flex min-w-0 items-center gap-3">
                        <span className={cn("truncate", channel.href ? "text-fg" : "text-xs text-fg-subtle italic")}>
                          {channel.href ? channel.display : copy.notConfigured}
                        </span>
                        {channel.href ? (
                          <ArrowUpRight
                            aria-hidden
                            className="size-4 shrink-0 text-fg-subtle transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg"
                            strokeWidth={1.75}
                          />
                        ) : null}
                      </span>
                    </>
                  );
                  const rowClass = "group flex items-center justify-between gap-6 border-b border-line py-5";

                  return (
                    <RevealItem as="li" key={channel.id}>
                      {channel.href ? (
                        <a
                          href={channel.href}
                          className={cn(rowClass, "transition-colors duration-300 hover:border-accent/40")}
                          {...(channel.external
                            ? { target: "_blank", rel: "noopener noreferrer", "aria-label": `${channel.label}: ${channel.display} (opens in a new tab)` }
                            : {})}
                        >
                          {inner}
                        </a>
                      ) : (
                        <div className={cn(rowClass, "border-dashed opacity-80")}>{inner}</div>
                      )}
                    </RevealItem>
                  );
                })}
              </RevealGroup>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
