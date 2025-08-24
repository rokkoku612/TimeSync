import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Clock, MapPin, FileText } from 'lucide-react';
import { Language } from '../types';
import googleCalendar from '../services/googleCalendar';
import EventModal from './EventModal';

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
}

interface DayViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  language: Language;
}

const DayViewModal: React.FC<DayViewModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  language
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadEventsForDay();
    }
  }, [isOpen, selectedDate]);

  const loadEventsForDay = async () => {
    setLoading(true);
    try {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const calendarEvents = await googleCalendar.listEvents(startOfDay, endOfDay);
      
      const formattedEvents: Event[] = calendarEvents
        .filter(event => {
          const eventStart = new Date(event.start.dateTime || event.start.date);
          return eventStart.toDateString() === selectedDate.toDateString();
        })
        .map(event => ({
          id: event.id,
          title: event.summary || 'No title',
          start: new Date(event.start.dateTime || event.start.date),
          end: new Date(event.end.dateTime || event.end.date),
          description: event.description,
          location: event.location
        }))
        .sort((a, b) => a.start.getTime() - b.start.getTime());
      
      setEvents(formattedEvents);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDateHeader = (date: Date) => {
    const monthNames = language.texts.monthNames;
    const dayNames = language.texts.dayNames;
    
    if (language.code === 'ja') {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dayOfWeek = dayNames[date.getDay()];
      return `${month}月${day}日(${dayOfWeek})`;
    } else {
      const month = monthNames[date.getMonth()];
      const day = date.getDate();
      const dayOfWeek = dayNames[date.getDay()];
      return `${month} ${day} (${dayOfWeek})`;
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleNewEvent = () => {
    // Create a new event with default time on the selected date
    const newEventStart = new Date(selectedDate);
    newEventStart.setHours(9, 0, 0, 0); // Default to 9:00 AM
    
    const newEventEnd = new Date(selectedDate);
    newEventEnd.setHours(10, 0, 0, 0); // Default to 10:00 AM (1 hour duration)
    
    setSelectedEvent({
      id: '',
      title: '',
      start: newEventStart,
      end: newEventEnd
    });
    setShowEventModal(true);
  };

  const handleEventUpdated = () => {
    loadEventsForDay(); // Reload events after update
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {formatDateHeader(selectedDate)}
              </h3>
              <p className="text-sm text-gray-500">
                {language.code === 'ja' ? '予定詳細' : 'Day Schedule'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleNewEvent}
                className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                <Plus size={14} />
                {language.code === 'ja' ? '追加' : 'Add'}
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="mt-2 text-sm text-gray-500">
                  {language.code === 'ja' ? '予定を読み込み中...' : 'Loading events...'}
                </p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">
                  {language.code === 'ja' ? 'この日は予定がありません' : 'No events scheduled for this day'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className="p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors flex-1 text-sm">
                        {event.title}
                      </h4>
                      <Edit size={12} className="text-gray-400 group-hover:text-blue-500 transition-colors mt-0.5" />
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                      <Clock size={12} />
                      <span>{formatTime(event.start)} - {formatTime(event.end)}</span>
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
                ))}
              </div>
            )}
          </div>
        </div>
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

export default DayViewModal;