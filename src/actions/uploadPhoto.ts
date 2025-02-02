"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { photos } from "@/schemas/photos";
import exif from "exif-reader";
import { revalidatePath } from "next/cache";
import path from "path";
import sharp from "sharp";

export async function uploadPhoto(photo: File) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) return;

  const photoBuffer = await photo.arrayBuffer();
  const transformer = sharp(photoBuffer);
  const metadata = await transformer.metadata();
  const photoExif = metadata.exif && exif(metadata.exif); // この画像のEXIFデータ

  const { id: photoId } = (
    await db
      .insert(photos)
      .values({
        created_at: photoExif?.Photo?.DateTimeOriginal, // 画像撮影時刻があれば
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
  const thumbnailSize = 128; // 一覧表示用
  await transformer
    .resize(thumbnailSize, thumbnailSize, { fit: "cover" })
    .webp({ quality: photoQuality }) // 容量の節約のため品質を下げる
    .toFile(path.join(process.env.CONTENTS_DIR!, "thumbnails", photoId));

  revalidatePath("/box"); // 画像一覧を更新
}
