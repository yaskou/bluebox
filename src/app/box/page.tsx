import { getPhotosInfo } from "@/actions/getPhotosInfo";
import { signOut } from "@/auth";
import PhotosViewer from "@/components/PhotosViewer";
import { Button } from "@/components/ui/button";
import UploaderDialog from "@/components/UploaderDialog";
import { Boxes } from "lucide-react";

export default async function Box() {
  const photosInfo = await getPhotosInfo(); // 最初に表示する画像を取得

  return (
    <div className="w-full h-svh flex flex-col">
      <header className="w-full p-2 md:p-4 flex gap-2 md:gap-4">
        <div className="text-3xl grow flex gap-1 font-extrabold tracking-tight md:text-4xl">
          <Boxes className="h-full" />
          <h1 className="hidden sm:block">BlueBox</h1>
        </div>
        <UploaderDialog />
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button type="submit">サインアウト</Button>
        </form>
      </header>
      <main className="size-full overflow-hidden">
        <PhotosViewer photosInfo={photosInfo} />
      </main>
    </div>
  );
}
