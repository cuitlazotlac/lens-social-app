/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["ipfs.infura.io"],
  },
};

// module.exports = nextConfig

module.exports = {
  images: {
    domains: ["lens.infura-ipfs.io"],
    remotePatterns: [
      {
        protocol: "ipfs",
        hostname: "**",
        pathname: "**",
      },
    ],
  },
};
