import fs from "fs";
import { NextRequest } from "next/server";
import path from "path";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ filename: string }>;
  },
) {
  const { filename } = await params;
  const idLength = 38; // v_含む動画のIDの文字数
  const id = filename.slice(0, idLength);
  const fileExtension = filename.slice(filename.lastIndexOf(".") + 1); // ファイルの拡張子を取得
  const contentPath = path.join(process.env.CONTENTS_DIR!, id, filename);

  if (!fs.existsSync(contentPath)) {
    return new Response("Not Found", {
      status: 404,
    });
  }

  const buffer = fs.readFileSync(contentPath);

  let mimeType = "";
  switch (
    fileExtension // mimetypeを指定
  ) {
    case "m3u8":
      mimeType = "application/x-mpegURL";
      break;
    case "ts":
      mimeType = "video/mp2t";
      break;
    default:
      break;
  }

  return new Response(buffer, {
    headers: {
      "Content-Type": mimeType,
      "Cache-Control": "private, max-age=31536000, immutable", // 1年間キャッシュ
    },
  });
}
