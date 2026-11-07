import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  images: {
    // WebP apenas: o AVIF tende a "lavar" detalhes finos em fotografias escuras
    // (pele em penumbra, ambientes com pouca luz). A qualidade é ajustada por imagem.
    formats: ["image/webp"],
    qualities: [72, 80, 86, 90],
    deviceSizes: [390, 640, 828, 1080, 1280, 1600, 1920, 2400],
    imageSizes: [96, 160, 256, 384],
  },
  distDir: process.env.NEXT_DIST_DIR || ".next",
  poweredByHeader: false,
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
