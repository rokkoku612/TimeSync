// import googleAuth from './googleAuth'; // Disabled - using direct OAuth
import googleAuthDirect from './googleAuthDirect';
import { TimeSlot } from '../types';
import type {
  GoogleCalendarEvent,
  GoogleCalendar,
  GoogleCalendarList,
  GoogleEventsList,
  EventData,
  MultiCalendarEventData,
  CreateEventResult,
  DemoEvent,
  TimeSlotEvent
} from '../types/google-calendar';

// Demo events for demo mode
const generateDemoEvents = (startDate: Date, endDate: Date, language: 'ja' | 'en' = 'en') => {
  const events = [];
  
  const eventTitles = {
    ja: [
      'チームミーティング', '顧客との打ち合わせ', 'プロジェクトレビュー', 'デザイン検討会',
      'スプリント計画', 'コードレビュー', '全社会議', '1on1ミーティング',
      '製品デモ', 'マーケティング会議', '予算会議', '研修セッション'
    ],
    en: [
      'Team Meeting', 'Client Call', 'Project Review', 'Design Session', 
      'Sprint Planning', 'Code Review', 'All Hands', 'One-on-One',
      'Product Demo', 'Marketing Sync', 'Budget Meeting', 'Training Session'
    ]
  };
  
  const locations = {
    ja: [
      '会議室A', '会議室1', 'オンライン', 'オフィス',
      'クライアント先', 'Zoom', 'Google Meet', ''
    ],
    en: [
      'Conference Room A', 'Meeting Room 1', 'Virtual', 'Office',
      'Client Site', 'Zoom', 'Google Meet', ''
    ]
  };
  
  const descriptions = {
    ja: [
      'プロジェクトの進捗と次のステップについて話し合い',
      '週次チーム情報共有会議',
      '成果物とタイムラインの確認',
      '戦略企画セッション',
      '四半期業務レビュー',
      ''
    ],
    en: [
      'Discuss project progress and next steps',
      'Weekly team alignment meeting',
      'Review deliverables and timeline',
      'Strategic planning session',
      'Quarterly business review',
      ''
    ]
  };

  const currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);
  
  while (currentDate <= endDate) {
    // Add 2-4 events per day randomly
    const eventsPerDay = Math.floor(Math.random() * 3) + 2;
    
    for (let i = 0; i < eventsPerDay; i++) {
      const startHour = 9 + Math.floor(Math.random() * 8); // 9am to 5pm
      const duration = [30, 60, 90][Math.floor(Math.random() * 3)]; // 30, 60, or 90 minutes
      
      const eventStart = new Date(currentDate);
      eventStart.setHours(startHour, Math.random() < 0.5 ? 0 : 30, 0, 0);
      
      const eventEnd = new Date(eventStart);
      eventEnd.setMinutes(eventEnd.getMinutes() + duration);
      
      events.push({
        id: `demo-event-${currentDate.toISOString()}-${i}`,
        summary: eventTitles[language][Math.floor(Math.random() * eventTitles[language].length)],
        description: descriptions[language][Math.floor(Math.random() * descriptions[language].length)],
        location: locations[language][Math.floor(Math.random() * locations[language].length)],
        start: {
          dateTime: eventStart.toISOString()
        },
        end: {
          dateTime: eventEnd.toISOString()
        }
      });
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return events.sort((a, b) => new Date(a.start.dateTime).getTime() - new Date(b.start.dateTime).getTime());
};

class GoogleCalendarService {
  
  private async makeCalendarRequest(url: string, method: string = 'GET', body?: unknown): Promise<unknown> {
    // Try direct OAuth first
    if (googleAuthDirect.isSignedIn()) {
      const accessToken = googleAuthDirect.getAccessToken();
      
      if (!accessToken) {
        throw new Error('No access token available');
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Calendar API request failed: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      return data;
    }
    
    // Fallback check - user must be signed in
    if (!googleAuthDirect.isSignedIn()) {
      throw new Error('User is not signed in');
    }
    
    // Use gapi client (will be used if direct OAuth fails)
    return null;
  }
  
  async listEvents(startDate: Date, endDate: Date, isDemoMode: boolean = false, language: 'ja' | 'en' = 'en', selectedCalendarIds?: string[]): Promise<GoogleCalendarEvent[]> {
    // If in demo mode, return demo events
    if (isDemoMode) {
      return generateDemoEvents(startDate, endDate, language);
    }
    
    // Try direct OAuth implementation first
    if (googleAuthDirect.isSignedIn()) {
      try {
        // Step 1: Get all calendar lists
        const calendarListUrl = 'https://www.googleapis.com/calendar/v3/users/me/calendarList';
        const calendarList = await this.makeCalendarRequest(calendarListUrl) as GoogleCalendarList;
        
        // Step 2: Fetch events from all calendars
        const allEvents: GoogleCalendarEvent[] = [];
        const params = new URLSearchParams({
          timeMin: startDate.toISOString(),
          timeMax: endDate.toISOString(),
          showDeleted: 'false',
          singleEvents: 'true',
          orderBy: 'startTime'
        });
        
        if (calendarList.items && calendarList.items.length > 0) {
          // Filter calendars based on selection
          const calendarsToFetch = selectedCalendarIds 
            ? calendarList.items.filter((cal) => selectedCalendarIds.includes(cal.id))
            : calendarList.items.filter((cal) => cal.primary === true); // Default to primary only
          
          for (const calendar of calendarsToFetch) {
            try {
              // Skip calendars that user doesn't have access to read
              if (calendar.accessRole === 'reader' || calendar.accessRole === 'writer' || calendar.accessRole === 'owner') {
                const calendarId = encodeURIComponent(calendar.id);
                const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${params}`;
                
                const result = await this.makeCalendarRequest(url) as GoogleEventsList;
                if (result.items && result.items.length > 0) {
                  // Add calendar info to each event
                  const eventsWithCalendarInfo = result.items.map((event) => ({
                    ...event,
                    calendarName: calendar.summary,
                    calendarColor: calendar.backgroundColor,
                    calendarId: calendar.id
                  }));
                  allEvents.push(...eventsWithCalendarInfo);
                }
              }
            } catch (error) {
              // Continue with other calendars even if one fails
            }
          }
        }
        
        // Sort all events by start time
        allEvents.sort((a, b) => {
          const aStart = new Date(a.start?.dateTime || a.start?.date || 0);
          const bStart = new Date(b.start?.dateTime || b.start?.date || 0);
          return aStart.getTime() - bStart.getTime();
        });
        
        return allEvents;
      } catch (error) {
        // Direct API call failed
      }
    }
    
    // Fallback check - user must be signed in
    if (!googleAuthDirect.isSignedIn()) {
      throw new Error('User is not signed in');
    }

    // Direct OAuth is required
    throw new Error('Google Sign-In SDK not available. Please use direct OAuth.');
  }

  async findAvailableSlots(
    startDate: Date, 
    endDate: Date, 
    minDuration: number,
    excludeBeforeTime?: string,
    excludeAfterTime?: string,
    isDemoMode: boolean = false,
    language: 'ja' | 'en' = 'en',
    selectedCalendarIds?: string[]
  ): Promise<TimeSlot[]> {
    const events = await this.listEvents(startDate, endDate, isDemoMode, language, selectedCalendarIds);
    
    // Process each day separately to apply daily exclusions
    const availableSlots: TimeSlot[] = [];
    const currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0);
    
    while (currentDate <= endDate) {
      const dayStart = new Date(currentDate);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);
      
      // Apply daily exclusions
      let dailyStart = new Date(Math.max(dayStart.getTime(), startDate.getTime()));
      let dailyEnd = new Date(Math.min(dayEnd.getTime(), endDate.getTime()));
      
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
      
      // Skip this day if no valid time range after exclusions
      if (dailyStart >= dailyEnd) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }
      
      // Get events for this day with full event information
      const dayEvents = events
        .filter(event => {
          if (!event.start || (!event.start.dateTime && !event.start.date)) return false;
          const eventStart = new Date(event.start.dateTime || event.start.date);
          const eventEnd = new Date(event.end.dateTime || event.end.date);
          return eventStart < dailyEnd && eventEnd > dailyStart;
        })
        .map(event => ({
          title: event.summary || 'No title',
          start: new Date(Math.max(
            new Date(event.start.dateTime || event.start.date).getTime(),
            dailyStart.getTime()
          )),
          end: new Date(Math.min(
            new Date(event.end.dateTime || event.end.date).getTime(),
            dailyEnd.getTime()
          )),
          originalStart: new Date(event.start.dateTime || event.start.date),
          originalEnd: new Date(event.end.dateTime || event.end.date)
        }))
        .sort((a, b) => a.start.getTime() - b.start.getTime());
      
      // Find gaps in this day
      let currentTime = new Date(dailyStart);
      
      for (let i = 0; i < dayEvents.length; i++) {
        const event = dayEvents[i];
        
        // Check if there's a gap before this event
        const gapDuration = (event.start.getTime() - currentTime.getTime()) / (60 * 1000);
        if (gapDuration >= minDuration) {
          // Find events before and after this slot
          const beforeEvent = i > 0 ? dayEvents[i - 1] : null;
          const afterEvent = event;
          
          availableSlots.push(this.createTimeSlotWithEvents(
            currentTime, 
            event.start, 
            beforeEvent, 
            afterEvent,
            language
          ));
        }
        
        // Move current time to the end of this event
        currentTime = new Date(Math.max(currentTime.getTime(), event.end.getTime()));
      }
      
      // Check if there's time available after the last event
      const remainingDuration = (dailyEnd.getTime() - currentTime.getTime()) / (60 * 1000);
      if (remainingDuration >= minDuration) {
        const beforeEvent = dayEvents.length > 0 ? dayEvents[dayEvents.length - 1] : null;
        
        availableSlots.push(this.createTimeSlotWithEvents(
          currentTime, 
          dailyEnd, 
          beforeEvent, 
          null,
          language
        ));
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return availableSlots;
  }

  private createTimeSlot(start: Date, end: Date, language: 'ja' | 'en' = 'en'): TimeSlot {
    const formatDate = (date: Date) => {
      if (language === 'ja') {
        const days = ['日', '月', '火', '水', '木', '金', '土'];
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const dayOfWeek = days[date.getDay()];
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        return `${month}月${day}日(${dayOfWeek}) ${hours}:${minutes}`;
      } else {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        const month = months[date.getMonth()];
        const day = date.getDate();
        const dayOfWeek = days[date.getDay()];
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        return `${month} ${day} (${dayOfWeek}) ${hours}:${minutes}`;
      }
    };

    const startStr = formatDate(start);
    const endTime = `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
    
    return {
      start,
      end,
      formatted: `${startStr} - ${endTime}`
    };
  }

  private createTimeSlotWithEvents(
    start: Date, 
    end: Date, 
    beforeEvent: DemoEvent | null, 
    afterEvent: DemoEvent | null,
    language: 'ja' | 'en' = 'en'
  ): TimeSlot {
    const formatDate = (date: Date) => {
      if (language === 'ja') {
        const days = ['日', '月', '火', '水', '木', '金', '土'];
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const dayOfWeek = days[date.getDay()];
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        return `${month}月${day}日(${dayOfWeek}) ${hours}:${minutes}`;
      } else {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        const month = months[date.getMonth()];
        const day = date.getDate();
        const dayOfWeek = days[date.getDay()];
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        return `${month} ${day} (${dayOfWeek}) ${hours}:${minutes}`;
      }
    };

    const formatTime = (date: Date) => {
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    const startStr = formatDate(start);
    const endTime = formatTime(end);
    
    const timeSlot: TimeSlot = {
      start,
      end,
      formatted: `${startStr} - ${endTime}`
    };

    // Add before event information if available
    if (beforeEvent) {
      timeSlot.beforeEvent = {
        title: beforeEvent.title,
        time: `${formatTime(beforeEvent.originalStart)} - ${formatTime(beforeEvent.originalEnd)}`
      };
    }

    // Add after event information if available
    if (afterEvent) {
      timeSlot.afterEvent = {
        title: afterEvent.title,
        time: `${formatTime(afterEvent.originalStart)} - ${formatTime(afterEvent.originalEnd)}`
      };
    }

    return timeSlot;
  }

  private isWithinTimeRestrictions(
    slot: TimeSlot, 
    excludeBeforeTime?: string, 
    excludeAfterTime?: string
  ): boolean {
    if (!excludeBeforeTime && !excludeAfterTime) {
      return true;
    }

    const slotStartHour = slot.start.getHours();
    const slotStartMinute = slot.start.getMinutes();
    const slotEndHour = slot.end.getHours();
    const slotEndMinute = slot.end.getMinutes();

    if (excludeAfterTime) {
      const [afterHour, afterMinute] = excludeAfterTime.split(':').map(Number);
      if (slotStartHour < afterHour || (slotStartHour === afterHour && slotStartMinute < afterMinute)) {
        return false;
      }
    }

    if (excludeBeforeTime) {
      const [beforeHour, beforeMinute] = excludeBeforeTime.split(':').map(Number);
      if (slotEndHour > beforeHour || (slotEndHour === beforeHour && slotEndMinute > beforeMinute)) {
        return false;
      }
    }

    return true;
  }

  private splitIntoDailySlots(
    slots: TimeSlot[], 
    excludeBeforeTime?: string, 
    excludeAfterTime?: string
  ): TimeSlot[] {
    const dailySlots: TimeSlot[] = [];

    for (const slot of slots) {
      const startDate = new Date(slot.start);
      const endDate = new Date(slot.end);

      // If slot is within the same day, add it as is
      if (startDate.toDateString() === endDate.toDateString()) {
        dailySlots.push(slot);
        continue;
      }

      // Split multi-day slot into daily slots
      let currentDate = new Date(startDate);
      
      while (currentDate < endDate) {
        const dayEnd = new Date(currentDate);
        dayEnd.setHours(23, 59, 59, 999);
        
        const slotEnd = dayEnd < endDate ? dayEnd : endDate;
        
        // Apply time restrictions
        let slotStart = new Date(currentDate);
        let adjustedEnd = new Date(slotEnd);

        if (excludeAfterTime) {
          const [hour, minute] = excludeAfterTime.split(':').map(Number);
          const restrictedStart = new Date(currentDate);
          restrictedStart.setHours(hour, minute, 0, 0);
          if (slotStart < restrictedStart) {
            slotStart = restrictedStart;
          }
        }

        if (excludeBeforeTime) {
          const [hour, minute] = excludeBeforeTime.split(':').map(Number);
          const restrictedEnd = new Date(currentDate);
          restrictedEnd.setHours(hour, minute, 0, 0);
          if (adjustedEnd > restrictedEnd) {
            adjustedEnd = restrictedEnd;
          }
        }

        // Only add if there's actual time available
        if (slotStart < adjustedEnd) {
          dailySlots.push(this.createTimeSlot(slotStart, adjustedEnd, 'en'));
        }

        // Move to next day
        currentDate = new Date(dayEnd);
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(0, 0, 0, 0);
      }
    }

    return dailySlots;
  }

  async getCalendarList(): Promise<GoogleCalendar[]> {
    if (googleAuthDirect.isSignedIn()) {
      try {
        const url = 'https://www.googleapis.com/calendar/v3/users/me/calendarList';
        const result = await this.makeCalendarRequest(url) as GoogleCalendarList;
        return result.items || [];
      } catch (error) {
        return [];
      }
    }
    return [];
  }
  
  async getCalendarListOld(): Promise<GoogleCalendar[]> {
    if (!googleAuth.isSignedIn()) {
      throw new Error('User is not signed in');
    }

    // Use direct OAuth implementation
    try {
      const url = 'https://www.googleapis.com/calendar/v3/users/me/calendarList';
      const result = await this.makeCalendarRequest(url) as GoogleCalendarList;
      return result.items || [];
    } catch (error) {
      throw error;
    }
  }

  async createEvent(eventData: EventData): Promise<GoogleCalendarEvent> {
    const event: Partial<GoogleCalendarEvent> & { attendees?: Array<{ email: string }> } = {
      summary: eventData.title,
      description: eventData.description,
      location: eventData.location,
      start: {
        dateTime: eventData.start.toISOString()
      },
      end: {
        dateTime: eventData.end.toISOString()
      }
    };

    // Add attendees if provided
    if (eventData.attendees && eventData.attendees.length > 0) {
      event.attendees = eventData.attendees.map(email => ({ email }));
    }

    // Add Google Meet conference if requested
    if (eventData.addGoogleMeet) {
      event.conferenceData = {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet'
          }
        }
      };
    }

    // Try direct OAuth implementation first
    if (googleAuthDirect.isSignedIn()) {
      try {
        const calendarId = eventData.calendarId || 'primary';
        const encodedCalendarId = encodeURIComponent(calendarId);
        const sendNotifications = eventData.sendNotifications !== false; // Default to true
        const conferenceDataVersion = eventData.addGoogleMeet ? '&conferenceDataVersion=1' : '';
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodedCalendarId}/events?sendNotifications=${sendNotifications}${conferenceDataVersion}`;
        return await this.makeCalendarRequest(url, 'POST', event) as GoogleCalendarEvent;
      } catch (error) {
        // Direct API call failed
      }
    }
    
    // Fallback check - user must be signed in
    if (!googleAuthDirect.isSignedIn()) {
      throw new Error('User is not signed in');
    }

    // Direct OAuth is required
    throw new Error('Google Sign-In SDK not available. Please use direct OAuth.');
  }

  async createEventInMultipleCalendars(eventData: MultiCalendarEventData): Promise<CreateEventResult[]> {
    const event: Partial<GoogleCalendarEvent> & { attendees?: Array<{ email: string }> } = {
      summary: eventData.title,
      description: eventData.description,
      location: eventData.location,
      start: {
        dateTime: eventData.start.toISOString()
      },
      end: {
        dateTime: eventData.end.toISOString()
      }
    };

    // Add attendees if provided
    if (eventData.attendees && eventData.attendees.length > 0) {
      event.attendees = eventData.attendees.map(email => ({ email }));
    }

    // Add Google Meet conference if requested
    if (eventData.addGoogleMeet) {
      event.conferenceData = {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet'
          }
        }
      };
    }

    if (!googleAuthDirect.isSignedIn()) {
      throw new Error('User is not signed in');
    }

    const results: CreateEventResult[] = [];
    const errors: string[] = [];

    // Create event in each selected calendar
    const sendNotifications = eventData.sendNotifications !== false; // Default to true
    const conferenceDataVersion = eventData.addGoogleMeet ? '&conferenceDataVersion=1' : '';
    for (const calendarId of eventData.calendarIds) {
      try {
        const encodedCalendarId = encodeURIComponent(calendarId);
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodedCalendarId}/events?sendNotifications=${sendNotifications}${conferenceDataVersion}`;
        const result = await this.makeCalendarRequest(url, 'POST', event) as GoogleCalendarEvent;
        results.push({ success: true, calendarId, eventId: result.id });
      } catch (error) {
        errors.push(`Failed to add to calendar ${calendarId}`);
        results.push({ success: false, calendarId, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    if (errors.length > 0 && results.every(r => !r.success)) {
      throw new Error(errors.join(', '));
    }

    return results;
  }

  async updateEvent(eventId: string, eventData: EventData): Promise<GoogleCalendarEvent> {
    const event: Partial<GoogleCalendarEvent> & { attendees?: Array<{ email: string }> } = {
      summary: eventData.title,
      description: eventData.description,
      location: eventData.location,
      start: {
        dateTime: eventData.start.toISOString()
      },
      end: {
        dateTime: eventData.end.toISOString()
      }
    };

    // Add attendees if provided
    if (eventData.attendees && eventData.attendees.length > 0) {
      event.attendees = eventData.attendees.map(email => ({ email }));
    }

    // Add Google Meet conference if requested
    if (eventData.addGoogleMeet) {
      event.conferenceData = {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet'
          }
        }
      };
    }

    // Try direct OAuth implementation first
    if (googleAuthDirect.isSignedIn()) {
      try {
        const calendarId = eventData.calendarId || 'primary';
        const encodedCalendarId = encodeURIComponent(calendarId);
        const sendNotifications = eventData.sendNotifications !== false; // Default to true
        const conferenceDataVersion = eventData.addGoogleMeet ? '&conferenceDataVersion=1' : '';
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodedCalendarId}/events/${eventId}?sendNotifications=${sendNotifications}${conferenceDataVersion}`;
        return await this.makeCalendarRequest(url, 'PUT', event) as GoogleCalendarEvent;
      } catch (error) {
        // Direct API call failed
      }
    }
    
    // Fallback check - user must be signed in
    if (!googleAuthDirect.isSignedIn()) {
      throw new Error('User is not signed in');
    }

    // Direct OAuth is required
    throw new Error('Google Sign-In SDK not available. Please use direct OAuth.');
  }

  async deleteEvent(eventId: string, calendarId?: string): Promise<void> {
    // Try direct OAuth implementation first
    if (googleAuthDirect.isSignedIn()) {
      try {
        const calId = calendarId || 'primary';
        const encodedCalendarId = encodeURIComponent(calId);
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodedCalendarId}/events/${eventId}`;
        await this.makeCalendarRequest(url, 'DELETE');
        return;
      } catch (error) {
        // Direct API call failed
      }
    }
    
    // Fallback check - user must be signed in
    if (!googleAuthDirect.isSignedIn()) {
      throw new Error('User is not signed in');
    }

    // Direct OAuth is required
    throw new Error('Google Sign-In SDK not available. Please use direct OAuth.');
  }
}

export default new GoogleCalendarService();