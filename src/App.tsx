import React, { useState } from 'react';
import HamburgerMenu from './components/HamburgerMenu';
import ManualPage from './components/ManualPage';
import SearchForm from './components/SearchForm';
import ResultsList from './components/ResultsList';
import EventsDisplay from './components/EventsDisplay';
import LanguageToggle from './components/LanguageToggle';
import GoogleLogin from './components/GoogleLogin';
import GoogleCalendarView from './components/GoogleCalendarView';
import CalendarSelector from './components/CalendarSelector';
import { useLanguage } from './hooks/useLanguage';
import { useCalendarState } from './hooks/useCalendarState';
import { useAvailabilitySearch } from './hooks/useAvailabilitySearch';
import { useGoogleAuth } from './hooks/useGoogleAuth';

const App: React.FC = () => {
  const [showManual, setShowManual] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'calendar' | 'search'>('search');
  const [selectedCalendarIds, setSelectedCalendarIds] = useState<string[]>(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem('selectedCalendarIds');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        // Failed to parse saved IDs
      }
    }
    return [];
  });
  
  // Custom hooks for state management
  const { currentLanguage, toggleLanguage } = useLanguage();
  const {
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
    handleEndTimeChange
  } = useCalendarState();
  
  const {
    minDuration,
    setMinDuration,
    excludeBeforeTime,
    setExcludeBeforeTime,
    excludeAfterTime,
    setExcludeAfterTime,
    showAdvanced,
    setShowAdvanced,
    availableSlots,
    isLoading,
    showResults,
    copySuccess,
    searchError,
    handleSearch,
    deleteSlot,
    copyToClipboard
  } = useAvailabilitySearch(currentLanguage);
  
  // Google Auth hook
  const {
    isSignedIn,
    isLoading: authLoading,
    user,
    signIn,
    signOut,
    error: authError,
    isDemoMode,
    toggleDemoMode
  } = useGoogleAuth();

  const onSearch = () => {
    handleSearch(startDateTime, endDateTime, currentLanguage, isDemoMode, selectedCalendarIds);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className={`fixed inset-0 pointer-events-none z-0 transition-all duration-300 ${isMenuOpen ? 'brightness-50' : 'brightness-100'}`}>
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-white/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute w-80 h-80 -bottom-40 -right-40 bg-white/40 rounded-full blur-3xl animate-pulse animation-delay-1000" />
        <div className="absolute w-64 h-64 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/30 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-slate-100 px-3 py-4 z-50 transition-all duration-300">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-medium text-slate-900 tracking-tight">{currentLanguage.texts.title}</h1>
            </div>
            
            <div className="flex items-center gap-3 relative z-60">
              <LanguageToggle 
                currentLanguage={currentLanguage} 
                onToggle={toggleLanguage} 
              />
              <HamburgerMenu 
                onShowManual={() => setShowManual(true)} 
                isOpen={isMenuOpen}
                onToggle={setIsMenuOpen}
                language={currentLanguage}
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className={`flex-1 px-2 py-4 pb-8 max-w-4xl mx-auto w-full transition-all duration-300 ${isMenuOpen ? 'brightness-50 contrast-75' : 'brightness-100'}`}>
          {/* Google Login */}
          <div className="mb-6">
            <GoogleLogin
              isSignedIn={isSignedIn}
              isLoading={authLoading}
              user={user}
              onSignIn={signIn}
              onSignOut={signOut}
              language={currentLanguage}
              error={authError}
              isDemoMode={isDemoMode}
              onToggleDemoMode={toggleDemoMode}
            />
          </div>

          {/* Tab Navigation - Only show when signed in */}
          {isSignedIn && (
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => setActiveTab('search')}
                className={`px-12 py-3 rounded-xl text-base font-medium transition-all min-w-[240px] ${
                  activeTab === 'search'
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {currentLanguage.code === 'ja' ? '空き時間検索' : 'Availability Search'}
              </button>
              
              <div className="flex-1"></div>
              
              <button
                onClick={() => setActiveTab('calendar')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'calendar'
                    ? 'bg-slate-100 text-slate-900 border border-slate-200'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {currentLanguage.code === 'ja' ? 'カレンダー表示' : 'Calendar View'}
              </button>
            </div>
          )}

          {/* Calendar View - Show when signed in and calendar tab is active */}
          {isSignedIn && activeTab === 'calendar' && (
            <div className="mb-6">
              <GoogleCalendarView
                language={currentLanguage}
                isSignedIn={isSignedIn}
                isDemoMode={isDemoMode}
                onSwitchToSearch={() => setActiveTab('search')}
              />
            </div>
          )}

          {/* Search Section - Show when not signed in OR when search tab is active */}
          {(!isSignedIn || activeTab === 'search') && (
            <>
              {/* Calendar Selector for Search */}
              {isSignedIn && !isDemoMode && (
                <div className="flex justify-end mb-4">
                  <CalendarSelector
                    language={currentLanguage}
                    onCalendarsChange={(ids) => {
                      setSelectedCalendarIds(ids);
                      localStorage.setItem('selectedCalendarIds', JSON.stringify(ids));
                    }}
                    isDemoMode={isDemoMode}
                  />
                </div>
              )}
              
              {/* Search Form */}
              <SearchForm
                startDateTime={startDateTime}
                endDateTime={endDateTime}
                minDuration={minDuration}
                excludeBeforeTime={excludeBeforeTime}
                excludeAfterTime={excludeAfterTime}
                showAdvanced={showAdvanced}
                language={currentLanguage}
                onStartDateTimeChange={handleStartDateSelect}
                onEndDateTimeChange={handleEndDateSelect}
                onMinDurationChange={setMinDuration}
                onExcludeBeforeTimeChange={setExcludeBeforeTime}
                onExcludeAfterTimeChange={setExcludeAfterTime}
                onShowAdvancedChange={setShowAdvanced}
                onSearch={onSearch}
                isLoading={isLoading}
              />

              {/* Loading State */}
              {isLoading && (
                <div className="text-center py-12">
                  <div className="inline-block relative w-20 h-20">
                    <div className="absolute inset-0 border-2 border-gray-300 opacity-100 rounded-full animate-ping" />
                    <div className="absolute inset-0 border-2 border-gray-300 opacity-100 rounded-full animate-ping animation-delay-200" />
                  </div>
                  <p className="mt-4 text-gray-500">{currentLanguage.texts.searchingCalendar}</p>
                </div>
              )}

              {/* Error Display */}
              {searchError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-700">{searchError}</p>
                </div>
              )}

              {/* Results */}
              {showResults && !isLoading && (
                <>
                  <ResultsList
                    availableSlots={availableSlots}
                    language={currentLanguage}
                    copySuccess={copySuccess}
                    onDeleteSlot={deleteSlot}
                    onCopyAll={copyToClipboard}
                  />
                  
                  {/* Events Display - Show scheduled events in the search period */}
                  <EventsDisplay
                    language={currentLanguage}
                    isSignedIn={isSignedIn}
                    isDemoMode={isDemoMode}
                    availableSlots={availableSlots}
                    startDateTime={startDateTime}
                    endDateTime={endDateTime}
                    selectedCalendarIds={selectedCalendarIds}
                  />
                </>
              )}
            </>
          )}
        </main>
      </div>

      {/* Manual Page */}
      <ManualPage isOpen={showManual} onClose={() => setShowManual(false)} language={currentLanguage} />

      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default App;