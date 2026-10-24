/**
 * Pure-CSS stand-in for the hero media: a starfield and a dotted violet globe
 * arranged like the video. Always rendered underneath, so the hero stays
 * complete if both the poster and the video fail to load.
 */
export function HeroFallbackArt() {
  return (
    <div aria-hidden className="absolute inset-0">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 12% 18%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 78% 12%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 34% 8%, #cfc4ff 50%, transparent 51%), radial-gradient(1px 1px at 88% 34%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 6% 52%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 58% 22%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 22% 38%, #bfb2ff 50%, transparent 51%), radial-gradient(1px 1px at 94% 64%, #fff 50%, transparent 51%)",
          backgroundSize: "420px 420px",
        }}
      />
      <div
        className="absolute left-1/2 top-[22%] aspect-square w-[min(130vw,72rem)] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgb(130 87 255 / 0.32), rgb(40 22 110 / 0.35) 45%, rgb(5 5 7 / 0.9) 72%)",
          boxShadow: "0 0 120px 10px rgb(130 87 255 / 0.25), inset 0 2px 40px rgb(190 170 255 / 0.35)",
        }}
      >
        <div
          className="absolute inset-0 rounded-full opacity-60"
          style={{
            backgroundImage: "radial-gradient(circle, rgb(190 170 255 / 0.55) 1px, transparent 1.4px)",
            backgroundSize: "9px 9px",
            maskImage: "radial-gradient(circle at 50% 35%, #000 30%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle at 50% 35%, #000 30%, transparent 70%)",
          }}
        />
      </div>
      <div className="absolute left-1/2 top-[48%] h-[16%] w-[min(150vw,86rem)] -translate-x-1/2 rounded-[50%] border border-accent/25" />
    </div>
  );
}
