"use client";

import { useResize } from "./useResize";

export function usePhotosLayout(maxPhotoSize: number, photosCount: number) {
  const { rootRef, rootWidth, rootHeight } = useResize();

  const colCount = Math.ceil(rootWidth / maxPhotoSize); // 一列に敷き詰められる最小個数
  const rowCount = colCount && Math.ceil(photosCount / colCount); // 全体の行数を計算
  const photoSize = colCount && Math.ceil(rootWidth / colCount);

  return {
    rootWidth,
    rootHeight,
    colCount,
    rowCount,
    photoSize,
    rootRef,
  };
}
