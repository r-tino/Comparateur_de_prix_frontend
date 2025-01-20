// next.config.ts

import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Vérifiez si config.optimization existe
      if (config.optimization) {
        // Vérifiez si splitChunks existe, sinon initialisez-le
        if (!config.optimization.splitChunks) {
          config.optimization.splitChunks = {}
        }

        // Vérifiez si cacheGroups existe, sinon initialisez-le
        if (!config.optimization.splitChunks.cacheGroups) {
          config.optimization.splitChunks.cacheGroups = {}
        }

        // Ajoutez la configuration 'app-pages'
        config.optimization.splitChunks.cacheGroups["app-pages"] = {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          name: "app-pages",
          chunks: "all",
          priority: 10,
          enforce: true,
        }
      }
    }
    return config
  },
}

export default nextConfig