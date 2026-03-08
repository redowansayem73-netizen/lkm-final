import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Disable Turbopack and limit parallel workers to fix Hostinger crashes
  experimental: {
    workerThreads: false,
    cpus: 1,
    turbo: {
      enabled: false
    }
  } as any,
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
