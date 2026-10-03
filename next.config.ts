import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Share cards for quiz results are rendered on demand and read these fonts from disk.
  outputFileTracingIncludes: {
    "/share/**": ["./src/assets/fonts/**"],
  },
  images: {
    // Demo photography is served from Unsplash. Swap for your own product shots.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
