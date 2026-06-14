import React, { useState } from 'react';
import { SportMatch, SportType, MetroCity } from '../types';
import { Landmark, Sparkles, Plus, Clock, Info, Network, AlertCircle } from 'lucide-react';

interface HostPortalProps {
  onAddMatch: (match: Omit<SportMatch, 'id' | 'slotsFilled' | 'joinedPlayers'>) => void;
  selectedCity: MetroCity;
}

export const HostPortal: React.FC<HostPortalProps> = ({ onAddMatch, selectedCity }) => {
  const [turfName, setTurfName] = useState('');
  const [location, setLocation] = useState('');
  const [sport, setSport] = useState<SportType>('Football');
  const [format, setFormat] = useState('5v5');
  const [time, setTime] = useState('06:00 PM - 07:00 PM');
  const [price, setPrice] = useState('350');
  const [slotsTotal, setSlotsTotal] = useState('10');
  const [intensity, setIntensity] = useState<'Friendly' | 'Competitive' | 'Mixed'>('Mixed');
  const [hostName, setHostName] = useState('');
  
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Pre-fill helpers
  const handlePreFill = (type: SportType) => {
    setSport(type);
    if (type === 'Football') {
      setTurfName('Apollo Arena');
      setFormat('5v5');
      setLocation('Siddapura Bypass Road, ' + selectedCity);
      setPrice('300');
      setSlotsTotal('10');
      setTime('06:00 PM - 07:00 PM');
    } else if (type === 'Box Cricket') {
      setTurfName('CricZone Super Kings Arena');
      setFormat('6v6');
      setLocation('Girinagar Ground East, ' + selectedCity);
      setPrice('250');
      setSlotsTotal('12');
      setTime('07:30 PM - 09:00 PM');
    } else {
      setTurfName('Apex Padel Lounge');
      setFormat('Doubles');
      setLocation('Regal Enclave Enclosure, ' + selectedCity);
      setPrice('600');
      setSlotsTotal('4');
      setTime('05:00 PM - 06:00 PM');
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccess(false);

    if (!turfName || !location || !hostName) {
      setErrorMsg('All fields marked with * are required to authorize the listing on India network node.');
      return;
    }

    const priceNum = Number(price);
    const slotsTotalNum = Number(slotsTotal);

    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMsg('Authorized pricing must be a positive integer in INR.');
      return;
    }

    if (isNaN(slotsTotalNum) || slotsTotalNum <= 0) {
      setErrorMsg('Total player count must be a positive integer.');
      return;
    }

    onAddMatch({
      turfName,
      location,
      city: selectedCity,
      sport,
      format,
      time,
      pricePerPlayer: priceNum,
      slotsTotal: slotsTotalNum,
      date: '2026-06-14', 
      intensity,
      hostName,
      distance: '0.5 km'
    });

    setSuccess(true);
    setTurfName('');
    setLocation('');
    setHostName('');
    
    setTimeout(() => {
      setSuccess(false);
    }, 5000);
  };

  return (
    <div className="w-full bg-white/10 border border-white/20 rounded-[32px] p-6 lg:p-10 relative overflow-hidden shadow-2xl backdrop-blur-2xl text-white">
      
      {/* Background architectural glow */}
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute left-1/4 bottom-0 h-64 w-64 rounded-full bg-indigo-550/10 blur-[100px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: Explanation */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-blue-300 text-xs font-black tracking-widest uppercase rounded-full border border-white/10">
            <Network className="h-3.5 w-3.5" /> TURF OWNER DASHBOARD
          </div>
          
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none">
            Instant Node <br />
            <span className="bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">Match Publisher</span>
          </h2>
          
          <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
            Are you a registered turf facility owner in <strong className="text-white">{selectedCity}</strong>? 
            Use this terminal session to broadcast vacant slots straight to the live match feed. CROSSBARS matches are instant-bookable and secure.
          </p>

          <div className="space-y-4 pt-4 border-t border-white/10">
            
            <div className="flex gap-3 items-start">
              <div className="h-7 w-7 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0 shadow-md">
                <Clock className="h-3.5 w-3.5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Realtime Slots Sync</h4>
                <p className="text-[10px] text-slate-300 leading-normal">Broadcasting reduces vacancy rates of slots by over 82% within 15 minutes of listing.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="h-7 w-7 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0 shadow-md">
                <Landmark className="h-3.5 w-3.5 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Instant Clearing System</h4>
                <p className="text-[10px] text-slate-300 leading-normal">Player reservation fees are instantly swept and validated in our secure ledger database.</p>
              </div>
            </div>

          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
            <h5 className="text-[10px] uppercase tracking-widest font-black text-slate-300 mb-2">Facility Quick Load presets:</h5>
            <div className="grid grid-cols-3 gap-2">
              <button type="button" onClick={() => handlePreFill('Football')} className="py-2 bg-white/10 hover:bg-white/20 text-[10px] font-bold text-indigo-200 rounded-lg border border-white/10 cursor-pointer active:scale-95 transition-colors text-center shadow-md">
                ⚽ Football
              </button>
              <button type="button" onClick={() => handlePreFill('Box Cricket')} className="py-2 bg-white/10 hover:bg-white/20 text-[10px] font-bold text-amber-200 rounded-lg border border-white/10 cursor-pointer active:scale-95 transition-colors text-center shadow-md">
                🏏 Cricket
              </button>
              <button type="button" onClick={() => handlePreFill('Padel')} className="py-2 bg-white/10 hover:bg-white/20 text-[10px] font-bold text-sky-200 rounded-lg border border-white/10 cursor-pointer active:scale-95 transition-colors text-center shadow-md">
                🎾 Padel
              </button>
            </div>
            <p className="text-[9px] text-slate-400 font-mono mt-2 text-center">Clicks fill realistic local values immediately</p>
          </div>

        </div>

        {/* Right Col: Interactive Publisher Form with deep glass backgrounds */}
        <div className="lg:col-span-7 bg-white/5 border border-white/15 rounded-3xl p-6 lg:p-8 shadow-2xl">
          <form onSubmit={handlePublish} className="space-y-4">
            
            {errorMsg && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/35 text-rose-200 rounded-xl text-xs flex gap-2 items-center">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {success && (
              <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 rounded-xl text-xs flex gap-2 items-center shadow-md">
                <Sparkles className="h-4 w-4 shrink-0 text-emerald-400 animate-pulse" />
                <div>
                  <h5 className="font-extrabold text-white">Match Successfully Broadcasted!</h5>
                  <p className="text-[10px] text-slate-300">The session is now live in the scheduling carousel above for other players to join.</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-300 tracking-wider mb-1">
                  Host Facility / Contact*
                </label>
                <input
                  type="text"
                  placeholder="e.g., Turf Owner Vinay"
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  className="w-full bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-300 tracking-wider mb-1">
                  Turf Name / Hub*
                </label>
                <input
                  type="text"
                  placeholder="e.g., Tikitaka Football Arena"
                  value={turfName}
                  onChange={(e) => setTurfName(e.target.value)}
                  className="w-full bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all placeholder-slate-400"
                />
              </div>

            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-300 tracking-wider mb-1">
                Turf Location / Landmark Address*
              </label>
              <input
                type="text"
                placeholder="e.g., Sector 4, Opposite Metro Pillar 114"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all placeholder-slate-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-300 tracking-wider mb-1">
                  Sport Type
                </label>
                <select
                  value={sport}
                  onChange={(e) => setSport(e.target.value as SportType)}
                  className="w-full bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-400 cursor-pointer"
                >
                  <option value="Football" className="text-slate-900 bg-white">⚽ Football</option>
                  <option value="Box Cricket" className="text-slate-900 bg-white">🏏 Box Cricket</option>
                  <option value="Padel" className="text-slate-900 bg-white">🎾 Padel</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-300 tracking-wider mb-1">
                  Format Type
                </label>
                <input
                  type="text"
                  placeholder="e.g., 5v5 or Doubles"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-300 tracking-wider mb-1">
                  Level Intensity
                </label>
                <select
                   value={intensity}
                   onChange={(e) => setIntensity(e.target.value as any)}
                   className="w-full bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-400 cursor-pointer"
                >
                  <option value="Mixed" className="text-slate-900 bg-white">Mixed</option>
                  <option value="Friendly" className="text-slate-900 bg-white">Friendly</option>
                  <option value="Competitive" className="text-slate-900 bg-white">Competitive</option>
                </select>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-300 tracking-wider mb-1">
                  Timing Slot
                </label>
                <input
                  type="text"
                  placeholder="e.g., 08:30 PM - 09:30 PM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-300 tracking-wider mb-1">
                  Price Per Player (₹ INR)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 350"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-300 tracking-wider mb-1">
                  Max Players / Slots
                </label>
                <input
                  type="number"
                  placeholder="e.g., 10"
                  value={slotsTotal}
                  onChange={(e) => setSlotsTotal(e.target.value)}
                  className="w-full bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all placeholder-slate-400"
                />
              </div>

            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs tracking-wider uppercase py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-lg shadow-blue-500/20 mt-4"
            >
              <Plus className="h-4 w-4" /> BROADCAST COMPLIANT SLOT NOW
            </button>

            <p className="text-[9px] text-slate-400 text-center font-mono mt-1">
              By submitting, your turf verifies this slot has a real physical reservation booked on {selectedCity} grid.
            </p>

          </form>
        </div>

      </div>

    </div>
  );
};
