import React, { useState } from 'react';
import { 
  FlaskConical, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Info, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Plus 
} from 'lucide-react';
import { SoilReport, Language } from '../types';
import { translations } from '../i18n/translations';

interface SoilReportScreenProps {
  soilReports: SoilReport[];
  language: Language;
  onSaveSoilReport: (report: Omit<SoilReport, 'id'>) => void;
}

export const SoilReportScreen: React.FC<SoilReportScreenProps> = ({
  soilReports,
  language,
  onSaveSoilReport
}) => {
  const t = translations[language];

  const [activeReport, setActiveReport] = useState<SoilReport>(soilReports[0]);
  const [isAddMode, setIsAddMode] = useState(false);

  const [form, setForm] = useState({
    farmerName: 'ज्ञानेश्वर तुकाराम पाटील',
    sampleLocation: 'गट क्र. १४२ (Gat No. 142)',
    soilType: 'काळी कसदार (Black Cotton)',
    ph: 7.4,
    nitrogen: 190,
    phosphorus: 18,
    potassium: 360,
    organicCarbon: 0.55,
    electricalConductivity: 0.42
  });

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();

    // Determine fertility
    let fertility: 'low' | 'medium' | 'high' = 'medium';
    if (form.nitrogen < 200 && form.phosphorus < 15) fertility = 'low';
    if (form.nitrogen > 280 && form.phosphorus > 25 && form.potassium > 300) fertility = 'high';

    // Fertilizer calculation (approximate MPKV standards)
    const ureaDose = form.nitrogen < 200 ? 50 : 35;
    const dapDose = form.phosphorus < 15 ? 55 : 40;
    const mopDose = form.potassium > 300 ? 15 : 30;
    const compostDose = form.organicCarbon < 0.5 ? 4 : 2.5;

    const summaryEn = `Soil pH is ${form.ph} (optimal). Nitrogen is ${form.nitrogen < 200 ? 'Low' : 'Adequate'}, Phosphorus is medium, and Potassium reserves are high.`;
    const summaryMr = `जमिनीचा सामू ${form.ph} आहे. नत्राची मात्रा कमी असून पालाश भरपूर आहे. सेंद्रिय कर्ब वाढविण्यासाठी शेणखताचा वापर वाढवा.`;

    const guidanceEn = `Apply ${ureaDose} kg Urea and ${dapDose} kg DAP per acre. Since soil has high potassium, MOP can be reduced to ${mopDose} kg/acre. Add ${compostDose} tons of organic compost.`;
    const guidanceMr = `प्रति एकर ${ureaDose} किलो युरिया व ${dapDose} किलो डीएपी द्यावे. जमिनीत पालाश मुबलक असल्याने एमओपी खताचा डोस ${mopDose} किलो ठेवावा. एकरी ${compostDose} टन चांगले कुजलेले शेणखत वापरावे.`;

    const newRep: Omit<SoilReport, 'id'> = {
      farmerName: form.farmerName,
      date: new Date().toISOString().split('T')[0],
      sampleLocation: form.sampleLocation,
      soilType: form.soilType,
      ph: form.ph,
      nitrogen: form.nitrogen,
      phosphorus: form.phosphorus,
      potassium: form.potassium,
      organicCarbon: form.organicCarbon,
      electricalConductivity: form.electricalConductivity,
      fertilityRating: fertility,
      fertilitySummary: summaryEn,
      fertilitySummaryMarathi: summaryMr,
      suitableCrops: ['सोयाबीन', 'कापूस', 'तूर', 'कांदा', 'हरभरा'],
      fertilizerPlan: {
        ureaKgPerAcre: ureaDose,
        dapKgPerAcre: dapDose,
        mopKgPerAcre: mopDose,
        organicCompostTons: compostDose,
        guidance: guidanceEn,
        guidanceMarathi: guidanceMr
      }
    };

    onSaveSoilReport(newRep);
    setIsAddMode(false);
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-150">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-purple-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
            <FlaskConical size={22} />
          </div>
          <div>
            <h2 className="font-bold text-base text-stone-900 leading-tight">
              {t.soilReportTitle}
            </h2>
            <p className="text-xs text-stone-500">
              {t.soilReportSubtitle}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddMode(!isAddMode)}
          className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
        >
          <Plus size={16} />
          <span>{isAddMode ? t.close : t.add}</span>
        </button>
      </div>

      {/* Add / Input Soil Test Form */}
      {isAddMode && (
        <form onSubmit={handleGenerateReport} className="bg-white rounded-3xl p-4 shadow-sm border-2 border-purple-400 space-y-3.5 text-xs animate-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-1 border-b border-stone-200">
            <span className="font-bold text-stone-800 text-xs">
              {language === 'mr' ? 'नवीन माती परीक्षण अहवाल प्रविष्ट करा' : 'Enter Lab Soil Test Parameters'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-medium text-stone-700 block mb-1">{language === 'mr' ? 'शेत / गट क्र.' : 'Field / Gat No.'}</label>
              <input
                type="text"
                value={form.sampleLocation}
                onChange={(e) => setForm({ ...form, sampleLocation: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-medium text-stone-700 block mb-1">{t.soilPH} (सामू)</label>
              <input
                type="number"
                step="0.1"
                value={form.ph}
                onChange={(e) => setForm({ ...form, ph: parseFloat(e.target.value) || 7.0 })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-medium text-stone-700 block mb-1">{t.soilNitrogen}</label>
              <input
                type="number"
                value={form.nitrogen}
                onChange={(e) => setForm({ ...form, nitrogen: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="font-medium text-stone-700 block mb-1">{t.soilPhosphorus}</label>
              <input
                type="number"
                value={form.phosphorus}
                onChange={(e) => setForm({ ...form, phosphorus: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="font-medium text-stone-700 block mb-1">{t.soilPotassium}</label>
              <input
                type="number"
                value={form.potassium}
                onChange={(e) => setForm({ ...form, potassium: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-medium text-stone-700 block mb-1">{t.organicCarbon}</label>
              <input
                type="number"
                step="0.05"
                value={form.organicCarbon}
                onChange={(e) => setForm({ ...form, organicCarbon: parseFloat(e.target.value) || 0.5 })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="font-medium text-stone-700 block mb-1">{t.electricalCond}</label>
              <input
                type="number"
                step="0.05"
                value={form.electricalConductivity}
                onChange={(e) => setForm({ ...form, electricalConductivity: parseFloat(e.target.value) || 0.4 })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5"
          >
            <Sparkles size={16} />
            <span>{t.generateSoilPlan}</span>
          </button>
        </form>
      )}

      {/* Active Soil Report Display */}
      {activeReport && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-200 space-y-4">
          
          <div className="flex items-start justify-between pb-3 border-b border-stone-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
                {language === 'mr' ? 'मृदा आरोग्य पत्रिका' : 'Soil Health Card'}
              </span>
              <h3 className="font-bold text-sm text-stone-900 mt-1.5">
                {activeReport.sampleLocation} ({activeReport.soilType})
              </h3>
              <p className="text-[11px] text-stone-500">{activeReport.date} • {activeReport.farmerName}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-stone-400 block">{language === 'mr' ? 'सुपीकता श्रेणी' : 'Fertility Rating'}</span>
              <span className="font-black text-sm text-purple-700 uppercase">
                {activeReport.fertilityRating}
              </span>
            </div>
          </div>

          {/* Nutrient Matrix Indicators */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
            <div className="p-2 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-[10px] text-stone-500 block">pH (सामू)</span>
              <span className="font-bold text-stone-800">{activeReport.ph}</span>
              <span className="text-[9px] text-emerald-700 block font-semibold">योग्य</span>
            </div>

            <div className="p-2 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-[10px] text-stone-500 block">नत्र (N)</span>
              <span className="font-bold text-stone-800">{activeReport.nitrogen}</span>
              <span className="text-[9px] text-rose-600 block font-semibold">कमी</span>
            </div>

            <div className="p-2 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-[10px] text-stone-500 block">स्फुरद (P)</span>
              <span className="font-bold text-stone-800">{activeReport.phosphorus}</span>
              <span className="text-[9px] text-amber-600 block font-semibold">मध्यम</span>
            </div>

            <div className="p-2 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-[10px] text-stone-500 block">पालाश (K)</span>
              <span className="font-bold text-stone-800">{activeReport.potassium}</span>
              <span className="text-[9px] text-emerald-700 block font-semibold">भरपूर</span>
            </div>

            <div className="p-2 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-[10px] text-stone-500 block">सेंद्रिय कर्ब (OC)</span>
              <span className="font-bold text-stone-800">{activeReport.organicCarbon}%</span>
              <span className="text-[9px] text-amber-600 block font-semibold">मध्यम</span>
            </div>

            <div className="p-2 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-[10px] text-stone-500 block">विद्युत वाहकता (EC)</span>
              <span className="font-bold text-stone-800">{activeReport.electricalConductivity}</span>
              <span className="text-[9px] text-emerald-700 block font-semibold">सामान्य</span>
            </div>
          </div>

          {/* Summary Box */}
          <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-2xl text-xs">
            <span className="font-bold text-purple-950 block mb-0.5">{t.soilHealthSummary}:</span>
            <p className="text-purple-900 leading-relaxed">
              {language === 'mr' ? activeReport.fertilitySummaryMarathi : activeReport.fertilitySummary}
            </p>
          </div>

          {/* Recommended Fertilizer Dosage Box */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-800">
              {t.recommendedFertilizerDose}
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-stone-200 shadow-xs">
                <span className="text-[10px] text-stone-500 block">{t.ureaKg}</span>
                <span className="font-black text-stone-800 text-sm">
                  {activeReport.fertilizerPlan.ureaKgPerAcre} kg / एकर
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-stone-200 shadow-xs">
                <span className="text-[10px] text-stone-500 block">{t.dapKg}</span>
                <span className="font-black text-stone-800 text-sm">
                  {activeReport.fertilizerPlan.dapKgPerAcre} kg / एकर
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-stone-200 shadow-xs">
                <span className="text-[10px] text-stone-500 block">{t.mopKg}</span>
                <span className="font-black text-stone-800 text-sm">
                  {activeReport.fertilizerPlan.mopKgPerAcre} kg / एकर
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-stone-200 shadow-xs">
                <span className="text-[10px] text-stone-500 block">{t.organicCompost}</span>
                <span className="font-black text-stone-800 text-sm">
                  {activeReport.fertilizerPlan.organicCompostTons} टन / एकर
                </span>
              </div>
            </div>

            <p className="text-stone-700 text-xs italic bg-white p-2.5 rounded-xl border border-stone-200">
              💡 {language === 'mr' ? activeReport.fertilizerPlan.guidanceMarathi : activeReport.fertilizerPlan.guidance}
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
