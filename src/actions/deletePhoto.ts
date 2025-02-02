"use server";

import { db } from "@/db";
import { photos } from "@/schemas";
import { eq } from "drizzle-orm";
import fs from "fs";
import { revalidatePath } from "next/cache";
import path from "path";

export async function deletePhoto(photoId: string) {
  // 画像を削除
  fs.unlinkSync(path.join(process.env.CONTENTS_DIR!, photoId));
  fs.unlinkSync(path.join(process.env.CONTENTS_DIR!, "thumbnails", photoId));

  await db.delete(photos).where(eq(photos.id, photoId)); // データベースを削除

  revalidatePath("/box"); // 画像一覧を更新
}
