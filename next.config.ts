import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  experimental: {
    // Project screenshots are uploaded through admin Server Actions (8 MB each, plus multipart overhead).
    serverActions: { bodySizeLimit: "9mb" },
  },
  images: {
    // The hero poster is served from the supplied CDN. Add hosts here if
    // project screenshots are later loaded from a remote origin.
    remotePatterns: [
      { protocol: "https", hostname: "d2ol7oe51mr4n9.cloudfront.net" },
    ],
  },
  async redirects() {
    return [{ source: "/adminisrator/:path*", destination: "/administrator/:path*", permanent: false }];
  },
};

export default nextConfig;
