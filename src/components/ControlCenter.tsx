import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wifi, Bluetooth, Radio, Sun, Volume2, 
  Play, Pause, SkipForward, Moon, ShieldAlert, Coins, Compass
} from 'lucide-react';
import { MetroCity, UserProfile } from '../types';

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: MetroCity;
  onCityChange: (city: MetroCity) => void;
  user: UserProfile;
  onTopUp: (amount: number) => void;
  hapticStatus: boolean;
  onToggleHaptic: () => void;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({
  isOpen,
  onClose,
  selectedCity,
  onCityChange,
  user,
  onTopUp,
  hapticStatus,
  onToggleHaptic
}) => {
  const [wifiOn, setWifiOn] = useState(true);
  const [bluetoothOn, setBluetoothOn] = useState(true);
  const [cellularOn, setCellularOn] = useState(true);
  const [airplaneMode, setAirplaneMode] = useState(false);
  const [brightness, setBrightness] = useState(85);
  const [isPlaying, setIsPlaying] = useState(false);

  const cities: MetroCity[] = ['Bengaluru', 'Delhi NCR', 'Mumbai', 'Hyderabad', 'Chennai'];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
        
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-md pointer-events-auto"
          onClick={onClose}
        />

        {/* Sliding Control Plate */}
        <motion.div
          initial={{ y: '-100%', opacity: 0.9 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0.9 }}
          transition={{ type: 'spring', damping: 26, stiffness: 220 }}
          className="absolute top-0 right-0 left-0 max-h-[88%] bg-white/10 text-white p-6 pt-16 rounded-b-[38px] shadow-[0_25px_60px_rgba(0,0,0,0.7)] border-b border-white/20 backdrop-blur-3xl overflow-y-auto scrollbar-none pointer-events-auto"
        >
          {/* Top Notch Indicators */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-black text-slate-300 font-mono tracking-wider uppercase">System Controller 26</span>
            <button 
              onClick={onClose}
              className="px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-xs font-black transition-all active:scale-95 cursor-pointer border border-white/10"
            >
              Close Panel
            </button>
          </div>

          {/* Interactive BENTO grid */}
          <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
            
            {/* Widget 1: Network & Services */}
            <div className="col-span-4 md:col-span-2 bg-white/10 p-4 rounded-3xl border border-white/10 grid grid-cols-2 gap-2">
              <button
                onClick={() => setWifiOn(!wifiOn)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all cursor-pointer ${
                  wifiOn ? 'bg-[#007AFF] text-white shadow-lg' : 'bg-white/5 text-slate-400'
                }`}
              >
                <Wifi className="h-5 w-5 mb-1" />
                <span className="text-[10px] font-black">Wi-Fi Active</span>
              </button>

              <button
                onClick={() => setBluetoothOn(!bluetoothOn)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all cursor-pointer ${
                  bluetoothOn ? 'bg-[#007AFF] text-white shadow-lg' : 'bg-white/5 text-slate-400'
                }`}
              >
                <Bluetooth className="h-5 w-5 mb-1" />
                <span className="text-[10px] font-black">Bluetooth</span>
              </button>

              <button
                onClick={() => setCellularOn(!cellularOn)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all cursor-pointer ${
                  cellularOn ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/5 text-slate-400'
                }`}
              >
                <Radio className="h-5 w-5 mb-1 animate-pulse" />
                <span className="text-[10px] font-black">10G Fiber Link</span>
              </button>

              <button
                onClick={() => setAirplaneMode(!airplaneMode)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all cursor-pointer ${
                  airplaneMode ? 'bg-amber-500 text-white shadow-lg' : 'bg-white/5 text-slate-400'
                }`}
              >
                <Moon className="h-5 w-5 mb-1" />
                <span className="text-[10px] font-black">Zen Mode</span>
              </button>
            </div>

            {/* Widget 2: Broadcast Live Tracker */}
            <div className="col-span-4 md:col-span-2 bg-white/10 p-4 px-5 rounded-3xl border border-white/11 flex flex-col justify-between">
              <div className="flex gap-3 items-center">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#007AFF] to-blue-500 animate-pulse flex items-center justify-center font-black text-white text-xs shadow-md shadow-blue-500/25">
                  CB
                </div>
                <div className="text-left w-full truncate">
                  <span className="text-[8px] text-slate-300 block font-mono">PAN-INDIA FEED BROADCASTER</span>
                  <span className="text-xs font-black text-white block truncate">HSR Turf Championship</span>
                </div>
              </div>

              {/* Slider simulation */}
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 relative overflow-hidden">
                <div className="bg-[#007AFF] h-full" style={{ width: isPlaying ? '65%' : '15%' }} />
              </div>

              {/* Tiny Controls */}
              <div className="flex justify-around items-center pt-2">
                <Compass className="h-4 w-4 text-slate-300" />
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all active:scale-95 text-white border border-white/10"
                >
                  {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 ml-0.5" />}
                </button>
                <SkipForward className="h-4 w-4 text-slate-300 cursor-pointer hover:text-white" />
              </div>
            </div>

            {/* Brightness / System contrast */}
            <div className="col-span-2 md:col-span-1 bg-white/10 p-4 rounded-3xl border border-white/10 flex flex-col justify-between items-center h-32">
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Glow</span>
              <div className="relative w-6 h-16 bg-white/10 rounded-full overflow-hidden flex flex-col justify-end">
                <div className="bg-amber-400 w-full" style={{ height: `${brightness}%` }} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Sun className="h-4 w-4 text-slate-800" />
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-200">{brightness}%</span>
            </div>

            {/* Volume / Sound */}
            <div className="col-span-2 md:col-span-1 bg-white/10 p-4 rounded-3xl border border-white/10 flex flex-col justify-between items-center h-32 text-center">
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Haptic</span>
              <div 
                onClick={onToggleHaptic}
                className="relative w-6 h-16 bg-white/10 rounded-full overflow-hidden flex flex-col justify-end cursor-pointer active:scale-95 transition-transform"
              >
                <div className={`w-full ${hapticStatus ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ height: hapticStatus ? '100%' : '15%' }} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Volume2 className="h-4 w-4 text-slate-800" />
                </div>
              </div>
              <span className="text-[9px] font-black tracking-wider text-slate-200 truncate max-w-full">{hapticStatus ? 'ON' : 'OFF'}</span>
            </div>

            {/* Quick Wallet Action */}
            <div className="col-span-4 md:col-span-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-4 rounded-3xl border border-white/10 flex flex-col justify-between h-32">
              <div>
                <span className="text-[9px] font-black text-indigo-200 uppercase tracking-widest block">Core Wallet Ledger</span>
                <span className="text-lg font-black font-mono text-white block mt-1">₹{user.walletBalance}</span>
              </div>
              <button
                onClick={() => onTopUp(500)}
                className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-550 hover:to-indigo-550 active:scale-95 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-white shadow-lg"
              >
                <Coins className="h-3.5 w-3.5 text-yellow-300" /> Quick Add ₹500
              </button>
            </div>

            {/* Regional Connected Gateways switcher */}
            <div className="col-span-4 bg-white/10 p-4 rounded-3xl border border-white/10 text-left">
              <span className="text-[9px] font-black text-slate-300 uppercase block mb-3 tracking-widest">
                SWITCH ACTIVE REGIONAL GRID NODE
              </span>
              <div className="flex flex-wrap gap-2">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => onCityChange(city)}
                    className={`px-3 py-1.5 text-xs font-black rounded-xl cursor-pointer transition-all border ${
                      selectedCity === city
                        ? 'bg-[#007AFF] text-white border-[#007AFF] shadow-md shadow-blue-500/20'
                        : 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="mt-6 max-w-4xl mx-auto p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-start gap-2.5 text-left">
            <ShieldAlert className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-orange-200 font-sans leading-relaxed">
              Currently connected to live 10Gbps Bangalore mainnet route. Any serverless database updates reflect immediately across the pan-Indian ledger cache networks.
            </p>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
