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

  // Week start setting (0: Sunday, 1: Monday)
  const [weekStart, setWeekStart] = useState<0 | 1>(() => {
    const saved = localStorage.getItem('weekStart');
    return saved ? (parseInt(saved) as 0 | 1) : 0; // Default to Sunday (0)
  });

  const handleCalendarSelectionChange = (ids: string[]) => {
    setSelectedCalendarIds(ids);
    localStorage.setItem('selectedCalendarIds', JSON.stringify(ids));
  };

  const handleWeekStartChange = (start: 0 | 1) => {
    setWeekStart(start);
    localStorage.setItem('weekStart', start.toString());
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
    weekStart,
    setShowManual,
    setShowContact,
    setShowTerms,
    setShowAbout,
    setIsMenuOpen,
    setActiveTab,
    handleCalendarSelectionChange,
    handleWeekStartChange,
    closeAllModals,
  };
};