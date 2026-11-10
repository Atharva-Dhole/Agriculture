import React, { useState, useRef } from 'react';
import { 
  Bug, 
  Camera, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Bookmark, 
  Clock, 
  ChevronRight, 
  FlaskConical, 
  Leaf, 
  RefreshCw 
} from 'lucide-react';
import { DiseaseDiagnosisResult, Language } from '../types';
import { translations } from '../i18n/translations';

interface DiseaseDiagnosisScreenProps {
  language: Language;
  onSaveReport: (result: DiseaseDiagnosisResult) => void;
  savedReports: DiseaseDiagnosisResult[];
}

export const DiseaseDiagnosisScreen: React.FC<DiseaseDiagnosisScreenProps> = ({
  language,
  onSaveReport,
  savedReports
}) => {
  const t = translations[language];

  const [selectedCrop, setSelectedCrop] = useState('Soybean');
  const [plantPart, setPlantPart] = useState('Leaves');
  const [symptoms, setSymptoms] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiseaseDiagnosisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setErrorMessage(language === 'mr' ? 'फोटो १५ MB पेक्षा लहान असावा.' : 'Image size must be under 15 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = async () => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setIsSaved(false);

    try {
      const response = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: selectedCrop,
          plantParts: [plantPart],
          symptoms: symptoms,
          imageBase64: imagePreview,
          language: language
        })
      });

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        const fullResult: DiseaseDiagnosisResult = {
          ...resJson.data,
          cropName: selectedCrop,
          imageUrl: imagePreview || undefined,
          analyzedAt: new Date().toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN')
        };
        setDiagnosisResult(fullResult);
      } else {
        setErrorMessage(resJson.error || 'Diagnosis failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Diagnosis error:', err);
      setErrorMessage(language === 'mr' ? 'सर्व्हरशी संपर्क होऊ शकला नाही.' : 'Unable to connect to server.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (diagnosisResult) {
      onSaveReport(diagnosisResult);
      setIsSaved(true);
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-rose-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
            <Bug size={22} />
          </div>
          <div>
            <h2 className="font-bold text-base text-stone-900 leading-tight">
              {t.diseaseIdTitle}
            </h2>
            <p className="text-xs text-stone-500">
              {t.diseaseIdSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-stone-200 space-y-4 text-xs">
        
        {/* Crop Selection */}
        <div>
          <label className="font-bold text-stone-700 block mb-1.5">{t.selectCropForDiagnosis} *</label>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {['Soybean', 'Cotton', 'Onion', 'Tur', 'Gram', 'Sugarcane', 'Wheat', 'Tomato', 'Pomegranate'].map((crop) => (
              <button
                key={crop}
                type="button"
                onClick={() => setSelectedCrop(crop)}
                className={`px-3 py-1.5 rounded-xl border font-semibold whitespace-nowrap transition-colors ${
                  selectedCrop === crop
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {crop}
              </button>
            ))}
          </div>
        </div>

        {/* Affected Part */}
        <div>
          <label className="font-bold text-stone-700 block mb-1.5">{t.plantPartAffected} *</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
            {[
              { id: 'Leaves', label: t.partLeaf },
              { id: 'Stem', label: t.partStem },
              { id: 'Fruit', label: t.partFruit },
              { id: 'Flower', label: t.partFlower },
              { id: 'Roots', label: t.partRoot }
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlantPart(p.id)}
                className={`py-2 px-1 rounded-xl text-center border font-semibold transition-all ${
                  plantPart === p.id
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Photo Upload / Camera Area */}
        <div>
          <label className="font-bold text-stone-700 block mb-1.5">{t.uploadPlantPhoto}</label>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

          {imagePreview ? (
            <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 max-h-56 bg-stone-900">
              <img src={imagePreview} alt="Crop sample" className="w-full h-52 object-contain" />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 px-2.5 py-1 bg-black/70 text-white text-[10px] rounded-lg hover:bg-rose-600 font-semibold"
              >
                {language === 'mr' ? 'फोटो बदला' : 'Change Photo'}
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-6 border-2 border-dashed border-stone-300 hover:border-emerald-500 rounded-2xl bg-stone-50 text-center cursor-pointer transition-colors"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
                <Camera size={24} />
              </div>
              <p className="font-bold text-stone-800 text-xs">
                {t.takePhoto} / {t.chooseFromGallery}
              </p>
              <p className="text-[10px] text-stone-500 mt-1">
                {language === 'mr' ? 'पानावरील डाग किंवा किडीचा स्पष्ट फोटो काढा' : 'Capture clear image of infected leaves or stems'}
              </p>
            </div>
          )}
        </div>

        {/* Symptoms Description */}
        <div>
          <label className="font-medium text-stone-700 block mb-1">
            {t.describeSymptoms}
          </label>
          <textarea
            rows={2}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder={language === 'mr' ? 'उदा. पानांवर पिवळे ठिपके दिसत आहेत आणि वाढ खुंटली आहे.' : 'e.g. Yellowing of leaf margins and curling.'}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2">
            <AlertTriangle size={16} className="text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleDiagnose}
          disabled={isAnalyzing}
          className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 active:scale-98 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              <span>{t.diagnosingAI}</span>
            </>
          ) : (
            <>
              <Sparkles size={18} className="text-amber-300" />
              <span>{t.diagnoseNow}</span>
            </>
          )}
        </button>

      </div>

      {/* Diagnosis Results Card */}
      {diagnosisResult && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-md border-2 border-emerald-600 space-y-4 animate-in slide-in-from-bottom duration-200">
          
          <div className="flex items-start justify-between pb-3 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {t.possibleDisease}
                </span>
                <span className="text-[11px] text-stone-500 font-semibold">
                  {t.confidenceLevel}: {diagnosisResult.confidence}%
                </span>
              </div>
              <h3 className="text-lg font-black text-stone-900 mt-1">
                {language === 'mr' ? diagnosisResult.diseaseMarathi : diagnosisResult.disease}
              </h3>
              {diagnosisResult.pest && (
                <p className="text-xs text-stone-600 font-medium">
                  {language === 'mr' ? 'संबंधित कीड/बुरशी: ' : 'Organism: '} {diagnosisResult.pest}
                </p>
              )}
            </div>

            <button
              onClick={handleSave}
              className={`p-2 rounded-xl border flex items-center gap-1 text-xs font-bold transition-all ${
                isSaved 
                  ? 'bg-emerald-600 text-white border-emerald-600' 
                  : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
            >
              <Bookmark size={15} />
              <span>{isSaved ? t.success : t.save}</span>
            </button>
          </div>

          {/* Symptoms & Causes */}
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="font-bold text-stone-800 block mb-0.5">{t.observedSymptoms}:</span>
              <p className="text-stone-700 leading-relaxed">
                {language === 'mr' ? diagnosisResult.symptomsMarathi : diagnosisResult.symptoms}
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="font-bold text-stone-800 block mb-0.5">{t.possibleCauses}:</span>
              <p className="text-stone-700 leading-relaxed">
                {language === 'mr' ? diagnosisResult.causesMarathi : diagnosisResult.causes}
              </p>
            </div>
          </div>

          {/* Organic Remedies */}
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-900 font-bold mb-1">
              <Leaf size={16} className="text-emerald-700" />
              <span>{t.organicTreatment}</span>
            </div>
            <p className="text-emerald-950 font-medium leading-relaxed">
              {language === 'mr' ? diagnosisResult.organicRemedyMarathi : diagnosisResult.organicRemedy}
            </p>
          </div>

          {/* Chemical Recommendations */}
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs">
            <div className="flex items-center gap-1.5 text-amber-950 font-bold mb-1">
              <FlaskConical size={16} className="text-amber-800" />
              <span>{t.chemicalTreatment}</span>
            </div>
            <p className="text-stone-800 font-medium leading-relaxed">
              {language === 'mr' ? diagnosisResult.chemicalRemedyMarathi : diagnosisResult.chemicalRemedy}
            </p>
          </div>

          {/* Preventive & KVK Advice */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs flex items-start gap-2">
            <ShieldCheck size={18} className="text-blue-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-blue-950 block">{t.expertAdviceKVK}</span>
              <p className="text-blue-900 text-[11px] mt-0.5">
                {language === 'mr' ? diagnosisResult.kvkAdviceMarathi : diagnosisResult.kvkAdvice}
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Saved Reports Section */}
      {savedReports.length > 0 && (
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-stone-200 space-y-3">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-stone-500" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-700">
              {t.savedReports} ({savedReports.length})
            </h3>
          </div>

          <div className="space-y-2">
            {savedReports.slice(0, 4).map((rep, idx) => (
              <div
                key={idx}
                className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-bold text-stone-900">
                    {language === 'mr' ? rep.diseaseMarathi : rep.disease} ({rep.cropName})
                  </h4>
                  <p className="text-[10px] text-stone-500">{rep.analyzedAt} • {rep.confidence}% Confidence</p>
                </div>
                <span className="text-[11px] text-emerald-700 font-bold">✓ Saved</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
