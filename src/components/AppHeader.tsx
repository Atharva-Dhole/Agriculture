import React from 'react';
import { Sprout, Mic, Bell, Globe, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface AppHeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  onOpenVoice: () => void;
  onOpenNotifications: () => void;
  activeScreen: string;
  onNavigate: (screen: string) => void;
  notificationCount?: number;
  isOffline?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  language,
  onToggleLanguage,
  onOpenVoice,
  onOpenNotifications,
  activeScreen,
  onNavigate,
  notificationCount = 2,
  isOffline = false
}) => {
  const t = translations[language];
  const isSubScreen = activeScreen !== 'home';

  return (
    <header className="sticky top-0 z-30 bg-emerald-800 text-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Left: Back button or App Logo */}
        <div className="flex items-center gap-2.5">
          {isSubScreen ? (
            <button
              onClick={() => onNavigate('home')}
              className="p-1.5 -ml-1 text-emerald-100 hover:text-white hover:bg-emerald-700/60 rounded-full transition-colors active:scale-95 flex items-center gap-1"
              aria-label={t.back}
            >
              <ArrowLeft size={22} />
              <span className="text-xs font-medium pr-1">{t.back}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-emerald-200 border border-white/20 shadow-inner">
                <Sprout size={22} className="text-emerald-300" />
              </div>
              <div>
                <h1 className="font-bold text-base tracking-tight leading-tight flex items-center gap-1.5">
                  <span>{t.appName}</span>
                  <span className="text-[10px] font-normal bg-emerald-700 text-emerald-100 px-1.5 py-0.5 rounded-full border border-emerald-600">
                    कृषी मित्र
                  </span>
                </h1>
                <p className="text-[11px] text-emerald-200 font-medium leading-none">
                  {language === 'mr' ? 'बळीराजाचा डिजिटल सखा' : 'Digital Farmer Companion'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          {/* Language toggle */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1 bg-emerald-700/80 hover:bg-emerald-700 active:scale-95 border border-emerald-600/70 rounded-full text-xs font-semibold text-emerald-100 transition-all shadow-sm"
            title={language === 'mr' ? 'Switch to English' : 'मराठीत बदला'}
          >
            <Globe size={13} className="text-emerald-300" />
            <span>{language === 'mr' ? 'ENG' : 'मराठी'}</span>
          </button>

          {/* Voice Assistant Shortcut */}
          <button
            onClick={onOpenVoice}
            className="p-2 bg-amber-500 hover:bg-amber-600 text-stone-900 rounded-full transition-all shadow-sm active:scale-95 flex items-center justify-center relative group"
            title={t.voiceTitle}
            aria-label={t.voiceTitle}
          >
            <Mic size={17} className="text-stone-950 fill-stone-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping"></span>
          </button>

          {/* Notifications / Reminders button */}
          <button
            onClick={onOpenNotifications}
            className="p-2 text-emerald-100 hover:text-white hover:bg-emerald-700/60 rounded-full transition-colors relative"
            aria-label={t.farmReminders}
            title={t.farmReminders}
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-400 text-stone-900 font-bold text-[10px] rounded-full flex items-center justify-center shadow">
                {notificationCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Offline Alert Strip if network is down */}
      {isOffline && (
        <div className="bg-amber-500 text-stone-950 text-xs px-4 py-1 flex items-center justify-center gap-2 font-medium">
          <ShieldAlert size={14} />
          <span>{t.offlineNotice}</span>
        </div>
      )}
    </header>
  );
};
