"use client";

import dynamic from "next/dynamic";

// WebGL is client-only and below the fold: load it lazily, never on the server.
const Antigravity = dynamic(() => import("@/components/effects/Antigravity"), { ssr: false });

/**
 * Particle field behind the footer in the site's violet palette. The particles
 * gather into a rippling ring around the cursor and drift on their own when idle.
 */
export function FooterAntigravity() {
  return (
    <Antigravity
      colors={["#8257ff", "#b49bff", "#6d6bff", "#e9e2ff"]}
      count={1100}
      magnetRadius={9}
      ringRadius={7}
      particleSize={0.85}
      ambient={0.3}
      waveAmplitude={1}
      colorSpeed={0.04}
      lerpSpeed={0.05}
      opacity={0.8}
      maxDevicePixelRatio={1.5}
      autoAnimate
    />
  );
}
