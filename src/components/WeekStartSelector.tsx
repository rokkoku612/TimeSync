import React, { useState, useEffect } from 'react';

interface WeekStartSelectorProps {
  onWeekStartChange?: (startDay: 0 | 1) => void;
}

const WeekStartSelector: React.FC<WeekStartSelectorProps> = ({ onWeekStartChange }) => {
  const [weekStart, setWeekStart] = useState<0 | 1>(() => {
    const saved = localStorage.getItem('weekStart');
    return saved ? (parseInt(saved) as 0 | 1) : 0; // Default to Sunday (0)
  });

  useEffect(() => {
    localStorage.setItem('weekStart', weekStart.toString());
    if (onWeekStartChange) {
      onWeekStartChange(weekStart);
    }
  }, [weekStart, onWeekStartChange]);

  const handleChange = (value: 0 | 1) => {
    setWeekStart(value);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => handleChange(0)}
        className={`px-2 py-1 text-xs rounded-l-lg transition-colors ${
          weekStart === 0 
            ? 'bg-slate-700 text-white' 
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
      >
        Sun
      </button>
      <button
        onClick={() => handleChange(1)}
        className={`px-2 py-1 text-xs rounded-r-lg transition-colors ${
          weekStart === 1 
            ? 'bg-slate-700 text-white' 
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
      >
        Mon
      </button>
    </div>
  );
};

export default WeekStartSelector;