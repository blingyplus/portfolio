// app/components/AppwriteImage.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface AppwriteImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function AppwriteImage({ src, alt, className, width = 300, height = 200 }: AppwriteImageProps) {
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  const handleError = () => {
    setImageSrc("/assets/default.jpg");
  };

  if (imageSrc.startsWith("http")) {
    return <img src={imageSrc} alt={alt} className={className} width={width} height={height} onError={handleError} />;
  }

  return <Image src={imageSrc} alt={alt} width={width} height={height} className={className} onError={handleError} />;
}
