import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { TimeRibbon } from './components/TimeRibbon';
import { MatchList } from './components/MatchList';
import { HostPortal } from './components/HostPortal';
import { ArchitectureSection } from './components/ArchitectureSection';
import { DynamicIsland, IslandState } from './components/DynamicIsland';
import { ControlCenter } from './components/ControlCenter';
import { SportMatch, MetroCity, UserProfile } from './types';
import { INITIAL_MATCHES } from './data';
import { 
  Award, Zap, Sparkles, TrendingUp, Users, Info, Flame, AlertCircle, Coins, 
  HeartHandshake, Laptop, SlidersHorizontal, Battery, Wifi, 
  MapPin, Calendar, Compass, ShieldCheck, Compass as DockIcon, 
  Globe, Monitor, Volume2, ShieldAlert
} from 'lucide-react';

export default function App() {
  // Sync state with local storage to simulate a real, live database
  const [matches, setMatches] = useState<SportMatch[]>(() => {
    const saved = localStorage.getItem('crossbars_matches');
    return saved ? JSON.parse(saved) : INITIAL_MATCHES;
  });

  const [selectedCity, setSelectedCity] = useState<MetroCity>('Bengaluru');
  const [selectedDate, setSelectedDate] = useState<string>('2026-06-14');

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('crossbars_user');
    return saved ? JSON.parse(saved) : {
      name: 'Gaurav Malhotra',
      phone: '9845300188',
      joinedGames: [],
      walletBalance: 1250, // Initial balance in INR
    };
  });

  // Interactive glass/macOS states
  const [islandState, setIslandState] = useState<IslandState>('idle');
  const [islandText, setIslandText] = useState('');
  const [controlCenterOpen, setControlCenterOpen] = useState(false);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState('09:41 AM');

  // Sync clock time with system time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; 
      setCurrentTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('crossbars_matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('crossbars_user', JSON.stringify(user));
  }, [user]);

  // Hook up Dynamic Island alerts
  const triggerIsland = (state: IslandState, text: string) => {
    setIslandState('idle'); 
    setTimeout(() => {
      setIslandState(state);
      setIslandText(text);
    }, 150);
  };

  // Wallet Top Up
  const handleTopUp = (amount: number) => {
    setUser(prev => ({
      ...prev,
      walletBalance: prev.walletBalance + amount
    }));
    triggerIsland('topup', `₹${amount} added successfully!`);
  };

  // Join Grid Match
  const handleJoinMatch = (matchId: string) => {
    setMatches(prevMatches => {
      const targetMatch = prevMatches.find(m => m.id === matchId);
      if (!targetMatch) return prevMatches;

      const isAlreadyJoined = user.joinedGames.includes(matchId);
      if (isAlreadyJoined) {
        triggerIsland('low-balance', 'Registered already on this slot!');
        return prevMatches;
      }

      if (targetMatch.slotsFilled >= targetMatch.slotsTotal) {
        triggerIsland('low-balance', 'Sorry! Match slot completely filled.');
        return prevMatches;
      }

      if (user.walletBalance < targetMatch.pricePerPlayer) {
        triggerIsland('low-balance', `Needs ₹${targetMatch.pricePerPlayer}. Top up now!`);
        return prevMatches;
      }

      // Deduct balance and join inline
      setUser(prevUser => ({
        ...prevUser,
        walletBalance: prevUser.walletBalance - targetMatch.pricePerPlayer,
        joinedGames: [...prevUser.joinedGames, matchId]
      }));

      // Trigger Dynamic Island Confirmation
      triggerIsland('success', `Booked ${targetMatch.turfName}! ⚽`);

      return prevMatches.map(m => {
        if (m.id === matchId) {
          return {
            ...m,
            slotsFilled: m.slotsFilled + 1,
            joinedPlayers: [...m.joinedPlayers, user.name]
          };
        }
        return m;
      });
    });
  };

  // Cancel Match slot
  const handleCancelMatch = (matchId: string) => {
    setMatches(prevMatches => {
      const targetMatch = prevMatches.find(m => m.id === matchId);
      if (!targetMatch) return prevMatches;

      const isJoined = user.joinedGames.includes(matchId);
      if (!isJoined) return prevMatches;

      // Refund balance
      setUser(prevUser => ({
        ...prevUser,
        walletBalance: prevUser.walletBalance + targetMatch.pricePerPlayer,
        joinedGames: prevUser.joinedGames.filter(id => id !== matchId)
      }));

      triggerIsland('refund', `Cancelled slot. ₹${targetMatch.pricePerPlayer} refunded.`);

      return prevMatches.map(m => {
        if (m.id === matchId) {
          return {
            ...m,
            slotsFilled: Math.max(0, m.slotsFilled - 1),
            joinedPlayers: m.joinedPlayers.filter(p => p !== user.name)
          };
        }
        return m;
      });
    });
  };

  // Add Match from Turf Owner panel
  const handleAddMatch = (newMatchData: Omit<SportMatch, 'id' | 'slotsFilled' | 'joinedPlayers'>) => {
    const newId = `custom-match-${Date.now()}`;
    const newMatch: SportMatch = {
      ...newMatchData,
      id: newId,
      slotsFilled: 0,
      joinedPlayers: []
    };

    setMatches(prev => [newMatch, ...prev]);
    triggerIsland('success', `Broadcasted ${newMatchData.turfName} onto feed! ✨`);
    
    // Smooth jump
    setTimeout(() => {
      scrollToSection('match-feed-section');
    }, 600);
  };

  const totalSlotsMatchCount = matches.filter(m => m.city === selectedCity && m.date === selectedDate).length;
  const spotsTakenThisDateCount = matches
    .filter(m => m.city === selectedCity && m.date === selectedDate)
    .reduce((sum, current) => sum + current.joinedPlayers.length, 0);

  // Smooth jump to sections
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-900 font-sans selection:bg-blue-200/50 selection:text-blue-900 overflow-x-hidden relative pb-32">
      
      {/* MAC/iOS 26 AMBIENT GRAPHIC GLASS BACKGROUND WALLPAPER */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-tr from-[#0F101A] via-[#12162E] to-[#0A0C16]">
        {/* Soft floating colorful blur blobs for beautiful frosted-glass showoff */}
        <div className="absolute top-[10%] left-[15%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-blue-600/20 to-purple-600/15 blur-[120px] animate-pulse" style={{ animationDuration: '14s' }} />
        <div className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-indigo-500/15 via-blue-500/10 to-emerald-500/10 blur-[130px] animate-pulse" style={{ animationDuration: '18s' }} />
        <div className="absolute top-[40%] right-[30%] w-[35vw] h-[35vw] rounded-full bg-rose-500/5 to-purple-500/5 blur-[100px] animate-pulse" style={{ animationDuration: '22s' }} />
      </div>

      {/* Dynamic Island Floating Notification Hub */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-55">
        <DynamicIsland 
          activeState={islandState} 
          customText={islandText} 
          onDismiss={() => setIslandState('idle')} 
        />
      </div>

      {/* Control Center Layer */}
      <ControlCenter 
        isOpen={controlCenterOpen} 
        onClose={() => setControlCenterOpen(false)} 
        selectedCity={selectedCity} 
        onCityChange={(city) => {
          setSelectedCity(city);
          triggerIsland('success', `Route tuned to ${city}!`);
        }}
        user={user} 
        onTopUp={handleTopUp}
        hapticStatus={hapticEnabled}
        onToggleHaptic={() => {
          setHapticEnabled(!hapticEnabled);
          triggerIsland('refund', hapticEnabled ? 'Haptics disabled' : 'Haptics active');
        }}
      />

      {/* MAC/OS 26 GLASS TOP BAR */}
      <div className="sticky top-0 z-50 w-full px-4 pt-3 pointer-events-none">
        <div className="max-w-7xl mx-auto rounded-2xl bg-white/30 backdrop-blur-2xl border border-white/40 shadow-xl pointer-events-auto flex items-center justify-between px-3 sm:px-6 py-1.5 sm:py-2">
          {/* Brand/System Title */}
          <div className="flex items-center gap-2 sm:gap-5">
            <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-[#007AFF] to-blue-500 flex items-center justify-center font-black text-white text-[10px] shadow-md shadow-blue-500/30 shrink-0">
                CB
              </div>
              <span className="text-xs font-black tracking-tight text-white uppercase font-sans hidden xs:inline-block">CROSSBARS</span>
            </div>
            
            <div className="hidden md:flex items-center gap-1 text-[11px] font-bold text-slate-300">
              <span className="px-2.5 py-0.5 rounded-md hover:bg-white/10 cursor-pointer transition-colors" onClick={() => scrollToSection('match-feed-section')}>Schedules</span>
              <span className="px-2.5 py-0.5 rounded-md hover:bg-white/10 cursor-pointer transition-colors" onClick={() => scrollToSection('host-portal-section')}>Broadcast</span>
              <span className="px-2.5 py-0.5 rounded-md hover:bg-white/10 cursor-pointer transition-colors" onClick={() => scrollToSection('architecture-section')}>Systems</span>
            </div>
          </div>

          {/* Core Controls Group */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Wallet indicator styled as glass tile */}
            <div className="flex items-center gap-1 bg-white/15 px-2 sm:px-3 py-1 rounded-full text-white border border-white/10 font-medium select-none text-[10px] sm:text-[11px]">
              <Coins className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-yellow-400" />
              <span className="font-mono font-bold">₹{user.walletBalance}</span>
            </div>

            {/* City Selector directly in macOS bar */}
            <div className="flex items-center gap-1 bg-white/15 px-2 sm:px-3 py-1 rounded-full text-white border border-white/10 font-bold select-none text-[10px] sm:text-[11px] cursor-pointer" onClick={() => setControlCenterOpen(true)}>
              <MapPin className="h-3 w-3 text-red-400" />
              <span className="max-w-[55px] sm:max-w-none truncate">{selectedCity}</span>
            </div>

            {/* Realtime Watch (Only on larger mobile / desktop) */}
            <span className="hidden sm:inline-block text-[11px] text-slate-200 font-bold font-mono px-1 select-none">
              {currentTime}
            </span>

            {/* Glass Slider settings button mimicking dynamic slider panel */}
            <button
              onClick={() => setControlCenterOpen(!controlCenterOpen)}
              className="p-1 h-7 w-7 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/35 text-white border border-white/20 transition-all active:scale-90 cursor-pointer shrink-0"
              title="Toggle macOS Control Center"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 relative z-10 select-none">
        
        {/* HERO INTRO FOR SQUAD HUB */}
        <section className="relative overflow-hidden pt-12 md:pt-20 pb-10 text-center select-none">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            
            {/* Elegant glass interactive tag */}
            <motion.div 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-wider shadow-lg shadow-black/10 cursor-pointer active:scale-95 transition-all"
            >
              <Flame className="h-3 w-3 text-orange-400 animate-pulse" /> Pan-India Turf Play Network Live
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-sans font-black tracking-tight leading-tight text-white">
              SQUAD UP. <span className="bg-gradient-to-r from-blue-400 via-[#007AFF] to-indigo-400 bg-clip-text text-transparent italic">PLAY NOW.</span>
            </h1>

            <p className="text-xs md:text-sm text-slate-300 font-medium max-w-lg mx-auto leading-relaxed">
              Experience the future of Indian sports scheduling on a high-fidelity platform. Discover and book premium sports fields in Bengaluru, Delhi NCR, Mumbai, Hyderabad, and Chennai.
            </p>

            {/* Elegant Bento widgets row styled like macOS launch panel */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.08
                  }
                }
              }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 max-w-4xl mx-auto font-sans"
            >
              
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                whileHover={{ scale: 1.03, y: -4, borderColor: 'rgba(255,255,255,0.4)' }}
                className="rounded-[24px] bg-white/10 backdrop-blur-2xl border border-white/25 p-4 text-left shadow-2xl flex flex-col justify-between cursor-pointer"
              >
                <span className="text-[9px] text-blue-300 font-black uppercase tracking-wider block">Active Metro Grid</span>
                <div>
                  <span className="text-xl font-black text-white block mt-1">{selectedCity}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Pan-India Route Connected</span>
                </div>
              </motion.div>

              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                whileHover={{ scale: 1.03, y: -4, borderColor: 'rgba(255,255,255,0.4)' }}
                className="rounded-[24px] bg-white/10 backdrop-blur-2xl border border-white/25 p-4 text-left shadow-2xl flex flex-col justify-between cursor-pointer"
              >
                <span className="text-[9px] text-slate-300 font-black uppercase tracking-wider block">Available Slots</span>
                <div>
                  <span className="text-xl font-black text-white block mt-1">{totalSlotsMatchCount} Matches</span>
                  <p className="text-[10px] text-emerald-400 mt-0.5 font-bold">● Live Schedules Ready</p>
                </div>
              </motion.div>

              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                whileHover={{ scale: 1.03, y: -4, borderColor: 'rgba(255,255,255,0.4)' }}
                className="rounded-[24px] bg-white/10 backdrop-blur-2xl border border-white/25 p-4 text-left shadow-2xl flex flex-col justify-between cursor-pointer"
              >
                <span className="text-[9px] text-amber-300 font-black uppercase tracking-wider block">Registered Players</span>
                <div>
                  <span className="text-xl font-black text-white block mt-1">{spotsTakenThisDateCount} Slots Taken</span>
                  <p className="text-[10px] text-indigo-300 mt-0.5">Real-time occupancy synced</p>
                </div>
              </motion.div>

              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                whileHover={{ scale: 1.03, y: -4, borderColor: 'rgba(255,255,255,0.4)' }}
                className="rounded-[24px] bg-gradient-to-br from-blue-600/35 to-indigo-700/35 backdrop-blur-2xl border border-white/25 p-4 text-left shadow-2xl flex flex-col justify-between cursor-pointer"
              >
                <span className="text-[9px] text-white font-black uppercase tracking-wider block">Your Wallet balance</span>
                <div>
                  <span className="text-xl font-black text-white block mt-1 font-mono">₹{user.walletBalance}</span>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTopUp(500);
                    }}
                    className="mt-1.5 w-full py-1 bg-white hover:bg-slate-100 text-[#007AFF] text-[9px] font-black uppercase rounded-lg transition-all"
                  >
                    <span className="xs:hidden">Topup ₹500</span>
                    <span className="hidden xs:inline">Quick Topup ₹500</span>
                  </motion.button>
                </div>
              </motion.div>

            </motion.div>

          </motion.div>
        </section>

        {/* TIME BAR SELECTOR */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 150, damping: 20 }}
          className="relative z-20 my-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-1.5 shadow-xl"
        >
          <TimeRibbon selectedDate={selectedDate} onDateSelect={(date) => setSelectedDate(date)} />
        </motion.div>

        {/* CORE INTERFACING SHEET */}
        <div className="space-y-12 pb-24">
          
          {/* Listing Header and Schedule matches wrapper */}
          <motion.section 
            id="match-feed-section" 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: 'spring', stiffness: 140, damping: 20 }}
            className="bg-white/15 backdrop-blur-2xl border border-white/25 rounded-[36px] p-6 lg:p-8 shadow-2xl space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>Match Grid for</span>
                  <span className="text-blue-300 font-mono">
                    {new Date(selectedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                  </span>
                </h2>
                <p className="text-xs text-slate-350">
                  Select a slot from available premium pitches. Real-time slot reservation system keeps scheduling overlaps locked.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-2xl border border-white/10 text-white shadow-xs self-start sm:self-center">
                <Coins className="h-4 w-4 text-emerald-400" />
                <span className="text-[10px] text-slate-400 font-bold">PAY WALLET:</span>
                <span className="font-mono text-xs font-black text-emerald-300">₹{user.walletBalance}</span>
              </div>
            </div>

            {/* List Components (Contains its own Glass filters to conform properly) */}
            <MatchList 
              matches={matches}
              selectedDate={selectedDate}
              selectedCity={selectedCity}
              user={user}
              onJoinMatch={handleJoinMatch}
              onCancelMatch={handleCancelMatch}
            />
          </motion.section>

          {/* Broadcast / Turf Portal */}
          <motion.section 
            id="host-portal-section" 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: 'spring', stiffness: 140, damping: 20 }}
            className="bg-white/15 backdrop-blur-2xl border border-white/25 rounded-[36px] p-6 lg:p-8 shadow-2xl"
          >
            <HostPortal onAddMatch={handleAddMatch} selectedCity={selectedCity} />
          </motion.section>

          {/* Architecture / Simulation blueprint */}
          <motion.section 
            id="architecture-section" 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: 'spring', stiffness: 140, damping: 20 }}
            className="bg-white/15 backdrop-blur-2xl border border-white/25 rounded-[36px] p-6 lg:p-8 shadow-2xl"
          >
            <ArchitectureSection />
          </motion.section>

        </div>

      </div>

      {/* DOCK FOR iOS/macOS QUICK NAVIGATION */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-lg">
        <div className="bg-white/20 backdrop-blur-3xl border border-white/35 rounded-3xl p-1.5 xs:p-2 flex items-center justify-around shadow-2xl shadow-black/40 hover:scale-[1.01] active:scale-[0.99] transition-transform">
          
          <button 
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center gap-1 py-1 px-1.5 xs:px-3 rounded-2xl hover:bg-white/15 text-white transition-colors cursor-pointer"
          >
            <Compass className="h-4 sm:h-5 w-4 sm:w-5 text-sky-300" />
            <span className="text-[7.5px] sm:text-[8px] uppercase font-black tracking-tight xs:tracking-wider text-slate-200">Hub</span>
          </button>

          <button 
            type="button"
            onClick={() => scrollToSection('match-feed-section')}
            className="flex flex-col items-center gap-1 py-1 px-1.5 xs:px-3 rounded-2xl hover:bg-white/15 text-white transition-colors cursor-pointer"
          >
            <Calendar className="h-4 sm:h-5 w-4 sm:w-5 text-indigo-300" />
            <span className="text-[7.5px] sm:text-[8px] uppercase font-black tracking-tight xs:tracking-wider text-slate-200">Schedules</span>
          </button>

          <button 
            type="button"
            onClick={() => scrollToSection('host-portal-section')}
            className="flex flex-col items-center gap-1 py-1 px-1.5 xs:px-3 rounded-2xl hover:bg-white/15 text-white transition-colors cursor-pointer"
          >
            <Flame className="h-4 sm:h-5 w-4 sm:w-5 text-amber-300" />
            <span className="text-[7.5px] sm:text-[8px] uppercase font-black tracking-tight xs:tracking-wider text-slate-200">Broadcast</span>
          </button>

          <button 
            type="button"
            onClick={() => scrollToSection('architecture-section')}
            className="flex flex-col items-center gap-1 py-1 px-1.5 xs:px-3 rounded-2xl hover:bg-white/15 text-white transition-colors cursor-pointer"
          >
            <ShieldCheck className="h-4 sm:h-5 w-4 sm:w-5 text-emerald-300" />
            <span className="text-[7.5px] sm:text-[8px] uppercase font-black tracking-tight xs:tracking-wider text-slate-200">Systems</span>
          </button>

          <button 
            type="button"
            onClick={() => handleTopUp(1000)}
            className="flex flex-col items-center gap-1 py-1 px-1.5 xs:px-3 rounded-2xl bg-[#007AFF]/40 hover:bg-[#007AFF]/60 border border-[#007AFF]/30 text-white transition-all cursor-pointer active:scale-90"
            title="Refill wallet with ₹1000"
          >
            <Coins className="h-4 sm:h-5 w-4 sm:w-5 text-yellow-300 animate-ios-bounce" />
            <span className="text-[7.5px] sm:text-[8px] uppercase font-black tracking-tight xs:tracking-wider text-white">Recharge</span>
          </button>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 text-center py-6 border-t border-white/10 mt-16 max-w-7xl mx-auto px-4 text-slate-400">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-[9px]">CB</div>
            <span>© 2026 CROSSBARS Grid Inc. All regional reservation mainnets verified.</span>
          </div>
          <span className="font-mono text-[10px] text-slate-500 uppercase">macOS 26 Serverless Core Endpoint Secured</span>
        </div>
      </footer>

    </div>
  );
}
