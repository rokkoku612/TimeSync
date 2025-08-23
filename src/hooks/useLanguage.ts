import { useState } from 'react';
import { Language } from '../types';
import { languages } from '../constants/languages';

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]); // デフォルトは日本語

  const toggleLanguage = () => {
    setCurrentLanguage(prev => 
      prev.code === 'ja' ? languages[1] : languages[0]
    );
  };

  return {
    currentLanguage,
    toggleLanguage
  };
};