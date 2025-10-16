/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: ["https://3000-firebase-ranked-daily-1756173925951.cluster-ocv3ypmyqfbqysslgd7zlhmxek.cloudworkstations.dev"],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.rankeddaily.com',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;
