import React, { useState } from 'react';
import { 
  Sprout, 
  Plus, 
  Calendar, 
  Droplets, 
  Layers, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  AlertCircle, 
  ChevronRight, 
  Clock, 
  Sparkles,
  Info
} from 'lucide-react';
import { Crop, CropGrowthStage, Language } from '../types';
import { translations } from '../i18n/translations';

interface CropsScreenProps {
  crops: Crop[];
  language: Language;
  onAddCrop: (crop: Omit<Crop, 'id' | 'createdAt'>) => void;
  onUpdateCrop: (id: string, updates: Partial<Crop>) => void;
  onDeleteCrop: (id: string) => void;
}

const POPULAR_CROPS_MAHARASHTRA = [
  { name: 'Soybean', nameMr: 'सोयाबीन', variety: 'JS 335 / फुले किमया', days: 100 },
  { name: 'Cotton', nameMr: 'कापूस / कपाशी', variety: 'राशी ६५९ (Bt Cotton)', days: 160 },
  { name: 'Onion', nameMr: 'कांदा', variety: 'फुले समर्थ / ॲग्रीफाउंड डार्क रेड', days: 120 },
  { name: 'Tur (Pigeon Pea)', nameMr: 'तूर', variety: 'बीडीएन ७११ / बीएसएमआर ७३६', days: 150 },
  { name: 'Gram (Chickpea)', nameMr: 'हरभरा', variety: 'दिग्विजय / फुले विक्रम', days: 105 },
  { name: 'Sugarcane', nameMr: 'ऊस', variety: 'को ८६०३२', days: 360 },
  { name: 'Wheat', nameMr: 'गहू', variety: 'लोकवान / फुले समाधान', days: 110 },
  { name: 'Tomato', nameMr: 'टोमॅटो', variety: 'अभिनव / यूएस १५०५', days: 90 },
  { name: 'Pomegranate', nameMr: 'डाळिंब', variety: 'भगवा', days: 180 },
  { name: 'Maize', nameMr: 'मका', variety: 'पायोनियर हायब्रिड', days: 95 }
];

export const CropsScreen: React.FC<CropsScreenProps> = ({
  crops,
  language,
  onAddCrop,
  onUpdateCrop,
  onDeleteCrop
}) => {
  const t = translations[language];
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(crops[0] || null);

  // Form State
  const [formData, setFormData] = useState({
    name: 'सोयाबीन (Soybean)',
    nameMarathi: 'सोयाबीन',
    variety: 'JS 335',
    sowingDate: new Date().toISOString().split('T')[0],
    landArea: 2.0,
    landUnit: 'acre' as const,
    soilType: 'काळी कसदार (Black Cotton)',
    irrigationType: 'ठिबक सिंचन (Drip)',
    expectedHarvestDate: '',
    stage: 'vegetative' as CropGrowthStage,
    healthStatus: 'healthy' as const,
    notes: '',
    photoUrl: 'https://images.unsplash.com/photo-1599818816934-2e924b80b080?auto=format&fit=crop&q=80&w=400'
  });

  const handleSelectPreset = (preset: typeof POPULAR_CROPS_MAHARASHTRA[0]) => {
    const sowing = new Date();
    const harvest = new Date();
    harvest.setDate(sowing.getDate() + preset.days);

    setFormData({
      ...formData,
      name: preset.name,
      nameMarathi: preset.nameMr,
      variety: preset.variety,
      expectedHarvestDate: harvest.toISOString().split('T')[0]
    });
  };

  const handleCreateCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameMarathi) return;

    onAddCrop({
      name: formData.name,
      nameMarathi: formData.nameMarathi,
      variety: formData.variety,
      sowingDate: formData.sowingDate,
      landArea: Number(formData.landArea) || 1,
      landUnit: formData.landUnit,
      soilType: formData.soilType,
      irrigationType: formData.irrigationType,
      expectedHarvestDate: formData.expectedHarvestDate || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      stage: formData.stage,
      healthStatus: formData.healthStatus,
      notes: formData.notes,
      photoUrl: formData.photoUrl
    });

    setIsAddModalOpen(false);
  };

  const getStageName = (stage: CropGrowthStage) => {
    switch (stage) {
      case 'germination': return t.stageGermination;
      case 'vegetative': return t.stageVegetative;
      case 'flowering': return t.stageFlowering;
      case 'pod_formation': return t.stagePodFormation;
      case 'maturity': return t.stageMaturity;
      case 'harvested': return t.stageHarvested;
      default: return stage;
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-150">
      
      {/* Top action bar */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-emerald-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
            <Sprout size={22} />
          </div>
          <div>
            <h2 className="font-bold text-base text-stone-900 leading-tight">
              {t.myCropsTitle}
            </h2>
            <p className="text-xs text-stone-500">
              {crops.length} {language === 'mr' ? 'सक्रिय पिके नोंदणीकृत' : 'Active Registered Crops'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
        >
          <Plus size={16} />
          <span>{t.addNewCropBtn}</span>
        </button>
      </div>

      {/* Horizontal Crop Selector Pills */}
      {crops.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {crops.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCrop(c)}
              className={`px-3.5 py-2 rounded-2xl flex items-center gap-2 border text-xs whitespace-nowrap transition-all ${
                selectedCrop?.id === c.id
                  ? 'bg-emerald-700 text-white border-emerald-700 font-bold shadow-sm'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-300'
              }`}
            >
              <span>🌱</span>
              <span>{language === 'mr' ? c.nameMarathi : c.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Selected Crop Detailed View */}
      {selectedCrop ? (
        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
          {/* Banner Photo */}
          <div className="h-44 sm:h-52 relative bg-stone-900">
            <img
              src={selectedCrop.photoUrl || "https://images.unsplash.com/photo-1599818816934-2e924b80b080?auto=format&fit=crop&q=80&w=800"}
              alt={selectedCrop.name}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent"></div>

            <div className="absolute bottom-3 left-4 right-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-600/90 text-white px-2 py-0.5 rounded-full">
                    {selectedCrop.variety || 'सुधारित वाण'}
                  </span>
                  <h3 className="text-xl font-bold mt-1">
                    {language === 'mr' ? selectedCrop.nameMarathi : selectedCrop.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      if (window.confirm(t.deleteCropConfirm)) {
                        onDeleteCrop(selectedCrop.id);
                        setSelectedCrop(crops.find(c => c.id !== selectedCrop.id) || null);
                      }
                    }}
                    className="p-2 bg-black/50 hover:bg-rose-600 text-white rounded-full transition-colors"
                    title={t.delete}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Details Content */}
          <div className="p-4 space-y-4">
            
            {/* Growth Stage Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-700">{t.growthStage}</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {getStageName(selectedCrop.stage)}
                </span>
              </div>

              {/* Stage buttons for quick update */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-[10px]">
                {(['germination', 'vegetative', 'flowering', 'pod_formation', 'maturity', 'harvested'] as CropGrowthStage[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => onUpdateCrop(selectedCrop.id, { stage: st })}
                    className={`py-1.5 px-1 rounded-xl text-center border font-semibold transition-all ${
                      selectedCrop.stage === st
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {st === 'germination' && '१. उगवण'}
                    {st === 'vegetative' && '२. वाढ'}
                    {st === 'flowering' && '३. फुले'}
                    {st === 'pod_formation' && '४. शेंगा/फळ'}
                    {st === 'maturity' && '५. पक्वता'}
                    {st === 'harvested' && '६. काढणी'}
                  </button>
                ))}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
                <span className="text-[10px] text-stone-500 block mb-0.5">{t.totalLand}</span>
                <span className="font-bold text-stone-800 text-sm">
                  {selectedCrop.landArea} {t[selectedCrop.landUnit] || selectedCrop.landUnit}
                </span>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
                <span className="text-[10px] text-stone-500 block mb-0.5">{t.sowingDate}</span>
                <span className="font-bold text-stone-800 text-sm font-mono">{selectedCrop.sowingDate}</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
                <span className="text-[10px] text-stone-500 block mb-0.5">{t.irrigationFacility}</span>
                <span className="font-bold text-stone-800">{selectedCrop.irrigationType}</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
                <span className="text-[10px] text-stone-500 block mb-0.5">{t.expectedHarvest}</span>
                <span className="font-bold text-stone-800 text-sm font-mono">{selectedCrop.expectedHarvestDate}</span>
              </div>
            </div>

            {/* Field Notes & Guidance */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-2xl">
              <h4 className="font-bold text-xs text-emerald-900 mb-1 flex items-center gap-1.5">
                <Info size={14} />
                <span>{t.cropNotes}</span>
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed">
                {selectedCrop.notes || (language === 'mr' ? 'पिकाची वाढ उत्तम स्थितीत आहे. दर आठवड्याला कीड व रोग तपासणी करा.' : 'Crop growth is healthy. Inspect weekly for pests and fungal spots.')}
              </p>
            </div>

          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-stone-300 p-6">
          <Sprout size={36} className="text-stone-300 mx-auto mb-2" />
          <h3 className="font-bold text-stone-700 text-sm">{t.noCropsYet}</h3>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
          >
            {t.addNewCropBtn}
          </button>
        </div>
      )}

      {/* Add Crop Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-emerald-800 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Sprout size={18} />
                <span>{t.addCropTitle}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 hover:bg-emerald-700 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCrop} className="p-4 overflow-y-auto space-y-3.5 text-xs">
              
              {/* Popular Presets */}
              <div>
                <label className="font-bold text-stone-700 block mb-1.5">
                  {language === 'mr' ? 'महाराष्ट्रातील लोकप्रिय पिके (द्रुत निवड)' : 'Popular Crop Presets (Quick Select)'}
                </label>
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {POPULAR_CROPS_MAHARASHTRA.map((p) => (
                    <button
                      type="button"
                      key={p.name}
                      onClick={() => handleSelectPreset(p)}
                      className="px-2.5 py-1 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 rounded-xl border border-stone-200 whitespace-nowrap text-[11px] font-medium"
                    >
                      {p.nameMr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">{t.cropName} *</label>
                  <input
                    type="text"
                    required
                    value={formData.nameMarathi}
                    onChange={(e) => setFormData({ ...formData, nameMarathi: e.target.value, name: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-stone-700 block mb-1">{t.variety}</label>
                  <input
                    type="text"
                    value={formData.variety}
                    onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
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
                    onChange={(e) => setFormData({ ...formData, landArea: parseFloat(e.target.value) || 1 })}
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
                  <label className="font-medium text-stone-700 block mb-1">{t.sowingDate}</label>
                  <input
                    type="date"
                    value={formData.sowingDate}
                    onChange={(e) => setFormData({ ...formData, sowingDate: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-stone-700 block mb-1">{t.expectedHarvest}</label>
                  <input
                    type="date"
                    value={formData.expectedHarvestDate}
                    onChange={(e) => setFormData({ ...formData, expectedHarvestDate: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">{t.soilType}</label>
                  <input
                    type="text"
                    value={formData.soilType}
                    onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-stone-700 block mb-1">{t.irrigationFacility}</label>
                  <input
                    type="text"
                    value={formData.irrigationType}
                    onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">{t.cropNotes}</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={language === 'mr' ? 'उदा. पेरणीवेळी डीएपी खताची मात्रा दिली.' : 'e.g. Applied basal fertilizer dose.'}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-semibold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm"
                >
                  {t.save}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
