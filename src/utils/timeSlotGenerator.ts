import { TimeSlot } from '../types';
import { formatSlot } from './dateFormatters';
import { Language } from '../types';

export const isWithinTimeRange = (
  start: Date, 
  end: Date, 
  workingHoursStart: string, 
  workingHoursEnd: string
): boolean => {
  // Check if within working hours (e.g., 9:00-18:00)
  if (workingHoursStart) {
    const [h, m] = workingHoursStart.split(':').map(Number);
    const workStartMinutes = h * 60 + m;
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    if (startMinutes < workStartMinutes) return false;
  }

  if (workingHoursEnd) {
    const [h, m] = workingHoursEnd.split(':').map(Number);
    const workEndMinutes = h * 60 + m;
    const endMinutes = end.getHours() * 60 + end.getMinutes();
    if (endMinutes > workEndMinutes) return false;
  }

  return true;
};

// Demo event titles for different languages
const demoEvents = {
  ja: [
    'チームミーティング', '顧客との打ち合わせ', '企画会議', 'ランチミーティング', 
    'プレゼンテーション', '面接', 'レビュー会議', '研修', 'ワークショップ', 
    '部署会議', '報告会', '商談', 'セミナー', '懇親会'
  ],
  en: [
    'Team Meeting', 'Client Call', 'Planning Session', 'Lunch Meeting',
    'Presentation', 'Interview', 'Review Meeting', 'Training', 'Workshop',
    'Department Meeting', 'Report Session', 'Business Meeting', 'Seminar', 'Networking'
  ]
};

export const generateDemoSlots = (
  start: Date, 
  end: Date, 
  duration: number, 
  language: Language,
  workingHoursStart: string = '',
  workingHoursEnd: string = ''
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const currentDate = new Date(start);
  currentDate.setHours(0, 0, 0, 0);
  
  // Process each day separately to apply daily exclusions
  while (currentDate <= end) {
    const dayStart = new Date(currentDate);
    const dayEnd = new Date(currentDate);
    dayEnd.setHours(23, 59, 59, 999);
    
    // Apply daily exclusions
    let dailyStart = new Date(Math.max(dayStart.getTime(), start.getTime()));
    let dailyEnd = new Date(Math.min(dayEnd.getTime(), end.getTime()));
    
    // Apply working hours (e.g., only show 9:00-18:00 each day)
    if (workingHoursStart) {
      const [hours, minutes] = workingHoursStart.split(':').map(Number);
      const workStart = new Date(currentDate);
      workStart.setHours(hours, minutes, 0, 0);
      if (dailyStart < workStart) {
        dailyStart = new Date(Math.max(workStart.getTime(), dailyStart.getTime()));
      }
    }
    
    if (workingHoursEnd) {
      const [hours, minutes] = workingHoursEnd.split(':').map(Number);
      const workEnd = new Date(currentDate);
      workEnd.setHours(hours, minutes, 0, 0);
      if (dailyEnd > workEnd) {
        dailyEnd = new Date(Math.min(workEnd.getTime(), dailyEnd.getTime()));
      }
    }
    
    // Generate demo slots for this day
    if (dailyStart < dailyEnd) {
      const current = new Date(dailyStart);
      
      // Generate a few demo slots for this day
      const maxSlotsPerDay = 3;
      let slotsGenerated = 0;
      
      while (current < dailyEnd && slotsGenerated < maxSlotsPerDay) {
        const slotEnd = new Date(current);
        slotEnd.setMinutes(slotEnd.getMinutes() + duration);
        
        if (slotEnd <= dailyEnd) {
          // Generate demo events before and after this slot
          const eventTitles = demoEvents[language.code] || demoEvents.en;
          
          // Create fake events around this slot
          const beforeEventStart = new Date(current);
          beforeEventStart.setMinutes(beforeEventStart.getMinutes() - 90);
          const beforeEventEnd = new Date(current);
          beforeEventEnd.setMinutes(beforeEventEnd.getMinutes() - 15);
          
          const afterEventStart = new Date(slotEnd);
          afterEventStart.setMinutes(afterEventStart.getMinutes() + 15);
          const afterEventEnd = new Date(slotEnd);
          afterEventEnd.setMinutes(afterEventEnd.getMinutes() + 90);
          
          const formatTime = (date: Date) => {
            return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
          };
          
          const slot: TimeSlot = {
            start: new Date(current),
            end: new Date(slotEnd),
            formatted: formatSlot(current, slotEnd, language),
            beforeEvent: Math.random() > 0.3 ? {
              title: eventTitles[Math.floor(Math.random() * eventTitles.length)],
              time: `${formatTime(beforeEventStart)} - ${formatTime(beforeEventEnd)}`
            } : undefined,
            afterEvent: Math.random() > 0.3 ? {
              title: eventTitles[Math.floor(Math.random() * eventTitles.length)],
              time: `${formatTime(afterEventStart)} - ${formatTime(afterEventEnd)}`
            } : undefined
          };
          slots.push(slot);
          slotsGenerated++;
        }
        
        // Move to next potential slot (add some random gap)
        current.setMinutes(current.getMinutes() + duration + 60 + Math.random() * 120);
      }
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return slots;
};