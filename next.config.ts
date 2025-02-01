import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // 画像アップロードのために最大容量を大きくする
    },
  }
};

export default nextConfig;
