import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  experimental: {
    // Full-page project screenshots are uploaded through admin Server Actions
    // (up to 40 MB each, plus multipart overhead) and optimized on the server.
    serverActions: { bodySizeLimit: "42mb" },
    // The admin panel runs behind the proxy, which buffers request bodies up to
    // this size (10 MB by default) — larger uploads would arrive truncated.
    proxyClientMaxBodySize: "42mb",
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
