// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     domains: ["ipfs.infura.io"],
//   },
// };

// // module.exports = nextConfig

// module.exports = {
//   images: {
//     domains: ["lens.infura-ipfs.io"],
//     remotePatterns: [
//       {
//         protocol: "ipfs",
//         hostname: "**",
//         pathname: "**",
//       },
//     ],
//   },
// };

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  preset: ["next/babel"],
  images: {
    domains: [
      "ipfs.infura.io",
      "statics-polygon-lens-staging.s3.eu-west-1.amazonaws.com",
      "lens.infura-ipfs.io",
      "",
    ],
  },
};

module.exports = nextConfig;
