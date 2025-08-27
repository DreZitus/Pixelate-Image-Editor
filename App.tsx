
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Lang, RGB } from './types';
import { translations } from './constants/translations';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CanvasArea from './components/CanvasArea';
import ToolButton from './components/ToolButton';
import Icon from './components/Icon';

const UploadIcon = () => <Icon path="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" />;
const SaveIcon = () => <Icon path="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />;
const ResetIcon = () => <Icon path="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />;

const App: React.FC = () => {
  const [lang, setLang] = useState<Lang>('en');
  const [originalImageData, setOriginalImageData] = useState<ImageData | null>(null);
  const [currentImageData, setCurrentImageData] = useState<ImageData | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [rgb, setRgb] = useState<RGB>({ r: 0, g: 0, b: 0 });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const t = translations[lang];

  const processImage = useCallback(<T,>(processor: (data: Uint8ClampedArray) => Uint8ClampedArray) => {
    if (!originalImageData) return;
    setIsProcessing(true);
    // Use setTimeout to allow UI to update before blocking the main thread
    setTimeout(() => {
        const newImageData = new ImageData(
            processor(new Uint8ClampedArray(originalImageData.data)),
            originalImageData.width,
            originalImageData.height
        );
        setCurrentImageDataObject(newImageData);
        setIsProcessing(false);
    }, 10);
  }, [originalImageData]);

  const setCurrentImageDataObject = (data: ImageData | null) => {
      // Fix: Corrected typo from setCurrentImageDatas to setCurrentImageData
      setCurrentImageData(data);
      if(canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if(ctx && data) {
            canvasRef.current.width = data.width;
            canvasRef.current.height = data.height;
            ctx.putImageData(data, 0, 0);
        }
      }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            setOriginalImageData(imageData);
            setCurrentImageDataObject(imageData);
            setZoom(1);
            setRgb({ r: 0, g: 0, b: 0 });
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoadImage = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setCurrentImageDataObject(originalImageData);
    setZoom(1);
    setRgb({ r: 0, g: 0, b: 0 });
  };
  
  const handleSaveImage = () => {
      if (!currentImageData) return;
      const canvas = document.createElement('canvas');
      canvas.width = currentImageData.width;
      canvas.height = currentImageData.height;
      const ctx = canvas.getContext('2d');
      if(ctx){
          ctx.putImageData(currentImageData, 0, 0);
          const link = document.createElement('a');
          link.download = 'edited-image.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
      }
  };

  const applyGrayscale = useCallback(() => {
    processImage((data) => {
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg;
          data[i + 1] = avg;
          data[i + 2] = avg;
        }
        return data;
    });
  }, [processImage]);

  const applyInvert = useCallback(() => {
     processImage((data) => {
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];
          data[i + 1] = 255 - data[i + 1];
          data[i + 2] = 255 - data[i + 2];
        }
        return data;
    });
  }, [processImage]);
  
  const applySepia = useCallback(() => {
    processImage((data) => {
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i+1], b = data[i+2];
            data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
            data[i+1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
            data[i+2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
        }
        return data;
    });
  }, [processImage]);


  const adjustChannels = useCallback((newRgb: RGB) => {
    setRgb(newRgb);
     processImage((data) => {
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.max(0, Math.min(255, data[i] + newRgb.r));
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + newRgb.g));
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + newRgb.b));
        }
        return data;
    });
  }, [processImage]);
  
  const isImageLoaded = !!originalImageData;

  return (
    <div className="h-screen w-screen bg-gray-900 text-gray-200 flex flex-col font-sans">
      <Header lang={lang} onLangChange={setLang} />
      <div className="flex flex-grow overflow-hidden">
        <Sidebar
          lang={lang}
          zoom={zoom}
          onZoomChange={setZoom}
          onApplyGrayscale={applyGrayscale}
          onApplyInvert={applyInvert}
          onApplySepia={applySepia}
          onAdjustChannels={adjustChannels}
          rgb={rgb}
          isImageLoaded={isImageLoaded}
          isProcessing={isProcessing}
        />
        <main className="flex-grow flex flex-col">
          <div className="bg-gray-800 p-2 flex space-x-2 border-b-2 border-gray-900 flex-shrink-0">
            <ToolButton onClick={handleLoadImage} icon={<UploadIcon />}>{t.loadImage}</ToolButton>
            <ToolButton onClick={handleSaveImage} icon={<SaveIcon />} disabled={!isImageLoaded || isProcessing}>{t.saveImage}</ToolButton>
            <ToolButton onClick={handleReset} icon={<ResetIcon />} disabled={!isImageLoaded || isProcessing}>{t.reset}</ToolButton>
          </div>
          <CanvasArea imageData={currentImageData} zoom={zoom} lang={lang} isProcessing={isProcessing} />
        </main>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
    </div>
  );
};

export default App;