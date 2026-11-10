import React, { useState } from 'react';
import { 
  CloudSun, 
  Search, 
  RefreshCw, 
  Droplets, 
  Wind, 
  Thermometer, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Calendar 
} from 'lucide-react';
import { WeatherData, Language } from '../types';
import { translations } from '../i18n/translations';
import { MAHARASHTRA_DISTRICTS } from './OnboardingModal';

interface WeatherScreenProps {
  weather: WeatherData | null;
  language: Language;
  onRefresh: (query?: string) => Promise<void>;
  isLoading: boolean;
}

export const WeatherScreen: React.FC<WeatherScreenProps> = ({
  weather,
  language,
  onRefresh,
  isLoading
}) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState(weather?.locationName || 'छत्रपती संभाजीनगर');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onRefresh(searchQuery.trim());
    }
  };

  const handleDistrictChange = (dist: string) => {
    setSelectedDistrict(dist);
    const cleanDist = dist.split('(')[0].trim();
    onRefresh(cleanDist);
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-150">
      
      {/* Title & Search Bar */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-emerald-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <CloudSun size={22} />
            </div>
            <div>
              <h2 className="font-bold text-base text-stone-900 leading-tight">
                {t.weatherTitle}
              </h2>
              <p className="text-xs text-stone-500">
                {language === 'mr' ? 'Open-Meteo थेट उपग्रह हवामान' : 'Open-Meteo Live Agro Forecast'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onRefresh(searchQuery || selectedDistrict)}
            disabled={isLoading}
            className="p-2.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all disabled:opacity-50 active:scale-95 flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
            <span>{t.refresh}</span>
          </button>
        </div>

        {/* Location search & district presets */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchLocationPlaceholder}
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs"
          >
            {t.search}
          </button>
        </form>

        {/* District Quick Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {['छत्रपती संभाजीनगर', 'पुणे', 'नाशिक', 'नागपूर', 'लातूर', 'अहिल्यानगर', 'सोलापूर', 'जळगाव', 'अमरावती'].map((dist) => (
            <button
              key={dist}
              onClick={() => handleDistrictChange(dist)}
              className={`px-3 py-1 rounded-full whitespace-nowrap text-xs font-medium border transition-colors ${
                (weather?.locationName || '').includes(dist)
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {dist}
            </button>
          ))}
        </div>
      </div>

      {weather && (
        <>
          {/* Main Weather Card */}
          <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-3xl p-5 shadow-md relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-200 text-xs font-medium">
                  <MapPin size={13} className="text-amber-300" />
                  <span className="font-bold text-sm text-white">{weather.locationName}</span>
                </div>
                <p className="text-xs text-emerald-200 mt-0.5">
                  {language === 'mr' ? weather.conditionTextMarathi : weather.conditionText}
                </p>
                <div className="text-4xl sm:text-5xl font-black mt-2 tracking-tight">
                  {weather.temperature}°C
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] bg-emerald-950/70 border border-emerald-600 px-2 py-0.5 rounded-full text-emerald-200">
                  {t.lastUpdated || 'Last updated'}: {weather.lastUpdated}
                </span>
                <div className="mt-3 text-xs text-emerald-100 space-y-1">
                  <div>{t.maxMinTemp}: {weather.daily[0]?.maxTemp}° / {weather.daily[0]?.minTemp}°</div>
                </div>
              </div>
            </div>

            {/* Weather Metrics Grid */}
            <div className="grid grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-emerald-700/60 text-center">
              <div className="bg-emerald-900/50 rounded-2xl p-2.5 border border-emerald-700/50">
                <div className="text-blue-300 flex items-center justify-center gap-1 text-sm font-bold">
                  <Droplets size={16} />
                  <span>{weather.precipitationProbability}%</span>
                </div>
                <span className="text-[10px] text-emerald-200 block mt-0.5">{t.rainChance}</span>
                <span className="text-[9px] text-emerald-300 font-mono">({weather.precipitation} mm)</span>
              </div>

              <div className="bg-emerald-900/50 rounded-2xl p-2.5 border border-emerald-700/50">
                <div className="text-teal-300 flex items-center justify-center gap-1 text-sm font-bold">
                  <Wind size={16} />
                  <span>{weather.windSpeed} km/h</span>
                </div>
                <span className="text-[10px] text-emerald-200 block mt-0.5">{t.windSpeed}</span>
                <span className="text-[9px] text-emerald-300 font-mono">
                  {weather.windSpeed < 15 ? (language === 'mr' ? 'शांत' : 'Calm') : (language === 'mr' ? 'वेगाने' : 'Breezy')}
                </span>
              </div>

              <div className="bg-emerald-900/50 rounded-2xl p-2.5 border border-emerald-700/50">
                <div className="text-amber-300 flex items-center justify-center gap-1 text-sm font-bold">
                  <Thermometer size={16} />
                  <span>{weather.humidity}%</span>
                </div>
                <span className="text-[10px] text-emerald-200 block mt-0.5">{t.humidity}</span>
                <span className="text-[9px] text-emerald-300 font-mono">RH</span>
              </div>
            </div>
          </div>

          {/* Agricultural Weather Advisories */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-stone-200 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-700">
              {t.todayAdvisory}
            </h3>

            {/* Spraying Advisory */}
            <div className={`p-3 rounded-2xl border flex items-start gap-3 ${
              weather.agriculturalAdvice.spraying.ok
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-rose-50 border-rose-200'
            }`}>
              <div className="mt-0.5 shrink-0">
                {weather.agriculturalAdvice.spraying.ok ? (
                  <CheckCircle2 size={18} className="text-emerald-700" />
                ) : (
                  <XCircle size={18} className="text-rose-600" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-xs text-stone-900">
                  {t.sprayCondition}: {weather.agriculturalAdvice.spraying.ok ? t.safeToSpray : t.unsafeToSpray}
                </h4>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  {language === 'mr' 
                    ? weather.agriculturalAdvice.spraying.adviceMarathi 
                    : weather.agriculturalAdvice.spraying.advice}
                </p>
              </div>
            </div>

            {/* Irrigation Advisory */}
            <div className="p-3 rounded-2xl border border-stone-200 bg-stone-50 flex items-start gap-3">
              <div className="mt-0.5 shrink-0 text-blue-600">
                <Droplets size={18} />
              </div>
              <div>
                <h4 className="font-bold text-xs text-stone-900">{t.irrigationCondition}</h4>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  {language === 'mr' 
                    ? weather.agriculturalAdvice.irrigation.adviceMarathi 
                    : weather.agriculturalAdvice.irrigation.advice}
                </p>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-stone-200">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={16} className="text-emerald-700" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-stone-700">
                {t.forecast7Days}
              </h3>
            </div>

            <div className="space-y-2">
              {weather.daily.map((day, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-2xl bg-stone-50 hover:bg-emerald-50/50 flex items-center justify-between text-xs transition-colors"
                >
                  <div className="w-24">
                    <span className="font-bold text-stone-800 block">
                      {language === 'mr' ? day.dayNameMarathi : day.dayName}
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">{day.date}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-stone-700">
                    <CloudSun size={15} className="text-amber-500" />
                    <span className="text-[11px]">{language === 'mr' ? day.conditionMarathi : day.condition}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-bold text-stone-800">{day.maxTemp}°</span>
                      <span className="text-stone-400 text-[10px]"> / {day.minTemp}°</span>
                    </div>

                    <div className="w-12 text-right text-blue-600 font-semibold text-[11px]">
                      {day.rainProb > 0 ? `${day.rainProb}%` : '0%'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  );
};
