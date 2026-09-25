/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "flagcdn.com" },
      { protocol: "https", hostname: "ui-avatars.com" }
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  experimental: {
    serverActions: { bodySizeLimit: "10mb" },
    optimizePackageImports: ['lucide-react'],
  },

  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
  },

  // NOTE: `modularizeImports` for lucide-react was removed. It duplicates
  // `experimental.optimizePackageImports` above, which supersedes it in
  // Next 13.5+. Running both on the same package causes very slow dev
  // compiles because each icon import is resolved twice.

  staticPageGenerationTimeout: 120,

  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
