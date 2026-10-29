/*
 * Background for the contact section, designed as the opening of the footer's
 * wave scene: a violet aura in the waves' palette, a faint dot matrix echoing
 * the hero globe, and thin wave lines drifting toward the ocean below. The
 * bottom fades to the page colour the footer waves rise from.
 */

const WIDTH = 2880;
const HEIGHT = 240;

/** A sine wave across two identical tiles, so a -50% translation loops seamlessly. */
function wavePath(amplitude: number, period: number, phase: number): string {
  const mid = HEIGHT / 2;
  let d = "";
  for (let x = 0; x <= WIDTH; x += 12) {
    const y = mid + amplitude * Math.sin(((x + phase) / period) * Math.PI * 2);
    d += `${x === 0 ? "M" : "L"}${x} ${y.toFixed(1)}`;
  }
  return d;
}

// Periods divide the 1440px tile so each line repeats exactly at the seam.
const lines = [
  { amplitude: 26, period: 720, phase: 0, opacity: 0.55, duration: 34, width: 1.25 },
  { amplitude: 40, period: 1440, phase: 360, opacity: 0.35, duration: 52, width: 1 },
  { amplitude: 16, period: 480, phase: 120, opacity: 0.25, duration: 26, width: 1 },
  { amplitude: 54, period: 1440, phase: 900, opacity: 0.18, duration: 70, width: 1 },
];

export function ContactBackdrop() {
  return (
    <div aria-hidden dir="ltr" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Aura in the footer waves' palette, sitting behind the headline. */}
      <div className="absolute inset-x-0 top-0 h-[85%] bg-[radial-gradient(ellipse_55%_45%_at_50%_38%,rgb(130_87_255/0.20),rgb(44_21_119/0.12)_45%,transparent_72%)]" />

      {/* Dot matrix, fading out from the centre. */}
      <div
        className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000,transparent_75%)]"
        style={{
          backgroundImage: "radial-gradient(circle, rgb(var(--t-dot) / 0.35) 1px, transparent 1.4px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Drifting wave lines below the content, flowing into the footer's ocean. */}
      <div className="absolute inset-x-0 bottom-4 h-44 [mask-image:linear-gradient(to_right,transparent,#000_18%,#000_82%,transparent)] md:h-56">
        {lines.map((line, index) => (
          <svg
            key={index}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            preserveAspectRatio="none"
            className="wave-drift absolute inset-y-0 start-0 h-full w-[200%]"
            style={{ animationDuration: `${line.duration}s`, animationDirection: index % 2 ? "reverse" : "normal" }}
          >
            <path
              d={wavePath(line.amplitude, line.period, line.phase)}
              fill="none"
              style={{ stroke: "var(--color-accent-strong)" }}
              strokeOpacity={line.opacity}
              strokeWidth={line.width}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ))}
      </div>

      {/* Hand-off to the footer: top blends from the previous section, bottom to the page colour. */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-950 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink-950 to-transparent" />
    </div>
  );
}
