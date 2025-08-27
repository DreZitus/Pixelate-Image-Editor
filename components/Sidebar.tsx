
import React from 'react';
import { translations } from '../constants/translations';
import { Lang, RGB } from '../types';
import ToolButton from './ToolButton';
import Icon from './Icon';

interface SidebarProps {
  lang: Lang;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onApplyGrayscale: () => void;
  onApplyInvert: () => void;
  onApplySepia: () => void;
  onAdjustChannels: (rgb: RGB) => void;
  rgb: RGB;
  isImageLoaded: boolean;
  isProcessing: boolean;
}

const FilterIcon = () => <Icon path="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />;
const AdjustIcon = () => <Icon path="M12 3c-1.1 0-2 .9-2 2v2.05c-1.51.42-2.75 1.48-3.44 2.83A7.5 7.5 0 006.5 17.5c0 .99.44 1.88 1.14 2.5h-1.29c-.39 0-.74.23-.9.58-.16.35-.04.78.29 1.02l2.3 1.68c.24.18.55.26.86.22.31-.04.6-.24.76-.51l1.63-2.71c.25-.42.06-.96-.37-1.21-.43-.25-.97-.06-1.21.36l-.76 1.28H9.3c-.34-.52-.53-1.12-.53-1.75 0-2.37 1.65-4.37 3.89-4.89V19c0 1.1.9 2 2 2s2-.9 2-2v-6.39c2.24.52 3.89 2.52 3.89 4.89 0 .63-.19 1.23-.53 1.75h-.65l-.76-1.28c-.25-.42-.78-.61-1.21-.36-.43.25-.62.79-.37 1.21l1.63 2.71c.16.27.45.47.76.51.31.04.62-.04.86-.22l2.3-1.68c.33-.24.45-.67.29-1.02-.16-.35-.51-.58-.9-.58h-1.29c.7-.62 1.14-1.51 1.14-2.5a7.5 7.5 0 00-2.06-5.12c-.69-1.35-1.93-2.41-3.44-2.83V5c0-1.1-.9-2-2-2z" />;


const Sidebar: React.FC<SidebarProps> = ({
  lang,
  zoom,
  onZoomChange,
  onApplyGrayscale,
  onApplyInvert,
  onApplySepia,
  onAdjustChannels,
  rgb,
  isImageLoaded,
  isProcessing
}) => {
  const t = translations[lang];

  const handleRgbChange = (channel: keyof RGB, value: number) => {
    onAdjustChannels({ ...rgb, [channel]: value });
  };

  const isDisabled = !isImageLoaded || isProcessing;

  return (
    <aside className="w-72 bg-gray-800 p-4 flex flex-col space-y-6 overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-200 border-b-2 border-gray-700 pb-2">{t.toolsHeader}</h2>

      {/* Zoom Controls */}
      <div>
        <label htmlFor="zoom" className="block text-sm font-medium text-gray-300 mb-2">{t.zoom} ({Math.round(zoom * 100)}%)</label>
        <input
          id="zoom"
          type="range"
          min="0.1"
          max="3"
          step="0.05"
          value={zoom}
          onChange={(e) => onZoomChange(parseFloat(e.target.value))}
          disabled={!isImageLoaded}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:cursor-not-allowed disabled:accent-gray-500"
        />
      </div>

      {/* Filters */}
      <div className="space-y-2">
        <h3 className="text-md font-semibold text-gray-300 flex items-center space-x-2"><FilterIcon /> <span>{t.filters}</span></h3>
        <ToolButton onClick={onApplyGrayscale} disabled={isDisabled}>{t.grayscale}</ToolButton>
        <ToolButton onClick={onApplyInvert} disabled={isDisabled}>{t.invert}</ToolButton>
        <ToolButton onClick={onApplySepia} disabled={isDisabled}>{t.sepia}</ToolButton>
      </div>

      {/* Adjustments */}
      <div className="space-y-4">
        <h3 className="text-md font-semibold text-gray-300 flex items-center space-x-2"><AdjustIcon /> <span>{t.adjustments}</span></h3>
        <div className="space-y-2">
          <label htmlFor="red" className="block text-sm font-medium text-gray-300">{t.red}</label>
          <input id="red" type="range" min="0" max="255" step="1" value={rgb.r} onChange={e => handleRgbChange('r', parseInt(e.target.value, 10))} className="w-full accent-red-500 disabled:accent-gray-500" disabled={isDisabled} />
          
          <label htmlFor="green" className="block text-sm font-medium text-gray-300">{t.green}</label>
          <input id="green" type="range" min="0" max="255" step="1" value={rgb.g} onChange={e => handleRgbChange('g', parseInt(e.target.value, 10))} className="w-full accent-green-500 disabled:accent-gray-500" disabled={isDisabled} />

          <label htmlFor="blue" className="block text-sm font-medium text-gray-300">{t.blue}</label>
          <input id="blue" type="range" min="0" max="255" step="1" value={rgb.b} onChange={e => handleRgbChange('b', parseInt(e.target.value, 10))} className="w-full accent-blue-500 disabled:accent-gray-500" disabled={isDisabled} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
