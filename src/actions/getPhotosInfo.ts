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
    columns: {
      buffer: false,
      thumbnail: false,
    },
    orderBy: desc(photos.created_at),
  });

  return sortedPhotos;
}
