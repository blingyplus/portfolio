"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

interface ImageViewerProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ImageViewer({ src, alt, className = "" }: ImageViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <img src={src} alt={alt} className={`cursor-zoom-in ${className}`} onClick={() => setIsOpen(true)} />
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={[{ src }]}
        plugins={[Zoom, Fullscreen, Thumbnails]}
        carousel={{ padding: "16px", spacing: "16px" }}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          doubleClickMaxStops: 2,
          keyboardMoveDistance: 50,
          wheelZoomDistanceFactor: 100,
          pinchZoomDistanceFactor: 100,
          scrollToZoom: true,
        }}
        fullscreen={{
          ref: null,
        }}
        thumbnails={{
          position: "bottom",
          width: 120,
          height: 80,
          padding: 4,
          border: 2,
          borderRadius: 4,
          gap: 16,
          imageFit: "contain",
        }}
      />
    </>
  );
}
