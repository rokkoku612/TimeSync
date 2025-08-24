import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GoogleLogin from '../GoogleLogin';

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
  const mockOnToggleDemoMode = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sign in button when not signed in', () => {
    render(
      <GoogleLogin
        isSignedIn={false}
        isLoading={false}
        user={null}
        language={mockLanguage}
        onSignIn={mockOnSignIn}
        onSignOut={mockOnSignOut}
        error={null}
        isDemoMode={false}
        onToggleDemoMode={mockOnToggleDemoMode}
      />
    );

    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
  });

  it('renders user info when signed in', () => {
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com',
      imageUrl: 'https://example.com/avatar.jpg',
    };

    render(
      <GoogleLogin
        isSignedIn={true}
        isLoading={false}
        user={mockUser}
        language={mockLanguage}
        onSignIn={mockOnSignIn}
        onSignOut={mockOnSignOut}
        error={null}
        isDemoMode={false}
        onToggleDemoMode={mockOnToggleDemoMode}
      />
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('calls signIn when sign in button is clicked', () => {
    render(
      <GoogleLogin
        isSignedIn={false}
        isLoading={false}
        user={null}
        language={mockLanguage}
        onSignIn={mockOnSignIn}
        onSignOut={mockOnSignOut}
        error={null}
        isDemoMode={false}
        onToggleDemoMode={mockOnToggleDemoMode}
      />
    );

    fireEvent.click(screen.getByText('Sign in with Google'));
    expect(mockOnSignIn).toHaveBeenCalled();
  });

  it('calls signOut when sign out button is clicked', () => {
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com',
      imageUrl: 'https://example.com/avatar.jpg',
    };

    render(
      <GoogleLogin
        isSignedIn={true}
        isLoading={false}
        user={mockUser}
        language={mockLanguage}
        onSignIn={mockOnSignIn}
        onSignOut={mockOnSignOut}
        error={null}
        isDemoMode={false}
        onToggleDemoMode={mockOnToggleDemoMode}
      />
    );

    fireEvent.click(screen.getByText('Sign out'));
    expect(mockOnSignOut).toHaveBeenCalled();
  });

  it('shows demo mode button when not signed in', () => {
    render(
      <GoogleLogin
        isSignedIn={false}
        isLoading={false}
        user={null}
        language={mockLanguage}
        onSignIn={mockOnSignIn}
        onSignOut={mockOnSignOut}
        error={null}
        isDemoMode={false}
        onToggleDemoMode={mockOnToggleDemoMode}
      />
    );

    expect(screen.getByText('Try Demo')).toBeInTheDocument();
  });

  it('shows demo mode badge when user is in demo mode', () => {
    const mockUser = {
      name: 'Demo User',
      email: 'demo@example.com',
      imageUrl: '',
    };

    render(
      <GoogleLogin
        isSignedIn={true}
        isLoading={false}
        user={mockUser}
        language={mockLanguage}
        onSignIn={mockOnSignIn}
        onSignOut={mockOnSignOut}
        error={null}
        isDemoMode={true}
        onToggleDemoMode={mockOnToggleDemoMode}
      />
    );

    expect(screen.getByText('Demo Mode')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <GoogleLogin
        isSignedIn={false}
        isLoading={true}
        user={null}
        language={mockLanguage}
        onSignIn={mockOnSignIn}
        onSignOut={mockOnSignOut}
        error={null}
        isDemoMode={false}
        onToggleDemoMode={mockOnToggleDemoMode}
      />
    );

    expect(screen.getByText('Connecting...')).toBeInTheDocument();
  });
});