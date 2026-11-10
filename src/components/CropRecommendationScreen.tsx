import React, { useState } from 'react';
import { 
  Sparkles, 
  FlaskConical, 
  Droplets, 
  Sun, 
  Clock, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  ChevronRight, 
  BookOpen, 
  RefreshCw 
} from 'lucide-react';
import { Language, CropRecommendationInput, RecommendedCropResult } from '../types';
import { translations } from '../i18n/translations';
import { cropRecommendationService } from '../services/cropRecommendation';
import { MAHARASHTRA_DISTRICTS } from './OnboardingModal';

interface CropRecommendationScreenProps {
  language: Language;
}

export const CropRecommendationScreen: React.FC<CropRecommendationScreenProps> = ({
  language
}) => {
  const t = translations[language];

  const [inputData, setInputData] = useState<CropRecommendationInput>({
    nitrogen: 210,
    phosphorus: 18,
    potassium: 320,
    ph: 7.2,
    district: 'छत्रपती संभाजीनगर (Chhatrapati Sambhajinagar)',
    season: 'kharif',
    soilType: 'black_cotton'
  });

  const [recommendations, setRecommendations] = useState<RecommendedCropResult[]>(() => {
    return cropRecommendationService.recommendCrops({
      nitrogen: 210,
      phosphorus: 18,
      potassium: 320,
      ph: 7.2,
      district: 'छत्रपती संभाजीनगर',
      season: 'kharif',
      soilType: 'black_cotton'
    });
  });

  const [expandedCropId, setExpandedCropId] = useState<string | null>(recommendations[0]?.cropId || null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const results = cropRecommendationService.recommendCrops(inputData);
    setRecommendations(results);
    if (results.length > 0) {
      setExpandedCropId(results[0].cropId);
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-emerald-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
            <Sparkles size={22} />
          </div>
          <div>
            <h2 className="font-bold text-base text-stone-900 leading-tight">
              {t.cropRecTitle}
            </h2>
            <p className="text-xs text-stone-500">
              {t.cropRecSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Input Parameters Card */}
      <form onSubmit={handleCalculate} className="bg-white rounded-3xl p-4 shadow-sm border border-stone-200 space-y-3.5 text-xs">
        
        <div className="flex items-center gap-2 pb-1 border-b border-stone-100">
          <FlaskConical size={16} className="text-emerald-700" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-stone-700">
            {language === 'mr' ? 'माती परीक्षण व हंगाम नोंदी' : 'Soil Test & Season Inputs'}
          </h3>
        </div>

        {/* Season Selector */}
        <div>
          <label className="font-bold text-stone-700 block mb-1.5">{t.season} *</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'kharif', label: t.seasonKharif },
              { id: 'rabi', label: t.seasonRabi },
              { id: 'zaid', label: t.seasonZaid }
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setInputData({ ...inputData, season: s.id as any })}
                className={`py-2 px-1 text-center rounded-xl font-bold border transition-all ${
                  inputData.season === s.id
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Soil Type & District */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="font-medium text-stone-700 block mb-1">{t.soilType} *</label>
            <select
              value={inputData.soilType}
              onChange={(e) => setInputData({ ...inputData, soilType: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
            >
              <option value="black_cotton">{t.soilBlackCotton}</option>
              <option value="loamy">{t.soilLoamy}</option>
              <option value="red">{t.soilRed}</option>
              <option value="alluvial">{t.soilAlluvial}</option>
              <option value="sandy">{t.soilSandy}</option>
            </select>
          </div>

          <div>
            <label className="font-medium text-stone-700 block mb-1">{t.district} *</label>
            <select
              value={inputData.district}
              onChange={(e) => setInputData({ ...inputData, district: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
            >
              {MAHARASHTRA_DISTRICTS.map((dist) => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>
        </div>

        {/* N-P-K & pH Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div>
            <label className="font-medium text-stone-700 block mb-1">{t.soilNitrogen}</label>
            <input
              type="number"
              value={inputData.nitrogen}
              onChange={(e) => setInputData({ ...inputData, nitrogen: Number(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="font-medium text-stone-700 block mb-1">{t.soilPhosphorus}</label>
            <input
              type="number"
              value={inputData.phosphorus}
              onChange={(e) => setInputData({ ...inputData, phosphorus: Number(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="font-medium text-stone-700 block mb-1">{t.soilPotassium}</label>
            <input
              type="number"
              value={inputData.potassium}
              onChange={(e) => setInputData({ ...inputData, potassium: Number(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="font-medium text-stone-700 block mb-1">{t.soilPH}</label>
            <input
              type="number"
              step="0.1"
              value={inputData.ph}
              onChange={(e) => setInputData({ ...inputData, ph: parseFloat(e.target.value) || 7.0 })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors active:scale-98"
        >
          <Sparkles size={16} className="text-amber-300" />
          <span>{t.calculateRecommendations}</span>
        </button>

      </form>

      {/* Recommended Crops Output */}
      <div className="space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-stone-700 pl-1">
          {language === 'mr' ? 'शिफारस केलेली पिके (योग्यतेनुसार क्रमवारी)' : 'Recommended Crops (Ranked by Suitability)'}
        </h3>

        {recommendations.map((rec, index) => {
          const isExpanded = expandedCropId === rec.cropId;
          return (
            <div
              key={rec.cropId}
              className={`bg-white rounded-3xl border transition-all overflow-hidden ${
                index === 0 ? 'border-emerald-500 shadow-md ring-1 ring-emerald-200' : 'border-stone-200 shadow-xs'
              }`}
            >
              {/* Header Card */}
              <div
                onClick={() => setExpandedCropId(isExpanded ? null : rec.cropId)}
                className="p-4 cursor-pointer hover:bg-stone-50/70 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black ${
                    rec.suitabilityScore >= 80 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : rec.suitabilityScore >= 60 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-stone-100 text-stone-700'
                  }`}>
                    <span className="text-sm leading-none">{rec.suitabilityScore}%</span>
                    <span className="text-[8px] font-normal uppercase">योग्य</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                        {rec.category}
                      </span>
                      {index === 0 && (
                        <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                          ⭐ सर्वाधिक योग्य
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-stone-900 mt-0.5">
                      {language === 'mr' ? rec.cropNameMarathi : rec.cropName}
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      कालावधी: {language === 'mr' ? rec.expectedDurationMarathi : rec.expectedDuration}
                    </p>
                  </div>
                </div>

                <ChevronRight size={18} className={`text-stone-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </div>

              {/* Expanded Guidance */}
              {isExpanded && (
                <div className="p-4 border-t border-stone-100 space-y-3 text-xs bg-stone-50/50">
                  
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                      <span className="text-[10px] text-stone-500 block">{language === 'mr' ? 'पाण्याची गरज' : 'Water Requirement'}</span>
                      <span className="font-bold text-stone-800 text-xs">
                        {language === 'mr' ? rec.waterNeedMarathi : rec.waterNeed}
                      </span>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                      <span className="text-[10px] text-stone-500 block">{language === 'mr' ? 'हंगाम कालावधी' : 'Duration'}</span>
                      <span className="font-bold text-stone-800 text-xs">
                        {language === 'mr' ? rec.expectedDurationMarathi : rec.expectedDuration}
                      </span>
                    </div>
                  </div>

                  {/* Cultivation Tips */}
                  <div className="p-3 bg-white rounded-2xl border border-stone-200 space-y-1">
                    <h5 className="font-bold text-emerald-800 flex items-center gap-1.5">
                      <BookOpen size={14} />
                      <span>{t.cropCultivationTips}</span>
                    </h5>
                    <p className="text-stone-700 leading-relaxed">
                      {language === 'mr' ? rec.cultivationGuideMarathi : rec.cultivationGuide}
                    </p>
                  </div>

                  {/* Fertilizer Guidance */}
                  <div className="p-3 bg-white rounded-2xl border border-stone-200 space-y-1">
                    <h5 className="font-bold text-amber-800 flex items-center gap-1.5">
                      <FlaskConical size={14} />
                      <span>{t.fertilizerReq}</span>
                    </h5>
                    <p className="text-stone-700 leading-relaxed">
                      {language === 'mr' ? rec.fertilizerGuideMarathi : rec.fertilizerGuide}
                    </p>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
