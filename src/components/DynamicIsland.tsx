import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Wallet, AlertCircle, Info, Calendar, Trophy, Zap, ShieldCheck } from 'lucide-react';

export type IslandState = 'idle' | 'success' | 'refund' | 'topup' | 'low-balance';

interface DynamicIslandProps {
  activeState: IslandState;
  customText?: string;
  onDismiss: () => void;
}

export const DynamicIsland: React.FC<DynamicIslandProps> = ({ activeState, customText, onDismiss }) => {
  const [internalState, setInternalState] = useState<IslandState>('idle');

  useEffect(() => {
    setInternalState(activeState);
    if (activeState !== 'idle') {
      const timer = setTimeout(() => {
        onDismiss();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [activeState, onDismiss]);

  // Framer motion variants to morph size and styling elegantly
  const islandVariants = {
    idle: {
      width: 120,
      height: 30,
      borderRadius: 999,
      backgroundColor: '#000000',
      scale: 1,
    },
    success: {
      width: 320,
      height: 65,
      borderRadius: 24,
      backgroundColor: '#000000',
      boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.4), 0px 0px 20px rgba(16, 185, 129, 0.2)',
    },
    refund: {
      width: 310,
      height: 65,
      borderRadius: 24,
      backgroundColor: '#000000',
      boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.4), 0px 0px 20px rgba(245, 158, 11, 0.15)',
    },
    topup: {
      width: 330,
      height: 70,
      borderRadius: 28,
      backgroundColor: '#000000',
      boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.4), 0px 0px 25px rgba(59, 130, 246, 0.25)',
    },
    'low-balance': {
      width: 330,
      height: 70,
      borderRadius: 28,
      backgroundColor: '#000000',
      boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.4), 0px 0px 25px rgba(239, 68, 68, 0.25)',
    },
  };

  const isExpanded = internalState !== 'idle';

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center pointer-events-none select-none">
      <motion.div
        variants={islandVariants}
        animate={internalState}
        transition={{
          type: 'spring',
          stiffness: 240,
          damping: 24,
        }}
        className="relative overflow-hidden pointer-events-auto flex items-center justify-center border border-white/5 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform duration-100"
        onClick={() => onDismiss()}
      >
        <AnimatePresence mode="wait">
          {internalState === 'idle' && (
            <motion.div
              key="idle-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 px-3 w-full justify-between"
            >
              {/* Front Camera Dot */}
              <div className="h-2 w-2 rounded-full bg-zinc-800 border border-zinc-700" />
              {/* Pulsing state ring */}
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping" />
                <span className="text-[9px] font-bold uppercase text-zinc-400 font-sans tracking-wide">6G LIVE</span>
              </div>
              {/* Mini mic aperture */}
              <div className="h-1 w-1 rounded-full bg-zinc-900/60" />
            </motion.div>
          )}

          {internalState === 'success' && (
            <motion.div
              key="success-view"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="px-4 py-3 w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-555 bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                  <Sparkles className="h-5 w-5 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold font-mono">
                    System Secured Slot
                  </span>
                  <p className="text-xs font-bold text-white leading-normal truncate max-w-[190px]">
                    {customText || 'Seat Confirmed!'}
                  </p>
                </div>
              </div>
              <div className="text-right flex flex-col justify-center text-emerald-400 pr-1">
                <Trophy className="h-5 w-5 animate-bounce stroke-[2.5]" />
              </div>
            </motion.div>
          )}

          {internalState === 'refund' && (
            <motion.div
              key="refund-view"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="px-4 py-3 w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-wider text-amber-400 font-bold font-mono">
                    Reservation Released
                  </span>
                  <p className="text-xs font-bold text-white leading-normal truncate max-w-[180px]">
                    {customText || 'Match cancelled, 100% refund'}
                  </p>
                </div>
              </div>
              <div className="text-xs font-black text-amber-400 pr-1 font-mono">
                REFUNDED
              </div>
            </motion.div>
          )}

          {internalState === 'topup' && (
            <motion.div
              key="topup-view"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="px-4 py-3.5 w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  <Wallet className="h-5.5 w-5.5 animate-bounce" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-wider text-blue-400 font-bold font-mono">
                    iOS Pay Sweep Verified
                  </span>
                  <p className="text-xs font-black text-white leading-normal truncate max-w-[190px]">
                    {customText || 'Funds Added to Wallet!'}
                  </p>
                </div>
              </div>
              <div className="bg-blue-900/40 border border-blue-500/30 px-2 py-1 rounded-xl text-xs font-black font-mono text-blue-400">
                +CREDIT
              </div>
            </motion.div>
          )}

          {internalState === 'low-balance' && (
            <motion.div
              key="low-balance-view"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="px-4 py-3.5 w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/25">
                  <AlertCircle className="h-5.5 w-5.5" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-wider text-rose-400 font-bold font-mono">
                    Transaction Declined
                  </span>
                  <p className="text-xs font-black text-white leading-tight truncate max-w-[190px]">
                    {customText || 'Insufficient Wallet balance!'}
                  </p>
                </div>
              </div>
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping mr-1" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
