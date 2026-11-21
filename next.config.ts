
const nextConfig = {
  experimental: {
    agentFeedback: true,
    instrumentationHook: true
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  serverExternalPackages: ["sqlite3","node-cron"],
};

export default nextConfig;
