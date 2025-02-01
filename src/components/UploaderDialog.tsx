"use client";

import { uploadPhoto } from "@/actions/uploadPhoto";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { useState } from "react";
import { UploadCloud } from "lucide-react";

export default function UploaderDialog() {
  const [open, setOpen] = useState(false);
  const [proportionUploaded, setProportionUploaded] = useState(0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // リロードを止める

    const formData = new FormData(e.currentTarget);
    const photos = formData.getAll("photos") as File[];

    if (!photos.length) return; // 写真がなければ

    for (const [count, photo] of photos.entries()) {
      await uploadPhoto(photo); // サーバー側の処理が終わるまで待つ
      setProportionUploaded(((count + 1) / photos.length) * 100); // 全体の何パーセントアップロードされたか
    }

    setOpen(false); // ダイアログを閉じる

    setProportionUploaded(0); // アップロード状況をリセット
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UploadCloud />
          アップロード
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-96">
        <DialogHeader>
          <DialogTitle>アップロードする写真を選択</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="photos"
            name="photos"
            type="file"
            accept="image/*"
            multiple
          />
          <section className="flex gap-2 items-center">
            <Progress className="grow" value={proportionUploaded} />
            <p>{Math.round(proportionUploaded)}%</p>
          </section>
          <DialogFooter>
            <Button type="submit">アップロード</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
