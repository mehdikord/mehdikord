import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    // The hero poster is served from the supplied CDN. Add hosts here if
    // project screenshots are later loaded from a remote origin.
    remotePatterns: [
      { protocol: "https", hostname: "d2ol7oe51mr4n9.cloudfront.net" },
    ],
  },
};

export default nextConfig;
