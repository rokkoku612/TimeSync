import React from 'react';
import { Language, TimeSlot } from '../types';
import SearchForm from './SearchForm';
import ResultsList from './ResultsList';
import EventsDisplay from './EventsDisplay';
import GoogleCalendarView from './GoogleCalendarView';
import CalendarSelector from './CalendarSelector';

interface MainContentProps {
  activeTab: 'calendar' | 'search';
  currentLanguage: Language;
  isSignedIn: boolean;
  isDemoMode: boolean;
  // Search form props
  startDateTime: Date;
  endDateTime: Date;
  minDuration: number;
  excludeBeforeTime: string;
  excludeAfterTime: string;
  showAdvanced: boolean;
  onStartDateTimeChange: (date: Date) => void;
  onEndDateTimeChange: (date: Date) => void;
  onMinDurationChange: (duration: number) => void;
  onExcludeBeforeTimeChange: (time: string) => void;
  onExcludeAfterTimeChange: (time: string) => void;
  onShowAdvancedChange: (show: boolean) => void;
  onSearch: () => void;
  isLoading: boolean;
  // Results props
  availableSlots: (TimeSlot | null)[];
  copySuccess: boolean;
  onDeleteSlot: (index: number) => void;
  onCopyAll: () => void;
  // Calendar props
  selectedCalendarIds: string[];
  onCalendarSelectionChange: (ids: string[]) => void;
  showResults: boolean;
}

const MainContent: React.FC<MainContentProps> = ({
  activeTab,
  currentLanguage,
  isSignedIn,
  isDemoMode,
  startDateTime,
  endDateTime,
  minDuration,
  excludeBeforeTime,
  excludeAfterTime,
  showAdvanced,
  onStartDateTimeChange,
  onEndDateTimeChange,
  onMinDurationChange,
  onExcludeBeforeTimeChange,
  onExcludeAfterTimeChange,
  onShowAdvancedChange,
  onSearch,
  isLoading,
  availableSlots,
  copySuccess,
  onDeleteSlot,
  onCopyAll,
  selectedCalendarIds,
  onCalendarSelectionChange,
  showResults,
}) => {
  return (
    <main className="flex-1 p-4 mobile-compact space-y-6">
      {activeTab === 'search' ? (
        <>
          <SearchForm
            startDateTime={startDateTime}
            endDateTime={endDateTime}
            minDuration={minDuration}
            excludeBeforeTime={excludeBeforeTime}
            excludeAfterTime={excludeAfterTime}
            showAdvanced={showAdvanced}
            language={currentLanguage}
            onStartDateTimeChange={(date) => {
              // 開始日時が終了日時より後の場合、終了日時も調整
              if (date > endDateTime) {
                onEndDateTimeChange(date);
              }
              onStartDateTimeChange(date);
            }}
            onEndDateTimeChange={(date) => {
              // 終了日時が開始日時より前の場合は無視
              if (date < startDateTime) {
                alert(currentLanguage.code === 'ja' 
                  ? '終了日時は開始日時より後に設定してください' 
                  : 'End date must be after start date');
                return;
              }
              onEndDateTimeChange(date);
            }}
            onMinDurationChange={onMinDurationChange}
            onExcludeBeforeTimeChange={onExcludeBeforeTimeChange}
            onExcludeAfterTimeChange={onExcludeAfterTimeChange}
            onShowAdvancedChange={onShowAdvancedChange}
            onSearch={onSearch}
            isLoading={isLoading}
          />

          <CalendarSelector
            language={currentLanguage}
            onCalendarsChange={onCalendarSelectionChange}
            isDemoMode={isDemoMode}
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

          {/* Results List - 空き時間の一覧 */}
          {showResults && !isLoading && (
            <ResultsList
              availableSlots={availableSlots}
              language={currentLanguage}
              copySuccess={copySuccess}
              onDeleteSlot={onDeleteSlot}
              onCopyAll={onCopyAll}
            />
          )}
          
          {/* Events Display - 検索期間の予定表示（常に表示） */}
          {!isLoading && (
            <EventsDisplay
              language={currentLanguage}
              isSignedIn={isSignedIn}
              isDemoMode={isDemoMode}
              startDateTime={startDateTime}
              endDateTime={endDateTime}
              selectedCalendarIds={selectedCalendarIds}
              showResults={showResults}
            />
          )}
        </>
      ) : (
        <>
          <GoogleCalendarView
            isSignedIn={isSignedIn}
            isDemoMode={isDemoMode}
            language={currentLanguage}
            selectedCalendarIds={selectedCalendarIds}
            onCalendarSelectionChange={onCalendarSelectionChange}
          />
        </>
      )}
    </main>
  );
};

export default MainContent;