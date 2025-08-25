import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface TimePickerInlineProps {
  value: string;
  onChange: (time: string) => void;
  label: string;
}

const TimePickerInline: React.FC<TimePickerInlineProps> = ({
  value,
  onChange,
  label,
}) => {
  // Parse the time value
  const [hours, minutes] = value ? value.split(':').map(Number) : [9, 0];

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
    handleHoursChange(hours < 23 ? hours + 1 : 0);
  };

  const decrementHours = () => {
    handleHoursChange(hours > 0 ? hours - 1 : 23);
  };

  const incrementMinutes = () => {
    const newMinutes = minutes >= 45 ? 0 : minutes + 15;
    handleMinutesChange(newMinutes);
  };

  const decrementMinutes = () => {
    const newMinutes = minutes <= 0 ? 45 : minutes - 15;
    handleMinutesChange(newMinutes);
  };

  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
        {/* Hours */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={decrementHours}
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
            style={{ padding: 0 }}
          >
            <ChevronDown size={12} />
          </button>
          <input
            type="number"
            min="0"
            max="23"
            value={hours.toString().padStart(2, '0')}
            onChange={(e) => handleHoursChange(parseInt(e.target.value) || 0)}
            className="w-9 text-center text-sm font-medium text-gray-900 bg-transparent border-none outline-none mx-0.5 tabular-nums"
          />
          <button
            type="button"
            onClick={incrementHours}
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
            style={{ padding: 0 }}
          >
            <ChevronUp size={12} />
          </button>
        </div>

        {/* Separator */}
        <div className="text-gray-300 font-light text-sm">:</div>

        {/* Minutes */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={decrementMinutes}
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
            style={{ padding: 0 }}
          >
            <ChevronDown size={12} />
          </button>
          <input
            type="number"
            min="0"
            max="59"
            step="15"
            value={minutes.toString().padStart(2, '0')}
            onChange={(e) => handleMinutesChange(parseInt(e.target.value) || 0)}
            className="w-9 text-center text-sm font-medium text-gray-900 bg-transparent border-none outline-none mx-0.5 tabular-nums"
          />
          <button
            type="button"
            onClick={incrementMinutes}
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
            style={{ padding: 0 }}
          >
            <ChevronUp size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimePickerInline;