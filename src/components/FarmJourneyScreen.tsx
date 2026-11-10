import React, { useState } from 'react';
import { 
  BookOpenText, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  IndianRupee, 
  Tag, 
  Filter, 
  X 
} from 'lucide-react';
import { FarmActivity, FarmActivityType, Language } from '../types';
import { translations } from '../i18n/translations';

interface FarmJourneyScreenProps {
  activities: FarmActivity[];
  crops: { name: string; nameMarathi: string }[];
  language: Language;
  onAddActivity: (act: Omit<FarmActivity, 'id'>) => void;
  onDeleteActivity: (id: string) => void;
}

export const FarmJourneyScreen: React.FC<FarmJourneyScreenProps> = ({
  activities,
  crops,
  language,
  onAddActivity,
  onDeleteActivity
}) => {
  const t = translations[language];

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const [formData, setFormData] = useState({
    cropName: crops[0]?.nameMarathi || 'सोयाबीन (JS 335)',
    activityType: 'fertilizer' as FarmActivityType,
    date: new Date().toISOString().split('T')[0],
    description: '',
    cost: 0,
    income: 0
  });

  // Calculate totals
  const totalCost = activities.reduce((sum, item) => sum + (item.cost || 0), 0);
  const totalIncome = activities.reduce((sum, item) => sum + (item.income || 0), 0);
  const netBalance = totalIncome - totalCost;

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description) return;

    onAddActivity({
      cropName: formData.cropName,
      activityType: formData.activityType,
      date: formData.date,
      description: formData.description,
      cost: Number(formData.cost) || 0,
      income: Number(formData.income) || 0
    });

    setIsAddModalOpen(false);
    setFormData({
      cropName: crops[0]?.nameMarathi || 'सोयाबीन (JS 335)',
      activityType: 'fertilizer',
      date: new Date().toISOString().split('T')[0],
      description: '',
      cost: 0,
      income: 0
    });
  };

  const getActivityTypeName = (type: FarmActivityType) => {
    switch (type) {
      case 'preparation': return t.activityPreparation;
      case 'seed_purchase': return t.activitySeedPurchase;
      case 'sowing': return t.activitySowing;
      case 'irrigation': return t.activityIrrigation;
      case 'fertilizer': return t.activityFertilizer;
      case 'pesticide': return t.activityPesticide;
      case 'inspection': return t.activityInspection;
      case 'harvesting': return t.activityHarvesting;
      case 'sale': return t.activitySale;
      default: return t.activityOther;
    }
  };

  const filteredActivities = activities.filter((act) => {
    if (filterType === 'all') return true;
    if (filterType === 'expense') return act.cost > 0;
    if (filterType === 'income') return act.income > 0;
    return act.activityType === filterType;
  });

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-150">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-emerald-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
            <BookOpenText size={22} />
          </div>
          <div>
            <h2 className="font-bold text-base text-stone-900 leading-tight">
              {t.farmJourneyTitle}
            </h2>
            <p className="text-xs text-stone-500">
              {t.farmJourneySubtitle}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
        >
          <Plus size={16} />
          <span>{t.addActivityBtn}</span>
        </button>
      </div>

      {/* Financial Summary Card */}
      <div className="bg-stone-900 text-white rounded-3xl p-5 shadow-md">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
          {t.financialSummaryTitle}
        </h3>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 bg-stone-800/80 rounded-2xl border border-stone-700/60">
            <span className="text-[10px] text-stone-400 block mb-0.5">{t.totalExpenses}</span>
            <span className="text-sm sm:text-base font-black text-rose-400">
              ₹{totalCost.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-2.5 bg-stone-800/80 rounded-2xl border border-stone-700/60">
            <span className="text-[10px] text-stone-400 block mb-0.5">{t.totalIncome}</span>
            <span className="text-sm sm:text-base font-black text-emerald-400">
              ₹{totalIncome.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-2.5 bg-stone-800/80 rounded-2xl border border-stone-700/60">
            <span className="text-[10px] text-stone-400 block mb-0.5">{t.netProfit}</span>
            <span className={`text-sm sm:text-base font-black ${netBalance >= 0 ? 'text-amber-300' : 'text-rose-400'}`}>
              ₹{netBalance.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {[
          { id: 'all', label: t.all },
          { id: 'expense', label: 'केवळ खर्च' },
          { id: 'income', label: 'केवळ उत्पन्न/विक्री' },
          { id: 'fertilizer', label: 'खते' },
          { id: 'pesticide', label: 'फवारणी' },
          { id: 'sowing', label: 'पेरणी' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold border transition-all ${
              filterType === f.id
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Activities Timeline */}
      <div className="space-y-2.5">
        {filteredActivities.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-stone-300">
            <p className="text-xs text-stone-500 mb-2">{t.noActivitiesYet}</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
            >
              {t.addActivityBtn}
            </button>
          </div>
        ) : (
          filteredActivities.map((act) => (
            <div
              key={act.id}
              className="bg-white p-3.5 rounded-2xl border border-stone-200/90 shadow-xs hover:border-emerald-300 transition-colors flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                  act.income > 0 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-stone-100 text-stone-700'
                }`}>
                  {act.income > 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 leading-snug">
                      {getActivityTypeName(act.activityType)}
                    </span>
                    {act.cropName && (
                      <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-medium">
                        {act.cropName}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-600 mt-0.5">{act.description}</p>
                  <span className="text-[10px] text-stone-400 font-mono mt-0.5 block">{act.date}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                {act.cost > 0 && (
                  <span className="text-rose-600 font-bold block text-sm">
                    -₹{act.cost.toLocaleString('en-IN')}
                  </span>
                )}
                {act.income > 0 && (
                  <span className="text-emerald-700 font-bold block text-sm">
                    +₹{act.income.toLocaleString('en-IN')}
                  </span>
                )}
                <button
                  onClick={() => onDeleteActivity(act.id)}
                  className="p-1 text-stone-400 hover:text-rose-600 transition-colors mt-1"
                  title={t.delete}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Farm Activity Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-emerald-800 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <BookOpenText size={18} />
                <span>{t.addActivityBtn}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 hover:bg-emerald-700 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="p-4 overflow-y-auto space-y-3 text-xs">
              
              <div>
                <label className="font-medium text-stone-700 block mb-1">{t.activityType} *</label>
                <select
                  value={formData.activityType}
                  onChange={(e) => setFormData({ ...formData, activityType: e.target.value as any })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="fertilizer">{t.activityFertilizer}</option>
                  <option value="pesticide">{t.activityPesticide}</option>
                  <option value="sowing">{t.activitySowing}</option>
                  <option value="irrigation">{t.activityIrrigation}</option>
                  <option value="seed_purchase">{t.activitySeedPurchase}</option>
                  <option value="preparation">{t.activityPreparation}</option>
                  <option value="inspection">{t.activityInspection}</option>
                  <option value="harvesting">{t.activityHarvesting}</option>
                  <option value="sale">{t.activitySale}</option>
                  <option value="other">{t.activityOther}</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">{t.cropName}</label>
                <input
                  type="text"
                  value={formData.cropName}
                  onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                  placeholder="उदा. सोयाबीन, कापूस"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">{t.date} *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">{t.amountSpent}</label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="font-medium text-stone-700 block mb-1">{t.amountEarned}</label>
                  <input
                    type="number"
                    value={formData.income}
                    onChange={(e) => setFormData({ ...formData, income: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">{t.activityDescription} *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="उदा. २ पोती डीएपी व मजुरी खर्च"
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
