// Google OAuth Configuration
// Production Client ID for GitHub Pages deployment
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '228481405429-krab31cq11382774i87dhuccs0j0p9bh.apps.googleusercontent.com';

// Google Calendar API configuration
export const GOOGLE_CALENDAR_SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events'
].join(' ');

// Discovery docs for Google Calendar API
export const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
];