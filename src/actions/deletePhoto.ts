"use server";

import { db } from "@/db";
import { photos } from "@/schemas";
import { eq } from "drizzle-orm";
import fs from "fs";
import { revalidatePath } from "next/cache";
import path from "path";

export async function deletePhoto(photoId: string) {
  // 画像を削除
  const contentPath = path.join(process.env.CONTENTS_DIR!, photoId);

  if (photoId.startsWith("v_")) {
    // 動画なら
    await fs.promises.rm(contentPath, { recursive: true, force: true }); // 動画のディレクトリごと削除
  } else {
    fs.unlinkSync(contentPath);
  }

  fs.unlinkSync(path.join(process.env.CONTENTS_DIR!, "thumbnails", photoId)); // サムネイルを削除

  await db.delete(photos).where(eq(photos.id, photoId)); // データベースを削除

  revalidatePath("/box"); // 画像一覧を更新
}
