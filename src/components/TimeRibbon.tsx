import React from 'react';
import { Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface TimeRibbonProps {
  selectedDate: string; // YYYY-MM-DD
  onDateSelect: (date: string) => void;
}

export const TimeRibbon: React.FC<TimeRibbonProps> = ({ selectedDate, onDateSelect }) => {
  // Generate next 10 days starting from 2026-06-14
  const startDate = new Date('2026-06-14');
  
  const dates = Array.from({ length: 10 }).map((_, index) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + index);
    
    // Formatting helper
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });

    return {
      dateStr,
      dayName,
      dayNum,
      monthName,
      isToday: index === 0,
    };
  });

  return (
    <div className="w-full bg-transparent py-4 overflow-hidden">
      <div className="w-full px-4 text-white">
        
        {/* Title Context Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-400" />
            <h2 className="text-xs font-black text-slate-300 uppercase tracking-widest font-mono">
              Schedule Chronology Feed
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-bold font-mono">
            TIMEZONE ACTIVE: <strong className="text-white">IST (UTC+5:30)</strong>
          </span>
        </div>

        {/* Horizontal scroll container with scrollbar hidden & touch active */}
        <div className="relative font-sans">
          <div className="flex gap-3 overflow-x-auto pb-1.5 scrollbar-none snap-x touch-pan-x">
            {dates.map((item) => {
              const isSelected = selectedDate === item.dateStr;
              return (
                <motion.button
                  key={item.dateStr}
                  onClick={() => onDateSelect(item.dateStr)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 w-20 py-2.5 rounded-2xl border transition-all duration-300 cursor-pointer snap-start flex flex-col items-center justify-center relative ${
                    isSelected
                      ? 'bg-[#007AFF] border-blue-400 text-white shadow-xl shadow-blue-500/20'
                      : 'bg-white/10 border-white/10 text-slate-300 hover:text-white hover:border-white/20 hover:bg-white/25'
                  }`}
                >
                  {/* Shared visual layout highlight for selected item */}
                  {isSelected && (
                    <motion.div
                      layoutId="activeScheduleHighlight"
                      className="absolute inset-0 bg-blue-600 rounded-2xl z-0 border border-blue-400 opacity-90"
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}

                  {/* Subtle Today Badge */}
                  {item.isToday && (
                    <span className={`absolute top-0.5 text-[8px] font-black uppercase tracking-wider z-10 ${
                      isSelected ? 'text-white' : 'text-blue-300'
                    }`}>
                      Today
                    </span>
                  )}
                  
                  <span className={`text-[9px] font-black uppercase tracking-wider z-10 ${item.isToday ? 'mt-1' : ''}`}>
                    {item.dayName}
                  </span>
                  <span className={`text-xl font-black font-sans leading-none my-0.5 tracking-tight z-10 text-white`}>
                    {item.dayNum}
                  </span>
                  <span className="text-[8px] font-mono tracking-widest uppercase text-slate-400 z-10">
                    {item.monthName}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
