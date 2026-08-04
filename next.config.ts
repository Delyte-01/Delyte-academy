import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.43.21"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // Allow all images from Cloudinary
      },
      {
        protocol: "https",
        hostname: "ifggosbdehcamqobuzva.supabase.co",
        pathname: "/**", // Allow all images from Unsplash
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**", // Allow all images from Googleusercontent
      },
    ],
  },
};

export default nextConfig;
