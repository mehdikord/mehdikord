import { toSafeExternalUrl } from "@/lib/utils";
import type { ContactDetails } from "@/types/portfolio";

export type ContactChannelId = "email" | "phone" | "telegram" | "linkedin" | "instagram";

export interface ContactChannel {
  id: ContactChannelId;
  label: string;
  /** Human-readable value, e.g. "@username". Empty when not configured. */
  display: string;
  /** Link target, or `null` when the value is missing or invalid. */
  href: string | null;
  external: boolean;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const stripAt = (value: string) => value.trim().replace(/^@/, "");

export function getEmailHref(email: string): string | null {
  const value = email.trim();
  return EMAIL_PATTERN.test(value) ? `mailto:${value}` : null;
}

function getPhoneHref(phone: string): string | null {
  const digits = phone.replace(/[^\d+]/g, "");
  return /^\+?\d{6,15}$/.test(digits) ? `tel:${digits}` : null;
}

function getHandleHref(handle: string, base: string): string | null {
  const value = stripAt(handle);
  if (!value) return null;
  if (/^https?:\/\//.test(value)) return toSafeExternalUrl(value);
  return /^[A-Za-z0-9_.]{2,64}$/.test(value) ? `${base}${value}` : null;
}

/** Normalises raw profile values into renderable, validated channels. */
export function getContactChannels(
  contact: ContactDetails,
  labels: Record<ContactChannelId, string>,
): ContactChannel[] {
  const linkedin = toSafeExternalUrl(contact.linkedin.trim());

  return [
    {
      id: "email",
      label: labels.email,
      display: contact.email.trim(),
      href: getEmailHref(contact.email),
      external: false,
    },
    {
      id: "phone",
      label: labels.phone,
      display: contact.phone.trim(),
      href: getPhoneHref(contact.phone),
      external: false,
    },
    {
      id: "telegram",
      label: labels.telegram,
      display: contact.telegram ? `@${stripAt(contact.telegram)}` : "",
      href: getHandleHref(contact.telegram, "https://t.me/"),
      external: true,
    },
    {
      id: "linkedin",
      label: labels.linkedin,
      display: linkedin ? linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com/, "").replace(/\/$/, "") || "LinkedIn" : "",
      href: linkedin,
      external: true,
    },
    {
      id: "instagram",
      label: labels.instagram,
      display: contact.instagram ? `@${stripAt(contact.instagram)}` : "",
      href: getHandleHref(contact.instagram, "https://www.instagram.com/"),
      external: true,
    },
  ];
}
