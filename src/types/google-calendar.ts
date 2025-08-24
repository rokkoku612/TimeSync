// Google Calendar API Types

export interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  attendees?: GoogleEventAttendee[];
  conferenceData?: GoogleConferenceData;
  calendarName?: string;
  calendarColor?: string;
  calendarId?: string;
}

export interface GoogleEventAttendee {
  email: string;
  displayName?: string;
  responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
}

export interface GoogleConferenceData {
  createRequest?: {
    requestId: string;
    conferenceSolutionKey: {
      type: string;
    };
  };
  entryPoints?: Array<{
    entryPointType: string;
    uri: string;
    label?: string;
  }>;
}

export interface GoogleCalendar {
  id: string;
  summary: string;
  description?: string;
  backgroundColor?: string;
  foregroundColor?: string;
  accessRole: 'reader' | 'writer' | 'owner' | 'freeBusyReader';
  primary?: boolean;
}

export interface GoogleCalendarList {
  items: GoogleCalendar[];
  nextPageToken?: string;
}

export interface GoogleEventsList {
  items: GoogleCalendarEvent[];
  nextPageToken?: string;
}

export interface EventData {
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  calendarId?: string;
  attendees?: string[];
  sendNotifications?: boolean;
  addGoogleMeet?: boolean;
}

export interface MultiCalendarEventData extends EventData {
  calendarIds: string[];
}

export interface CreateEventResult {
  success: boolean;
  calendarId: string;
  eventId?: string;
  error?: string;
}

export interface DemoEvent {
  title: string;
  start: Date;
  end: Date;
  originalStart: Date;
  originalEnd: Date;
}

export interface TimeSlotEvent {
  title: string;
  time: string;
}