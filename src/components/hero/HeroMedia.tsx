"use client";

import { useReducedMotion } from "motion/react";
import Image from "next/image";
import { useCallback, useState } from "react";

import { HeroFallbackArt } from "@/components/hero/HeroFallbackArt";
import { useCrossfadeLoop } from "@/hooks/use-crossfade-loop";
import { cn } from "@/lib/utils";

type VideoStatus = "idle" | "playing" | "failed";

// No `src` or `autoPlay` in markup: the loop hook assigns the source and starts
// muted playback only after confirming motion is allowed and data saver is off.
const videoProps = {
  className: "absolute inset-0 size-full object-cover object-[50%_65%]",
  muted: true,
  playsInline: true,
  preload: "none",
  disablePictureInPicture: true,
  disableRemotePlayback: true,
  tabIndex: -1,
} as const;

interface HeroMediaProps {
  video: string;
  poster: string;
}

/**
 * Layered hero background: CSS artwork → poster image → looping video.
 * The video only becomes visible once it is actually playing, so a slow or
 * failed load never produces a black frame. With reduced motion, playback
 * never starts and the poster remains as a still background.
 */
export function HeroMedia({ video, poster }: HeroMediaProps) {
  const reduceMotion = useReducedMotion();
  const [posterFailed, setPosterFailed] = useState(false);
  const [status, setStatus] = useState<VideoStatus>("idle");

  // `null` until the preference is known on the client — don't start early.
  const enabled = reduceMotion === false && status !== "failed";

  const handlePlaying = useCallback(() => setStatus("playing"), []);
  const handleFailure = useCallback(() => setStatus("failed"), []);

  const { containerRef, firstRef, secondRef } = useCrossfadeLoop({
    src: video,
    enabled,
    onPlaying: handlePlaying,
    onFailure: handleFailure,
  });

  const videoVisible = enabled && status === "playing";

  return (
    <div ref={containerRef} aria-hidden className="absolute inset-0 overflow-hidden bg-ink-950">
      <HeroFallbackArt />

      {!posterFailed ? (
        <Image
          src={poster}
          alt=""
          fill
          preload
          unoptimized
          sizes="100vw"
          className="object-cover object-[50%_65%]"
          onError={() => setPosterFailed(true)}
        />
      ) : null}

      <div
        className={cn(
          "absolute inset-0 isolate transition-opacity duration-[1400ms] ease-out-quart",
          videoVisible ? "opacity-100" : "opacity-0",
        )}
      >
        <video ref={firstRef} {...videoProps} poster={poster} />
        <video ref={secondRef} {...videoProps} poster={poster} />
      </div>

      {/* Legibility: top shade for the navigation, central scrim, bottom fade into the page. */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-ink-950/80 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_48%,rgb(5_5_7/0.62),transparent_75%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-ink-950 via-ink-950/70 to-transparent" />
    </div>
  );
}
