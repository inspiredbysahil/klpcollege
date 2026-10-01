import { useState, type ImgHTMLAttributes } from 'react';

/** Image that swaps to a bundled local copy once if the configured URL fails. */
export function FallbackImg({ src, fallback, ...props }: ImgHTMLAttributes<HTMLImageElement> & { src: string; fallback: string }) {
  const [current, setCurrent] = useState(src);
  return <img {...props} src={current} onError={() => { if (current !== fallback) setCurrent(fallback); }} ref={el => { if (el && el.complete && el.naturalWidth === 0 && current !== fallback) setCurrent(fallback); }} />;
}
