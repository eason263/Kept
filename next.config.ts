import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Demo photography is served from Unsplash. Swap for your own product shots.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
