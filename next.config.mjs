/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'places.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.aceternity.com',
        pathname: '/**',
      },
    ],
    localPatterns: [
      { pathname: '/api/google-place-photo' },
      { pathname: '/logo.png' },
      { pathname: '/placeholder.png' },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
