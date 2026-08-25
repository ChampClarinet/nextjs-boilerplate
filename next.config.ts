import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dev-vip.selen.ai",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "vip-security-international.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
