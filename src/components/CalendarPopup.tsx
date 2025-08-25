import React from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { CalendarPopupProps } from '../types';

const CalendarPopup: React.FC<CalendarPopupProps> = React.memo(({ 
  currentDate, 
  calendarYear, 
  calendarMonth, 
  language, 
  onMonthChange, 
  onDateSelect, 
  onTimeChange 
}) => {
  const { monthNames, weekDays } = language.texts;
  
  const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const changeMonth = (direction: number) => {
    let newMonth = calendarMonth + direction;
    let newYear = calendarYear;
    
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    
    onMonthChange(newYear, newMonth);
  };

  const selectDate = (day: number, month: number, year: number) => {
    const selectedDate = new Date(year, month, day, currentDate.getHours(), currentDate.getMinutes());
    onDateSelect(selectedDate);
  };

  const updateTime = (field: 'hours' | 'minutes', value: number) => {
    if (field === 'hours') {
      const clampedHours = Math.max(0, Math.min(23, value));
      onTimeChange(clampedHours, currentDate.getMinutes());
    } else {
      const clampedMinutes = Math.max(0, Math.min(59, value));
      onTimeChange(currentDate.getHours(), clampedMinutes);
    }
  };

  const incrementTime = (field: 'hours' | 'minutes') => {
    if (field === 'hours') {
      const newHours = (currentDate.getHours() + 1) % 24;
      onTimeChange(newHours, currentDate.getMinutes());
    } else {
      const currentMinutes = currentDate.getMinutes();
      const newMinutes = currentMinutes >= 45 ? 0 : currentMinutes + 15;
      const newHours = currentMinutes >= 45 ? (currentDate.getHours() + 1) % 24 : currentDate.getHours();
      onTimeChange(newHours, newMinutes);
    }
  };

  const decrementTime = (field: 'hours' | 'minutes') => {
    if (field === 'hours') {
      const newHours = currentDate.getHours() === 0 ? 23 : currentDate.getHours() - 1;
      onTimeChange(newHours, currentDate.getMinutes());
    } else {
      const currentMinutes = currentDate.getMinutes();
      const newMinutes = currentMinutes === 0 ? 45 : currentMinutes - 15;
      const newHours = currentMinutes === 0 ? (currentDate.getHours() === 0 ? 23 : currentDate.getHours() - 1) : currentDate.getHours();
      onTimeChange(newHours, newMinutes);
    }
  };

  const days = [];
  
  // Previous month days
  const prevMonthDays = new Date(calendarYear, calendarMonth, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    days.push(
      <button
        key={`prev-${day}`}
        className="w-8 h-8 flex items-center justify-center text-xs text-gray-400 opacity-30 hover:opacity-60 transition-all duration-200 rounded-full"
        onClick={() => selectDate(day, calendarMonth - 1, calendarMonth === 0 ? calendarYear - 1 : calendarYear)}
      >
        {day}
      </button>
    );
  }
  
  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(calendarYear, calendarMonth, day);
    date.setHours(0, 0, 0, 0);
    const isToday = date.getTime() === today.getTime();
    const isSelected = currentDate && 
                      date.getDate() === currentDate.getDate() &&
                      date.getMonth() === currentDate.getMonth() &&
                      date.getFullYear() === currentDate.getFullYear();
    
    days.push(
      <button
        key={`current-${day}`}
        className={`w-8 h-8 flex items-center justify-center text-xs rounded-full transition-all duration-200 relative ${
          isSelected 
            ? 'bg-gray-900 text-white font-medium' 
            : 'text-gray-900 hover:bg-gray-100 hover:scale-110'
        } ${isToday && !isSelected ? 'after:absolute after:bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:w-1 after:h-1 after:bg-gray-600 after:rounded-full' : ''}
        ${isToday && isSelected ? 'after:absolute after:bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:w-1 after:h-1 after:bg-white after:rounded-full' : ''}`}
        onClick={() => selectDate(day, calendarMonth, calendarYear)}
      >
        {day}
      </button>
    );
  }
  
  // Next month days
  const totalCells = firstDay + daysInMonth;
  const remainingCells = totalCells <= 35 ? 35 - totalCells : 42 - totalCells;
  for (let day = 1; day <= remainingCells; day++) {
    days.push(
      <button
        key={`next-${day}`}
        className="w-8 h-8 flex items-center justify-center text-xs text-gray-400 opacity-30 hover:opacity-60 transition-all duration-200 rounded-full"
        onClick={() => selectDate(day, calendarMonth + 1, calendarMonth === 11 ? calendarYear + 1 : calendarYear)}
      >
        {day}
      </button>
    );
  }
  
  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
      <div className="flex justify-between items-center px-2 py-1.5 bg-gray-50 border-b border-gray-100">
        <span className="text-sm font-medium text-gray-900 tracking-tight">
          {monthNames[calendarMonth]} {calendarYear}
        </span>
        <div className="flex gap-2">
          <button
            className="calendar-nav-btn w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-900 hover:border-gray-900 hover:text-white transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={() => changeMonth(-1)}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            className="calendar-nav-btn w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-900 hover:border-gray-900 hover:text-white transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={() => changeMonth(1)}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="grid grid-cols-7 gap-1 mb-1">
          {weekDays.map((day, index) => (
            <div key={index} className="w-8 h-6 flex items-center justify-center text-xs font-medium text-gray-400 tracking-wide">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
      <div className="flex justify-center items-center py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
          {/* Hours */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => decrementTime('hours')}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <ChevronDown size={14} strokeWidth={1.5} />
            </button>
            <input
              type="number"
              min="0"
              max="23"
              className="w-9 text-center text-sm font-medium text-gray-900 bg-transparent border-none outline-none mx-0.5 tabular-nums"
              value={String(currentDate.getHours()).padStart(2, '0')}
              onChange={(e) => updateTime('hours', parseInt(e.target.value) || 0)}
            />
            <button
              type="button"
              onClick={() => incrementTime('hours')}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <ChevronUp size={14} strokeWidth={1.5} />
            </button>
          </div>
          
          <div className="text-gray-300 font-light text-sm">:</div>
          
          {/* Minutes */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => decrementTime('minutes')}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <ChevronDown size={14} strokeWidth={1.5} />
            </button>
            <input
              type="number"
              min="0"
              max="59"
              step="15"
              className="w-9 text-center text-sm font-medium text-gray-900 bg-transparent border-none outline-none mx-0.5 tabular-nums"
              value={String(currentDate.getMinutes()).padStart(2, '0')}
              onChange={(e) => updateTime('minutes', parseInt(e.target.value) || 0)}
            />
            <button
              type="button"
              onClick={() => incrementTime('minutes')}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <ChevronUp size={14} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

CalendarPopup.displayName = 'CalendarPopup';

export default CalendarPopup;