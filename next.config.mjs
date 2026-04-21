/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  basePath: "/ai-lab",
  assetPrefix: "/ai-lab",
  // 部署端需显式转译，否则可能报 Can't resolve 'react-syntax-highlighter'
  transpilePackages: ["react-syntax-highlighter"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
      { protocol: "https", hostname: "signwayonline.net", pathname: "/**" },
      { protocol: "https", hostname: "www.jetson-ai-lab.com", pathname: "/**" },
      { protocol: "https", hostname: "files.seeedstudio.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
