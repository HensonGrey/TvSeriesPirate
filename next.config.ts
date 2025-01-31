import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    domains: ["image.tmdb.org", "placehold.co"],
  },
};

export default nextConfig;
