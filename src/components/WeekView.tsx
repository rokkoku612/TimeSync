import React, { useRef, useEffect, useState } from 'react';
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
  calendarId?: string;
}

interface WeekViewProps {
  dates: Date[];
  events: Event[];
  language: Language;
  weekStart?: 0 | 1;
  onEventClick: (event: Event) => void;
  onTimeSlotClick: (date: Date, hour: number) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  dates,
  events,
  language,
  weekStart = 0,
  onEventClick,
  onTimeSlotClick
}) => {
  // Adjust weekDays based on weekStart setting
  const defaultWeekDays = language.texts.weekDays || [];
  const weekDays = weekStart === 1 
    ? [...defaultWeekDays.slice(1), defaultWeekDays[0]]
    : defaultWeekDays;
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);


  // Calculate event position and height
  const getEventStyle = (event: Event) => {
    const startHour = event.start.getHours();
    const startMinute = event.start.getMinutes();
    const endHour = event.end.getHours();
    const endMinute = event.end.getMinutes();
    
    // Calculate position relative to the hour slot
    const hourSlotHeight = 60; // 60px per hour
    const minuteOffset = (startMinute / 60) * hourSlotHeight;
    const top = startHour * hourSlotHeight + minuteOffset;
    
    // Calculate duration and height
    const durationMinutes = (endHour - startHour) * 60 + (endMinute - startMinute);
    const height = Math.max(20, (durationMinutes / 60) * hourSlotHeight);
    
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
    return dates.some(date => isToday(date));
  };

  // Sync horizontal scroll between header and content
  useEffect(() => {
    const handleContentScroll = () => {
      if (contentRef.current && headerRef.current) {
        headerRef.current.scrollLeft = contentRef.current.scrollLeft;
      }
    };

    const content = contentRef.current;
    if (content) {
      content.addEventListener('scroll', handleContentScroll);
      return () => content.removeEventListener('scroll', handleContentScroll);
    }
  }, []);

  return (
    <div className="relative h-full">
      {/* Fixed header with days */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="flex">
          <div className="w-16 flex-shrink-0"></div>
          <div ref={headerRef} className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-none">
            <div className="min-w-[700px] grid grid-cols-7 gap-0">
              {dates.map((date, index) => (
                <div 
                  key={index} 
                  className={`p-2 text-center border-r border-gray-200 ${isToday(date) ? 'bg-blue-50' : 'bg-white'}`}
                >
                  <div className="text-xs font-medium text-gray-600">
                    {weekDays[index]}
                  </div>
                  <div className={`text-sm font-bold ${isToday(date) ? 'text-blue-600' : 'text-gray-900'}`}>
                    {date.getDate()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="relative overflow-y-auto" style={{ maxHeight: 'calc(100% - 52px)' }}>
        <div className="flex">
          {/* Time axis - outside the table */}
          <div className="w-16 flex-shrink-0 relative bg-white">
            {hours.map(hour => (
              <div 
                key={hour} 
                className="h-[60px] flex items-start justify-end pr-1 text-xs text-gray-500 relative"
              >
                <span className="absolute -top-2 right-1">
                  {`${hour.toString().padStart(2, '0')}:00`}
                </span>
              </div>
            ))}
          </div>

          {/* Main calendar grid */}
          <div ref={contentRef} className="flex-1 overflow-x-auto">
            <div className="min-w-[700px] relative">
              {/* Current time indicator */}
              {isCurrentTime() && (
                <div 
                  className="absolute left-0 right-0 border-t-2 border-red-500 z-20 pointer-events-none"
                  style={{ top: `${getCurrentTimePosition()}px` }}
                >
                  <div className="absolute -left-16 w-14 text-xs text-red-500 font-bold text-right pr-1">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </div>
                  <div className="absolute left-0 w-2 h-2 bg-red-500 rounded-full -mt-1"></div>
                </div>
              )}

              {/* Day columns */}
              <div className="grid grid-cols-7 gap-0">
                {dates.map((date, dateIndex) => (
                  <div key={dateIndex} className="border-r border-gray-200 relative">
                    {/* All events for this day */}
                    {events
                      .filter(event => event.start.toDateString() === date.toDateString())
                      .map(event => (
                        <div
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick(event);
                          }}
                          className="absolute inset-x-1 rounded px-1 py-0.5 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                          style={{
                            ...getEventStyle(event),
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
                      ))}
                    
                    {/* Hour slots for click events */}
                    {hours.map(hour => (
                      <div
                        key={hour}
                        onClick={() => onTimeSlotClick(date, hour)}
                        className={`h-[60px] border-b border-gray-100 hover:bg-gray-50 cursor-pointer
                          ${isToday(date) ? 'bg-blue-50/20' : ''}
                        `}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekView;