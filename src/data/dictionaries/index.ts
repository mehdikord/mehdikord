import type { Locale } from "@/i18n/config";

import { en, type Dictionary } from "./en";
import { fa } from "./fa";

const dictionaries: Record<Locale, Dictionary> = { en, fa };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
