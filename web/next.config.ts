import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'standalone',
  // Disable Turbopack and limit parallel workers to fix Hostinger crashes
  experimental: {
    workerThreads: false,
    cpus: 1,
    turbo: {
      enabled: false
    }
  } as any,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
} as any;

export default nextConfig;
