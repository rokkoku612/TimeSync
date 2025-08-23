import React from 'react';
import { X, Calendar, Clock, Copy, Settings, ChevronRight, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Language } from '../types';

interface ManualPageProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const ManualPage: React.FC<ManualPageProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Manual Panel */}
      <div className="absolute inset-y-0 right-0 w-full max-w-4xl bg-pure-white shadow-float animate-slideUp overflow-y-auto">
        <div className="sticky top-0 bg-pure-white/95 backdrop-blur-xl border-b border-mist z-10">
          <div className="flex items-center justify-between p-6">
            <div>
              <h1 className="text-xl font-medium text-ink tracking-tight">{language.texts.userGuide}</h1>
              <p className="text-sm text-graphite mt-1">Availability — Serenity Calendar</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center text-graphite hover:text-ink hover:bg-pearl rounded-lg transition-all duration-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 pb-20">
          {/* Introduction */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-pearl to-mist rounded-xl p-6 mb-8">
              <h2 className="text-lg font-medium text-ink mb-3 flex items-center gap-2">
                <Info size={20} className="text-charcoal" />
                {language.texts.aboutApp}
              </h2>
              <p className="text-charcoal leading-relaxed">
                {language.texts.aboutDescription}
              </p>
            </div>
          </section>

          {/* Quick Start */}
          <section className="mb-12">
            <h2 className="text-lg font-medium text-ink mb-6 flex items-center gap-2">
              <CheckCircle size={20} className="text-charcoal" />
              {language.texts.quickStart}
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-soft-white rounded-lg border border-mist">
                <div className="w-8 h-8 bg-ink text-pure-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-ink mb-1">
                    {language.code === 'ja' ? 'Googleカレンダー連携' : 'Connect Google Calendar'}
                  </h3>
                  <p className="text-charcoal text-sm">
                    {language.code === 'ja' 
                      ? 'Googleアカウントでログインして、カレンダーの予定を自動取得します。' 
                      : 'Sign in with your Google account to automatically fetch your calendar events.'}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-soft-white rounded-lg border border-mist">
                <div className="w-8 h-8 bg-ink text-pure-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-ink mb-1">{language.texts.selectPeriod}</h3>
                  <p className="text-charcoal text-sm">{language.texts.selectPeriodDesc}</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-soft-white rounded-lg border border-mist">
                <div className="w-8 h-8 bg-ink text-pure-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-ink mb-1">{language.texts.setMinDuration}</h3>
                  <p className="text-charcoal text-sm">{language.texts.setMinDurationDesc}</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-soft-white rounded-lg border border-mist">
                <div className="w-8 h-8 bg-ink text-pure-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-medium text-ink mb-1">{language.texts.executeSearch}</h3>
                  <p className="text-charcoal text-sm">{language.texts.executeSearchDesc}</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-soft-white rounded-lg border border-mist">
                <div className="w-8 h-8 bg-ink text-pure-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  5
                </div>
                <div>
                  <h3 className="font-medium text-ink mb-1">
                    {language.code === 'ja' ? 'テンプレート選択とコピー' : 'Select Template and Copy'}
                  </h3>
                  <p className="text-charcoal text-sm">
                    {language.code === 'ja' 
                      ? 'ビジネスシーンに合わせたテンプレートを選択し、空き時間をコピーします。' 
                      : 'Select a template suited for your business needs and copy your available times.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="mb-12">
            <h2 className="text-lg font-medium text-ink mb-6 flex items-center gap-2">
              <Settings size={20} className="text-charcoal" />
              {language.texts.mainFeatures}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-soft-white rounded-xl border border-mist">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-pearl rounded-lg flex items-center justify-center">
                    <Calendar size={20} className="text-charcoal" />
                  </div>
                  <h3 className="font-medium text-ink">{language.texts.calendarIntegration}</h3>
                </div>
                <p className="text-charcoal text-sm leading-relaxed">
                  {language.texts.calendarIntegrationDesc}
                </p>
              </div>

              <div className="p-6 bg-soft-white rounded-xl border border-mist">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-pearl rounded-lg flex items-center justify-center">
                    <Clock size={20} className="text-charcoal" />
                  </div>
                  <h3 className="font-medium text-ink">{language.texts.autoDetectionFeature}</h3>
                </div>
                <p className="text-charcoal text-sm leading-relaxed">
                  {language.texts.autoDetectionDesc}
                </p>
              </div>

              <div className="p-6 bg-soft-white rounded-xl border border-mist">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-pearl rounded-lg flex items-center justify-center">
                    <Copy size={20} className="text-charcoal" />
                  </div>
                  <h3 className="font-medium text-ink">{language.texts.easySharing}</h3>
                </div>
                <p className="text-charcoal text-sm leading-relaxed">
                  {language.texts.easySharingDesc}
                </p>
              </div>

              <div className="p-6 bg-soft-white rounded-xl border border-mist">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-pearl rounded-lg flex items-center justify-center">
                    <Settings size={20} className="text-charcoal" />
                  </div>
                  <h3 className="font-medium text-ink">{language.texts.timeRestriction}</h3>
                </div>
                <p className="text-charcoal text-sm leading-relaxed">
                  {language.texts.timeRestrictionDesc}
                </p>
              </div>
            </div>
          </section>

          {/* Detailed Usage */}
          <section className="mb-12">
            <h2 className="text-lg font-medium text-ink mb-6">{language.texts.detailedUsage}</h2>
            
            <div className="space-y-8">
              {/* Date Selection */}
              <div>
                <h3 className="font-medium text-ink mb-4 flex items-center gap-2">
                  <ChevronRight size={16} className="text-graphite" />
                  {language.texts.dateSelection}
                </h3>
                <div className="pl-6 space-y-3">
                  <p className="text-charcoal text-sm leading-relaxed">
                    {language.texts.dateSelectionDesc}
                  </p>
                  <div className="bg-pearl p-4 rounded-lg">
                    <p className="text-charcoal text-sm">
                      <strong>{language.texts.hint}：</strong> 
                      {language.texts.dateHint}
                    </p>
                  </div>
                </div>
              </div>

              {/* Duration Settings */}
              <div>
                <h3 className="font-medium text-ink mb-4 flex items-center gap-2">
                  <ChevronRight size={16} className="text-graphite" />
                  {language.texts.durationSettings}
                </h3>
                <div className="pl-6 space-y-3">
                  <p className="text-charcoal text-sm leading-relaxed">
                    {language.texts.durationSettingsDesc}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs">
                    <div className="bg-mist p-2 rounded text-center">15 {language.texts.minutes}</div>
                    <div className="bg-mist p-2 rounded text-center">30 {language.texts.minutes}</div>
                    <div className="bg-mist p-2 rounded text-center">45 {language.texts.minutes}</div>
                    <div className="bg-mist p-2 rounded text-center">1 {language.texts.hour}</div>
                    <div className="bg-mist p-2 rounded text-center">90 {language.texts.minutes}</div>
                    <div className="bg-mist p-2 rounded text-center">2 {language.texts.hours}</div>
                  </div>
                </div>
              </div>

              {/* Time Restrictions */}
              <div>
                <h3 className="font-medium text-ink mb-4 flex items-center gap-2">
                  <ChevronRight size={16} className="text-graphite" />
                  {language.texts.timeRestrictionsOption}
                </h3>
                <div className="pl-6 space-y-3">
                  <p className="text-charcoal text-sm leading-relaxed">
                    {language.texts.timeRestrictionsDesc}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-charcoal w-16">{language.texts.after}:</span>
                      <span className="text-sm text-graphite">{language.texts.afterTime}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-charcoal w-16">{language.texts.before}:</span>
                      <span className="text-sm text-graphite">{language.texts.beforeTime}</span>
                    </div>
                  </div>
                  <div className="bg-pearl p-4 rounded-lg">
                    <p className="text-charcoal text-sm">
                      <strong>{language.texts.example}：</strong> 
                      {language.texts.timeRestrictionExample}
                    </p>
                  </div>
                </div>
              </div>

              {/* Results Management */}
              <div>
                <h3 className="font-medium text-ink mb-4 flex items-center gap-2">
                  <ChevronRight size={16} className="text-graphite" />
                  {language.texts.resultsManagement}
                </h3>
                <div className="pl-6 space-y-3">
                  <p className="text-charcoal text-sm leading-relaxed">
                    {language.texts.resultsManagementDesc}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Copy size={16} className="text-graphite" />
                      <span className="text-sm text-charcoal">{language.texts.copyAllSlots}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <X size={16} className="text-graphite" />
                      <span className="text-sm text-charcoal">{language.texts.deleteIndividual}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Template Function */}
              <div>
                <h3 className="font-medium text-ink mb-4 flex items-center gap-2">
                  <ChevronRight size={16} className="text-graphite" />
                  {language.code === 'ja' ? 'コピーテンプレート機能' : 'Copy Template Feature'}
                </h3>
                <div className="pl-6 space-y-3">
                  <p className="text-charcoal text-sm leading-relaxed">
                    {language.code === 'ja' 
                      ? '空き時間をコピーする際、ビジネスシーンに合わせた8種類のテンプレートから選択できます。前文・後文が自動的に追加され、そのままメールやチャットで送信できます。'
                      : 'When copying available times, you can choose from 8 templates suited for different business scenarios. Introductory and closing text is automatically added, ready to send via email or chat.'}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-mist p-2 rounded">
                      {language.code === 'ja' ? 'シンプル（日程のみ）' : 'Simple (Dates Only)'}
                    </div>
                    <div className="bg-mist p-2 rounded">
                      {language.code === 'ja' ? 'フォーマル' : 'Formal'}
                    </div>
                    <div className="bg-mist p-2 rounded">
                      {language.code === 'ja' ? 'カジュアル' : 'Casual'}
                    </div>
                    <div className="bg-mist p-2 rounded">
                      {language.code === 'ja' ? 'ビジネス' : 'Business'}
                    </div>
                    <div className="bg-mist p-2 rounded">
                      {language.code === 'ja' ? '面接・面談' : 'Interview'}
                    </div>
                    <div className="bg-mist p-2 rounded">
                      {language.code === 'ja' ? 'リマインダー付き' : 'With Reminder'}
                    </div>
                    <div className="bg-mist p-2 rounded">
                      {language.code === 'ja' ? 'クイック調整' : 'Quick Schedule'}
                    </div>
                    <div className="bg-mist p-2 rounded">
                      {language.code === 'ja' ? '国際会議' : 'International'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendar Selection */}
              <div>
                <h3 className="font-medium text-ink mb-4 flex items-center gap-2">
                  <ChevronRight size={16} className="text-graphite" />
                  {language.code === 'ja' ? 'カレンダー選択機能' : 'Calendar Selection'}
                </h3>
                <div className="pl-6 space-y-3">
                  <p className="text-charcoal text-sm leading-relaxed">
                    {language.code === 'ja' 
                      ? '複数のGoogleカレンダーを使用している場合、検索対象とするカレンダーを選択できます。共有カレンダーも含め、必要なカレンダーのみを選択することで、より正確な空き時間を検索できます。'
                      : 'If you use multiple Google calendars, you can select which calendars to include in the search. Including shared calendars, select only the necessary ones for more accurate availability search.'}
                  </p>
                  <div className="bg-pearl p-4 rounded-lg">
                    <p className="text-charcoal text-sm">
                      <strong>{language.code === 'ja' ? 'ヒント' : 'Tip'}：</strong>
                      {language.code === 'ja' 
                        ? '選択したカレンダーは自動的に保存され、次回アクセス時も維持されます。' 
                        : 'Selected calendars are automatically saved and maintained for your next visit.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section className="mb-12">
            <h2 className="text-lg font-medium text-ink mb-6 flex items-center gap-2">
              <AlertCircle size={20} className="text-charcoal" />
              {language.texts.usageTips}
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-soft-white rounded-lg border-l-4 border-charcoal">
                <h3 className="font-medium text-ink mb-2">{language.texts.privacyTitle}</h3>
                <p className="text-charcoal text-sm leading-relaxed">
                  {language.texts.privacyDesc}
                </p>
              </div>
              <div className="p-4 bg-soft-white rounded-lg border-l-4 border-charcoal">
                <h3 className="font-medium text-ink mb-2">{language.texts.efficientUsage}</h3>
                <p className="text-charcoal text-sm leading-relaxed">
                  {language.texts.efficientUsageDesc}
                </p>
              </div>
              <div className="p-4 bg-soft-white rounded-lg border-l-4 border-charcoal">
                <h3 className="font-medium text-ink mb-2">{language.texts.mobileSupport}</h3>
                <p className="text-charcoal text-sm leading-relaxed">
                  {language.texts.mobileSupportDesc}
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-lg font-medium text-ink mb-6">{language.texts.faq}</h2>
            <div className="space-y-4">
              <details className="group">
                <summary className="flex items-center justify-between p-4 bg-soft-white rounded-lg cursor-pointer hover:bg-pearl transition-colors duration-200">
                  <span className="font-medium text-ink">{language.texts.faqAuth}</span>
                  <ChevronRight size={16} className="text-graphite group-open:rotate-90 transition-transform duration-200" />
                </summary>
                <div className="p-4 text-charcoal text-sm leading-relaxed">
                  {language.texts.faqAuthAnswer}
                </div>
              </details>

              <details className="group">
                <summary className="flex items-center justify-between p-4 bg-soft-white rounded-lg cursor-pointer hover:bg-pearl transition-colors duration-200">
                  <span className="font-medium text-ink">{language.texts.faqMultiCalendar}</span>
                  <ChevronRight size={16} className="text-graphite group-open:rotate-90 transition-transform duration-200" />
                </summary>
                <div className="p-4 text-charcoal text-sm leading-relaxed">
                  {language.texts.faqMultiCalendarAnswer}
                </div>
              </details>

              <details className="group">
                <summary className="flex items-center justify-between p-4 bg-soft-white rounded-lg cursor-pointer hover:bg-pearl transition-colors duration-200">
                  <span className="font-medium text-ink">{language.texts.faqAllDay}</span>
                  <ChevronRight size={16} className="text-graphite group-open:rotate-90 transition-transform duration-200" />
                </summary>
                <div className="p-4 text-charcoal text-sm leading-relaxed">
                  {language.texts.faqAllDayAnswer}
                </div>
              </details>

              <details className="group">
                <summary className="flex items-center justify-between p-4 bg-soft-white rounded-lg cursor-pointer hover:bg-pearl transition-colors duration-200">
                  <span className="font-medium text-ink">{language.texts.faqDataStorage}</span>
                  <ChevronRight size={16} className="text-graphite group-open:rotate-90 transition-transform duration-200" />
                </summary>
                <div className="p-4 text-charcoal text-sm leading-relaxed">
                  {language.texts.faqDataStorageAnswer}
                </div>
              </details>
            </div>
          </section>

          {/* Support */}
          <section>
            <h2 className="text-lg font-medium text-ink mb-6">{language.texts.support}</h2>
            <div className="p-6 bg-gradient-to-r from-pearl to-mist rounded-xl">
              <p className="text-charcoal leading-relaxed mb-4">
                {language.texts.supportDesc}
              </p>
              <div className="text-sm text-graphite">
                <div>Version 1.0.0</div>
                <div>© 2024 Availability — Serenity Calendar</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ManualPage;