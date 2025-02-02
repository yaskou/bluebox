import fs from "fs";
import { NextRequest } from "next/server";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id; // URLから画像のIDを取得
  let contentPath = path.join(process.env.CONTENTS_DIR!, id);

  if (!fs.existsSync(contentPath)) {
    return new Response("Not Found", {
      status: 404,
    });
  }

  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");

  if (type === "thumbnail") {
    contentPath = path.join(process.env.CONTENTS_DIR!, "thumbnails", id); // サムネイルのパスに変更
  }

  const buffer = fs.readFileSync(contentPath);

  return new Response(buffer, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "private, max-age=31536000, immutable", // 1年間キャッシュ
    },
  });
}
