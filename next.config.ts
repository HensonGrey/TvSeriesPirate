import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    domains: ["image.tmdb.org", "placehold.co", "www.google.com"],
  },
};

export default nextConfig;
