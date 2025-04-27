"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { photos } from "@/schemas/photos";
import { spawn, spawnSync } from "child_process";
import fs from "fs";
import { revalidatePath } from "next/cache";
import path from "path";
import sharp from "sharp";

export async function uploadPhoto(photo: File, utcCreatedAt: Date) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) return;

  const thumbnailSize = 200; // 一覧表示用

  if (photo.type.startsWith("video")) {
    // 動画なら
    const photoId = `v_${crypto.randomUUID()}`; // v_をつけて動画を識別

    const saveDir = path.join(process.env.CONTENTS_DIR!, photoId);
    const originPath = path.join(saveDir, "origin");
    fs.mkdirSync(saveDir); // この動画の保存先を作成
    fs.writeFileSync(originPath, await photo.bytes());

    const thumbnailQuality = 17; // 保存容量をおさえる
    spawnSync("ffmpeg", [
      // 動画の1フレームをサムネイルに使用
      "-i",
      originPath,
      "-ss",
      "0:0:0",
      "-vframes",
      "1",
      "-f",
      "webp",
      "-vf",
      `scale=${thumbnailSize}:${thumbnailSize}`,
      "-q:v",
      `${thumbnailQuality}`,
      path.join(process.env.CONTENTS_DIR!, "thumbnails", photoId),
    ]);

    const hlsEncoder = spawn("ffmpeg", [
      // HLS用に再エンコード
      "-i",
      originPath,
      "-c:v",
      "copy",
      "-c:a",
      "copy",
      "-f",
      "hls",
      "-hls_time",
      "6",
      "-hls_playlist_type",
      "vod",
      "-hls_segment_filename",
      path.join(saveDir, `${photoId}_%3d.ts`),
      path.join(saveDir, `${photoId}.m3u8`),
    ]);
    hlsEncoder.on("exit", () => {
      console.log(`Finish encoding: ${photoId}`); // エンコード終了時にログを出力
    });

    await db.insert(photos).values({
      id: photoId,
      created_at: utcCreatedAt,
      userId: session.user.id,
    });
  }

  if (photo.type.startsWith("image")) {
    // 画像なら
    const photoBuffer = await photo.arrayBuffer();
    const transformer = sharp(photoBuffer);
    const metadata = await transformer.metadata();

    const { id: photoId } = (
      await db
        .insert(photos)
        .values({
          created_at: utcCreatedAt, // 画像撮影時刻があれば
          userId: session!.user!.id!,
        })
        .returning({ id: photos.id })
    )[0];

    const maxWidth = 1080;
    await transformer // 画像が大きすぎればリサイズ
      .resize(metadata.width! > maxWidth ? maxWidth : metadata.width)
      .webp()
      .toFile(path.join(process.env.CONTENTS_DIR!, photoId));

    const photoQuality = 60;
    await transformer
      .resize(thumbnailSize, thumbnailSize, { fit: "cover" })
      .webp({ quality: photoQuality }) // 容量の節約のため品質を下げる
      .toFile(path.join(process.env.CONTENTS_DIR!, "thumbnails", photoId));
  }

  revalidatePath("/box"); // 画像一覧を更新
}
