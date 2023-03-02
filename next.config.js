/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: "/app-manager",
  rewrites() {
    return [
      {
        source: "/app-manager/_next/:path*",
        destination: "/_next/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
