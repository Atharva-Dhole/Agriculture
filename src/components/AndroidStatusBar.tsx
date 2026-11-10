import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery } from 'lucide-react';

export const AndroidStatusBar: React.FC = () => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-emerald-950 text-emerald-100 text-xs px-4 py-1.5 flex items-center justify-between font-mono select-none border-b border-emerald-900/50">
      <div className="font-semibold tracking-wider text-[11px]">{timeStr || '09:30'}</div>
      <div className="flex items-center gap-2 text-emerald-200">
        <span className="text-[10px] font-sans font-medium tracking-tight bg-emerald-900/80 px-1 rounded text-emerald-300">4G LTE</span>
        <Wifi size={13} className="text-emerald-300" />
        <Signal size={13} className="text-emerald-300" />
        <div className="flex items-center gap-0.5">
          <span className="text-[10px]">96%</span>
          <Battery size={14} className="text-emerald-300 fill-emerald-400" />
        </div>
      </div>
    </div>
  );
};
