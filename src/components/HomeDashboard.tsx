import React from 'react';
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  Bug, 
  IndianRupee, 
  Landmark, 
  Sparkles, 
  Calendar, 
  MapPin, 
  ChevronRight, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ShieldCheck, 
  BookOpenText, 
  PhoneCall 
} from 'lucide-react';
import { FarmerProfile, Crop, WeatherData, SmartReminder, FarmActivity, OutbreakAlert, Language } from '../types';
import { translations } from '../i18n/translations';

interface HomeDashboardProps {
  profile: FarmerProfile;
  crops: Crop[];
  weather: WeatherData | null;
  reminders: SmartReminder[];
  activities: FarmActivity[];
  outbreaks: OutbreakAlert[];
  language: Language;
  onNavigate: (screen: string) => void;
  onToggleReminder: (id: string) => void;
  onOpenVoice: () => void;
  onInstallApp?: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  profile,
  crops,
  weather,
  reminders,
  activities,
  outbreaks,
  language,
  onNavigate,
  onToggleReminder,
  onOpenVoice,
  onInstallApp
}) => {
  const t = translations[language];

  // Financial calculation
  const totalExpenses = activities.reduce((acc, curr) => acc + (curr.cost || 0), 0);
  const totalIncome = activities.reduce((acc, curr) => acc + (curr.income || 0), 0);
  const netProfit = totalIncome - totalExpenses;

  // Marathi and English date strings
  const now = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = language === 'mr'
    ? now.toLocaleDateString('mr-IN', dateOptions)
    : now.toLocaleDateString('en-IN', dateOptions);

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-150">
      
      {/* 1. Farmer Welcome & Profile Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-3xl p-4.5 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/5 rounded-full pointer-events-none blur-xl"></div>
        
        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-200 text-xs font-medium">
              <Calendar size={13} />
              <span>{formattedDate}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold mt-1 tracking-tight">
              {profile.name}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-emerald-100 mt-1">
              <MapPin size={12} className="text-amber-300" />
              <span>{profile.village}, {profile.district}</span>
              <span className="text-emerald-300">•</span>
              <span>{profile.landArea} {t[profile.landUnit] || profile.landUnit}</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('settings')}
            className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/30 shadow-md shrink-0 active:scale-95 transition-transform"
          >
            <img 
              src={profile.photoUrl || "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&q=80&w=200"} 
              alt={profile.name}
              className="w-full h-full object-cover" 
            />
          </button>
        </div>

        {/* Quick Voice Assistant Banner Button */}
        <div 
          onClick={onOpenVoice}
          className="mt-3.5 bg-emerald-900/60 hover:bg-emerald-900/80 cursor-pointer border border-white/15 rounded-2xl p-2.5 flex items-center justify-between transition-colors active:scale-98"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-amber-400 text-stone-900 flex items-center justify-center font-bold text-xs shadow">
              🎙️
            </div>
            <span className="text-xs font-semibold text-emerald-100">
              {language === 'mr' ? 'कोणताही शेती प्रश्न विचारा (कृषी मित्र संवाद)' : 'Ask any farming query via Voice'}
            </span>
          </div>
          <ChevronRight size={16} className="text-emerald-300" />
        </div>
      </div>

      {/* App Install Banner */}
      {onInstallApp && (
        <div 
          onClick={onInstallApp}
          className="bg-emerald-900 text-white rounded-2xl p-3 shadow-xs border border-emerald-700/80 cursor-pointer hover:bg-emerald-850 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center font-bold text-base shadow shrink-0">
              📲
            </div>
            <div>
              <h4 className="font-bold text-xs leading-snug">
                {language === 'mr' ? 'कृषी मित्र ॲप मोबाईलवर इन्स्टॉल करा' : 'Install Krishi Mitra Mobile App'}
              </h4>
              <p className="text-[10px] text-emerald-200">
                {language === 'mr' ? 'थेट होम स्क्रीनवर १-टॅप ऑफलाइन वापरा' : 'Add to home screen for full offline access'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl shadow shrink-0"
          >
            {language === 'mr' ? 'इन्स्टॉल' : 'Install'}
          </button>
        </div>
      )}

      {/* 2. Live Weather Snapshot Card */}
      {weather && (
        <div 
          onClick={() => onNavigate('weather')}
          className="bg-white rounded-3xl p-4 shadow-sm border border-emerald-100 cursor-pointer hover:border-emerald-300 transition-all active:scale-[0.99]"
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                <CloudSun size={20} />
              </div>
              <div>
                <h3 className="font-bold text-xs text-stone-800">
                  {weather.locationName} ({t.weatherSnapshot})
                </h3>
                <p className="text-[11px] text-stone-500">
                  {language === 'mr' ? weather.conditionTextMarathi : weather.conditionText} • {t.refresh}: {weather.lastUpdated}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-stone-800 tracking-tight">
                {weather.temperature}°C
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 text-center">
            <div className="bg-stone-50 rounded-xl py-2 px-1">
              <div className="text-blue-600 flex items-center justify-center gap-1 text-xs">
                <Droplets size={13} />
                <span className="font-bold">{weather.precipitationProbability}%</span>
              </div>
              <span className="text-[10px] text-stone-500">{t.rainChance}</span>
            </div>

            <div className="bg-stone-50 rounded-xl py-2 px-1">
              <div className="text-teal-600 flex items-center justify-center gap-1 text-xs">
                <Wind size={13} />
                <span className="font-bold">{weather.windSpeed} km/h</span>
              </div>
              <span className="text-[10px] text-stone-500">{t.windSpeed}</span>
            </div>

            <div className="bg-stone-50 rounded-xl py-2 px-1">
              <div className="text-emerald-700 flex items-center justify-center gap-1 text-xs font-bold">
                {weather.agriculturalAdvice.spraying.ok ? '✓ अनुकूल' : '✗ सावध'}
              </div>
              <span className="text-[10px] text-stone-500">{t.sprayCondition}</span>
            </div>
          </div>

          {/* Spraying & Irrigation hint */}
          <div className="mt-2.5 pt-2 border-t border-dashed border-stone-100 text-[11px] text-stone-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span className="truncate">
              {language === 'mr' 
                ? weather.agriculturalAdvice.spraying.adviceMarathi 
                : weather.agriculturalAdvice.spraying.advice}
            </span>
          </div>
        </div>
      )}

      {/* 3. Quick Action Grid */}
      <div className="grid grid-cols-4 gap-2.5">
        <button
          onClick={() => onNavigate('disease')}
          className="bg-white hover:bg-emerald-50/50 p-2.5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col items-center text-center transition-transform active:scale-95"
        >
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-1 shadow-inner">
            <Bug size={22} />
          </div>
          <span className="text-[11px] font-bold text-stone-800 leading-tight">
            {language === 'mr' ? 'रोग निदान' : 'Disease ID'}
          </span>
          <span className="text-[9px] text-stone-600 font-medium">AI कॅमेरा</span>
        </button>

        <button
          onClick={() => onNavigate('mandi')}
          className="bg-white hover:bg-emerald-50/50 p-2.5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col items-center text-center transition-transform active:scale-95"
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-1 shadow-inner">
            <IndianRupee size={22} />
          </div>
          <span className="text-[11px] font-bold text-stone-800 leading-tight">
            {language === 'mr' ? 'बाजारभाव' : 'Mandi Rates'}
          </span>
          <span className="text-[9px] text-stone-600 font-medium">MSAMB APMC</span>
        </button>

        <button
          onClick={() => onNavigate('schemes')}
          className="bg-white hover:bg-emerald-50/50 p-2.5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col items-center text-center transition-transform active:scale-95"
        >
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1 shadow-inner">
            <Landmark size={22} />
          </div>
          <span className="text-[11px] font-bold text-stone-800 leading-tight">
            {language === 'mr' ? 'योजना' : 'Schemes'}
          </span>
          <span className="text-[9px] text-stone-600 font-medium">₹१२,००० DBT</span>
        </button>

        <button
          onClick={() => onNavigate('recommendation')}
          className="bg-white hover:bg-emerald-50/50 p-2.5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col items-center text-center transition-transform active:scale-95"
        >
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-1 shadow-inner">
            <Sparkles size={22} />
          </div>
          <span className="text-[11px] font-bold text-stone-800 leading-tight">
            {language === 'mr' ? 'पीक शिफारस' : 'Crop Match'}
          </span>
          <span className="text-[9px] text-stone-600 font-medium">माती परीक्षण</span>
        </button>
      </div>

      {/* 4. Active Crops Cards */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-stone-200/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
            <h3 className="font-bold text-xs text-stone-800 uppercase tracking-wider">
              {t.activeCropsSummary} ({crops.length})
            </h3>
          </div>
          <button
            onClick={() => onNavigate('crops')}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-0.5"
          >
            <span>{t.viewAll}</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {crops.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-stone-200 rounded-2xl">
            <p className="text-xs text-stone-500 mb-2">{t.noCropsYet}</p>
            <button
              onClick={() => onNavigate('crops')}
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
            >
              {t.addNewCropBtn}
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {crops.slice(0, 3).map((crop) => (
              <div
                key={crop.id}
                onClick={() => onNavigate('crops')}
                className="p-3 bg-stone-50/70 hover:bg-emerald-50/40 rounded-2xl border border-stone-200/60 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-200 shrink-0">
                    <img
                      src={crop.photoUrl || "https://images.unsplash.com/photo-1599818816934-2e924b80b080?auto=format&fit=crop&q=80&w=150"}
                      alt={crop.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-stone-900">
                      {language === 'mr' ? crop.nameMarathi : crop.name}
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      {crop.landArea} {t[crop.landUnit] || crop.landUnit} • {t.stagePodFormation}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        crop.healthStatus === 'healthy' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {crop.healthStatus === 'healthy' 
                          ? (language === 'mr' ? 'उत्तम आरोग्य' : 'Healthy')
                          : (language === 'mr' ? 'कीड लक्ष ठेवा' : 'Attention')}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-stone-400" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Smart Farm Reminders */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-stone-200/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-amber-600" />
            <h3 className="font-bold text-xs text-stone-800 uppercase tracking-wider">
              {t.farmReminders}
            </h3>
          </div>
          <button
            onClick={() => onNavigate('reminders')}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-0.5"
          >
            <span>{t.viewAll}</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="space-y-2">
          {reminders.slice(0, 3).map((rem) => (
            <div
              key={rem.id}
              className={`p-3 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                rem.completed
                  ? 'bg-stone-50 border-stone-200 opacity-60 line-through'
                  : 'bg-amber-50/50 border-amber-200/80 text-stone-900'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <button
                  onClick={() => onToggleReminder(rem.id)}
                  className="mt-0.5 text-stone-400 hover:text-emerald-600 transition-colors"
                >
                  {rem.completed ? (
                    <CheckCircle2 size={18} className="text-emerald-600" />
                  ) : (
                    <div className="w-4 h-4 rounded-md border-2 border-stone-400"></div>
                  )}
                </button>
                <div>
                  <h4 className="text-xs font-bold leading-snug">
                    {language === 'mr' ? rem.titleMarathi : rem.title}
                  </h4>
                  {rem.cropName && (
                    <p className="text-[10px] text-stone-500 mt-0.5">{rem.cropName}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Outbreak & Pest Warning Banner */}
      {outbreaks.length > 0 && (
        <div 
          onClick={() => onNavigate('outbreaks')}
          className="bg-rose-50 border border-rose-200 rounded-3xl p-4 cursor-pointer hover:bg-rose-100/50 transition-colors shadow-xs"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-rose-600 text-white rounded-xl shrink-0 mt-0.5">
              <AlertTriangle size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded-full">
                  {language === 'mr' ? 'अधिकृत अलर्ट' : 'Outbreak Alert'}
                </span>
                <span className="text-[11px] text-stone-500">{outbreaks[0].district}</span>
              </div>
              <h4 className="text-xs font-bold text-rose-950 mt-1">
                {language === 'mr' ? outbreaks[0].pestOrDiseaseMarathi : outbreaks[0].pestOrDisease} ({outbreaks[0].crop})
              </h4>
              <p className="text-[11px] text-stone-600 mt-1 line-clamp-2">
                {language === 'mr' ? outbreaks[0].precautionsMarathi : outbreaks[0].precautions}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7. Season Financial Summary (Khata) */}
      <div 
        onClick={() => onNavigate('journey')}
        className="bg-stone-900 text-white rounded-3xl p-4.5 cursor-pointer shadow-md hover:bg-stone-850 transition-colors"
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-750">
          <div className="flex items-center gap-2">
            <BookOpenText size={18} className="text-emerald-400" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-300">
              {t.financialSummaryTitle}
            </h3>
          </div>
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-0.5">
            <span>{t.details}</span>
            <ChevronRight size={14} />
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3 text-center">
          <div>
            <span className="text-[10px] text-stone-400 block">{t.totalExpenses}</span>
            <span className="text-sm font-bold text-rose-400">₹{totalExpenses.toLocaleString('en-IN')}</span>
          </div>

          <div>
            <span className="text-[10px] text-stone-400 block">{t.totalIncome}</span>
            <span className="text-sm font-bold text-emerald-400">₹{totalIncome.toLocaleString('en-IN')}</span>
          </div>

          <div>
            <span className="text-[10px] text-stone-400 block">{t.netProfit}</span>
            <span className={`text-sm font-black ${netProfit >= 0 ? 'text-amber-300' : 'text-rose-400'}`}>
              ₹{netProfit.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Kisan Call Centre Helpline Strip */}
      <div className="p-3 bg-stone-100 rounded-2xl flex items-center justify-between text-xs text-stone-600 border border-stone-200">
        <div className="flex items-center gap-2">
          <PhoneCall size={15} className="text-emerald-700" />
          <span className="font-medium">{t.helpAndKVK}</span>
        </div>
        <a 
          href="tel:18001801551" 
          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px]"
        >
          Call 1551
        </a>
      </div>

    </div>
  );
};
