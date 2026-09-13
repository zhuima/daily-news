import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

async function initCfDev() {
  if (process.env.NODE_ENV !== "development") return;
  try {
    const { initOpenNextCloudflareForDev } = await import(
      "@opennextjs/cloudflare"
    );
    initOpenNextCloudflareForDev();
  } catch {
    /* optional: local next dev without OpenNext */
  }
}

void initCfDev();

export default nextConfig;
