
import React, { useRef, useEffect } from 'react';
import { translations } from '../constants/translations';
import { Lang } from '../types';

interface CanvasAreaProps {
  imageData: ImageData | null;
  zoom: number;
  lang: Lang;
  isProcessing: boolean;
}

const CanvasArea: React.FC<CanvasAreaProps> = ({ imageData, zoom, lang, isProcessing }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const t = translations[lang];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageData) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    
    // Set the canvas drawing buffer size based on the image data and zoom
    const canvasWidth = Math.floor(imageData.width * zoom);
    const canvasHeight = Math.floor(imageData.height * zoom);
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Use an offscreen canvas to draw the original imageData
    const offscreenCanvas = new OffscreenCanvas(imageData.width, imageData.height);
    const offscreenCtx = offscreenCanvas.getContext('2d');
    if (offscreenCtx) {
      offscreenCtx.putImageData(imageData, 0, 0);
      
      // Clear the main canvas and draw the scaled image from the offscreen canvas
      ctx.imageSmoothingEnabled = false; // Preserve pixelation on zoom
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height);
    }

  }, [imageData, zoom]);

  return (
    <div className="flex-grow bg-gray-900 p-4 flex justify-center items-center overflow-auto relative">
      {!imageData && (
        <div className="text-center text-gray-500">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2 text-sm font-semibold">{t.canvasPlaceholder}</p>
        </div>
      )}
      {isProcessing && (
         <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="text-white text-lg font-semibold animate-pulse">Processing...</div>
         </div>
      )}
      <canvas ref={canvasRef} className={`${!imageData ? 'hidden' : ''} shadow-lg`} />
    </div>
  );
};

export default CanvasArea;
