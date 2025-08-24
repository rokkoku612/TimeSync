import React from 'react';
import { Language } from '../types';

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

interface WeekViewProps {
  dates: Date[];
  events: Event[];
  language: Language;
  onEventClick: (event: Event) => void;
  onTimeSlotClick: (date: Date, hour: number) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  dates,
  events,
  language,
  onEventClick,
  onTimeSlotClick
}) => {
  const weekDays = language.texts.weekDays || [];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Get events for a specific day and hour
  const getEventsForSlot = (date: Date, hour: number) => {
    return events.filter(event => {
      const eventDate = event.start.toDateString();
      const eventHour = event.start.getHours();
      const eventEndHour = event.end.getHours();
      return eventDate === date.toDateString() && 
             eventHour <= hour && 
             (eventEndHour > hour || (eventEndHour === hour && event.end.getMinutes() > 0));
    });
  };

  // Calculate event position and height
  const getEventStyle = (event: Event, date: Date) => {
    const startHour = event.start.getHours();
    const startMinute = event.start.getMinutes();
    const endHour = event.end.getHours();
    const endMinute = event.end.getMinutes();
    
    const top = (startHour * 60 + startMinute) * (60 / 60); // 60px per hour
    const duration = (endHour - startHour) * 60 + (endMinute - startMinute);
    const height = Math.max(20, duration * (60 / 60)); // Minimum 20px height
    
    return {
      top: `${top}px`,
      height: `${height}px`,
      position: 'absolute' as const,
      left: '2px',
      right: '2px',
      zIndex: 10
    };
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getCurrentTimePosition = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return (hours * 60 + minutes) * (60 / 60); // 60px per hour
  };

  const isCurrentTime = () => {
    const now = new Date();
    return dates.some(date => isToday(date));
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header with days */}
        <div className="grid grid-cols-8 gap-0 border-b border-gray-200 sticky top-0 bg-white z-20">
          <div className="p-2 text-xs text-gray-500 border-r border-gray-200">
            {/* Empty corner cell */}
          </div>
          {dates.map((date, index) => (
            <div 
              key={index} 
              className={`p-2 text-center border-r border-gray-200 ${isToday(date) ? 'bg-blue-50' : ''}`}
            >
              <div className="text-xs font-medium text-gray-600">
                {weekDays[date.getDay()]}
              </div>
              <div className={`text-sm font-bold ${isToday(date) ? 'text-blue-600' : 'text-gray-900'}`}>
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="relative">
          {/* Current time indicator */}
          {isCurrentTime() && (
            <div 
              className="absolute left-0 right-0 border-t-2 border-red-500 z-20 pointer-events-none"
              style={{ top: `${getCurrentTimePosition()}px` }}
            >
              <div className="absolute left-0 w-2 h-2 bg-red-500 rounded-full -mt-1"></div>
            </div>
          )}

          {/* Hours grid */}
          <div className="grid grid-cols-8 gap-0">
            {/* Time column */}
            <div className="border-r border-gray-200">
              {hours.map(hour => (
                <div 
                  key={hour} 
                  className="h-[60px] px-2 py-1 text-xs text-gray-500 border-b border-gray-100"
                >
                  {`${hour.toString().padStart(2, '0')}:00`}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {dates.map((date, dateIndex) => (
              <div key={dateIndex} className="border-r border-gray-200 relative">
                {hours.map(hour => (
                  <div
                    key={hour}
                    onClick={() => onTimeSlotClick(date, hour)}
                    className={`h-[60px] border-b border-gray-100 hover:bg-gray-50 cursor-pointer relative
                      ${isToday(date) ? 'bg-blue-50/20' : ''}
                    `}
                  >
                    {/* Events for this time slot */}
                    {getEventsForSlot(date, hour).map(event => {
                      // Only render the event in its starting hour
                      if (event.start.getHours() === hour) {
                        return (
                          <div
                            key={event.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEventClick(event);
                            }}
                            className="absolute inset-x-1 rounded px-1 py-0.5 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                            style={{
                              ...getEventStyle(event, date),
                              backgroundColor: event.calendarColor ? `${event.calendarColor}30` : '#e2e8f0',
                              borderLeft: `3px solid ${event.calendarColor || '#64748b'}`,
                              fontSize: '11px'
                            }}
                            title={`${event.title} (${formatTime(event.start)} - ${formatTime(event.end)})`}
                          >
                            <div className="font-medium truncate">{event.title}</div>
                            <div className="text-gray-600 truncate">
                              {formatTime(event.start)} - {formatTime(event.end)}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekView;