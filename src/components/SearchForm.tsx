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
  // State for single calendar
  const [isSelectingEnd, setIsSelectingEnd] = React.useState(false);
  const [calendarYear, setCalendarYear] = React.useState(startDateTime.getFullYear());
  const [calendarMonth, setCalendarMonth] = React.useState(startDateTime.getMonth());

  const handleMonthChange = React.useCallback((year: number, month: number) => {
    setCalendarYear(year);
    setCalendarMonth(month);
  }, []);

  const handleDateSelect = React.useCallback((date: Date) => {
    if (!isSelectingEnd) {
      // Selecting start date
      onStartDateTimeChange(date);
      setIsSelectingEnd(true);
    } else {
      // Selecting end date
      if (date < startDateTime) {
        // If end date is before start date, swap them
        onEndDateTimeChange(startDateTime);
        onStartDateTimeChange(date);
      } else {
        onEndDateTimeChange(date);
      }
      setIsSelectingEnd(false);
    }
  }, [isSelectingEnd, startDateTime, onStartDateTimeChange, onEndDateTimeChange]);
  

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
        {/* Single Calendar */}
        <div className="mb-4 -mx-6 md:-mx-8 lg:-mx-12">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2 text-center">
            {isSelectingEnd ? language.texts.end : language.texts.start}
          </div>
          <div className="w-full px-4 md:px-6 lg:px-8">
            <CalendarPopup
              type={isSelectingEnd ? "end" : "start"}
              currentDate={isSelectingEnd ? endDateTime : startDateTime}
              calendarYear={calendarYear}
              calendarMonth={calendarMonth}
              language={language}
              weekStart={weekStart}
              startDate={startDateTime}
              endDate={endDateTime}
              onMonthChange={handleMonthChange}
              onDateSelect={handleDateSelect}
              onTimeChange={isSelectingEnd ? handleEndTimeChange : handleStartTimeChange}
            />
          </div>
        </div>
        
        {/* Time Pickers for Start and End */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">{language.texts.start}</div>
            <div className="flex justify-center">
              <TimePickerInline
                value={`${startDateTime.getHours().toString().padStart(2, '0')}:${startDateTime.getMinutes().toString().padStart(2, '0')}`}
                onChange={(time) => {
                  const [hours, minutes] = time.split(':').map(Number);
                  handleStartTimeChange(hours, minutes);
                }}
              />
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">{language.texts.end}</div>
            <div className="flex justify-center">
              <TimePickerInline
                value={`${endDateTime.getHours().toString().padStart(2, '0')}:${endDateTime.getMinutes().toString().padStart(2, '0')}`}
                onChange={(time) => {
                  const [hours, minutes] = time.split(':').map(Number);
                  handleEndTimeChange(hours, minutes);
                }}
              />
            </div>
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
          <div className="animate-fadeIn">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1.5 font-medium">
                  {language.texts.before}
                </label>
                <div className="flex justify-center sm:justify-start">
                  <TimePickerInline
                    value={excludeBeforeTime}
                    onChange={onExcludeBeforeTimeChange}
                    hideLabel={true}
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1.5 font-medium">
                  {language.texts.after}
                </label>
                <div className="flex justify-center sm:justify-start">
                  <TimePickerInline
                    value={excludeAfterTime}
                    onChange={onExcludeAfterTimeChange}
                    hideLabel={true}
                  />
                </div>
              </div>
            </div>
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