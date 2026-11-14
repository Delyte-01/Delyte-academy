import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.43.22"],
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
        hostname: "images.pexels.com",
        pathname: "/photos/**", // Free stock photos from Pexels
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**", // Allow all images from Googleusercontent
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
        pathname: "/photos/**", // istock photos
      },
    ],
  },
};

export default nextConfig;
