import React from 'react';
import { 
  Sprout, 
  Sparkles, 
  Bug, 
  FlaskConical, 
  CloudSun, 
  IndianRupee, 
  Landmark, 
  BookOpenText, 
  AlertTriangle, 
  Mic, 
  Clock, 
  Droplets,
  ChevronRight 
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface ServicesScreenProps {
  language: Language;
  onNavigate: (screen: string) => void;
  onOpenVoice: () => void;
}

export const ServicesScreen: React.FC<ServicesScreenProps> = ({
  language,
  onNavigate,
  onOpenVoice
}) => {
  const t = translations[language];

  const services = [
    {
      id: 'disease',
      title: t.serviceDisease,
      desc: t.serviceDiseaseDesc,
      icon: Bug,
      color: 'bg-rose-50 text-rose-600 border-rose-200',
      tag: 'AI कॅमेरा'
    },
    {
      id: 'mandi',
      title: t.serviceMandi,
      desc: t.serviceMandiDesc,
      icon: IndianRupee,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      tag: 'MSAMB APMC'
    },
    {
      id: 'schemes',
      title: t.serviceSchemes,
      desc: t.serviceSchemesDesc,
      icon: Landmark,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      tag: 'अनुदान व DBT'
    },
    {
      id: 'recommendation',
      title: t.serviceRec,
      desc: t.serviceRecDesc,
      icon: Sparkles,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      tag: 'मातीनिहाय'
    },
    {
      id: 'soil',
      title: t.serviceSoil,
      desc: t.serviceSoilDesc,
      icon: FlaskConical,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      tag: 'खत मात्रा डोस'
    },
    {
      id: 'weather',
      title: t.serviceWeather,
      desc: t.serviceWeatherDesc,
      icon: CloudSun,
      color: 'bg-teal-50 text-teal-700 border-teal-200',
      tag: '७ दिवस पाऊस'
    },
    {
      id: 'crops',
      title: t.serviceCrops,
      desc: t.serviceCropsDesc,
      icon: Sprout,
      color: 'bg-green-50 text-green-700 border-green-200',
      tag: 'वाढ अवस्था'
    },
    {
      id: 'journey',
      title: t.serviceJourney,
      desc: t.serviceJourneyDesc,
      icon: BookOpenText,
      color: 'bg-stone-100 text-stone-800 border-stone-200',
      tag: 'जमा-खर्च वही'
    },
    {
      id: 'outbreaks',
      title: t.serviceOutbreak,
      desc: t.serviceOutbreakDesc,
      icon: AlertTriangle,
      color: 'bg-orange-50 text-orange-600 border-orange-200',
      tag: 'सावधानता'
    },
    {
      id: 'reminders',
      title: t.farmReminders,
      desc: language === 'mr' ? 'पाणी, फवारणी व खतांचे अचूक शेड्युल' : 'Timely reminders for irrigation and spraying',
      icon: Clock,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      tag: 'अलर्ट्स'
    }
  ];

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-emerald-100">
        <h2 className="font-bold text-base text-stone-900 leading-tight">
          {t.servicesTitle}
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          {language === 'mr' ? 'सर्व शेती तंत्रज्ञान व शासकीय सेवा एकाच ठिकाणी' : 'All agricultural technologies and government services in one place'}
        </p>
      </div>

      {/* Voice Assistant Featured Card */}
      <div
        onClick={onOpenVoice}
        className="bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-700 text-white rounded-3xl p-4.5 shadow-sm cursor-pointer hover:opacity-95 transition-all active:scale-[0.99] flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 text-stone-950 flex items-center justify-center font-bold text-xl border border-white/30 shadow-inner">
            <Mic size={24} className="text-white fill-white" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-black/20 text-white px-2 py-0.5 rounded-full">
              {language === 'mr' ? 'कृषी संवाद' : 'AI Voice Assistant'}
            </span>
            <h3 className="font-bold text-base mt-0.5">{t.serviceVoice}</h3>
            <p className="text-xs text-amber-100">{t.serviceVoiceDesc}</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-white" />
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((svc) => {
          const Icon = svc.icon;
          return (
            <div
              key={svc.id}
              onClick={() => onNavigate(svc.id)}
              className="bg-white p-3.5 rounded-3xl border border-stone-200/90 hover:border-emerald-300 shadow-xs hover:shadow-sm cursor-pointer transition-all active:scale-98 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${svc.color}`}>
                  <Icon size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xs text-stone-900 leading-snug">
                      {svc.title}
                    </h3>
                    {svc.tag && (
                      <span className="text-[9px] font-semibold bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded-md">
                        {svc.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                    {svc.desc}
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-stone-400 shrink-0 ml-2" />
            </div>
          );
        })}
      </div>

    </div>
  );
};
