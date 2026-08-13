import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    // Force la racine du workspace sur ce projet.
    // Sans ça, Next remonte jusqu'à C:\Users\hp\package-lock.json.
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
