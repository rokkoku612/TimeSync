import React from 'react';
import { ChevronUp, ChevronDown, X } from 'lucide-react';

interface TimePickerInlineProps {
  value: string;
  onChange: (time: string) => void;
  label?: string;
  hideLabel?: boolean;
}

const TimePickerInline: React.FC<TimePickerInlineProps> = ({
  value,
  onChange,
  label = '',
  hideLabel = false,
}) => {
  // Parse the time value - if empty, show placeholder
  const [hours, minutes] = value ? value.split(':').map(Number) : [0, 0];
  const hasValue = Boolean(value);

  const handleHoursChange = (newHours: number) => {
    // Ensure hours are within 0-23 range
    const validHours = Math.max(0, Math.min(23, newHours));
    const currentMinutes = hasValue ? minutes : 0;
    onChange(`${validHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`);
  };

  const handleMinutesChange = (newMinutes: number) => {
    // Ensure minutes are within 0-59 range and snap to 15-minute intervals
    const validMinutes = Math.max(0, Math.min(45, Math.floor(newMinutes / 15) * 15));
    const currentHours = hasValue ? hours : 9;
    onChange(`${currentHours.toString().padStart(2, '0')}:${validMinutes.toString().padStart(2, '0')}`);
  };

  const handleHoursInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (inputValue === '') {
      // Clear the entire time if hours is cleared
      onChange('');
      return;
    }
    
    const parsed = parseInt(inputValue);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 23) {
      const currentMinutes = hasValue ? minutes : 0;
      onChange(`${parsed.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`);
    }
  };

  const handleMinutesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (inputValue === '') {
      // Clear entire time if minutes is cleared and no hours
      if (!hasValue || !hours) {
        onChange('');
      } else {
        onChange(`${hours.toString().padStart(2, '0')}:00`);
      }
      return;
    }
    
    const parsed = parseInt(inputValue);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 59) {
      const currentHours = hasValue ? hours : 9;
      // Round to nearest 15 minutes
      const roundedMinutes = Math.round(parsed / 15) * 15;
      const finalMinutes = roundedMinutes === 60 ? 0 : roundedMinutes;
      onChange(`${currentHours.toString().padStart(2, '0')}:${finalMinutes.toString().padStart(2, '0')}`);
    }
  };

  const incrementHours = () => {
    if (!hasValue) {
      onChange('09:00'); // Start with 9:00 when first clicking
      return;
    }
    handleHoursChange(hours < 23 ? hours + 1 : 0);
  };

  const decrementHours = () => {
    if (!hasValue) {
      onChange('09:00'); // Start with 9:00 when first clicking
      return;
    }
    handleHoursChange(hours > 0 ? hours - 1 : 23);
  };

  const incrementMinutes = () => {
    if (!hasValue) {
      onChange('09:00'); // Start with 9:00 when first clicking
      return;
    }
    const newMinutes = minutes >= 45 ? 0 : minutes + 15;
    handleMinutesChange(newMinutes);
  };

  const decrementMinutes = () => {
    if (!hasValue) {
      onChange('09:00'); // Start with 9:00 when first clicking
      return;
    }
    const newMinutes = minutes <= 0 ? 45 : minutes - 15;
    handleMinutesChange(newMinutes);
  };

  const clearValue = () => {
    onChange('');
  };


  return (
    <div>
      {!hideLabel && label && (
        <label className="block text-xs font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="inline-flex items-center gap-2 bg-white px-3 py-2.5 rounded-lg border border-gray-200 min-w-fit">
        {/* Hours */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={decrementHours}
            className="w-10 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors duration-200 flex-shrink-0 active:scale-95"
            aria-label="Decrease hours"
          >
            <ChevronDown size={20} />
          </button>
          <input
            type="number"
            min="0"
            max="23"
            value={hasValue ? hours : ''}
            onChange={handleHoursInput}
            onFocus={(e) => e.target.select()}
            placeholder="--"
            className={`w-12 text-center text-base font-normal ${hasValue ? 'text-gray-900' : 'text-gray-400'} bg-transparent border-none outline-none tabular-nums flex-shrink-0`}
          />
          <button
            type="button"
            onClick={incrementHours}
            className="w-10 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors duration-200 flex-shrink-0 active:scale-95"
            aria-label="Increase hours"
          >
            <ChevronUp size={20} />
          </button>
        </div>

        {/* Separator */}
        <div className="text-gray-400 font-normal text-base flex-shrink-0">:</div>

        {/* Minutes */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={decrementMinutes}
            className="w-10 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors duration-200 flex-shrink-0 active:scale-95"
            aria-label="Decrease minutes"
          >
            <ChevronDown size={20} />
          </button>
          <input
            type="number"
            min="0"
            max="59"
            step="15"
            value={hasValue ? minutes : ''}
            onChange={handleMinutesInput}
            onFocus={(e) => e.target.select()}
            placeholder="--"
            className={`w-12 text-center text-base font-normal ${hasValue ? 'text-gray-900' : 'text-gray-400'} bg-transparent border-none outline-none tabular-nums flex-shrink-0`}
          />
          <button
            type="button"
            onClick={incrementMinutes}
            className="w-10 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors duration-200 flex-shrink-0 active:scale-95"
            aria-label="Increase minutes"
          >
            <ChevronUp size={20} />
          </button>
        </div>

        {/* Clear button */}
        {hasValue && (
          <button
            type="button"
            onClick={clearValue}
            className="ml-1 w-9 h-9 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors duration-200 flex-shrink-0"
            aria-label="Clear time"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TimePickerInline;