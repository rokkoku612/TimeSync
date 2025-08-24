import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GoogleLogin from '../GoogleLogin';
import googleAuthDirect from '../../services/googleAuthDirect';

// Mock the auth service
vi.mock('../../services/googleAuthDirect', () => ({
  default: {
    signIn: vi.fn(),
    signOut: vi.fn(),
    isSignedIn: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

describe('GoogleLogin', () => {
  const mockLanguage = {
    code: 'en' as const,
    name: 'English',
    texts: {
      title: 'TimeSync',
      subtitle: 'Smart Calendar Scheduling',
      searchTitle: 'Find Available Time',
      calendarTitle: 'Calendar View',
      dateRange: 'Date Range',
      minDuration: 'Minimum Duration',
      search: 'Search',
      copyToClipboard: 'Copy to Clipboard',
      noResults: 'No available time slots found',
      availableSlots: 'Available Time Slots',
      monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      signInWithGoogle: 'Sign in with Google',
      signOut: 'Sign Out',
      restrictToBusinessHours: 'Business hours only',
      businessHoursDescription: '9:00 AM - 6:00 PM on weekdays',
      copyOption: 'Copy Format',
      resultsCopied: 'Results copied to clipboard!',
      excludeAllDay: 'Exclude all-day events',
      minutes: 'minutes',
      demoMode: 'Demo Mode',
      exitDemo: 'Exit Demo',
      calendarSelectorTitle: 'Select Calendars',
      selectAll: 'Select All',
      deselectAll: 'Deselect All',
      selectedCalendars: 'selected calendars',
      weekStartLabel: 'Week Start',
      sunday: 'Sunday',
      monday: 'Monday',
      eventsDisplay: 'Events Display',
    },
  };

  const mockOnSignIn = vi.fn();
  const mockOnSignOut = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sign in button when not signed in', () => {
    vi.mocked(googleAuthDirect.isSignedIn).mockReturnValue(false);

    render(
      <GoogleLogin
        language={mockLanguage}
        onSignIn={mockOnSignIn}
        onSignOut={mockOnSignOut}
      />
    );

    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
  });

  it('renders user info when signed in', async () => {
    vi.mocked(googleAuthDirect.isSignedIn).mockReturnValue(true);
    vi.mocked(googleAuthDirect.getCurrentUser).mockResolvedValue({
      isSignedIn: true,
      profile: {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        imageUrl: 'https://example.com/avatar.jpg',
      },
      accessToken: 'test-token',
    });

    render(
      <GoogleLogin
        language={mockLanguage}
        onSignIn={mockOnSignIn}
        onSignOut={mockOnSignOut}
      />
    );

    // Wait for user info to load
    await screen.findByText('Test User');
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('calls signIn when sign in button is clicked', () => {
    vi.mocked(googleAuthDirect.isSignedIn).mockReturnValue(false);

    render(
      <GoogleLogin
        language={mockLanguage}
        onSignIn={mockOnSignIn}
        onSignOut={mockOnSignOut}
      />
    );

    fireEvent.click(screen.getByText('Sign in with Google'));
    expect(googleAuthDirect.signIn).toHaveBeenCalled();
  });

  it('calls signOut when sign out button is clicked', async () => {
    vi.mocked(googleAuthDirect.isSignedIn).mockReturnValue(true);
    vi.mocked(googleAuthDirect.getCurrentUser).mockResolvedValue({
      isSignedIn: true,
      profile: {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        imageUrl: 'https://example.com/avatar.jpg',
      },
      accessToken: 'test-token',
    });

    render(
      <GoogleLogin
        language={mockLanguage}
        onSignIn={mockOnSignIn}
        onSignOut={mockOnSignOut}
      />
    );

    await screen.findByText('Test User');
    fireEvent.click(screen.getByText('Sign Out'));
    
    expect(googleAuthDirect.signOut).toHaveBeenCalled();
    expect(mockOnSignOut).toHaveBeenCalled();
  });

  it('shows demo mode button when not signed in', () => {
    vi.mocked(googleAuthDirect.isSignedIn).mockReturnValue(false);

    render(
      <GoogleLogin
        language={mockLanguage}
        onSignIn={mockOnSignIn}
        onSignOut={mockOnSignOut}
        isDemoMode={false}
      />
    );

    expect(screen.getByText('Demo Mode')).toBeInTheDocument();
  });

  it('shows exit demo button in demo mode', () => {
    vi.mocked(googleAuthDirect.isSignedIn).mockReturnValue(false);

    render(
      <GoogleLogin
        language={mockLanguage}
        onSignIn={mockOnSignIn}
        onSignOut={mockOnSignOut}
        isDemoMode={true}
      />
    );

    expect(screen.getByText('Exit Demo')).toBeInTheDocument();
  });
});