/** Theme settings shared by the pre-paint script, the provider and the toggle. */

export type Theme = "light" | "dark";

/** localStorage key holding an explicit choice; absent means "follow the system". */
export const THEME_STORAGE_KEY = "theme";

/** Name of the event dispatched on `window` after the theme changes. */
export const THEME_EVENT = "themechange";

/**
 * Runs inline in <head> before anything paints: applies the stored choice,
 * or the system preference, so the first frame already has the right colours.
 */
export const themeInitScript = `(function(){try{var s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});var t=s==="light"||s==="dark"?s:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;}catch(e){}})();`;

/** The theme to use: the stored choice, or the system preference. */
export function resolveTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Storage unavailable: fall through to the system preference.
  }
  return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function readTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage may be unavailable; the choice still applies for this page.
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}
