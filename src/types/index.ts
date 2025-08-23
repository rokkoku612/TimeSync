export interface TimeSlot {
  start: Date;
  end: Date;
  formatted: string;
  beforeEvent?: {
    title: string;
    time: string;
  };
  afterEvent?: {
    title: string;
    time: string;
  };
}

export interface Language {
  code: 'ja' | 'en';
  name: string;
  texts: {
    title: string;
    searchParameters: string;
    period: string;
    start: string;
    end: string;
    currentSelection: string;
    minimumDuration: string;
    timeRestrictions: string;
    after: string;
    before: string;
    findAvailableTimes: string;
    searchingCalendar: string;
    availableSlots: string;
    copyAll: string;
    copied: string;
    noSlotsFound: string;
    minutes: string;
    hour: string;
    hours: string;
    monthNames: string[];
    weekDays: string[];
    dayNames: string[];
    // Menu texts
    menu: string;
    openMenu: string;
    userGuide: string;
    features: string;
    googleCalendarIntegration: string;
    autoDetection: string;
    oneClickCopy: string;
    timeSettings: string;
    // Manual page texts
    aboutApp: string;
    aboutDescription: string;
    quickStart: string;
    selectPeriod: string;
    selectPeriodDesc: string;
    setMinDuration: string;
    setMinDurationDesc: string;
    executeSearch: string;
    executeSearchDesc: string;
    copyResults: string;
    copyResultsDesc: string;
    mainFeatures: string;
    calendarIntegration: string;
    calendarIntegrationDesc: string;
    autoDetectionFeature: string;
    autoDetectionDesc: string;
    easySharing: string;
    easySharingDesc: string;
    timeRestriction: string;
    timeRestrictionDesc: string;
    detailedUsage: string;
    dateSelection: string;
    dateSelectionDesc: string;
    hint: string;
    dateHint: string;
    durationSettings: string;
    durationSettingsDesc: string;
    timeRestrictionsOption: string;
    timeRestrictionsDesc: string;
    afterTime: string;
    beforeTime: string;
    example: string;
    timeRestrictionExample: string;
    resultsManagement: string;
    resultsManagementDesc: string;
    copyAllSlots: string;
    deleteIndividual: string;
    usageTips: string;
    privacyTitle: string;
    privacyDesc: string;
    efficientUsage: string;
    efficientUsageDesc: string;
    mobileSupport: string;
    mobileSupportDesc: string;
    faq: string;
    faqAuth: string;
    faqAuthAnswer: string;
    faqMultiCalendar: string;
    faqMultiCalendarAnswer: string;
    faqAllDay: string;
    faqAllDayAnswer: string;
    faqDataStorage: string;
    faqDataStorageAnswer: string;
    support: string;
    supportDesc: string;
    // Help tooltips
    helpPeriod: string;
    helpPeriodDesc: string;
    helpMinDuration: string;
    helpMinDurationDesc: string;
    helpTimeRestrictions: string;
    helpTimeRestrictionsDesc: string;
  };
}

export interface CalendarPopupProps {
  type: 'start' | 'end';
  currentDate: Date;
  calendarYear: number;
  calendarMonth: number;
  language: Language;
  onMonthChange: (year: number, month: number) => void;
  onDateSelect: (date: Date) => void;
  onTimeChange: (hours: number, minutes: number) => void;
}

export interface SearchFormProps {
  startDateTime: Date;
  endDateTime: Date;
  minDuration: number;
  excludeBeforeTime: string;
  excludeAfterTime: string;
  showAdvanced: boolean;
  language: Language;
  onStartDateTimeChange: (date: Date) => void;
  onEndDateTimeChange: (date: Date) => void;
  onMinDurationChange: (duration: number) => void;
  onExcludeBeforeTimeChange: (time: string) => void;
  onExcludeAfterTimeChange: (time: string) => void;
  onShowAdvancedChange: (show: boolean) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export interface ResultsListProps {
  availableSlots: (TimeSlot | null)[];
  language: Language;
  copySuccess: boolean;
  onDeleteSlot: (index: number) => void;
  onCopyAll: () => void;
}

export interface LanguageToggleProps {
  currentLanguage: Language;
  onToggle: () => void;
}

export interface AvailabilitySearchState {
  availableSlots: (TimeSlot | null)[];
  isLoading: boolean;
  showResults: boolean;
  copySuccess: boolean;
}

export interface CalendarState {
  startCalendarYear: number;
  startCalendarMonth: number;
  endCalendarYear: number;
  endCalendarMonth: number;
}