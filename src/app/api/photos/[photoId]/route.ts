import { db } from "@/db";
import { photos } from "@/schemas";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ photoId: string }> },
) {
  const photoId = (await params).photoId; // URLから画像IDを取得
  const photo = await db.query.photos.findFirst({
    where: eq(photos.id, photoId),
    columns: {
      buffer: true,
    },
  });

  if (!photo) {
    return new Response("この画像は存在しません", {
      status: 404,
    });
  }

  return new Response(photo.buffer, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "private, max-age=31536000, immutable", // 1年間キャッシュ
    },
  });
}
