import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  label: string;
  placeholder?: string;
  disabled?: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = '00:00',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      setHours(h || '');
      setMinutes(m || '');
    } else {
      setHours('');
      setMinutes('');
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTimeChange = (newHours: string, newMinutes: string) => {
    const h = newHours.padStart(2, '0');
    const m = newMinutes.padStart(2, '0');
    onChange(`${h}:${m}`);
  };

  const incrementHours = () => {
    const h = parseInt(hours || '0');
    const newHours = h >= 23 ? 0 : h + 1;
    setHours(newHours.toString());
    handleTimeChange(newHours.toString(), minutes || '0');
  };

  const decrementHours = () => {
    const h = parseInt(hours || '0');
    const newHours = h <= 0 ? 23 : h - 1;
    setHours(newHours.toString());
    handleTimeChange(newHours.toString(), minutes || '0');
  };

  const incrementMinutes = () => {
    const m = parseInt(minutes || '0');
    const newMinutes = m >= 45 ? 0 : m + 15;
    setMinutes(newMinutes.toString());
    handleTimeChange(hours || '0', newMinutes.toString());
  };

  const decrementMinutes = () => {
    const m = parseInt(minutes || '0');
    const newMinutes = m <= 0 ? 45 : m - 15;
    setMinutes(newMinutes.toString());
    handleTimeChange(hours || '0', newMinutes.toString());
  };

  const clearTime = () => {
    setHours('');
    setMinutes('');
    onChange('');
    setIsOpen(false);
  };

  const formatDisplay = () => {
    if (!value) return '';
    const [h, m] = value.split(':');
    return `${h?.padStart(2, '0') || '00'}:${m?.padStart(2, '0') || '00'}`;
  };

  // Generate hour options
  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  const minuteOptions = [0, 15, 30, 45];

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full px-3 py-2 
            bg-white border border-gray-300 rounded-lg
            text-sm text-left
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            hover:border-gray-400 transition-all
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer'}
            ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
          `}
        >
          <span className={value ? 'text-gray-900' : 'text-gray-400'}>
            {formatDisplay() || placeholder}
          </span>
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 -top-2 -translate-y-full w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-fadeIn">
          <div className="p-4">
            {/* Time Display and Spinners in one row */}
            <div className="flex items-center justify-center gap-6 mb-4">
              {/* Time Display */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-2xl font-mono font-medium text-gray-900">
                  {hours?.padStart(2, '0') || '00'}
                  <span className="mx-1 animate-pulse">:</span>
                  {minutes?.padStart(2, '0') || '00'}
                </div>
              </div>

              {/* Hours Spinner */}
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 mb-1">Hours</span>
                <div className="flex flex-col items-center bg-gray-50 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={incrementHours}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <input
                    type="text"
                    value={hours?.padStart(2, '0') || '00'}
                    readOnly
                    className="w-8 text-center text-sm font-mono bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={decrementHours}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
              </div>

              {/* Minutes Spinner */}
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 mb-1">Minutes</span>
                <div className="flex flex-col items-center bg-gray-50 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={incrementMinutes}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <input
                    type="text"
                    value={minutes?.padStart(2, '0') || '00'}
                    readOnly
                    className="w-8 text-center text-sm font-mono bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={decrementMinutes}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Select */}
            <div className="border-t pt-3">
              <div className="text-xs text-gray-500 mb-2">Quick Select</div>
              <div className="grid grid-cols-4 gap-2">
                {['03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '00:00'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      const [h, m] = time.split(':');
                      setHours(h);
                      setMinutes(m);
                      handleTimeChange(h, m);
                      setIsOpen(false);
                    }}
                    className="px-2 py-1.5 text-xs bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors font-medium"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4 pt-3 border-t">
              <button
                type="button"
                onClick={clearTime}
                className="flex-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 px-3 py-1.5 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

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
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TimePicker;