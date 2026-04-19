/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bundle the data/ directory so it's available on Vercel serverless functions
  outputFileTracingIncludes: {
    "/api/verify": ["./data/**"],
  },
};

export default nextConfig;
