import React, { useState, useRef } from 'react';
import { 
  User, 
  Globe, 
  MapPin, 
  Download, 
  Upload, 
  Trash2, 
  ShieldCheck, 
  Check, 
  AlertTriangle, 
  PhoneCall, 
  Save 
} from 'lucide-react';
import { FarmerProfile, Language } from '../types';
import { translations } from '../i18n/translations';
import { MAHARASHTRA_DISTRICTS } from './OnboardingModal';

interface ProfileSettingsScreenProps {
  profile: FarmerProfile;
  language: Language;
  onSaveProfile: (profile: FarmerProfile) => void;
  onToggleLanguage: () => void;
  onExportData: () => void;
  onImportData: (jsonStr: string) => boolean;
  onResetData: () => void;
}

export const ProfileSettingsScreen: React.FC<ProfileSettingsScreenProps> = ({
  profile,
  language,
  onSaveProfile,
  onToggleLanguage,
  onExportData,
  onImportData,
  onResetData
}) => {
  const t = translations[language];

  const [formData, setFormData] = useState({ ...profile });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const ok = onImportData(content);
          if (ok) {
            setImportMessage(language === 'mr' ? 'डेटा यशस्वीरित्या रिस्टोअर झाला!' : 'Data restored successfully!');
            setTimeout(() => window.location.reload(), 1200);
          } else {
            setImportMessage(language === 'mr' ? 'अवैध फाइल फॉरमॅट' : 'Invalid JSON file');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-150">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-emerald-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
            <User size={22} />
          </div>
          <div>
            <h2 className="font-bold text-base text-stone-900 leading-tight">
              {t.settingsTitle}
            </h2>
            <p className="text-xs text-stone-500">
              {profile.name} • {profile.village}
            </p>
          </div>
        </div>
      </div>

      {/* Language Switcher Card */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-stone-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
            <Globe size={18} />
          </div>
          <div>
            <h3 className="font-bold text-xs text-stone-800">{t.switchLanguage}</h3>
            <p className="text-[11px] text-stone-500">
              {language === 'mr' ? 'सध्याची भाषा: मराठी' : 'Current Language: English'}
            </p>
          </div>
        </div>

        <button
          onClick={onToggleLanguage}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
        >
          {language === 'mr' ? 'Switch to English' : 'मराठीत बदला'}
        </button>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-4 shadow-sm border border-stone-200 space-y-3.5 text-xs">
        
        <div className="flex items-center justify-between pb-1 border-b border-stone-200">
          <span className="font-bold text-stone-800 text-xs">
            {t.personalDetails} &amp; {t.landDetails}
          </span>
          {saveSuccess && (
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <Check size={14} />
              <span>{t.profileSavedSuccess}</span>
            </span>
          )}
        </div>

        <div>
          <label className="font-medium text-stone-700 block mb-1">{t.farmerName} *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="font-medium text-stone-700 block mb-1">{t.mobileNumber}</label>
            <input
              type="tel"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="font-medium text-stone-700 block mb-1">{t.district}</label>
            <select
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
            >
              {MAHARASHTRA_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="font-medium text-stone-700 block mb-1">{t.village}</label>
            <input
              type="text"
              value={formData.village}
              onChange={(e) => setFormData({ ...formData, village: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
            />
          </div>
          <div>
            <label className="font-medium text-stone-700 block mb-1">{t.taluka}</label>
            <input
              type="text"
              value={formData.taluka}
              onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="font-medium text-stone-700 block mb-1">{t.totalLand}</label>
            <input
              type="number"
              step="0.5"
              value={formData.landArea}
              onChange={(e) => setFormData({ ...formData, landArea: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
            />
          </div>
          <div>
            <label className="font-medium text-stone-700 block mb-1">{t.landUnit}</label>
            <select
              value={formData.landUnit}
              onChange={(e) => setFormData({ ...formData, landUnit: e.target.value as any })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
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
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
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
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
            >
              <option value="drip">{t.irriDrip}</option>
              <option value="sprinkler">{t.irriSprinkler}</option>
              <option value="well">{t.irriWell}</option>
              <option value="canal">{t.irriCanal}</option>
              <option value="rainfed">{t.irriRainfed}</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Save size={16} />
          <span>{t.save}</span>
        </button>

      </form>

      {/* Data Backup & Restore Section */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-stone-200 space-y-3 text-xs">
        <h3 className="font-bold text-xs uppercase tracking-wider text-stone-700">
          {t.dataManagement}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={onExportData}
            className="p-3 bg-stone-50 hover:bg-emerald-50 rounded-2xl border border-stone-200 text-stone-800 font-semibold flex items-center gap-2 transition-colors text-left"
          >
            <Download size={18} className="text-emerald-700 shrink-0" />
            <div>
              <span className="block font-bold">{t.backupData}</span>
              <span className="text-[10px] text-stone-500">JSON File</span>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-stone-50 hover:bg-blue-50 rounded-2xl border border-stone-200 text-stone-800 font-semibold flex items-center gap-2 transition-colors text-left"
          >
            <Upload size={18} className="text-blue-700 shrink-0" />
            <div>
              <span className="block font-bold">{t.importData}</span>
              <span className="text-[10px] text-stone-500">Restore JSON</span>
            </div>
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileImport}
            accept=".json"
            className="hidden"
          />
        </div>

        {importMessage && (
          <p className="text-xs text-emerald-700 font-bold bg-emerald-50 p-2 rounded-xl">
            {importMessage}
          </p>
        )}

        {/* Reset Account */}
        <div className="pt-2 border-t border-stone-100">
          <button
            onClick={() => {
              if (window.confirm(t.resetWarning)) {
                onResetData();
              }
            }}
            className="text-rose-600 hover:text-rose-700 font-bold text-xs flex items-center gap-1.5 p-1"
          >
            <Trash2 size={15} />
            <span>{t.resetAccount}</span>
          </button>
        </div>
      </div>

      {/* Kisan Call Center Strip */}
      <div className="bg-emerald-800 text-white rounded-3xl p-4 shadow-sm flex items-center justify-between">
        <div>
          <h4 className="font-bold text-xs">{t.helpAndKVK}</h4>
          <p className="text-[11px] text-emerald-200 mt-0.5">
            {language === 'mr' ? '२४x७ शेतकरी मार्गदर्शन मोफत दूरध्वनी सेवा' : '24x7 Free Agricultural Advice Hotline'}
          </p>
        </div>
        <a
          href="tel:18001801551"
          className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-stone-900 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <PhoneCall size={14} />
          <span>1800-180-1551</span>
        </a>
      </div>

    </div>
  );
};
