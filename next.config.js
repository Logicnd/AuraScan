/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  generateBuildId: async () => 'aurascan-build',
};

module.exports = nextConfig;
