import { getPhotosInfo } from "@/actions/getPhotosInfo";
import PhotosViewer from "@/components/PhotosViewer";

export default async function Box() {
  const photosInfo = await getPhotosInfo(); // 最初に表示する画像を取得

  return (
    <main className="size-full overflow-hidden">
      <PhotosViewer photosInfo={photosInfo} />
    </main>
  );
}
