import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // All event artwork is generated with CSS gradients rather than bitmaps, so
  // next/image is intentionally unused and no remote image hosts are allowlisted.
  reactStrictMode: true,
};

export default nextConfig;
