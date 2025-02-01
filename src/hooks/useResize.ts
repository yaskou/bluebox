"use client";

import { RefObject, useRef, useSyncExternalStore } from "react";

let cachedSize = [0, 0];

function getSnapshot(rootRef: RefObject<HTMLElement | null>) {
  if (rootRef.current) {
    const { clientWidth, clientHeight } = rootRef.current;
    if (cachedSize[0] !== clientWidth || cachedSize[1] !== clientHeight) {
      // サイズが変わった時だけキャッシュを更新
      cachedSize = [clientWidth, clientHeight];
    }
  }
  return cachedSize;
}

function subscribe(
  rootRef: RefObject<HTMLElement | null>,
  callback: () => void,
) {
  const observer = new ResizeObserver(callback);
  if (rootRef.current) {
    observer.observe(rootRef.current); // 要素のサイズ変化を監視
  }
  return () => {
    observer.disconnect();
  };
}

export function useResize() {
  const rootRef = useRef<HTMLElement>(null);

  const [rootWidth, rootHeight] = useSyncExternalStore(
    (callback) => subscribe(rootRef, callback),
    () => getSnapshot(rootRef),
    () => cachedSize,
  );

  return {
    rootRef,
    rootWidth,
    rootHeight,
  };
}
