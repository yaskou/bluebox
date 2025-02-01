"use client";

import { usePhotosLayout } from "@/hooks/usePhotosLayout";
import { FixedSizeList } from "react-window";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";
import PhotoDeleteDialog from "./PhotoDeleteDialog";

type PhotoInfo = {
  id: string;
  created_at: Date;
  userId: string;
};

type Props = {
  photosInfo: PhotoInfo[];
};

export default function PhotosViewer({ photosInfo }: Props) {
  const maxPhotoSize = 150; // 画像の最大サイズ

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const selectedPhoto = photosInfo[selectedPhotoIndex];

  const [open, setOpen] = useState(false);

  const { rootWidth, rootHeight, colCount, rowCount, photoSize, rootRef } =
    usePhotosLayout(maxPhotoSize, photosInfo.length);

  return (
    <article className="size-full" ref={rootRef}>
      <Dialog open={open} onOpenChange={setOpen}>
        <FixedSizeList
          itemCount={rowCount}
          itemSize={photoSize}
          width={rootWidth}
          height={rootHeight}
        >
          {({ index: rowIndex, style }) => (
            <section className="flex" style={style}>
              {photosInfo[rowIndex * colCount] &&
                [...Array(colCount)]
                  .map((_, index) => rowIndex * colCount + index) // 画像のインデックスを連番で生成
                  .map(
                    (
                      index, // 表示崩れが起きないように空要素で調整
                    ) => (
                      <div
                        className="flex-1"
                        key={photosInfo[index] ? photosInfo[index].id : index}
                      >
                        {photosInfo[index] && (
                          <DialogTrigger
                            className="cursor-pointer"
                            onClick={() => setSelectedPhotoIndex(index)}
                            asChild
                          >
                            <img
                              className="object-cover min-w-full min-h-full"
                              src={`/api/thumbnails/${photosInfo[index].id}`}
                              width={photoSize}
                              height={photoSize}
                            />
                          </DialogTrigger>
                        )}
                      </div>
                    ),
                  )}
            </section>
          )}
        </FixedSizeList>
        {selectedPhoto && (
          <DialogContent className="flex flex-col justify-center items-center max-h-[90svh] sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">画像選択中</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm" asChild>
                <section className="text-left">
                  <p>ID: {selectedPhoto.id}</p>
                  <p>撮影日: {selectedPhoto.created_at.toLocaleString()}</p>
                  <p>ユーザーID: {selectedPhoto.userId}</p>
                </section>
              </DialogDescription>
            </DialogHeader>
            <div className="size-full flex justify-center items-center overflow-hidden">
              <img
                className="size-full object-contain"
                src={`/api/photos/${selectedPhoto.id}`}
              />
            </div>
            <DialogFooter className="flex justify-center">
              <PhotoDeleteDialog
                deletePhotoCallback={() => setOpen(false)} // 画像が削除されたらダイアログを消す
                photoId={selectedPhoto.id}
              />
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </article>
  );
}
