import { useState } from 'react';

export const useAppState = () => {
  const [showManual, setShowManual] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'calendar' | 'search'>('search');
  
  const [selectedCalendarIds, setSelectedCalendarIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('selectedCalendarIds');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Failed to parse saved IDs
      }
    }
    return [];
  });

  const handleCalendarSelectionChange = (ids: string[]) => {
    setSelectedCalendarIds(ids);
    localStorage.setItem('selectedCalendarIds', JSON.stringify(ids));
  };

  const closeAllModals = () => {
    setShowManual(false);
    setShowContact(false);
    setShowTerms(false);
    setShowAbout(false);
    setIsMenuOpen(false);
  };

  return {
    showManual,
    showContact,
    showTerms,
    showAbout,
    isMenuOpen,
    activeTab,
    selectedCalendarIds,
    setShowManual,
    setShowContact,
    setShowTerms,
    setShowAbout,
    setIsMenuOpen,
    setActiveTab,
    handleCalendarSelectionChange,
    closeAllModals,
  };
};