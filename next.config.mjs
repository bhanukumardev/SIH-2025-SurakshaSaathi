import { createRequire } from 'module';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Some environments / packages can cause the mini-css-extract-plugin loader to run
    // without the plugin being injected. In dev we add the plugin explicitly to avoid
    // the runtime ModuleBuildError that complains about the plugin missing.
    try {
      // Create a CommonJS-style require in this ESM file
      const require = createRequire(import.meta.url);
      // prefer the compiled copy bundled with next if available
      let MiniCssExtractPlugin;
      try {
        MiniCssExtractPlugin = require('next/dist/compiled/mini-css-extract-plugin');
      } catch (e) {
        // fallback to the normal package
        try {
          MiniCssExtractPlugin = require('mini-css-extract-plugin');
        } catch (e2) {
          MiniCssExtractPlugin = null;
        }
      }

      // Only add once
      if (MiniCssExtractPlugin) {
        const has = config.plugins.some((p) => p && p.constructor && p.constructor.name === 'MiniCssExtractPlugin');
        if (!has) {
          config.plugins.push(new MiniCssExtractPlugin({ ignoreOrder: true }));
        }
      }
    } catch (err) {
      // If anything goes wrong here, don't break the build — Next's default behavior
      // should still work for production builds where this injection is not necessary.
      // We intentionally swallow the error and let Next continue.
      // console.warn('Could not ensure MiniCssExtractPlugin:', err);
    }

    return config;
  }
}

export default nextConfig
