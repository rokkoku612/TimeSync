import React from 'react';
import { Calendar, Search } from 'lucide-react';
import { Language } from '../types';

interface TabNavigationProps {
  activeTab: 'calendar' | 'search';
  onTabChange: (tab: 'calendar' | 'search') => void;
  language: Language;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  language 
}) => {
  const tabLabels = {
    ja: {
      search: '空き時間検索',
      calendar: 'カレンダー表示'
    },
    en: {
      search: 'Available Time Search',
      calendar: 'Calendar View'
    }
  };

  const t = tabLabels[language.code];

  return (
    <div className="flex space-x-1 mb-6 bg-pearl rounded-lg p-1">
      <button
        onClick={() => onTabChange('search')}
        className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
          activeTab === 'search'
            ? 'bg-pure-white text-ink shadow-sm'
            : 'text-charcoal hover:text-ink hover:bg-pure-white/50'
        }`}
      >
        <Search size={16} />
        <span className="text-sm font-medium">{t.search}</span>
      </button>
      <button
        onClick={() => onTabChange('calendar')}
        className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
          activeTab === 'calendar'
            ? 'bg-pure-white text-ink shadow-sm'
            : 'text-charcoal hover:text-ink hover:bg-pure-white/50'
        }`}
      >
        <Calendar size={16} />
        <span className="text-sm font-medium">{t.calendar}</span>
      </button>
    </div>
  );
};

export default TabNavigation;