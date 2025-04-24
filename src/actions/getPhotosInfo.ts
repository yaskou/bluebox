"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { photos } from "@/schemas";
import { desc, eq } from "drizzle-orm";

export async function getPhotosInfo() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) return [];

  const sortedPhotos = await db.query.photos.findMany({
    where: eq(photos.userId, session.user.id),
    orderBy: desc(photos.created_at),
  });

  return sortedPhotos;
}

export async function getPhotoInfo(photoId: string) {
  const session = await auth();

  if (!session) return;

  const photo = await db.query.photos.findFirst({
    where: eq(photos.id, photoId),
  });

  return photo;
}
