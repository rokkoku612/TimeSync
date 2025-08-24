import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, FileText, Edit } from 'lucide-react';
import { Language, TimeSlot } from '../types';
import googleCalendar from '../services/googleCalendar';
import EventModal from './EventModal';

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  calendarName?: string;
  calendarColor?: string;
}

interface EventsDisplayProps {
  language: Language;
  isSignedIn: boolean;
  isDemoMode?: boolean;
  availableSlots: (TimeSlot | null)[];
  startDateTime: Date;
  endDateTime: Date;
  selectedCalendarIds?: string[];
  showResults?: boolean;
}

const EventsDisplay: React.FC<EventsDisplayProps> = ({
  language,
  isSignedIn,
  isDemoMode = false,
  availableSlots,
  startDateTime,
  endDateTime,
  selectedCalendarIds,
  showResults = false
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  useEffect(() => {
    if ((isSignedIn || isDemoMode) && showResults) {
      loadEventsInPeriod();
    }
  }, [isSignedIn, isDemoMode, showResults, startDateTime, endDateTime, selectedCalendarIds]);

  const loadEventsInPeriod = async () => {
    if (!isSignedIn && !isDemoMode) return;
    
    setLoading(true);
    try {
      const calendarEvents = await googleCalendar.listEvents(startDateTime, endDateTime, isDemoMode, language.code, selectedCalendarIds);
      
      const formattedEvents: Event[] = calendarEvents.map(event => ({
        id: event.id,
        title: event.summary || 'No title',
        start: new Date(event.start.dateTime || event.start.date),
        end: new Date(event.end.dateTime || event.end.date),
        description: event.description,
        location: event.location,
        calendarName: event.calendarName,
        calendarColor: event.calendarColor
      }));
      
      // Sort events by start time
      formattedEvents.sort((a, b) => a.start.getTime() - b.start.getTime());
      setEvents(formattedEvents);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (date: Date) => {
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    
    if (language.code === 'ja') {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dayOfWeek = language.texts.dayNames[date.getDay()];
      return `${month}月${day}日(${dayOfWeek}) ${timeStr}`;
    } else {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dayOfWeek = language.texts.dayNames[date.getDay()];
      return `${month}/${day} (${dayOfWeek}) ${timeStr}`;
    }
  };

  const formatEventDuration = (start: Date, end: Date) => {
    const startTime = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const endTime = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${startTime} - ${endTime}`;
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleEventUpdated = () => {
    loadEventsInPeriod(); // Reload events after update
  };

  if ((!isSignedIn && !isDemoMode) || !showResults) {
    return null;
  }

  return (
    <>
      <div className="bg-white rounded-xl p-6 border border-slate-200 mt-6">
        <div className="flex items-center gap-3 mb-6 text-xs font-medium text-slate-500 uppercase tracking-wider">
          <Calendar size={14} />
          <span>{language.code === 'ja' ? '検索期間の予定一覧' : 'Events in Search Period'}</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="mt-2 text-sm text-gray-500">
              {language.code === 'ja' ? '予定を読み込み中...' : 'Loading events...'}
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              {language.code === 'ja' ? '指定期間に予定はありません' : 'No events in the selected period'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                onClick={() => handleEventClick(event)}
                className="p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 cursor-pointer group"
                style={{
                  borderLeft: `3px solid ${event.calendarColor || '#4285f4'}`
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {event.calendarName && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <div 
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: event.calendarColor || '#4285f4' }}
                        />
                        <span>{event.calendarName}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                        {event.title}
                      </h4>
                      <Edit size={12} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                      <Clock size={12} />
                      <span>{formatEventDuration(event.start, event.end)}</span>
                      <span className="text-gray-400">•</span>
                      <span>{formatDateTime(event.start)}</span>
                    </div>
                    
                    {event.location && (
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                        <MapPin size={12} />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                    
                    {event.description && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <FileText size={12} />
                        <span className="truncate">{event.description}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        language={language}
        onEventUpdated={handleEventUpdated}
      />
    </>
  );
};

export default EventsDisplay;