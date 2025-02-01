"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { photos } from "@/schemas/photos";
import exif from "exif-reader";
import { revalidatePath } from "next/cache";
import sharp from "sharp";

export async function uploadPhoto(photo: File) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) return;

  const photoBuffer = await photo.arrayBuffer();
  const transformer = sharp(photoBuffer);
  const metadata = await transformer.metadata();
  const photoExif = metadata.exif && exif(metadata.exif); // この画像のEXIFデータ

  const maxWidth = 1080;
  const photoEncoded = await transformer // 画像が大きすぎればリサイズ
    .resize(metadata.width! > maxWidth ? maxWidth : metadata.width)
    .webp()
    .toBuffer();

  const photoQuality = 60;
  const thumbnailSize = 128; // 一覧表示用
  const thumbnail = await transformer
    .resize(thumbnailSize, thumbnailSize, { fit: "cover" })
    .webp({ quality: photoQuality }) // 容量の節約のため品質を下げる
    .toBuffer();

  await db.insert(photos).values({
    buffer: photoEncoded,
    created_at: photoExif?.Photo?.DateTimeOriginal, // 画像撮影時刻があれば
    thumbnail: thumbnail,
    userId: session!.user!.id!,
  });

  revalidatePath("/box"); // 画像一覧を更新
}
