/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "mmedalvgmzlqufqgyugz.supabase.co",
      },
      {
        hostname: "www.freepik.com",
      },
    ],
  },
};

export default nextConfig;
