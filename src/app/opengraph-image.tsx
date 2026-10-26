import { ImageResponse } from "next/og";

import { getProfile } from "@/lib/profile";

export const alt = "Portfolio preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  // Shared by both languages: the image font has no Persian glyphs, so it uses
  // the English profile.
  const profile = await getProfile("en");
  const headline = profile.hero.headline.map((line) => line.map((segment) => segment.text).join(" "));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(ellipse 70% 80% at 50% 120%, #3b1f9e 0%, #120a33 45%, #050507 75%)",
          color: "#f4f4f6",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 26 }}>
          <div
            style={{
              display: "flex",
              width: 56,
              height: 56,
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid rgba(155,123,255,0.6)",
              borderRadius: 10,
              fontSize: 22,
            }}
          >
            {profile.initials}
          </div>
          <span>{profile.name}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.02 }}>
          {headline.map((line, index) => (
            <span key={line} style={{ color: index === 1 ? "#b9a3ff" : "#f4f4f6" }}>
              {line}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#a3a3ae" }}>
          <span>{profile.title}</span>
          <span>{profile.yearsOfExperience}+ years</span>
        </div>
      </div>
    ),
    size,
  );
}
