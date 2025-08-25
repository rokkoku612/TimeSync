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
    onChange(`${validHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
  };

  const handleMinutesChange = (newMinutes: number) => {
    // Ensure minutes are within 0-59 range and snap to 15-minute intervals
    const validMinutes = Math.max(0, Math.min(45, Math.floor(newMinutes / 15) * 15));
    onChange(`${hours.toString().padStart(2, '0')}:${validMinutes.toString().padStart(2, '0')}`);
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
      <div className="flex items-center gap-0.5 bg-white px-1.5 py-1 rounded-lg border border-gray-200">
        {/* Hours */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={decrementHours}
            className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
            style={{ padding: 0 }}
          >
            <ChevronDown size={10} />
          </button>
          <input
            type="number"
            min="0"
            max="23"
            value={hasValue ? hours.toString().padStart(2, '0') : '--'}
            readOnly
            className={`w-6 text-center text-xs font-medium ${hasValue ? 'text-gray-900' : 'text-gray-400'} bg-transparent border-none outline-none tabular-nums`}
          />
          <button
            type="button"
            onClick={incrementHours}
            className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
            style={{ padding: 0 }}
          >
            <ChevronUp size={10} />
          </button>
        </div>

        {/* Separator */}
        <div className="text-gray-300 font-light text-xs px-0.5">:</div>

        {/* Minutes */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={decrementMinutes}
            className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
            style={{ padding: 0 }}
          >
            <ChevronDown size={10} />
          </button>
          <input
            type="number"
            min="0"
            max="59"
            step="15"
            value={hasValue ? minutes.toString().padStart(2, '0') : '--'}
            readOnly
            className={`w-6 text-center text-xs font-medium ${hasValue ? 'text-gray-900' : 'text-gray-400'} bg-transparent border-none outline-none tabular-nums`}
          />
          <button
            type="button"
            onClick={incrementMinutes}
            className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
            style={{ padding: 0 }}
          >
            <ChevronUp size={10} />
          </button>
        </div>

        {/* Clear button */}
        {hasValue && (
          <button
            type="button"
            onClick={clearValue}
            className="ml-0.5 w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X size={10} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TimePickerInline;