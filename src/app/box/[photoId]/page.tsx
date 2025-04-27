import { getPhotoInfo } from "@/actions/getPhotosInfo";
import HlsPlayer from "@/components/HlsPlayer";
import PhotoDeleteDialog from "@/components/PhotoDeleteDialog";
import { redirect } from "next/navigation";

export default async function PhotoViewer({
  params,
}: {
  params: Promise<{ photoId: string }>;
}) {
  const { photoId } = await params;
  const photoInfo = await getPhotoInfo(photoId);

  if (!photoInfo) return;

  return (
    <main className="size-full flex flex-col md:flex-row justify-center items-center gap-4">
      {photoId.startsWith("v_") ? ( // 動画なら
        <HlsPlayer photoId={photoId} />
      ) : (
        <img
          className="max-w-md object-contain"
          src={`/api/images/${photoId}`}
          alt="User's photo"
        />
      )}
      <section className="text-left p-2">
        <p>ID: {photoInfo.id}</p>
        <p>撮影日: {photoInfo.created_at.toLocaleString()}</p>
        <div className="flex mt-2">
          <PhotoDeleteDialog
            photoId={photoId}
            deletePhotoCallback={async () => {
              "use server";
              redirect("/box");
            }}
          />
        </div>
      </section>
    </main>
  );
}
