/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    domains: ["encrypted-tbn0.gstatic.com", "i0.wp.com", "thedisconnekt.com", "images.unsplash.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.com",
        pathname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "X-DNS-Prefetch-Control",
          value: "on",
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ],
    },
  ],
  compress: true,
  swcMinify: true,
  webpack: (config, { dev, isServer }) => {
    // Add fallback for punycode (handles DEP0040 warning)
    config.resolve.fallback = {
      ...config.resolve.fallback,
      punycode: false
    };

    // Keep your existing webpack optimization configuration
    if (!dev && !isServer) {
      Object.assign(config.optimization, {
        minimize: true,
        splitChunks: {
          chunks: "all",
          minSize: 20000,
          maxSize: 244000,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      })
    }
    return config
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
  },
}

module.exports = nextConfig 