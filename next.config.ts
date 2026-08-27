import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/__lab",
        destination: "/lab",
      },
      {
        source: "/__lab/:path*",
        destination: "/lab/:path*",
      },
    ];
  },
};

export default nextConfig;
