"use client";

import { useEffect, useRef, useState } from "react";

export function usePhotosLayout(maxPhotoSize: number, photosCount: number) {
  const rootRef = useRef<HTMLElement>(null);

  const [rootWidth, setRootWidth] = useState(0);
  const [rootHeight, setRootHeight] = useState(0);

  const colCount = Math.ceil(rootWidth / maxPhotoSize); // 一列に敷き詰められる最小個数
  const rowCount = colCount && Math.ceil(photosCount / colCount); // 全体の行数を計算
  const photoSize = colCount && Math.ceil(rootWidth / colCount);

  useEffect(() => {
    const handleResize = () => {
      // 現在の画面サイズを状態に追加
      setRootWidth(rootRef.current!.clientWidth);
      setRootHeight(rootRef.current!.clientHeight);
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      // 終了時にイベント破棄
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    rootWidth,
    rootHeight,
    colCount,
    rowCount,
    photoSize,
    rootRef,
  };
}
