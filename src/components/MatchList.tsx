import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SportMatch, SportType, UserProfile } from '../types';
import { Search, Users, MapPin, Clock, Award, ShieldAlert, Sparkles, Filter, CheckCircle2 } from 'lucide-react';

interface MatchListProps {
  matches: SportMatch[];
  selectedDate: string;
  selectedCity: string;
  user: UserProfile;
  onJoinMatch: (matchId: string) => void;
  onCancelMatch: (matchId: string) => void;
}

export const MatchList: React.FC<MatchListProps> = ({
  matches,
  selectedDate,
  selectedCity,
  user,
  onJoinMatch,
  onCancelMatch,
}) => {
  const [activeSport, setActiveSport] = useState<SportType | 'All'>('All');
  const [activeIntensity, setActiveIntensity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter computation
  const filteredMatches = matches.filter((match) => {
    const matchesCity = match.city === selectedCity;
    const matchesDate = match.date === selectedDate;
    const matchesSport = activeSport === 'All' || match.sport === activeSport;
    const matchesIntensity = activeIntensity === 'All' || match.intensity === activeIntensity;
    
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      match.turfName.toLowerCase().includes(query) || 
      match.location.toLowerCase().includes(query) || 
      match.format.toLowerCase().includes(query);

    return matchesCity && matchesDate && matchesSport && matchesIntensity && matchesSearch;
  });

  return (
    <div className="w-full text-white">
      
      {/* Search & Filtering Control Center as glass bar */}
      <div className="bg-white/10 rounded-3xl p-5 border border-white/20 mb-8 backdrop-blur-xl shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          
          {/* Dynamic Search Bar */}
          <div className="relative lg:col-span-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
            <input
              type="text"
              placeholder="Search for turfs, localities, formats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/15 rounded-2xl py-2.5 pl-11 pr-4 text-xs text-white placeholder-slate-350 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all"
            />
          </div>

          {/* Sport Selector iOS Segmented Control */}
          <div className="bg-white/10 p-1 rounded-2xl flex items-center lg:col-span-4 justify-start w-full border border-white/10">
            {(['All', 'Football', 'Box Cricket', 'Padel'] as const).map((sport) => {
              const isActive = activeSport === sport;
              return (
                <button
                  key={sport}
                  type="button"
                  onClick={() => setActiveSport(sport)}
                  className="flex-1 text-center py-2 relative rounded-xl text-xs font-bold transition-colors cursor-pointer select-none active:scale-[0.97] transition-all"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSportPill"
                      className="absolute inset-0 bg-white/25 rounded-xl shadow-lg border border-white/20"
                      transition={{ type: 'spring', stiffness: 280, damping: 25 }}
                    />
                  )}
                  <span className={`relative z-10 transition-all font-sans text-[11px] ${isActive ? 'text-white font-black scale-105' : 'text-slate-300 hover:text-white'}`}>
                    {sport === 'Football' && '⚽'}
                    {sport === 'Box Cricket' && '🏏'}
                    {sport === 'Padel' && '🎾'}
                    <span className="ml-[3px]">
                      {sport === 'Box Cricket' ? (
                        <>
                          <span className="inline xs:hidden">Cric</span>
                          <span className="hidden xs:inline sm:hidden">Cricket</span>
                          <span className="hidden sm:inline">Box Cricket</span>
                        </>
                      ) : sport}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Intensity Selector Dropdown */}
          <div className="flex items-center gap-2 lg:col-span-3 justify-start lg:justify-end text-white">
            <Filter className="h-3.5 w-3.5 text-slate-350" />
            <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Level:</span>
            <select
              value={activeIntensity}
              onChange={(e) => setActiveIntensity(e.target.value)}
              className="bg-white/15 border border-white/15 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-blue-400 cursor-pointer"
            >
              <option value="All" className="text-slate-900 bg-white">All Levels</option>
              <option value="Friendly" className="text-slate-900 bg-white">Friendly Only</option>
              <option value="Competitive" className="text-slate-900 bg-white">Competitive Only</option>
              <option value="Mixed" className="text-slate-900 bg-white">Mixed Play Only</option>
            </select>
          </div>

        </div>
      </div>

      {/* Matches Grid */}
      {filteredMatches.length === 0 ? (
        <div className="text-center py-16 bg-white/10 border border-white/20 rounded-3xl p-8 max-w-lg mx-auto shadow-2xl">
          <div className="h-12 w-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="h-6 w-6 text-slate-300" />
          </div>
          <h3 className="text-base font-extrabold text-white mb-1">No matches found</h3>
          <p className="text-xs text-slate-300 mb-6">
            There fit no listings in {selectedCity} for {(activeSport === 'All' ? 'any sport' : activeSport)} on the selected date. Try changing the date or city!
          </p>
          <div className="text-[10px] text-slate-400 font-mono">
            Or scroll down to the turf Host Portal below to publish a new session slot instantly!
          </div>
        </div>
      ) : (
        <motion.div 
          layout="position"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredMatches.map((match) => {
              const hasJoined = user.joinedGames.includes(match.id);
              const isFull = match.slotsFilled >= match.slotsTotal;
              const slotsLeft = match.slotsTotal - match.slotsFilled;
              const percentageFilled = (match.slotsFilled / match.slotsTotal) * 100;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -6, scale: 1.01, boxShadow: "0 22px 45px rgba(0,0,0,0.3)" }}
                  transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                  key={match.id}
                  id={`match-card-${match.id}`}
                  className={`group rounded-3xl bg-white/10 hover:bg-white/15 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                    hasJoined
                      ? 'border-blue-400 shadow-[0_12px_32px_rgba(0,122,255,0.15)] bg-blue-500/10'
                      : 'border-white/15 hover:border-blue-400 shadow-xl'
                  }`}
                >
                  {/* Visual Strip Indicator */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                    match.sport === 'Football' ? 'bg-indigo-500' :
                    match.sport === 'Box Cricket' ? 'bg-amber-500' : 'bg-sky-500'
                  }`} />

                  {/* Card Top section */}
                  <div className="p-6">
                    {/* Sport Badging & Pricing Row */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        match.sport === 'Football' ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/30' :
                        match.sport === 'Box Cricket' ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30' : 'bg-sky-500/20 text-sky-200 border border-sky-500/30'
                      }`}>
                        {match.sport} • {match.format}
                      </span>
                      <span className="text-sm font-black text-white font-mono">
                        ₹{match.pricePerPlayer} <span className="text-[10px] text-slate-300 font-medium font-sans">/ slot</span>
                      </span>
                    </div>

                    {/* Turf Name */}
                    <h3 className="font-extrabold text-white text-lg group-hover:text-blue-300 transition-colors tracking-tight line-clamp-1">
                      {match.turfName}
                    </h3>

                    {/* Distance & Precise Location */}
                    <div className="flex items-start gap-1.5 mt-2 text-slate-200">
                      <MapPin className="h-3.5 w-3.5 text-slate-355 text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold leading-normal line-clamp-2">{match.location}</p>
                        {match.distance && (
                          <span className="text-[10px] font-mono font-black text-blue-300 bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 rounded-md mt-1 inline-block">
                            {match.distance} away
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Timing Block */}
                    <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl border border-white/10 mt-4">
                      <Clock className="h-3.5 w-3.5 text-blue-400" />
                      <span className="text-xs font-bold text-white">{match.time}</span>
                    </div>

                    {/* Intensity level & Host information */}
                    <div className="flex items-center gap-4 mt-4 text-[10px] font-bold text-slate-300">
                      <span className="flex items-center gap-1">
                        <Award className="h-3 w-3 text-slate-300 shrink-0" /> {match.intensity} match
                      </span>
                      <span className="truncate">
                        Host: <strong className="text-white font-bold">{match.hostName}</strong>
                      </span>
                    </div>

                    {/* Occupancy Progress */}
                    <div className="mt-5 pt-4 border-t border-white/10">
                      <div className="flex justify-between items-center mb-1.5 text-xs text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-slate-300" />
                          <span>Occupancy Status</span>
                        </span>
                        <span className="font-mono font-bold text-white">
                          {match.slotsFilled}/{match.slotsTotal} <span className="text-[10px] text-slate-300">slots</span>
                        </span>
                      </div>
                      
                      {/* Glass Slider Meter */}
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentageFilled}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`h-full rounded-full transition-colors duration-500 ${
                            percentageFilled >= 90 ? 'bg-rose-500' :
                            percentageFilled >= 70 ? 'bg-amber-500' : 'bg-blue-500'
                          }`}
                        />
                      </div>
                      
                      <div className="flex justify-between text-[9px] text-slate-300 mt-2">
                        <span>{slotsLeft} empty slots left</span>
                        <span className={`font-mono font-bold ${percentageFilled >= 90 ? 'text-rose-400' : 'text-slate-300'}`}>
                          {percentageFilled >= 100 ? 'SOLD OUT' : `${Math.round(percentageFilled)}% Capacity`}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Card Button footer section */}
                  <div className="p-6 pt-0 mt-auto">
                    {hasJoined ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-300 font-bold bg-emerald-500/20 border border-emerald-500/30 py-2.5 rounded-2xl">
                          <CheckCircle2 className="h-4 w-4 text-[#10B981]" /> Joined Successfully
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onCancelMatch(match.id)}
                          className="w-full py-2 bg-transparent text-rose-300 hover:text-rose-400 hover:bg-rose-500/10 text-[10px] font-bold tracking-widest uppercase border border-rose-500/30 rounded-xl transition-colors cursor-pointer"
                        >
                          Cancel Spot (Full Refund)
                        </motion.button>
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: isFull ? 1 : 1.02 }}
                        whileTap={{ scale: isFull ? 1 : 0.95 }}
                        disabled={isFull}
                        onClick={() => onJoinMatch(match.id)}
                        className={`w-full py-3 rounded-2xl text-xs font-black tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                          isFull
                            ? 'bg-white/10 text-slate-400 border border-white/10 cursor-not-allowed'
                            : 'bg-[#007AFF] hover:bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/25'
                        }`}
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        {isFull ? 'Sold Out' : 'JOIN GAME'}
                      </motion.button>
                    )}
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

    </div>
  );
};
