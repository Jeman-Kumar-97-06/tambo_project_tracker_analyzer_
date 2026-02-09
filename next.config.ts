import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Run ESLint separately via `npm run lint` (avoids deprecated next lint)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enhanced webpack configuration for MongoDB compatibility
  webpack: (config, { isServer }) => {
    // Stub optional peer deps from @standard-community/standard-json
    config.resolve.alias = {
      ...config.resolve.alias,
      effect: false,
      sury: false,
      "@valibot/to-json-schema": false,
    };

    // Only apply client-side MongoDB exclusions for browser builds
    if (!isServer) {
      // Exclude MongoDB and related packages from client bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        dns: false,
        tls: false,
        fs: false,
        crypto: false,
        stream: false,
        util: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        child_process: false,
        worker_threads: false,
        perf_hooks: false,
        mongodb: false,
        "mongodb-client-encryption": false,
        bson: false,
      };

      // Externalize MongoDB and related packages on client side
      config.externals = config.externals || [];
      config.externals.push({
        mongodb: "mongodb",
        "mongodb-client-encryption": "mongodb-client-encryption",
        aws4: "aws4",
        snappy: "snappy",
        "@mongodb-js/zstd": "@mongodb-js/zstd",
        kerberos: "kerberos",
        "bson-ext": "bson-ext",
      });
    }

    return config;
  },

  // Server external packages for better performance
  serverExternalPackages: ["mongodb", "mongoose"],
};

export default nextConfig;
