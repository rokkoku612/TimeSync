import React, { useState } from 'react';
import { Menu, X, Book, Calendar, Clock, Copy, Settings, ChevronRight } from 'lucide-react';
import { Language } from '../types';

interface HamburgerMenuProps {
  onShowManual: () => void;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  language: Language;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ onShowManual, isOpen, onToggle, language }) => {
  const toggleMenu = () => {
    onToggle(!isOpen);
  };

  const handleManualClick = () => {
    onShowManual();
    onToggle(false);
  };

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={toggleMenu}
        className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors duration-200 hover:bg-gray-100 rounded-sm"
        aria-label={language.texts.openMenu}
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40"
          onClick={() => onToggle(false)}
        />
      )}

      {/* Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white/90 backdrop-blur-sm border-l border-gray-200 shadow-xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-medium text-gray-900 tracking-tight">{language.texts.menu}</h2>
            <button
              onClick={() => onToggle(false)}
              className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors duration-200 hover:bg-gray-100 rounded-sm"
            >
              <X size={18} />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2 bg-white rounded-lg p-2">
            <button
              onClick={handleManualClick}
              className="w-full flex items-center gap-3 p-3 text-left text-gray-800 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-all duration-200 group"
            >
              <Book size={18} className="text-gray-600 group-hover:text-gray-900 transition-colors duration-200" />
              <span className="font-normal">{language.texts.userGuide}</span>
              <ChevronRight size={16} className="ml-auto text-gray-600 group-hover:text-gray-900 transition-colors duration-200" />
            </button>

            <div className="border-t border-gray-300 my-4" />

            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                {language.texts.features}
              </div>
              <div className="flex items-center gap-3 p-3 text-gray-800">
                <Calendar size={18} className="text-gray-600" />
                <span className="font-normal text-sm">{language.texts.googleCalendarIntegration}</span>
              </div>
              <div className="flex items-center gap-3 p-3 text-gray-800">
                <Clock size={18} className="text-gray-600" />
                <span className="font-normal text-sm">{language.texts.autoDetection}</span>
              </div>
              <div className="flex items-center gap-3 p-3 text-gray-800">
                <Copy size={18} className="text-gray-600" />
                <span className="font-normal text-sm">{language.texts.oneClickCopy}</span>
              </div>
              <div className="flex items-center gap-3 p-3 text-gray-800">
                <Settings size={18} className="text-gray-600" />
                <span className="font-normal text-sm">{language.texts.timeSettings}</span>
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="text-xs text-gray-600 text-center">
              <div className="mb-2">Availability — Serenity Calendar</div>
              <div>Version 1.0.0</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;