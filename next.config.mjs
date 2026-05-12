/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
    // Firebase Admin SDK não é tree-shakeable e tem trans-deps com
    // OpenTelemetry opcional que quebram "page data collection" do
    // Next durante o build. Marcando como external resolve.
    // Vide: https://firebase.google.com/docs/web/setup#nextjs-app-router
    serverComponentsExternalPackages: [
      'firebase-admin',
      '@google-cloud/firestore',
      'google-gax',
    ],
  },
};
export default nextConfig;
