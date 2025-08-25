import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, Calendar } from 'lucide-react';
import googleCalendar from '../services/googleCalendar';
import { Language } from '../types';

interface CalendarInfo {
  id: string;
  summary: string;
  backgroundColor?: string;
  selected: boolean;
  isPrimary?: boolean;
}

interface CalendarSelectorProps {
  language: Language;
  onCalendarsChange: (selectedCalendarIds: string[]) => void;
  isDemoMode: boolean;
}

const CalendarSelector: React.FC<CalendarSelectorProps> = ({ 
  language, 
  onCalendarsChange,
  isDemoMode 
}) => {
  const [calendars, setCalendars] = useState<CalendarInfo[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    loadCalendars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemoMode]);

  // Auto-scroll on mobile when dropdown opens
  useEffect(() => {
    if (isOpen && window.innerWidth <= 640 && buttonRef.current) {
      setTimeout(() => {
        buttonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [isOpen]);

  // Load saved selection from localStorage
  useEffect(() => {
    if (calendars.length > 0 && !isInitialized) {
      const savedSelection = localStorage.getItem('selectedCalendarIds');
      if (savedSelection) {
        try {
          const savedIds = JSON.parse(savedSelection);
          const updatedCalendars = calendars.map(cal => ({
            ...cal,
            selected: savedIds.includes(cal.id)
          }));
          setCalendars(updatedCalendars);
          onCalendarsChange(savedIds);
        } catch {
          // Failed to load saved selection
        }
      }
      setIsInitialized(true);
    }
  }, [calendars, isInitialized, onCalendarsChange]);

  const loadCalendars = async () => {
    if (isDemoMode) {
      // Demo mode - show fake calendars
      const demoCalendars: CalendarInfo[] = [
        {
          id: 'primary',
          summary: language.code === 'ja' ? 'マイカレンダー' : 'My Calendar',
          backgroundColor: '#4285f4',
          selected: true,
          isPrimary: true
        }
      ];
      setCalendars(demoCalendars);
      onCalendarsChange(['primary']);
      return;
    }

    setLoading(true);
    try {
      const calendarList = await googleCalendar.getCalendarList();
      
      // Check for saved selection
      const savedSelection = localStorage.getItem('selectedCalendarIds');
      let savedIds: string[] = [];
      
      if (savedSelection) {
        try {
          savedIds = JSON.parse(savedSelection);
        } catch {
          // Failed to parse saved selection
        }
      }
      
      // Initialize calendars with saved selection or default to primary only
      const calendarInfos: CalendarInfo[] = calendarList.map((cal) => ({
        id: cal.id,
        summary: cal.summary,
        backgroundColor: cal.backgroundColor,
        selected: savedIds.length > 0 ? savedIds.includes(cal.id) : cal.primary === true,
        isPrimary: cal.primary === true
      }));

      setCalendars(calendarInfos);
      
      // Notify parent of selected calendars
      const selectedIds = calendarInfos
        .filter(cal => cal.selected)
        .map(cal => cal.id);
      onCalendarsChange(selectedIds);
      
      // Save selection if not already saved
      if (savedIds.length === 0) {
        localStorage.setItem('selectedCalendarIds', JSON.stringify(selectedIds));
      }
    } catch {
      // Failed to load calendars
    } finally {
      setLoading(false);
    }
  };

  const toggleCalendar = (calendarId: string) => {
    const updatedCalendars = calendars.map(cal => 
      cal.id === calendarId 
        ? { ...cal, selected: !cal.selected }
        : cal
    );
    
    setCalendars(updatedCalendars);
    
    // Notify parent of selected calendars
    const selectedIds = updatedCalendars
      .filter(cal => cal.selected)
      .map(cal => cal.id);
    onCalendarsChange(selectedIds);
    
    // Save to localStorage
    localStorage.setItem('selectedCalendarIds', JSON.stringify(selectedIds));
  };

  const selectAll = () => {
    const updatedCalendars = calendars.map(cal => ({ ...cal, selected: true }));
    setCalendars(updatedCalendars);
    const allIds = calendars.map(cal => cal.id);
    onCalendarsChange(allIds);
    // Save to localStorage
    localStorage.setItem('selectedCalendarIds', JSON.stringify(allIds));
  };

  const selectNone = () => {
    // Keep primary calendar selected
    const updatedCalendars = calendars.map(cal => ({ 
      ...cal, 
      selected: cal.isPrimary === true 
    }));
    setCalendars(updatedCalendars);
    const primaryIds = calendars.filter(cal => cal.isPrimary).map(cal => cal.id);
    onCalendarsChange(primaryIds);
    // Save to localStorage
    localStorage.setItem('selectedCalendarIds', JSON.stringify(primaryIds));
  };

  const selectedCount = calendars.filter(cal => cal.selected).length;

  // メールアドレスの場合は@前だけ表示
  const formatCalendarName = (name: string) => {
    if (name.includes('@')) {
      const parts = name.split('@');
      return `${parts[0]}`;
    }
    return name;
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        disabled={loading}
      >
        <Calendar size={16} />
        <span>
          {language.code === 'ja' 
            ? `カレンダー (${selectedCount}/${calendars.length})`
            : `Calendars (${selectedCount}/${calendars.length})`
          }
        </span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Mobile: Dropdown below button */}
          <div className="md:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-[45]"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-[46] bg-white rounded-lg shadow-xl border border-gray-200 w-[90vw] max-w-[400px] max-h-[60vh] overflow-hidden">
              {/* Quick Actions */}
              <div className="p-2 border-b border-gray-100 flex gap-2">
                <button
                  onClick={selectAll}
                  className="flex-1 text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  {language.code === 'ja' ? 'すべて選択' : 'Select All'}
                </button>
                <button
                  onClick={selectNone}
                  className="flex-1 text-xs px-2 py-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                >
                  {language.code === 'ja' ? 'マイカレンダーのみ' : 'Primary Only'}
                </button>
              </div>

              {/* Calendar List */}
              <div className="max-h-[50vh] overflow-y-auto p-2">
                {calendars.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-4">
                    {loading 
                      ? (language.code === 'ja' ? '読み込み中...' : 'Loading...')
                      : (language.code === 'ja' ? 'カレンダーがありません' : 'No calendars')
                    }
                  </div>
                ) : (
                  <div className="space-y-1">
                    {calendars.map(calendar => (
                      <button
                        key={calendar.id}
                        onClick={() => toggleCalendar(calendar.id)}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 transition-colors text-left"
                      >
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: calendar.backgroundColor || '#4285f4' }}
                        />
                        <span className="flex-1 text-sm min-w-0">
                          <span className="block truncate" title={calendar.summary}>
                            {formatCalendarName(calendar.summary)}
                            {calendar.isPrimary && (
                              <span className="text-xs text-gray-500 ml-1">
                                ({language.code === 'ja' ? 'メイン' : 'Primary'})
                              </span>
                            )}
                          </span>
                        </span>
                        {calendar.selected && (
                          <Check size={14} className="text-blue-600 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  {language.code === 'ja' 
                    ? '選択したカレンダーの予定が表示され、空き時間検索に反映されます'
                    : 'Selected calendars will be shown and used for availability search'
                  }
                </p>
              </div>
            </div>
          </div>
          
          {/* Desktop: Original dropdown style */}
          <div className="hidden md:block">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-[45]"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 z-[46] min-w-[280px] max-w-[400px]">
              {/* Quick Actions */}
              <div className="p-2 border-b border-gray-100 flex gap-2">
                <button
                  onClick={selectAll}
                  className="flex-1 text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  {language.code === 'ja' ? 'すべて選択' : 'Select All'}
                </button>
                <button
                  onClick={selectNone}
                  className="flex-1 text-xs px-2 py-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                >
                  {language.code === 'ja' ? 'マイカレンダーのみ' : 'Primary Only'}
                </button>
              </div>

              {/* Calendar List */}
              <div className="max-h-[350px] overflow-y-auto p-2">
                {calendars.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-4">
                    {loading 
                      ? (language.code === 'ja' ? '読み込み中...' : 'Loading...')
                      : (language.code === 'ja' ? 'カレンダーがありません' : 'No calendars')
                    }
                  </div>
                ) : (
                  <div className="space-y-1">
                    {calendars.map(calendar => (
                      <button
                        key={calendar.id}
                        onClick={() => toggleCalendar(calendar.id)}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 transition-colors text-left"
                      >
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: calendar.backgroundColor || '#4285f4' }}
                        />
                        <span className="flex-1 text-sm min-w-0">
                          <span className="block truncate" title={calendar.summary}>
                            {formatCalendarName(calendar.summary)}
                            {calendar.isPrimary && (
                              <span className="text-xs text-gray-500 ml-1">
                                ({language.code === 'ja' ? 'メイン' : 'Primary'})
                              </span>
                            )}
                          </span>
                        </span>
                        {calendar.selected && (
                          <Check size={14} className="text-blue-600 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  {language.code === 'ja' 
                    ? '選択したカレンダーの予定が表示され、空き時間検索に反映されます'
                    : 'Selected calendars will be shown and used for availability search'
                  }
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CalendarSelector;