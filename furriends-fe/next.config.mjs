/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mesoubhjhzpgfmfvhity.supabase.co',
        port: '',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
