import React from 'react';
import { Menu, X, Book, ChevronRight, Mail, FileText, Info } from 'lucide-react';
import { Language } from '../types';

interface HamburgerMenuProps {
  onShowManual: () => void;
  onShowContact: () => void;
  onShowTerms: () => void;
  onShowAbout: () => void;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  language: Language;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ 
  onShowManual, 
  onShowContact, 
  onShowTerms, 
  onShowAbout, 
  isOpen, 
  onToggle, 
  language 
}) => {
  const toggleMenu = () => {
    onToggle(!isOpen);
  };

  const handleManualClick = () => {
    onShowManual();
    onToggle(false);
  };

  const handleContactClick = () => {
    onShowContact();
    onToggle(false);
  };

  const handleTermsClick = () => {
    onShowTerms();
    onToggle(false);
  };

  const handleAboutClick = () => {
    onShowAbout();
    onToggle(false);
  };

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={toggleMenu}
        className="w-8 h-8 flex items-center justify-center text-graphite hover:text-ink transition-colors duration-200 hover:bg-pearl rounded-sm"
        aria-label={language.texts.openMenu}
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Overlay - Dark background when menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => onToggle(false)}
        />
      )}

      {/* Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-white to-soft-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-medium text-ink tracking-tight">{language.texts.menu}</h2>
            <button
              onClick={() => onToggle(false)}
              className="w-8 h-8 flex items-center justify-center text-graphite hover:text-ink transition-colors duration-200 hover:bg-pearl rounded-sm"
            >
              <X size={18} />
            </button>
          </div>

          {/* Menu Items - Enhanced visibility with shadow and better contrast */}
          <nav className="space-y-2 bg-white rounded-xl p-3 shadow-lg border border-mist/30 backdrop-blur-sm">
            <button
              onClick={handleManualClick}
              className="w-full flex items-center gap-3 p-3 text-left text-charcoal hover:text-ink hover:bg-pearl rounded-md transition-all duration-200 group"
            >
              <Book size={18} className="text-graphite group-hover:text-ink transition-colors duration-200" />
              <span>{language.texts.userGuide}</span>
              <ChevronRight size={16} className="ml-auto text-graphite group-hover:text-ink transition-colors duration-200" />
            </button>
            
            <div className="border-t border-mist my-2" />
            
            <button
              onClick={handleContactClick}
              className="w-full flex items-center gap-3 p-3 text-left text-charcoal hover:text-ink hover:bg-pearl rounded-md transition-all duration-200 group"
            >
              <Mail size={18} className="text-graphite group-hover:text-ink transition-colors duration-200" />
              <span>{language.code === 'ja' ? 'お問い合わせ' : 'Contact'}</span>
              <ChevronRight size={16} className="ml-auto text-graphite group-hover:text-ink transition-colors duration-200" />
            </button>
            
            <button
              onClick={handleTermsClick}
              className="w-full flex items-center gap-3 p-3 text-left text-charcoal hover:text-ink hover:bg-pearl rounded-md transition-all duration-200 group"
            >
              <FileText size={18} className="text-graphite group-hover:text-ink transition-colors duration-200" />
              <span>{language.code === 'ja' ? '利用規約' : 'Terms of Service'}</span>
              <ChevronRight size={16} className="ml-auto text-graphite group-hover:text-ink transition-colors duration-200" />
            </button>
            
            <button
              onClick={handleAboutClick}
              className="w-full flex items-center gap-3 p-3 text-left text-charcoal hover:text-ink hover:bg-pearl rounded-md transition-all duration-200 group"
            >
              <Info size={18} className="text-graphite group-hover:text-ink transition-colors duration-200" />
              <span>{language.code === 'ja' ? '開発者情報' : 'About'}</span>
              <ChevronRight size={16} className="ml-auto text-graphite group-hover:text-ink transition-colors duration-200" />
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;