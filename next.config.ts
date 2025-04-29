import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "500mb", // 動画アップロードのために最大容量を大きくする
    },
  }
};

export default nextConfig;
