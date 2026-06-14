import React, { useState } from 'react';
import { Logo } from './Logo';
import { MetroCity, UserProfile } from '../types';
import { MapPin, ChevronDown, Wallet, User, Calendar, Award, SlidersHorizontal } from 'lucide-react';

interface HeaderProps {
  selectedCity: MetroCity;
  onCityChange: (city: MetroCity) => void;
  user: UserProfile;
  onTopUp: (amount: number) => void;
  onOpenControlCenter?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ selectedCity, onCityChange, user, onTopUp, onOpenControlCenter }) => {
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const cities: MetroCity[] = ['Bengaluru', 'Delhi NCR', 'Mumbai', 'Hyderabad', 'Chennai'];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/60 border-b border-slate-200/50 px-4 lg:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Brand Identity & City Picker */}
        <div className="flex items-center gap-6">
          <Logo />
          
          {/* Slick City Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setCityDropdownOpen(!cityDropdownOpen);
                setProfileOpen(false);
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5E5EA] hover:bg-[#D1D1D6] text-slate-800 text-xs font-semibold tracking-wide transition-all border border-transparent cursor-pointer active:scale-95 animate-fade-in"
            >
              <MapPin className="h-3.5 w-3.5 text-blue-500" />
              <span>{selectedCity}</span>
              <ChevronDown className={`h-3 w-3 text-slate-550 transition-transform duration-200 ${cityDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {cityDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setCityDropdownOpen(false)} 
                />
                <div className="absolute left-0 mt-2 w-52 rounded-2xl bg-white/95 border border-slate-200 shadow-2xl p-2 z-20 backdrop-blur-3xl animate-in fade-in slide-in-from-top-3 duration-200 text-slate-850">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Select Your Region
                  </div>
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        onCityChange(city);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                        selectedCity === city
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <span>{city}</span>
                      {selectedCity === city && (
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-550 bg-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Balance, Live Stats and Profile Widget */}
        <div className="flex items-center gap-4">
          
          {/* Quick Wallet Indicator */}
          <div className="hidden sm:flex items-center gap-2 bg-white/80 p-1.5 px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-xs">
            <Wallet className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-slate-800 font-bold font-mono">₹{user.walletBalance}</span>
          </div>

          {/* iOS System Slider Trigger */}
          {onOpenControlCenter && (
            <button
              onClick={onOpenControlCenter}
              title="Open System Controls"
              className="p-1.5 h-8 w-8 flex items-center justify-center rounded-full bg-[#E5E5EA] hover:bg-[#D1D1D6] text-slate-700 transition-all active:scale-90 cursor-pointer border border-transparent"
            >
              <SlidersHorizontal className="h-4 w-4 text-slate-800" />
            </button>
          )}

          {/* User Profile Trigger Button */}
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setCityDropdownOpen(false);
            }}
            className="relative flex items-center gap-2.5 p-1.5 pr-3.5 rounded-full bg-white/80 hover:bg-slate-50 border border-slate-200/80 shadow-xs transition-all active:scale-95 cursor-pointer text-left"
          >
            {/* Minimalist modern profile avatar */}
            <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-650 bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="hidden md:block">
              <div className="text-[10px] font-sans text-slate-400 font-medium leading-none">In-Play Rank</div>
              <div className="text-xs font-bold text-slate-800 leading-tight">Master Pro</div>
            </div>
          </button>

          {profileOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setProfileOpen(false)} 
              />
              <div className="absolute right-4 mt-16 w-80 rounded-3xl bg-white/95 border border-slate-200 p-5 shadow-2xl z-20 backdrop-blur-3xl animate-in fade-in slide-in-from-top-3 duration-200" style={{ top: '3.5rem' }}>
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white text-lg">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{user.name}</h3>
                    <p className="text-xs text-slate-500 font-mono">+91 {user.phone}</p>
                  </div>
                </div>

                {/* Profile Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                      <Calendar className="h-3 w-3 text-blue-500" /> Matches
                    </div>
                    <div className="text-lg font-black text-slate-900">{user.joinedGames.length}</div>
                    <p className="text-[9px] text-slate-500">Successfully booked</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                      <Award className="h-3 w-3 text-blue-500" /> Level
                    </div>
                    <div className="text-lg font-black text-blue-600">Tier 1</div>
                    <p className="text-[9px] text-slate-500">HSR MVP Streak</p>
                  </div>
                </div>

                {/* Simulated Wallet System */}
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/70 mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Balance</span>
                    <Wallet className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  <div className="text-2xl font-black text-[#007AFF] font-mono">₹{user.walletBalance}</div>
                  
                  {/* Top-up buttons */}
                  <div className="grid grid-cols-3 gap-1.5 mt-3">
                    {[200, 500, 1000].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => onTopUp(amt)}
                        className="py-1.5 bg-white hover:bg-blue-55 hover:bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg border border-slate-200 cursor-pointer active:scale-95 transition-all text-center"
                      >
                        +₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-center text-[10px] text-slate-400 mt-2 font-mono">
                  CROSSBARS Elite Member ID: #CB-2026-BGLR
                </div>
              </div>
            </>
          )}

        </div>

      </div>
    </header>
  );
};
