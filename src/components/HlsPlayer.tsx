"use client";

import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }); // ハイドレーションエラーを防ぐため

type Props = {
  photoId: string;
};

export default function HlsPlayer({ photoId }: Props) {
  return <ReactPlayer url={`/api/videos/${photoId}.m3u8`} controls />;
}
