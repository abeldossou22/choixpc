/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permet de lancer une 2e instance (tests) sans toucher au dossier .next du serveur principal.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};
module.exports = nextConfig;
