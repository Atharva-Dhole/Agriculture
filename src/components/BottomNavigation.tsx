import React from 'react';
import { Home, Sprout, Grid3X3, BookOpenText, CloudSun } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface BottomNavigationProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  language: Language;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onSelectTab,
  language
}) => {
  const t = translations[language];

  const tabs = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'crops', label: t.navCrops, icon: Sprout },
    { id: 'services', label: t.navServices, icon: Grid3X3 },
    { id: 'journey', label: t.navFarmJourney, icon: BookOpenText },
    { id: 'weather', label: t.navWeather, icon: CloudSun }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-emerald-100 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] pb-safe">
      <div className="max-w-4xl mx-auto flex items-center justify-around h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-all relative ${
                isActive 
                  ? 'text-emerald-700 font-bold scale-105' 
                  : 'text-stone-500 hover:text-stone-800 font-medium'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-emerald-50 text-emerald-700' : ''}`}>
                <Icon size={22} strokeWidth={isActive ? 2.4 : 1.8} />
              </div>
              <span className={`text-[11px] leading-tight tracking-tight mt-0.5 truncate max-w-[70px] ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-0.5"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
