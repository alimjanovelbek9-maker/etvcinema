import React from 'react';
import { Home, Search, User } from 'lucide-react';
import type { NavTab, Language } from '../types';

interface BottomNavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  language: Language;
  isDarkMode: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  language,
  isDarkMode,
}) => {
  const t = {
    uz: { home: 'Bosh sahifa', search: 'Qidiruv', settings: 'Sozlamalar' },
    ru: { home: 'Главная', search: 'Поиск', settings: 'Настройки' },
  }[language];

  return (
    <div className="fixed bottom-2 left-0 right-0 px-3 max-w-md mx-auto z-50">
      <div className={`backdrop-blur-md rounded-[2rem] p-1.5 border shadow-2xl grid grid-cols-3 items-stretch gap-1 transition-all duration-500 ${
        isDarkMode ? 'bg-[#12182b]/90 border-gray-800/80' : 'bg-white/85 border-gray-300'
      }`}>
        <button
          onClick={() => onTabChange('home')}
          className={`min-h-[4rem] rounded-[1.7rem] flex flex-col items-center justify-center gap-1 shadow-lg transition-all duration-300 active:scale-95 ${
            activeTab === 'home'
              ? 'bg-[#18233d] text-white shadow-blue-950/40'
              : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'text-gray-300' : ''}`} />
          <span className="text-[10px] font-medium whitespace-nowrap">{t.home}</span>
        </button>

        <button
          onClick={() => onTabChange('search')}
          className={`min-h-[4rem] rounded-[1.7rem] flex flex-col items-center justify-center gap-1 transition-all duration-300 active:scale-95 ${
            activeTab === 'search' ? 'bg-[#18233d] text-blue-400 shadow-blue-950/40' : isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-medium">{t.search}</span>
        </button>

        <button
          onClick={() => onTabChange('settings')}
          className={`min-h-[4rem] rounded-[1.7rem] flex flex-col items-center justify-center gap-1 transition-all duration-300 active:scale-95 ${
            activeTab === 'settings' ? 'bg-[#18233d] text-blue-400 shadow-blue-950/40' : isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">{t.settings}</span>
        </button>

      </div>
      <p className={`text-center text-[11px] font-semibold tracking-[0.18em] mt-1.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
        @etvcinema
      </p>
    </div>
  );
};