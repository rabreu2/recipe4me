/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 1000,
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.spoonacular.com',
        port: '',
        pathname: '/recipes/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;