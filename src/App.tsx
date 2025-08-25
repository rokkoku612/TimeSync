import React from 'react';
import HamburgerMenu from './components/HamburgerMenu';
import ManualPage from './components/ManualPage';
import ContactPage from './components/ContactPage';
import TermsPage from './components/TermsPage';
import AboutPage from './components/AboutPage';
import LanguageToggle from './components/LanguageToggle';
import GoogleLogin from './components/GoogleLogin';
import MainContent from './components/MainContent';
import TabNavigation from './components/TabNavigation';
import { useLanguage } from './hooks/useLanguage';
import { useCalendarState } from './hooks/useCalendarState';
import { useAvailabilitySearch } from './hooks/useAvailabilitySearch';
import { useGoogleAuth } from './hooks/useGoogleAuth';
import { useAppState } from './hooks/useAppState';

const App: React.FC = () => {
  const {
    showManual,
    showContact,
    showTerms,
    showAbout,
    isMenuOpen,
    activeTab,
    selectedCalendarIds,
    weekStart,
    setShowManual,
    setShowContact,
    setShowTerms,
    setShowAbout,
    setIsMenuOpen,
    setActiveTab,
    handleCalendarSelectionChange,
    handleWeekStartChange,
  } = useAppState();
  
  // Custom hooks for state management
  const { currentLanguage, toggleLanguage } = useLanguage();
  const {
    startDateTime,
    endDateTime,
    handleStartDateSelect,
    handleEndDateSelect
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
      <div className="fixed inset-0 pointer-events-none transition-all duration-300">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-white/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute w-80 h-80 -bottom-40 -right-40 bg-white/40 rounded-full blur-3xl animate-pulse animation-delay-1000" />
        <div className="absolute w-64 h-64 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/30 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="relative flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-slate-100 px-3 py-4 z-20 transition-all duration-300">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-medium tracking-tight rainbow-text">{currentLanguage.texts.title}</h1>
            </div>
            
            <div className="flex items-center gap-3 relative">
              <LanguageToggle 
                currentLanguage={currentLanguage} 
                onToggle={toggleLanguage} 
              />
              <HamburgerMenu 
                onShowManual={() => setShowManual(true)}
                onShowContact={() => setShowContact(true)}
                onShowTerms={() => setShowTerms(true)}
                onShowAbout={() => setShowAbout(true)}
                isOpen={isMenuOpen}
                onToggle={setIsMenuOpen}
                language={currentLanguage}
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-2 py-4 pb-8 max-w-4xl mx-auto w-full transition-all duration-300">
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
            <TabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              language={currentLanguage}
            />
          )}

          {/* Main Content */}
          {(isSignedIn || !isSignedIn) && (
            <MainContent
              activeTab={activeTab}
              currentLanguage={currentLanguage}
              isSignedIn={isSignedIn}
              isDemoMode={isDemoMode}
              startDateTime={startDateTime}
              endDateTime={endDateTime}
              minDuration={minDuration}
              excludeBeforeTime={excludeBeforeTime}
              excludeAfterTime={excludeAfterTime}
              showAdvanced={showAdvanced}
              onStartDateTimeChange={handleStartDateSelect}
              onEndDateTimeChange={handleEndDateSelect}
              onMinDurationChange={setMinDuration}
              onExcludeBeforeTimeChange={setExcludeBeforeTime}
              onExcludeAfterTimeChange={setExcludeAfterTime}
              onShowAdvancedChange={setShowAdvanced}
              onSearch={onSearch}
              isLoading={isLoading}
              availableSlots={availableSlots}
              copySuccess={copySuccess}
              onDeleteSlot={deleteSlot}
              onCopyAll={copyToClipboard}
              selectedCalendarIds={selectedCalendarIds}
              onCalendarSelectionChange={handleCalendarSelectionChange}
              weekStart={weekStart}
              onWeekStartChange={handleWeekStartChange}
              showResults={showResults}
            />
          )}
        </main>
      </div>

      {/* Manual Page */}
      <ManualPage isOpen={showManual} onClose={() => setShowManual(false)} language={currentLanguage} />
      
      {/* Contact Page */}
      <ContactPage isOpen={showContact} onClose={() => setShowContact(false)} language={currentLanguage} />
      
      {/* Terms Page */}
      <TermsPage isOpen={showTerms} onClose={() => setShowTerms(false)} language={currentLanguage} />
      
      {/* About Page */}
      <AboutPage isOpen={showAbout} onClose={() => setShowAbout(false)} language={currentLanguage} />

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