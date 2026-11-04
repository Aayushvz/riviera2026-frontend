/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "i.postimg.cc" },
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "api.qrserver.com" },
    ],
    unoptimized: true,
  },
}

module.exports = nextConfig
