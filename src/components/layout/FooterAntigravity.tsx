"use client";

import dynamic from "next/dynamic";

import { useTheme } from "@/theme/ThemeProvider";

// WebGL is client-only and below the fold: load it lazily, never on the server.
const Antigravity = dynamic(() => import("@/components/effects/Antigravity"), { ssr: false });

const palettes = {
  dark: ["#8257ff", "#b49bff", "#6d6bff", "#e9e2ff"],
  light: ["#5a37df", "#6a48ec", "#4f4de0", "#2c1d7f"],
};

/**
 * Particle field behind the footer in the site's violet palette. The particles
 * gather into a rippling ring around the cursor and drift on their own when idle.
 */
export function FooterAntigravity() {
  const { theme } = useTheme();
  return (
    <Antigravity
      key={theme}
      colors={palettes[theme]}
      count={1100}
      magnetRadius={9}
      ringRadius={7}
      particleSize={0.85}
      ambient={0.3}
      waveAmplitude={1}
      colorSpeed={0.04}
      lerpSpeed={0.05}
      opacity={theme === "light" ? 0.7 : 0.8}
      maxDevicePixelRatio={1.5}
      autoAnimate
    />
  );
}
