import { useState } from 'react';
import { TimeSlot, Language } from '../types';
import { generateDemoSlots } from '../utils/timeSlotGenerator';
import googleCalendar from '../services/googleCalendar';
import googleAuthDirect from '../services/googleAuthDirect';
import { useLocalStorage } from './useLocalStorage';

export const useAvailabilitySearch = () => {
  // 設定をローカルストレージに保存
  const [minDuration, setMinDuration] = useLocalStorage('timeSync_minDuration', 30);
  const [excludeBeforeTime, setExcludeBeforeTime] = useLocalStorage('timeSync_excludeBefore', '');
  const [excludeAfterTime, setExcludeAfterTime] = useLocalStorage('timeSync_excludeAfter', '');
  const [showAdvanced, setShowAdvanced] = useLocalStorage('timeSync_showAdvanced', false);
  const [availableSlots, setAvailableSlots] = useState<(TimeSlot | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async (startDateTime: Date, endDateTime: Date, language: Language, isDemoMode: boolean = false, selectedCalendarIds?: string[]) => {
    if (!startDateTime || !endDateTime) {
      alert('Please select both start and end dates.');
      return;
    }

    setIsLoading(true);
    setShowResults(false);
    setSearchError(null);

    try {
      // Check if user is signed in or in demo mode
      if (googleAuthDirect.isSignedIn() || isDemoMode) {
        // Use Google Calendar data (real or demo)
        const slots = await googleCalendar.findAvailableSlots(
          startDateTime,
          endDateTime,
          minDuration,
          excludeBeforeTime,
          excludeAfterTime,
          isDemoMode,
          language.code,
          selectedCalendarIds
        );
        setAvailableSlots(slots);
      } else {
        // Use demo data if not signed in and not in demo mode
        setTimeout(() => {
          const slots = generateDemoSlots(
            startDateTime, 
            endDateTime, 
            minDuration, 
            language,
            excludeBeforeTime,
            excludeAfterTime
          );
          setAvailableSlots(slots);
          setShowResults(true);
          setIsLoading(false);
        }, 1500);
        return;
      }
      
      setShowResults(true);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : 'Failed to search calendar');
      setAvailableSlots([]);
      setShowResults(false);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSlot = (index: number) => {
    setAvailableSlots(prev => {
      const newSlots = [...prev];
      newSlots[index] = null;
      return newSlots;
    });
  };

  const copyToClipboard = () => {
    // This function now just triggers the success state
    // The actual copying is handled in ResultsList with templates
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return {
    minDuration,
    setMinDuration,
    excludeBeforeTime,
    setExcludeBeforeTime,
    excludeAfterTime,
    setExcludeAfterTime,
    showAdvanced,
    setShowAdvanced,
    availableSlots,
    isLoading,
    showResults,
    copySuccess,
    searchError,
    handleSearch,
    deleteSlot,
    copyToClipboard
  };
};