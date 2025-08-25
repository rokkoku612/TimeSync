import React from 'react';
import { Calendar, ChevronRight, Loader2 } from 'lucide-react';
import { SearchFormProps } from '../types';
import CalendarPopup from './CalendarPopup';
import HelpTooltip from './HelpTooltip';
import TimePickerInline from './TimePickerInline';
import { formatCurrentDateTime, getDurationText } from '../utils/dateFormatters';

const SearchForm: React.FC<SearchFormProps> = ({
  startDateTime,
  endDateTime,
  minDuration,
  excludeBeforeTime,
  excludeAfterTime,
  showAdvanced,
  language,
  weekStart = 0,
  onStartDateTimeChange,
  onEndDateTimeChange,
  onMinDurationChange,
  onExcludeBeforeTimeChange,
  onExcludeAfterTimeChange,
  onShowAdvancedChange,
  onSearch,
  isLoading
}) => {
  // Calendar display states - we need to manage these internally
  const [startCalendarYear, setStartCalendarYear] = React.useState(startDateTime.getFullYear());
  const [startCalendarMonth, setStartCalendarMonth] = React.useState(startDateTime.getMonth());
  const [endCalendarYear, setEndCalendarYear] = React.useState(endDateTime.getFullYear());
  const [endCalendarMonth, setEndCalendarMonth] = React.useState(endDateTime.getMonth());
  
  // Refs for scrolling on mobile
  const endCalendarRef = React.useRef<HTMLDivElement>(null);

  const handleStartMonthChange = React.useCallback((year: number, month: number) => {
    setStartCalendarYear(year);
    setStartCalendarMonth(month);
  }, []);

  const handleEndMonthChange = React.useCallback((year: number, month: number) => {
    setEndCalendarYear(year);
    setEndCalendarMonth(month);
  }, []);

  const handleStartDateSelect = React.useCallback((date: Date) => {
    onStartDateTimeChange(date);
    setStartCalendarYear(date.getFullYear());
    setStartCalendarMonth(date.getMonth());
  }, [onStartDateTimeChange]);

  const handleEndDateSelect = React.useCallback((date: Date) => {
    onEndDateTimeChange(date);
    setEndCalendarYear(date.getFullYear());
    setEndCalendarMonth(date.getMonth());
  }, [onEndDateTimeChange]);
  
  // Auto-scroll on mobile when calendar is interacted with
  React.useEffect(() => {
    if (window.innerWidth <= 640 && endCalendarRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        endCalendarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [endCalendarMonth, endCalendarYear]);

  const handleStartTimeChange = React.useCallback((hours: number, minutes: number) => {
    const newDate = new Date(startDateTime);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    onStartDateTimeChange(newDate);
  }, [startDateTime, onStartDateTimeChange]);

  const handleEndTimeChange = React.useCallback((hours: number, minutes: number) => {
    const newDate = new Date(endDateTime);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    onEndDateTimeChange(newDate);
  }, [endDateTime, onEndDateTimeChange]);

  return (
    <div className="bg-white rounded-xl p-6 mb-6 border border-slate-200">
      <div className="flex items-center gap-3 mb-6 text-xs font-medium text-slate-500 uppercase tracking-wider">
        <span>{language.texts.searchParameters}</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-sm text-gray-600 font-normal">{language.texts.period}</div>
          <HelpTooltip 
            title={language.texts.helpPeriod}
            content={language.texts.helpPeriodDesc}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
          {/* Start Date Picker */}
          <div className="space-y-2">
            <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">{language.texts.start}</div>
            <CalendarPopup
              type="start"
              currentDate={startDateTime}
              calendarYear={startCalendarYear}
              calendarMonth={startCalendarMonth}
              language={language}
              weekStart={weekStart}
              onMonthChange={handleStartMonthChange}
              onDateSelect={handleStartDateSelect}
              onTimeChange={handleStartTimeChange}
            />
          </div>

          {/* End Date Picker */}
          <div className="space-y-2" ref={endCalendarRef}>
            <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">{language.texts.end}</div>
            <CalendarPopup
              type="end"
              currentDate={endDateTime}
              calendarYear={endCalendarYear}
              calendarMonth={endCalendarMonth}
              language={language}
              weekStart={weekStart}
              onMonthChange={handleEndMonthChange}
              onDateSelect={handleEndDateSelect}
              onTimeChange={handleEndTimeChange}
            />
          </div>
        </div>
      </div>

      {/* Current Selection Display */}
      <div className="mb-4">
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="grid grid-cols-2 text-sm text-gray-600 relative">
            <div className="pr-3">
              <div className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">{language.texts.start}</div>
              <div className="font-mono text-xs text-gray-900">{formatCurrentDateTime(startDateTime, language)}</div>
            </div>
            <div className="w-px bg-gray-200 absolute left-1/2 top-0 bottom-0 -translate-x-1/2"></div>
            <div className="pl-3">
              <div className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">{language.texts.end}</div>
              <div className="font-mono text-xs text-gray-900">{formatCurrentDateTime(endDateTime, language)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-sm text-gray-600 font-normal">{language.texts.minimumDuration}</div>
          <HelpTooltip 
            title={language.texts.helpMinDuration}
            content={language.texts.helpMinDurationDesc}
          />
        </div>
        <div className="grid grid-cols-3 sm:flex sm:gap-2 gap-1.5">
          {[15, 30, 45, 60, 90, 120].map(duration => (
            <button
              key={duration}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                minDuration === duration
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => onMinDurationChange(duration)}
            >
              {getDurationText(duration, language)}
            </button>
          ))}
        </div>
      </div>

      {/* Time Restrictions */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <button
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            onClick={() => onShowAdvancedChange(!showAdvanced)}
          >
            <ChevronRight 
              size={16} 
              className={`transition-transform duration-200 ${showAdvanced ? 'rotate-90' : ''}`} 
            />
            {language.texts.timeRestrictions}
          </button>
          <HelpTooltip 
            title={language.texts.helpTimeRestrictions}
            content={language.texts.helpTimeRestrictionsDesc}
          />
        </div>
        
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
            <TimePickerInline
              value={excludeBeforeTime}
              onChange={onExcludeBeforeTimeChange}
              label={language.texts.before}
            />
            <TimePickerInline
              value={excludeAfterTime}
              onChange={onExcludeAfterTimeChange}
              label={language.texts.after}
            />
          </div>
        )}
      </div>

      <button
        className={`w-full p-4 bg-slate-900 text-white rounded-lg font-medium transition-all ${
          isLoading 
            ? 'cursor-not-allowed opacity-80' 
            : 'cursor-pointer hover:bg-slate-800'
        }`}
        onClick={onSearch}
        disabled={isLoading}
      >
        <span className="flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {language.texts.searchingCalendar}
            </>
          ) : (
            <>
              <Calendar size={16} />
              {language.texts.findAvailableTimes}
            </>
          )}
        </span>
      </button>
      
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SearchForm;