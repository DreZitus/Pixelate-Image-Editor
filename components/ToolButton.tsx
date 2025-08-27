
import React from 'react';

interface ToolButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const ToolButton: React.FC<ToolButtonProps> = ({ onClick, children, icon, disabled = false, className = '' }) => {
  const baseClasses =
    'w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800';
  const enabledClasses =
    'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 hover:border-gray-500 focus:ring-indigo-500';
  const disabledClasses = 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${disabled ? disabledClasses : enabledClasses} ${className}`}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
};

export default ToolButton;
