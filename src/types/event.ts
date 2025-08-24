// Event Types for TimeSync Application

export interface Event {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  calendarId?: string;
  calendarName?: string;
  calendarColor?: string;
}

export interface EventFormData {
  title: string;
  description: string;
  location: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  selectedCalendarIds: string[];
  attendees: string[];
  sendNotifications: boolean;
  addGoogleMeet: boolean;
}