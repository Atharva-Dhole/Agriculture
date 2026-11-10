import React, { useState } from 'react';
import { 
  Clock, 
  Plus, 
  CheckCircle2, 
  Trash2, 
  Bell, 
  Droplets, 
  Bug, 
  FlaskConical, 
  Calendar, 
  X 
} from 'lucide-react';
import { SmartReminder, Language } from '../types';
import { translations } from '../i18n/translations';

interface RemindersScreenProps {
  reminders: SmartReminder[];
  language: Language;
  onAddReminder: (rem: Omit<SmartReminder, 'id'>) => void;
  onToggleReminder: (id: string) => void;
  onDeleteReminder: (id: string) => void;
}

export const RemindersScreen: React.FC<RemindersScreenProps> = ({
  reminders,
  language,
  onAddReminder,
  onToggleReminder,
  onDeleteReminder
}) => {
  const t = translations[language];

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    titleMarathi: '',
    cropName: 'सोयाबीन (JS 335)',
    category: 'irrigation' as SmartReminder['category'],
    dateTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    notes: ''
  });

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleMarathi && !formData.title) return;

    onAddReminder({
      title: formData.title || formData.titleMarathi,
      titleMarathi: formData.titleMarathi || formData.title,
      cropName: formData.cropName,
      category: formData.category,
      dateTime: formData.dateTime,
      completed: false,
      notes: formData.notes
    });

    setIsAddModalOpen(false);
    setFormData({
      title: '',
      titleMarathi: '',
      cropName: 'सोयाबीन (JS 335)',
      category: 'irrigation',
      dateTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      notes: ''
    });

    // Request notification permission if not yet requested
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const getCategoryIcon = (cat: SmartReminder['category']) => {
    switch (cat) {
      case 'irrigation': return <Droplets size={16} className="text-blue-600" />;
      case 'pesticide': return <Bug size={16} className="text-rose-600" />;
      case 'fertilizer': return <FlaskConical size={16} className="text-amber-600" />;
      default: return <Clock size={16} className="text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-150">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-emerald-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
            <Bell size={22} />
          </div>
          <div>
            <h2 className="font-bold text-base text-stone-900 leading-tight">
              {t.remindersTitle}
            </h2>
            <p className="text-xs text-stone-500">
              {reminders.filter(r => !r.completed).length} {language === 'mr' ? 'प्रलंबित कामे' : 'pending farming tasks'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
        >
          <Plus size={16} />
          <span>{t.addReminderBtn}</span>
        </button>
      </div>

      {/* Reminders List */}
      <div className="space-y-2.5">
        {reminders.map((rem) => (
          <div
            key={rem.id}
            className={`p-4 rounded-3xl border transition-all flex items-start justify-between gap-3 ${
              rem.completed
                ? 'bg-stone-50 border-stone-200 opacity-60'
                : 'bg-white border-stone-200/90 shadow-xs hover:border-emerald-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => onToggleReminder(rem.id)}
                className="mt-1 text-stone-400 hover:text-emerald-600 transition-colors"
              >
                {rem.completed ? (
                  <CheckCircle2 size={20} className="text-emerald-600" />
                ) : (
                  <div className="w-5 h-5 rounded-lg border-2 border-stone-300 hover:border-emerald-600"></div>
                )}
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-stone-100">
                    {getCategoryIcon(rem.category)}
                  </span>
                  <h4 className={`text-xs font-bold leading-snug ${rem.completed ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                    {language === 'mr' ? rem.titleMarathi : rem.title}
                  </h4>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-500 mt-1">
                  {rem.cropName && (
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      🌱 {rem.cropName}
                    </span>
                  )}
                  <div className="flex items-center gap-1 font-mono">
                    <Calendar size={12} className="text-stone-400" />
                    <span>{rem.dateTime.replace('T', ' ')}</span>
                  </div>
                </div>

                {rem.notes && (
                  <p className="text-[11px] text-stone-600 mt-1 italic">
                    💡 {rem.notes}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => onDeleteReminder(rem.id)}
              className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
              title={t.delete}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Add Reminder Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-emerald-800 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Bell size={18} />
                <span>{t.addReminderBtn}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 hover:bg-emerald-700 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="p-4 overflow-y-auto space-y-3 text-xs">
              <div>
                <label className="font-medium text-stone-700 block mb-1">{t.reminderTitle} *</label>
                <input
                  type="text"
                  required
                  value={formData.titleMarathi}
                  onChange={(e) => setFormData({ ...formData, titleMarathi: e.target.value, title: e.target.value })}
                  placeholder="उदा. ठिबक सिंचनाने पाणी सोडणे"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">{t.reminderCategory}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="irrigation">{t.activityIrrigation}</option>
                    <option value="fertilizer">{t.activityFertilizer}</option>
                    <option value="pesticide">{t.activityPesticide}</option>
                    <option value="sowing">{t.activitySowing}</option>
                    <option value="harvesting">{t.activityHarvesting}</option>
                    <option value="scheme">योजना मुदत</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">{t.cropName}</label>
                  <input
                    type="text"
                    value={formData.cropName}
                    onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">{t.reminderDate} *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.dateTime}
                  onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">{t.cropNotes}</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="उदा. मोटर सकाळी ७ वाजता चालू करणे"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
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
