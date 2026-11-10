import React, { useState } from 'react';
import { 
  Landmark, 
  Search, 
  ExternalLink, 
  Bookmark, 
  CheckCircle2, 
  FileText, 
  Layers, 
  ShieldCheck, 
  IndianRupee, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { GovtScheme, Language } from '../types';
import { translations } from '../i18n/translations';

interface GovernmentSchemesScreenProps {
  schemes: GovtScheme[];
  language: Language;
  onUpdateSchemeStatus: (id: string, status: 'interested' | 'applied' | 'none') => void;
}

export const GovernmentSchemesScreen: React.FC<GovernmentSchemesScreenProps> = ({
  schemes,
  language,
  onUpdateSchemeStatus
}) => {
  const t = translations[language];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>(schemes[0]?.id || null);

  const categories = [
    { id: 'all', label: t.schemeCategoryAll },
    { id: 'financial', label: t.schemeCategoryFinancial },
    { id: 'insurance', label: t.schemeCategoryInsurance },
    { id: 'irrigation', label: t.schemeCategoryIrrigation },
    { id: 'finance', label: 'पीक कर्ज (KCC)' },
    { id: 'soil', label: t.schemeCategorySoil }
  ];

  const filteredSchemes = schemes.filter((s) => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nameMarathi.includes(searchQuery) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.descriptionMarathi.includes(searchQuery);

    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-blue-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
            <Landmark size={22} />
          </div>
          <div>
            <h2 className="font-bold text-base text-stone-900 leading-tight">
              {t.schemesTitle}
            </h2>
            <p className="text-xs text-stone-500">
              {t.schemesSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-stone-200 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'mr' ? 'योजनेचे नाव किंवा लाभ शोधा (उदा. नमो शेतकरी, विमा, ठिबक)...' : 'Search schemes by keyword...'}
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold border transition-all ${
                selectedCategory === c.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes List */}
      <div className="space-y-3">
        {filteredSchemes.map((scheme) => {
          const isExpanded = expandedSchemeId === scheme.id;
          return (
            <div
              key={scheme.id}
              className={`bg-white rounded-3xl border transition-all overflow-hidden ${
                isExpanded ? 'border-blue-400 shadow-md ring-1 ring-blue-100' : 'border-stone-200 shadow-xs'
              }`}
            >
              {/* Card Summary Header */}
              <div
                onClick={() => setExpandedSchemeId(isExpanded ? null : scheme.id)}
                className="p-4 cursor-pointer hover:bg-stone-50/60 transition-colors flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                      {scheme.department}
                    </span>
                    {scheme.status === 'applied' && (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={11} />
                        <span>{t.markedApplied}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-stone-900 mt-1.5 leading-snug">
                    {language === 'mr' ? scheme.nameMarathi : scheme.name}
                  </h3>

                  <p className="text-xs text-emerald-700 font-bold mt-1 flex items-center gap-1">
                    <IndianRupee size={13} />
                    <span>{language === 'mr' ? scheme.benefitsMarathi : scheme.benefits}</span>
                  </p>
                </div>

                <div className="p-1 rounded-full text-stone-400">
                  <ChevronRight size={18} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 space-y-3.5 border-t border-stone-100 text-xs">
                  
                  {/* Description */}
                  <p className="text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-2xl">
                    {language === 'mr' ? scheme.descriptionMarathi : scheme.description}
                  </p>

                  {/* Eligibility */}
                  <div>
                    <h4 className="font-bold text-stone-800 mb-1.5 flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-blue-600" />
                      <span>{t.schemeEligibility}</span>
                    </h4>
                    <ul className="space-y-1 text-stone-600 pl-2">
                      {(language === 'mr' ? scheme.eligibilityMarathi : scheme.eligibility).map((el, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>{el}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Required Documents */}
                  <div>
                    <h4 className="font-bold text-stone-800 mb-1.5 flex items-center gap-1.5">
                      <FileText size={14} className="text-blue-600" />
                      <span>{t.schemeDocuments}</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(language === 'mr' ? scheme.requiredDocumentsMarathi : scheme.requiredDocuments).map((doc, i) => (
                        <span key={i} className="bg-stone-100 text-stone-700 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-stone-200">
                          📄 {doc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-stone-200">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateSchemeStatus(scheme.id, scheme.status === 'applied' ? 'none' : 'applied')}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                          scheme.status === 'applied'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-100 hover:bg-emerald-50 text-stone-700'
                        }`}
                      >
                        <CheckCircle2 size={14} />
                        <span>{scheme.status === 'applied' ? t.markedApplied : t.markedApplied}</span>
                      </button>

                      <button
                        onClick={() => onUpdateSchemeStatus(scheme.id, scheme.status === 'interested' ? 'none' : 'interested')}
                        className={`p-2 rounded-xl border text-stone-600 transition-colors ${
                          scheme.status === 'interested' ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-stone-50 border-stone-200'
                        }`}
                        title={t.saveAsInterested}
                      >
                        <Bookmark size={15} />
                      </button>
                    </div>

                    <a
                      href={scheme.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <span>{t.visitOfficialPortal}</span>
                      <ExternalLink size={13} />
                    </a>
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
