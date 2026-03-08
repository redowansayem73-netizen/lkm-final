import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Fix for Hostinger resource issues: limit parallel workers
  experimental: {
    workerThreads: false,
    cpus: 1
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
