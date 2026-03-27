import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Disable Next.js API routes so PHP can handle them
  api: {
    externalResolver: true,
  },
  
  // Skip Next.js routing for /api routes (let PHP handle them)
  async rewrites() {
    return [];
  },
};

export default nextConfig;
