
import React from 'react';
import { Lang } from '../types';
import { translations } from '../constants/translations';

interface HeaderProps {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
}

const LanguageButton: React.FC<{
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
}> = ({ onClick, isActive, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
      isActive ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`}
  >
    {children}
  </button>
);


const Header: React.FC<HeaderProps> = ({ lang, onLangChange }) => {
  const t = translations[lang];

  return (
    <header className="bg-gray-800 text-white shadow-md p-3 flex justify-between items-center flex-shrink-0">
      <h1 className="text-xl font-bold tracking-wider">{t.title}</h1>
      <div className="flex space-x-1 bg-gray-900 p-1 rounded-lg">
        <LanguageButton onClick={() => onLangChange('en')} isActive={lang === 'en'}>
          EN
        </LanguageButton>
        <LanguageButton onClick={() => onLangChange('pt')} isActive={lang === 'pt'}>
          PT
        </LanguageButton>
      </div>
    </header>
  );
};

export default Header;
