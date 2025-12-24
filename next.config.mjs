/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
    // Fix the quality warning (optional but recommended for Next.js 16+)
    qualities: [60, 75, 90], // Add 90 here since we're using quality={90}
  },
};

export default nextConfig;