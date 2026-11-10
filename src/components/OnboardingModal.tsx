import React, { useState } from 'react';
import { Sprout, Check, ArrowRight, ShieldCheck, CloudSun, Bug, IndianRupee, MapPin } from 'lucide-react';
import { Language, FarmerProfile } from '../types';
import { translations } from '../i18n/translations';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: FarmerProfile, lang: Language) => void;
  currentProfile: FarmerProfile;
  currentLanguage: Language;
}

export const MAHARASHTRA_DISTRICTS = [
  'छत्रपती संभाजीनगर (Chhatrapati Sambhajinagar)',
  'नाशिक (Nashik)',
  'पुणे (Pune)',
  'नागपूर (Nagpur)',
  'लातूर (Latur)',
  'अहिल्यानगर (Ahmednagar)',
  'सोलापूर (Solapur)',
  'कोल्हापूर (Kolhapur)',
  'सातारा (Satara)',
  'सांगली (Sangli)',
  'जळगाव (Jalgaon)',
  'अमरावती (Amravati)',
  'यवतमाळ (Yavatmal)',
  'नांदेड (Nanded)',
  'जालना (Jalna)',
  'परभणी (Parbhani)',
  'बुलढाणा (Buldhana)',
  'वाशीम (Washim)',
  'बीड (Beed)',
  'धुळे (Dhule)',
  'नंदुरबार (Nandurbar)',
  'वर्धा (Wardha)',
  'चंद्रपूर (Chandrapur)',
  'भंडारा (Bhandara)',
  'गोंदिया (Gondia)',
  'गडचिरोली (Gadchiroli)',
  'हिंगोली (Hingoli)',
  'धाराशिव (Osmanabad)',
  'रायगड (Raigad)',
  'रत्नागिरी (Ratnagiri)',
  'सिंधुदुर्ग (Sindhudurg)',
  'ठाणे (Thane)',
  'पालघर (Palghar)'
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  currentProfile,
  currentLanguage
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedLang, setSelectedLang] = useState<Language>(currentLanguage);

  const [formData, setFormData] = useState({
    name: currentProfile.name || '',
    mobile: currentProfile.mobile || '',
    village: currentProfile.village || '',
    taluka: currentProfile.taluka || '',
    district: currentProfile.district || 'छत्रपती संभाजीनगर (Chhatrapati Sambhajinagar)',
    landArea: currentProfile.landArea || 3.0,
    landUnit: currentProfile.landUnit || 'acre',
    soilType: currentProfile.soilType || 'black_cotton',
    irrigationFacility: currentProfile.irrigationFacility || 'drip',
    crops: currentProfile.mainCrops.join(', ') || 'सोयाबीन, कापूस'
  });

  if (!isOpen) return null;

  const t = translations[selectedLang];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      const cropsList = formData.crops
        .split(',')
        .map(c => c.trim())
        .filter(c => c.length > 0);

      const updatedProfile: FarmerProfile = {
        ...currentProfile,
        name: formData.name.trim() || (selectedLang === 'mr' ? 'शेतकरी बंधू' : 'Farmer Friend'),
        mobile: formData.mobile.trim() || '9876543210',
        village: formData.village.trim() || (selectedLang === 'mr' ? 'शिऊर' : 'Shiur'),
        taluka: formData.taluka.trim() || (selectedLang === 'mr' ? 'वैजापूर' : 'Vaijapur'),
        district: formData.district,
        state: 'महाराष्ट्र (Maharashtra)',
        preferredLanguage: selectedLang,
        landArea: Number(formData.landArea) || 2.5,
        landUnit: formData.landUnit as any,
        soilType: formData.soilType as any,
        irrigationFacility: formData.irrigationFacility as any,
        mainCrops: cropsList.length > 0 ? cropsList : ['सोयाबीन', 'कापूस'],
        onboardingCompleted: true
      };

      onComplete(updatedProfile, selectedLang);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white p-5 text-center relative">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/20 flex items-center justify-center text-emerald-100 mb-2 border border-white/30 shadow-inner">
            <Sprout size={32} />
          </div>
          <h2 className="text-xl font-bold">{t.welcomeTitle}</h2>
          <p className="text-xs text-emerald-100 max-w-sm mx-auto mt-1">
            {t.welcomeSubtitle}
          </p>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-3">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s === step ? 'w-8 bg-amber-400' : 'w-2 bg-emerald-900/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Language Selection */}
        {step === 1 && (
          <div className="p-6 space-y-5 overflow-y-auto">
            <div className="text-center">
              <h3 className="text-base font-bold text-stone-800">
                कृपया तुमची पसंतीची भाषा निवडा
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Select your preferred language
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => setSelectedLang('mr')}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                  selectedLang === 'mr'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-sm'
                    : 'border-stone-200 hover:border-emerald-300 text-stone-700'
                }`}
              >
                <div className="text-2xl mb-1">🚩</div>
                <div className="font-bold text-base">मराठी</div>
                <div className="text-xs text-emerald-700 font-medium">महाराष्ट्र राज्य विशेष</div>
                {selectedLang === 'mr' && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check size={13} strokeWidth={3} />
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedLang('en')}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                  selectedLang === 'en'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-sm'
                    : 'border-stone-200 hover:border-emerald-300 text-stone-700'
                }`}
              >
                <div className="text-2xl mb-1">🌾</div>
                <div className="font-bold text-base">English</div>
                <div className="text-xs text-stone-500">Standard English</div>
                {selectedLang === 'en' && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check size={13} strokeWidth={3} />
                  </div>
                )}
              </button>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-600 flex items-center gap-2 border border-stone-200">
              <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
              <span>
                {selectedLang === 'mr' 
                  ? 'तुम्ही ॲपच्या शीर्षस्थानी किंवा सेटिंग्जमधून केव्हाही भाषा बदलू शकता.'
                  : 'You can change the language anytime from the top bar or settings.'}
              </span>
            </div>
          </div>
        )}

        {/* Step 2: Main Features Overview */}
        {step === 2 && (
          <div className="p-6 space-y-4 overflow-y-auto">
            <h3 className="text-sm font-bold text-stone-800 text-center">
              {selectedLang === 'mr' ? 'कृषी मित्र मधील मुख्य वैशिष्ट्ये' : 'Key Features of Krishi Mitra'}
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-100 flex items-start gap-3">
                <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0">
                  <CloudSun size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-emerald-950">{t.onboardingStep1Title}</h4>
                  <p className="text-[11px] text-stone-600 mt-0.5">{t.onboardingStep1Desc}</p>
                </div>
              </div>

              <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-100 flex items-start gap-3">
                <div className="p-2 bg-amber-600 text-white rounded-xl shrink-0">
                  <Bug size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-stone-900">{t.onboardingStep2Title}</h4>
                  <p className="text-[11px] text-stone-600 mt-0.5">{t.onboardingStep2Desc}</p>
                </div>
              </div>

              <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-100 flex items-start gap-3">
                <div className="p-2 bg-blue-600 text-white rounded-xl shrink-0">
                  <IndianRupee size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-blue-950">{t.onboardingStep3Title}</h4>
                  <p className="text-[11px] text-stone-600 mt-0.5">{t.onboardingStep3Desc}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Farmer Profile Setup */}
        {step === 3 && (
          <div className="p-5 space-y-3.5 overflow-y-auto max-h-[50vh]">
            <h3 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
              <MapPin size={16} className="text-emerald-700" />
              <span>{t.personalDetails} &amp; {t.landDetails}</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="font-medium text-stone-700 block mb-1">{t.farmerName} *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={selectedLang === 'mr' ? 'उदा. ज्ञानेश्वर पाटील' : 'e.g. Ramesh Patil'}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">{t.village} *</label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    placeholder="उदा. शिऊर"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-stone-700 block mb-1">{t.taluka} *</label>
                  <input
                    type="text"
                    value={formData.taluka}
                    onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
                    placeholder="उदा. वैजापूर"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">{t.district} *</label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  {MAHARASHTRA_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">{t.totalLand}</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.landArea}
                    onChange={(e) => setFormData({ ...formData, landArea: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-stone-700 block mb-1">{t.landUnit}</label>
                  <select
                    value={formData.landUnit}
                    onChange={(e) => setFormData({ ...formData, landUnit: e.target.value as any })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="acre">{t.acre}</option>
                    <option value="guntha">{t.guntha}</option>
                    <option value="hectare">{t.hectare}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">{t.soilType}</label>
                  <select
                    value={formData.soilType}
                    onChange={(e) => setFormData({ ...formData, soilType: e.target.value as any })}
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
                  <label className="font-medium text-stone-700 block mb-1">{t.irrigationFacility}</label>
                  <select
                    value={formData.irrigationFacility}
                    onChange={(e) => setFormData({ ...formData, irrigationFacility: e.target.value as any })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="drip">{t.irriDrip}</option>
                    <option value="sprinkler">{t.irriSprinkler}</option>
                    <option value="well">{t.irriWell}</option>
                    <option value="canal">{t.irriCanal}</option>
                    <option value="rainfed">{t.irriRainfed}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">{t.mainCropsGrown}</label>
                <input
                  type="text"
                  value={formData.crops}
                  onChange={(e) => setFormData({ ...formData, crops: e.target.value })}
                  placeholder="उदा. सोयाबीन, कापूस, कांदा"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-semibold"
            >
              {t.back}
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm active:scale-95 transition-all ml-auto"
          >
            <span>{step === 3 ? t.getStarted : t.next}</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};
