import { useState, useCallback } from 'react';

export const useCalendarState = () => {
  const [startDateTime, setStartDateTime] = useState<Date>(() => {
    const now = new Date();
    const start = new Date(now);
    start.setHours(9, 0, 0, 0);
    return start;
  });
  
  const [endDateTime, setEndDateTime] = useState<Date>(() => {
    const now = new Date();
    const end = new Date(now);
    end.setHours(18, 0, 0, 0);
    return end;
  });

  // Calendar display states
  const [startCalendarYear, setStartCalendarYear] = useState(startDateTime.getFullYear());
  const [startCalendarMonth, setStartCalendarMonth] = useState(startDateTime.getMonth());
  const [endCalendarYear, setEndCalendarYear] = useState(endDateTime.getFullYear());
  const [endCalendarMonth, setEndCalendarMonth] = useState(endDateTime.getMonth());

  // Callbacks for calendar interactions
  const handleStartMonthChange = useCallback((year: number, month: number) => {
    setStartCalendarYear(year);
    setStartCalendarMonth(month);
  }, []);

  const handleEndMonthChange = useCallback((year: number, month: number) => {
    setEndCalendarYear(year);
    setEndCalendarMonth(month);
  }, []);

  const handleStartDateSelect = useCallback((date: Date) => {
    setStartDateTime(date);
    setStartCalendarYear(date.getFullYear());
    setStartCalendarMonth(date.getMonth());
  }, []);

  const handleEndDateSelect = useCallback((date: Date) => {
    setEndDateTime(date);
    setEndCalendarYear(date.getFullYear());
    setEndCalendarMonth(date.getMonth());
  }, []);

  const handleStartTimeChange = useCallback((hours: number, minutes: number) => {
    const newDate = new Date(startDateTime);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setStartDateTime(newDate);
  }, [startDateTime]);

  const handleEndTimeChange = useCallback((hours: number, minutes: number) => {
    const newDate = new Date(endDateTime);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setEndDateTime(newDate);
  }, [endDateTime]);

  return {
    startDateTime,
    endDateTime,
    startCalendarYear,
    startCalendarMonth,
    endCalendarYear,
    endCalendarMonth,
    handleStartMonthChange,
    handleEndMonthChange,
    handleStartDateSelect,
    handleEndDateSelect,
    handleStartTimeChange,
    handleEndTimeChange,
    setStartDateTime,
    setEndDateTime
  };
};