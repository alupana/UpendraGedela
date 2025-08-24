import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com", // Some YouTube thumbnails
      },
      {
        protocol: "https",
        hostname: "img.youtube.com", // Other YouTube thumbnails
      },
      {
        protocol: "https",
        hostname: "scontent.cdninstagram.com", // Instagram CDN
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com", // Facebook profile images
      },
    ],
  },
};

export default nextConfig;
