import { Language } from '../types';

export const formatSlot = (start: Date, end: Date, language: Language): string => {
  const { monthNames, dayNames } = language.texts;
  const months = language.code === 'ja' 
    ? monthNames.map((m, i) => `${i + 1}月`)
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const startStr = language.code === 'ja'
    ? `${start.getMonth() + 1}月${start.getDate()}日 (${dayNames[start.getDay()]}) ${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`
    : `${months[start.getMonth()]} ${start.getDate()} (${dayNames[start.getDay()]}) ${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`;
  const endStr = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;
  return `${startStr} - ${endStr}`;
};

export const formatCurrentDateTime = (date: Date, language: Language): string => {
  const { monthNames, dayNames } = language.texts;
  if (language.code === 'ja') {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 (${dayNames[date.getDay()]}) ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  } else {
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} (${dayNames[date.getDay()]}) ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
};

export const getDurationText = (duration: number, language: Language): string => {
  const { minutes, hour, hours } = language.texts;
  if (duration === 60) return `1 ${hour}`;
  if (duration === 90) return `1.5 ${hours}`;
  return `${duration} ${minutes}`;
};