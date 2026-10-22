import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // The development badge otherwise sits directly over the phone's Home tab.
  devIndicators: false,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
