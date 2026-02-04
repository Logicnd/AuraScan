// ╔════════════════════════════════════════════════════════════════════════════╗
// ║                    NEXT.JS CONFIGURATION                                    ║
// ║                     AuraScan Build & Runtime Settings                       ║
// ╠════════════════════════════════════════════════════════════════════════════╣
// ║                                                                             ║
// ║  This file configures Next.js behavior for:                                 ║
// ║  • Image optimization                                                       ║
// ║  • Package bundling                                                         ║
// ║  • Experimental features                                                    ║
// ║                                                                             ║
// ║  Documentation: https://nextjs.org/docs/app/api-reference/next-config-js   ║
// ║                                                                             ║
// ╚════════════════════════════════════════════════════════════════════════════╝

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ═══════════════════════════════════════════════════════════════════════════
  // CORE SETTINGS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * React Strict Mode
   * @configurable Set to false if you have issues with double-rendering in dev
   * @recommended Keep enabled for catching React bugs
   */
  reactStrictMode: true,
  
  // ═══════════════════════════════════════════════════════════════════════════
  // IMAGE OPTIMIZATION
  // ═══════════════════════════════════════════════════════════════════════════
  
  images: {
    /**
     * Allowed image domains
     * Add domains here if you load external images
     * @configurable Add specific domains for security:
     * @example hostname: 'avatars.githubusercontent.com' for GitHub avatars
     * @example hostname: '*.supabase.co' for Supabase storage
     */
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS domains (less secure)
        // For production, specify exact domains:
        // hostname: 'avatars.githubusercontent.com',
        // hostname: 'lh3.googleusercontent.com',
        // hostname: '*.supabase.co',
      },
    ],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // EXPERIMENTAL FEATURES
  // ═══════════════════════════════════════════════════════════════════════════
  
  experimental: {
    /**
     * Package Import Optimization
     * Reduces bundle size by tree-shaking these packages
     * @configurable Add large icon/UI libraries here
     */
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // OPTIONAL: UNCOMMENT TO ENABLE
  // ═══════════════════════════════════════════════════════════════════════════
  
  // /**
  //  * Environment Variables Available to Browser
  //  * @security Only expose non-sensitive values
  //  */
  // env: {
  //   NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
  // },
  
  // /**
  //  * Custom Webpack Config
  //  * @configurable For advanced bundling needs
  //  */
  // webpack: (config, { isServer }) => {
  //   // Add custom webpack plugins or rules here
  //   return config;
  // },
  
  // /**
  //  * Headers for Security & Caching
  //  * @configurable Add security headers for production
  //  */
  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         { key: 'X-Frame-Options', value: 'DENY' },
  //         { key: 'X-Content-Type-Options', value: 'nosniff' },
  //         { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  //       ],
  //     },
  //   ];
  // },
  
  // /**
  //  * Redirects
  //  * @configurable For URL migrations or shortcuts
  //  */
  // async redirects() {
  //   return [
  //     {
  //       source: '/app',
  //       destination: '/',
  //       permanent: true,
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
