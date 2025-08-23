import React from 'react';
import { LanguageToggleProps } from '../types';

const LanguageToggle: React.FC<LanguageToggleProps> = ({ currentLanguage, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 font-mono text-xs"
      title={currentLanguage.code === 'ja' ? 'Switch to English' : '日本語に切り替え'}
    >
      <span 
        className={`px-2 py-1 rounded-md transition-all duration-200 ${
          currentLanguage.code === 'ja' 
            ? 'bg-gray-900 text-white' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        JA
      </span>
      <span 
        className={`px-2 py-1 rounded-md transition-all duration-200 ${
          currentLanguage.code === 'en' 
            ? 'bg-gray-900 text-white' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        EN
      </span>
    </button>
  );
};

export default LanguageToggle;