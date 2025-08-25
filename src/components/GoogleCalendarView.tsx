import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';
import { Language } from '../types';
import googleCalendar from '../services/googleCalendar';
import EventModal from './EventModal';
import DayViewModal from './DayViewModal';
import CalendarSelector from './CalendarSelector';
import WeekView from './WeekView';
import WeekStartSelector from './WeekStartSelector';

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  calendarName?: string;
  calendarColor?: string;
  calendarId?: string;
}

interface GoogleCalendarViewProps {
  language: Language;
  isSignedIn: boolean;
  isDemoMode?: boolean;
}

const GoogleCalendarView: React.FC<GoogleCalendarViewProps> = ({
  language,
  isSignedIn,
  isDemoMode = false
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedCalendarIds, setSelectedCalendarIds] = useState<string[]>(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem('selectedCalendarIds');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Failed to parse saved calendar IDs
      }
    }
    return [];
  });
  
  const [weekStart, setWeekStart] = useState<0 | 1>(() => {
    const saved = localStorage.getItem('weekStart');
    return saved ? (parseInt(saved) as 0 | 1) : 0; // Default to Sunday (0)
  });

  const monthNames = language.texts.monthNames;
  
  // Adjust weekDays based on weekStart setting
  const getWeekDays = () => {
    const defaultWeekDays = language.texts.weekDays || [];
    if (weekStart === 1) {
      // Monday start - move Sunday to the end
      return [...defaultWeekDays.slice(1), defaultWeekDays[0]];
    }
    return defaultWeekDays;
  };
  
  const weekDays = getWeekDays();

  useEffect(() => {
    if (isSignedIn || isDemoMode) {
      loadEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate, isSignedIn, isDemoMode, viewMode, selectedCalendarIds, weekStart]);

  const loadEvents = async () => {
    if (!isSignedIn && !isDemoMode) return;
    
    setLoading(true);
    try {
      let startDate: Date, endDate: Date;
      
      if (viewMode === 'month') {
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      } else {
        // Week view
        const weekDates = getDaysInWeek();
        startDate = weekDates[0];
        endDate = weekDates[6];
        endDate.setHours(23, 59, 59, 999);
      }
      
      const calendarEvents = await googleCalendar.listEvents(startDate, endDate, isDemoMode, language.code, selectedCalendarIds.length > 0 ? selectedCalendarIds : undefined);
      
      const formattedEvents: Event[] = calendarEvents.map(event => ({
        id: event.id,
        title: event.summary || 'No title',
        start: new Date(event.start.dateTime || event.start.date),
        end: new Date(event.end.dateTime || event.end.date),
        description: event.description,
        location: event.location,
        calendarName: event.calendarName,
        calendarColor: event.calendarColor,
        calendarId: event.calendarId
      }));
      
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Failed to load events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (viewMode === 'month') {
        if (direction === 'prev') {
          newDate.setMonth(newDate.getMonth() - 1);
        } else {
          newDate.setMonth(newDate.getMonth() + 1);
        }
      } else {
        // Week mode navigation
        if (direction === 'prev') {
          newDate.setDate(newDate.getDate() - 7);
        } else {
          newDate.setDate(newDate.getDate() + 7);
        }
      }
      return newDate;
    });
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    
    // Adjust start date based on weekStart setting
    const dayOfWeek = startDate.getDay();
    if (weekStart === 0) {
      // Sunday start - go back to previous Sunday
      startDate.setDate(startDate.getDate() - dayOfWeek);
    } else {
      // Monday start - go back to previous Monday
      const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startDate.setDate(startDate.getDate() - daysToSubtract);
    }
    
    const days = [];
    const endDate = new Date(lastDay);
    
    // Adjust end date to complete the last week
    const endDayOfWeek = endDate.getDay();
    if (weekStart === 0) {
      // Sunday start - go forward to next Saturday
      endDate.setDate(endDate.getDate() + (6 - endDayOfWeek));
    } else {
      // Monday start - go forward to next Sunday
      const daysToAdd = endDayOfWeek === 0 ? 0 : 7 - endDayOfWeek;
      endDate.setDate(endDate.getDate() + daysToAdd);
    }
    
    const current = new Date(startDate);
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const getDaysInWeek = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    
    if (weekStart === 0) {
      // Sunday start
      startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
    } else {
      // Monday start
      const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startOfWeek.setDate(startOfWeek.getDate() - daysToSubtract);
    }
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventDate = event.start.toDateString();
      return eventDate === date.toDateString();
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowDayModal(true);
  };

  const getHeaderTitle = () => {
    if (viewMode === 'month') {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else {
      // Week view: show date range
      const weekDates = getDaysInWeek();
      const firstDay = weekDates[0];
      const lastDay = weekDates[6];
      
      if (firstDay.getMonth() === lastDay.getMonth()) {
        return `${monthNames[firstDay.getMonth()]} ${firstDay.getDate()}-${lastDay.getDate()}, ${firstDay.getFullYear()}`;
      } else {
        return `${monthNames[firstDay.getMonth()]} ${firstDay.getDate()} - ${monthNames[lastDay.getMonth()]} ${lastDay.getDate()}, ${firstDay.getFullYear()}`;
      }
    }
  };

  if (!isSignedIn) {
    return (
      <div className="bg-white rounded-xl p-8 border border-slate-200 text-center">
        <Clock size={32} className="mx-auto mb-3 text-slate-400" />
        <p className="text-slate-600 text-sm">
          {language.code === 'ja' 
            ? 'Googleアカウントでサインインしてカレンダーを表示してください' 
            : 'Sign in with your Google account to view your calendar'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200">
      {/* Calendar Header */}
      <div className="mb-4">
        {/* First row - Title and Navigation */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-medium text-slate-900">
              {getHeaderTitle()}
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                disabled={loading}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                disabled={loading}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          <CalendarSelector
            language={language}
            onCalendarsChange={(ids) => {
              setSelectedCalendarIds(ids);
              localStorage.setItem('selectedCalendarIds', JSON.stringify(ids));
            }}
            isDemoMode={isDemoMode}
          />
        </div>
        
        {/* Second row - Controls */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <WeekStartSelector
              language={language}
              onWeekStartChange={(start) => setWeekStart(start)}
            />
            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode('month')}
                className={`px-2 py-1 text-xs rounded-l-lg transition-colors ${
                  viewMode === 'month' 
                    ? 'bg-slate-700 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-2 py-1 text-xs rounded-r-lg transition-colors ${
                  viewMode === 'week' 
                    ? 'bg-slate-700 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Week
              </button>
            </div>
          </div>
          
          <button
            onClick={() => {
              setSelectedEvent(null);
              setShowEventModal(true);
            }}
            className="flex items-center gap-1 px-3 py-1 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
          >
            <Plus size={12} />
            {language.code === 'ja' ? '予定追加' : 'Add'}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-500">Loading calendar...</p>
        </div>
      )}

      {/* Calendar Grid */}
      {!loading && (
        <>
          {viewMode === 'week' ? (
            // Week View with time axis
            <div className="h-[600px] border border-gray-200 rounded-lg">
              <WeekView
                dates={getDaysInWeek()}
                events={events}
                language={language}
                weekStart={weekStart}
                onEventClick={(event) => {
                  setSelectedEvent(event);
                  setShowEventModal(true);
                }}
                onTimeSlotClick={(date, hour) => {
                  const newEventDate = new Date(date);
                  newEventDate.setHours(hour, 0, 0, 0);
                  setSelectedEvent({
                    id: 'new',
                    title: '',
                    start: newEventDate,
                    end: new Date(newEventDate.getTime() + 60 * 60 * 1000), // 1 hour later
                  });
                  setShowEventModal(true);
                }}
              />
            </div>
          ) : (
            // Month View (existing)
            <>
              {/* Week Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day, index) => (
                  <div key={`weekday-${index}`} className="p-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth().map((date, index) => {
                  const dayEvents = getEventsForDay(date);
                  const isCurrentMonthDay = isCurrentMonth(date);
                  const isTodayDate = isToday(date);

                  return (
                    <div
                      key={index}
                      onClick={() => handleDateClick(date)}
                      className={`
                        min-h-[80px] p-2 border border-slate-100 rounded-lg
                        ${isTodayDate ? 'bg-blue-50 border-blue-200' : 'bg-white'}
                        ${!isCurrentMonthDay ? 'opacity-50' : 'opacity-100'}
                        cursor-pointer hover:bg-slate-50 hover:border-slate-200
                        transition-colors
                      `}
                    >
                      <div className={`
                        text-sm font-medium mb-2
                        ${isTodayDate ? 'text-blue-600' : isCurrentMonthDay ? 'text-slate-900' : 'text-slate-400'}
                      `}>
                        {date.getDate()}
                      </div>
                      
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(event);
                              setShowEventModal(true);
                            }}
                            className="text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity truncate"
                            style={{
                              backgroundColor: event.calendarColor ? `${event.calendarColor}30` : '#f1f5f9',
                              borderLeft: `3px solid ${event.calendarColor || '#64748b'}`
                            }}
                            title={`${event.calendarName ? `[${event.calendarName}] ` : ''}${event.title} (${formatTime(event.start)} - ${formatTime(event.end)})`}
                          >
                            {event.calendarName && (
                              <div style={{ fontSize: '9px', opacity: 0.7, marginBottom: '1px' }}>
                                {event.calendarName}
                              </div>
                            )}
                            <div className="font-medium truncate">{event.title}</div>
                            <div className="text-slate-500">{formatTime(event.start)}</div>
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-slate-500 text-center">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}

      {/* Event Modal */}
      <EventModal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        language={language}
        onEventUpdated={() => {
          loadEvents(); // Reload events after create/update/delete
        }}
      />

      {/* Day View Modal */}
      {selectedDate && (
        <DayViewModal
          isOpen={showDayModal}
          onClose={() => {
            setShowDayModal(false);
            setSelectedDate(null);
          }}
          selectedDate={selectedDate}
          language={language}
        />
      )}
    </div>
  );
};

export default GoogleCalendarView;