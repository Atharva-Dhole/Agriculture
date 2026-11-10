import React, { useState } from 'react';
import { 
  IndianRupee, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  MapPin, 
  Layers, 
  Calendar 
} from 'lucide-react';
import { MandiPriceItem, Language } from '../types';
import { translations } from '../i18n/translations';
import { mandiService } from '../services/mandiService';

interface MandiPricesScreenProps {
  language: Language;
}

export const MandiPricesScreen: React.FC<MandiPricesScreenProps> = ({
  language
}) => {
  const t = translations[language];

  const [prices, setPrices] = useState<MandiPriceItem[]>(mandiService.getPrices());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const cropList = mandiService.getCropList();
  const districtList = mandiService.getDistrictList();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setPrices(mandiService.getPrices());
      setIsRefreshing(false);
    }, 600);
  };

  const filteredPrices = prices.filter((item) => {
    const matchesSearch = 
      item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cropMarathi.includes(searchQuery) ||
      item.market.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCrop = selectedCrop === 'all' || item.crop === selectedCrop;
    const matchesDistrict = selectedDistrict === 'all' || item.district === selectedDistrict;

    return matchesSearch && matchesCrop && matchesDistrict;
  });

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-150">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-amber-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
            <IndianRupee size={22} />
          </div>
          <div>
            <h2 className="font-bold text-base text-stone-900 leading-tight">
              {t.mandiTitle}
            </h2>
            <p className="text-xs text-stone-500">
              {t.mandiSubtitle}
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2.5 text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all disabled:opacity-50 active:scale-95 flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
          <span>{t.refresh}</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-stone-200 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'mr' ? 'पीक किंवा बाजार समिती शोधा (उदा. कांदा, लासलगाव, सोयाबीन)...' : 'Search by crop or APMC market...'}
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        {/* Crop Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCrop('all')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold border transition-all ${
              selectedCrop === 'all'
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
          >
            {t.all}
          </button>
          {cropList.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCrop(c)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold border transition-all ${
                selectedCrop === c
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {c.split('(')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Prices List */}
      <div className="space-y-3">
        {filteredPrices.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-4 border border-stone-200/90 shadow-xs hover:border-amber-300 transition-colors"
          >
            <div className="flex items-start justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                  {item.market}
                </span>
                <h3 className="font-bold text-sm text-stone-900 mt-1 leading-snug">
                  {language === 'mr' ? item.cropMarathi : item.crop}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                  <MapPin size={12} className="text-stone-400" />
                  <span>{item.district}</span>
                  <span>•</span>
                  <span>{item.updatedDate}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-stone-400 block">{t.modalPrice}</span>
                <div className="text-lg font-black text-emerald-800 tracking-tight">
                  ₹{item.modalPrice.toLocaleString('en-IN')}
                </div>
                <div className={`text-[11px] font-bold flex items-center justify-end gap-0.5 ${
                  item.priceChange >= 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}>
                  {item.priceChange >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  <span>{item.priceChange >= 0 ? `+₹${item.priceChange}` : `-₹${Math.abs(item.priceChange)}`}</span>
                </div>
              </div>
            </div>

            {/* Min - Max & Arrival info */}
            <div className="grid grid-cols-3 gap-2 pt-3 text-center text-xs">
              <div className="p-2 bg-stone-50 rounded-xl">
                <span className="text-[10px] text-stone-400 block">{t.minPrice}</span>
                <span className="font-bold text-stone-700">₹{item.minPrice}</span>
              </div>

              <div className="p-2 bg-stone-50 rounded-xl">
                <span className="text-[10px] text-stone-400 block">{t.maxPrice}</span>
                <span className="font-bold text-stone-700">₹{item.maxPrice}</span>
              </div>

              <div className="p-2 bg-stone-50 rounded-xl">
                <span className="text-[10px] text-stone-400 block">{t.arrivalQty}</span>
                <span className="font-bold text-stone-700 font-mono">{item.arrivalQuantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
