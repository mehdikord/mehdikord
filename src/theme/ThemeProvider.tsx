"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";

import { THEME_EVENT, applyTheme, readTheme, resolveTheme, type Theme } from "@/theme/theme";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: "dark", setTheme: () => {} });

function subscribe(onChange: () => void) {
  window.addEventListener(THEME_EVENT, onChange);
  return () => window.removeEventListener(THEME_EVENT, onChange);
}

/**
 * Exposes the current theme to Client Components. The server always renders
 * "dark"; the client reads the attribute set by the pre-paint script and
 * re-renders after hydration, so no markup mismatch occurs.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "dark" as Theme);
  const setTheme = useCallback((next: Theme) => applyTheme(next), []);

  // Safety net: if <html> is ever (re)created by React rather than loaded from
  // the server, the pre-paint script has not run, so apply the theme here.
  useEffect(() => {
    if (!document.documentElement.dataset.theme) applyTheme(resolveTheme());
  }, []);
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
