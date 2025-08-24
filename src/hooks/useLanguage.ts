import { Language } from '../types';
import { languages } from '../constants/languages';
import { useLocalStorage } from './useLocalStorage';

export const useLanguage = () => {
  // 言語設定をローカルストレージに保存
  const [languageCode, setLanguageCode] = useLocalStorage<'ja' | 'en'>('timeSync_language', 'ja');
  
  const currentLanguage: Language = languages.find(lang => lang.code === languageCode) || languages[0];

  const toggleLanguage = () => {
    const newCode = languageCode === 'ja' ? 'en' : 'ja';
    setLanguageCode(newCode);
  };

  return {
    currentLanguage,
    toggleLanguage
  };
};