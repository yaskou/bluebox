"use client";

import { usePhotosLayout } from "@/hooks/usePhotosLayout";
import { FixedSizeList } from "react-window";
import Link from "next/link";

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

  const { rootWidth, rootHeight, colCount, rowCount, photoSize, rootRef } =
    usePhotosLayout(maxPhotoSize, photosInfo.length);

  return (
    <article className="size-full" ref={rootRef}>
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
                        <Link href={`/box/${photosInfo[index].id}`}>
                          <img
                            className="object-cover min-w-full min-h-full"
                            src={`/api/images/${photosInfo[index].id}?type=thumbnail`}
                            width={photoSize}
                            height={photoSize}
                          />
                        </Link>
                      )}
                    </div>
                  ),
                )}
          </section>
        )}
      </FixedSizeList>
    </article>
  );
}
