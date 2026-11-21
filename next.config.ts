
const nextConfig = {
  experimental: {
    agentFeedback: true,
    instrumentationHook: true
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  serverExternalPackages: ["sqlite3"],
};

export default nextConfig;
