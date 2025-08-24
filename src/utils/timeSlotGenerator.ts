import { TimeSlot } from '../types';
import { formatSlot } from './dateFormatters';
import { Language } from '../types';

export const isWithinTimeRange = (
  start: Date, 
  end: Date, 
  excludeBeforeTime: string, 
  excludeAfterTime: string
): boolean => {
  // Exclude before time (e.g., exclude before 9:00 each day)
  if (excludeBeforeTime) {
    const [h, m] = excludeBeforeTime.split(':').map(Number);
    const excludeMinutes = h * 60 + m;
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    if (startMinutes < excludeMinutes) return false;
  }

  // Exclude after time (e.g., exclude after 21:00 each day)
  if (excludeAfterTime) {
    const [h, m] = excludeAfterTime.split(':').map(Number);
    const excludeMinutes = h * 60 + m;
    const endMinutes = end.getHours() * 60 + end.getMinutes();
    if (endMinutes > excludeMinutes) return false;
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
  excludeBeforeTime: string = '',
  excludeAfterTime: string = ''
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
    
    // Apply exclude before time (e.g., exclude before 9:00 each day)
    if (excludeBeforeTime) {
      const [hours, minutes] = excludeBeforeTime.split(':').map(Number);
      const excludeBefore = new Date(currentDate);
      excludeBefore.setHours(hours, minutes, 0, 0);
      if (dailyStart < excludeBefore) {
        dailyStart = new Date(Math.max(excludeBefore.getTime(), dailyStart.getTime()));
      }
    }
    
    // Apply exclude after time (e.g., exclude after 21:00 each day)
    if (excludeAfterTime) {
      const [hours, minutes] = excludeAfterTime.split(':').map(Number);
      const excludeAfter = new Date(currentDate);
      excludeAfter.setHours(hours, minutes, 0, 0);
      if (dailyEnd > excludeAfter) {
        dailyEnd = new Date(Math.min(excludeAfter.getTime(), dailyEnd.getTime()));
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