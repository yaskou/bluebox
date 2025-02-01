"use server";

import { db } from "@/db";
import { photos } from "@/schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deletePhoto(photoId: string) {
  await db.delete(photos).where(eq(photos.id, photoId));

  revalidatePath("/box"); // 画像一覧を更新
}
