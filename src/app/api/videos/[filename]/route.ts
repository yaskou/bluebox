import fs from "fs";
import { NextRequest } from "next/server";
import path from "path";

function fileExtensionToMimeType(fileExtension: string) {
  if (fileExtension === ".m3u8") return "application/x-mpegURL";
  if (fileExtension === ".ts") return "video/mp2t";
}

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
  const fileExtension = filename.slice(filename.lastIndexOf(".")); // ファイルの拡張子を取得
  const contentPath = path.join(process.env.CONTENTS_DIR!, id, filename);

  if (!fs.existsSync(contentPath)) {
    return new Response("Not Found", {
      status: 404,
    });
  }

  const buffer = fs.readFileSync(contentPath);
  const mimeType = fileExtensionToMimeType(fileExtension);
  if (!mimeType) return;

  return new Response(buffer, {
    headers: {
      "Content-Type": mimeType,
      "Cache-Control": "private, max-age=31536000, immutable", // 1年間キャッシュ
    },
  });
}
