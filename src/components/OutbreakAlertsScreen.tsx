import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Plus, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Filter, 
  X, 
  Camera 
} from 'lucide-react';
import { OutbreakAlert, Language } from '../types';
import { translations } from '../i18n/translations';
import { MAHARASHTRA_DISTRICTS } from './OnboardingModal';

interface OutbreakAlertsScreenProps {
  outbreaks: OutbreakAlert[];
  language: Language;
  onReportOutbreak: (outbreak: Omit<OutbreakAlert, 'id' | 'reportedDate' | 'reportCount' | 'verified'>) => void;
}

export const OutbreakAlertsScreen: React.FC<OutbreakAlertsScreenProps> = ({
  outbreaks,
  language,
  onReportOutbreak
}) => {
  const t = translations[language];

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  const [formData, setFormData] = useState({
    district: 'छत्रपती संभाजीनगर (Chhatrapati Sambhajinagar)',
    taluka: '',
    village: '',
    crop: 'Cotton',
    cropMarathi: 'कापूस',
    pestOrDisease: '',
    pestOrDiseaseMarathi: '',
    symptoms: '',
    severity: 'medium' as const,
    precautions: '',
    precautionsMarathi: ''
  });

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pestOrDiseaseMarathi && !formData.pestOrDisease) return;

    onReportOutbreak({
      district: formData.district,
      taluka: formData.taluka || 'तालुका परिसर',
      village: formData.village || 'स्थानिक गाव',
      crop: formData.crop,
      cropMarathi: formData.cropMarathi,
      pestOrDisease: formData.pestOrDisease || formData.pestOrDiseaseMarathi,
      pestOrDiseaseMarathi: formData.pestOrDiseaseMarathi || formData.pestOrDisease,
      severity: formData.severity,
      precautions: formData.precautions || 'Maintain field cleanliness and spray recommended organic bio-pesticides.',
      precautionsMarathi: formData.precautionsMarathi || 'पिकाची स्वच्छता ठेवावी व निंबोळी अर्काची त्वरित फवारणी करावी.'
    });

    setIsReportModalOpen(false);
  };

  const filteredOutbreaks = outbreaks.filter((o) => {
    if (selectedDistrict === 'all') return true;
    return o.district.includes(selectedDistrict);
  });

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-150">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-rose-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h2 className="font-bold text-base text-stone-900 leading-tight">
              {t.outbreakTitle}
            </h2>
            <p className="text-xs text-stone-500">
              {t.outbreakSubtitle}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
        >
          <Plus size={16} />
          <span>{t.reportOutbreakBtn}</span>
        </button>
      </div>

      {/* Outbreak Alerts List */}
      <div className="space-y-3">
        {filteredOutbreaks.map((alert) => (
          <div
            key={alert.id}
            className={`bg-white rounded-3xl p-4.5 border transition-all ${
              alert.severity === 'high' 
                ? 'border-rose-400 shadow-sm ring-1 ring-rose-200' 
                : 'border-stone-200 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between pb-2.5 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  {alert.verified ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={11} />
                      <span>{language === 'mr' ? 'कृषी विभाग प्रमाणित' : 'Verified Alert'}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      {language === 'mr' ? 'शेतकरी नोंद' : 'Farmer Report'}
                    </span>
                  )}
                  <span className="text-xs text-stone-500 font-mono">{alert.reportedDate}</span>
                </div>

                <h3 className="font-bold text-sm text-stone-900 mt-1 leading-snug">
                  {language === 'mr' ? alert.pestOrDiseaseMarathi : alert.pestOrDisease}
                </h3>

                <div className="flex items-center gap-2 text-xs text-stone-600 mt-1">
                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                    🌱 {language === 'mr' ? alert.cropMarathi : alert.crop}
                  </span>
                  <div className="flex items-center gap-1 text-stone-500">
                    <MapPin size={12} className="text-stone-400" />
                    <span>{alert.district} ({alert.taluka})</span>
                  </div>
                </div>
              </div>

              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                alert.severity === 'high' 
                  ? 'bg-rose-100 text-rose-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {alert.severity}
              </span>
            </div>

            {/* Precautions */}
            <div className="mt-3 bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs">
              <span className="font-bold text-stone-800 block mb-0.5">
                ⚠️ {t.precautions}:
              </span>
              <p className="text-stone-700 leading-relaxed">
                {language === 'mr' ? alert.precautionsMarathi : alert.precautions}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Report Outbreak Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-rose-700 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <AlertTriangle size={18} />
                <span>{t.reportOutbreakBtn}</span>
              </h3>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 hover:bg-rose-800 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="p-4 overflow-y-auto space-y-3 text-xs">
              <div>
                <label className="font-medium text-stone-700 block mb-1">{t.district} *</label>
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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">{t.taluka}</label>
                  <input
                    type="text"
                    value={formData.taluka}
                    onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
                    placeholder="उदा. निफाड"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-medium text-stone-700 block mb-1">{t.village}</label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    placeholder="उदा. सायखेडा"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">{t.cropName} *</label>
                <input
                  type="text"
                  required
                  value={formData.cropMarathi}
                  onChange={(e) => setFormData({ ...formData, cropMarathi: e.target.value, crop: e.target.value })}
                  placeholder="उदा. कापूस, कांदा, सोयाबीन"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">
                  {language === 'mr' ? 'दिसून आलेला रोग किंवा कीड' : 'Pest or Disease Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.pestOrDiseaseMarathi}
                  onChange={(e) => setFormData({ ...formData, pestOrDiseaseMarathi: e.target.value, pestOrDisease: e.target.value })}
                  placeholder="उदा. गुलाबी बोंडअळी, करपा, पांढरी माशी"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">{t.precautions}</label>
                <textarea
                  rows={2}
                  value={formData.precautionsMarathi}
                  onChange={(e) => setFormData({ ...formData, precautionsMarathi: e.target.value, precautions: e.target.value })}
                  placeholder="उदा. शेत स्वच्छ ठेवावे व त्वरित निंबोळी अर्क फवारावे."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-semibold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-sm"
                >
                  {language === 'mr' ? 'अलर्ट नोंदवा' : 'Submit Alert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
