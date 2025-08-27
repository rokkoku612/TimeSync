import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarPopupProps } from '../types';

const CalendarPopup: React.FC<CalendarPopupProps> = React.memo(({ 
  type,
  currentDate, 
  calendarYear, 
  calendarMonth, 
  language, 
  weekStart = 0,
  startDate,
  endDate,
  onMonthChange, 
  onDateSelect, 
  onTimeChange 
}) => {
  const { monthNames } = language.texts;
  
  // Adjust weekDays based on weekStart setting
  const defaultWeekDays = language.texts.weekDays || [];
  const weekDays = weekStart === 1 
    ? [...defaultWeekDays.slice(1), defaultWeekDays[0]]
    : defaultWeekDays;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const changeMonth = (direction: number) => {
    let newMonth = calendarMonth + direction * 2; // Change by 2 months
    let newYear = calendarYear;
    
    while (newMonth < 0) {
      newMonth += 12;
      newYear--;
    }
    while (newMonth > 11) {
      newMonth -= 12;
      newYear++;
    }
    
    onMonthChange(newYear, newMonth);
  };

  const selectDate = (day: number, month: number, year: number) => {
    const selectedDate = new Date(year, month, day, currentDate.getHours(), currentDate.getMinutes());
    onDateSelect(selectedDate);
  };

  // Generate calendar for a specific month
  const generateMonthDays = (year: number, month: number) => {
    const days = [];
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const firstDay = weekStart === 1 
      ? (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1)
      : firstDayOfMonth;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Previous month days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      days.push(
        <button
          key={`${year}-${month}-prev-${day}`}
          className="w-8 h-8 flex items-center justify-center text-xs text-gray-400 opacity-30 hover:opacity-60 transition-all duration-200 rounded-full"
          onClick={() => selectDate(day, month - 1, month === 0 ? year - 1 : year)}
        >
          {day}
        </button>
      );
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      const isToday = date.getTime() === today.getTime();
      const isSelected = currentDate && 
                        date.getDate() === currentDate.getDate() &&
                        date.getMonth() === currentDate.getMonth() &&
                        date.getFullYear() === currentDate.getFullYear();
      
      // Check if date is in range between start and end
      let isInRange = false;
      let isRangeStart = false;
      let isRangeEnd = false;
      
      if (startDate && endDate) {
        const startTime = new Date(startDate).setHours(0, 0, 0, 0);
        const endTime = new Date(endDate).setHours(0, 0, 0, 0);
        const currentTime = date.getTime();
        
        isInRange = currentTime >= startTime && currentTime <= endTime;
        isRangeStart = currentTime === startTime;
        isRangeEnd = currentTime === endTime;
      }
      
      days.push(
        <button
          key={`${year}-${month}-current-${day}`}
          className={`w-8 h-8 flex items-center justify-center text-xs transition-all duration-200 relative ${
            isSelected 
              ? 'bg-gray-900 text-white font-medium rounded-full z-10' 
              : isInRange
              ? `${isRangeStart ? 'rounded-l-full' : isRangeEnd ? 'rounded-r-full' : ''} ${
                isRangeStart || isRangeEnd ? 'bg-blue-500 text-white font-medium' : 'bg-blue-100 text-gray-900'
              }`
              : 'text-gray-900 hover:bg-gray-100 hover:scale-110 rounded-full'
          } ${isToday && !isSelected ? 'after:absolute after:bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:w-1 after:h-1 after:bg-gray-600 after:rounded-full' : ''}
          ${isToday && isSelected ? 'after:absolute after:bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:w-1 after:h-1 after:bg-white after:rounded-full' : ''}`}
          onClick={() => selectDate(day, month, year)}
        >
          {day}
        </button>
      );
    }
    
    // Fill remaining cells to complete the grid
    const totalCells = firstDay + daysInMonth;
    const remainingCells = 42 - totalCells;
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <button
          key={`${year}-${month}-next-${day}`}
          className="w-8 h-8 flex items-center justify-center text-xs text-gray-400 opacity-30 hover:opacity-60 transition-all duration-200 rounded-full"
          onClick={() => selectDate(day, month + 1, month === 11 ? year + 1 : year)}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  // Generate days for both months
  const firstMonthDays = generateMonthDays(calendarYear, calendarMonth);
  
  // Calculate next month's year and month
  let nextMonth = calendarMonth + 1;
  let nextYear = calendarYear;
  if (nextMonth > 11) {
    nextMonth = 0;
    nextYear++;
  }
  const secondMonthDays = generateMonthDays(nextYear, nextMonth);
  
  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 w-full">
      <div className="flex justify-between items-center px-3 py-1.5 bg-gray-50 border-b border-gray-100">
        <button
          className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-900 hover:border-gray-900 hover:text-white transition-all duration-200 hover:scale-105 active:scale-95"
          onClick={() => changeMonth(-1)}
          style={{ padding: 0 }}
        >
          <ChevronLeft size={12} />
        </button>
        <div className="flex gap-4 md:gap-8 items-center">
          <span className="text-sm font-medium text-gray-900 tracking-tight">
            {monthNames[calendarMonth]} {calendarYear}
          </span>
          <span className="text-sm font-medium text-gray-900 tracking-tight">
            {monthNames[nextMonth]} {nextYear}
          </span>
        </div>
        <button
          className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-900 hover:border-gray-900 hover:text-white transition-all duration-200 hover:scale-105 active:scale-95"
          onClick={() => changeMonth(1)}
          style={{ padding: 0 }}
        >
          <ChevronRight size={12} />
        </button>
      </div>
      <div className="flex flex-row gap-6 md:gap-8 px-4 py-3">
        {/* First Month */}
        <div className="flex-1">
          <div className="grid grid-cols-7 gap-1 mb-1">
            {weekDays.map((day, index) => (
              <div key={`first-${index}`} className="w-8 h-6 flex items-center justify-center text-xs font-medium text-gray-400 tracking-wide">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {firstMonthDays}
          </div>
        </div>
        
        {/* Second Month */}
        <div className="flex-1">
          <div className="grid grid-cols-7 gap-1 mb-1">
            {weekDays.map((day, index) => (
              <div key={`second-${index}`} className="w-8 h-6 flex items-center justify-center text-xs font-medium text-gray-400 tracking-wide">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {secondMonthDays}
          </div>
        </div>
      </div>
    </div>
  );
});

CalendarPopup.displayName = 'CalendarPopup';

export default CalendarPopup;