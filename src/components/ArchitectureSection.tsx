import React, { useState, useEffect } from 'react';
import { Database, Zap, Cpu, Server, Earth, Activity, ShieldCheck } from 'lucide-react';

export const ArchitectureSection: React.FC = () => {
  const [concurrentUsers, setConcurrentUsers] = useState(12000);
  const [redisEnabled, setRedisEnabled] = useState(true);
  const [serverLoad, setServerLoad] = useState(24);
  const [dbQueriesSec, setDbQueriesSec] = useState(120);
  const [avgLatency, setAvgLatency] = useState(38); // in ms
  const [cacheHitRate, setCacheHitRate] = useState(94.5);

  // Dynamic simulation of traffic patterns
  useEffect(() => {
    const interval = setInterval(() => {
      setConcurrentUsers(prev => {
        const delta = Math.floor((Math.random() - 0.5) * 400);
        const next = prev + delta;
        return next < 3000 ? 3000 : next > 45000 ? 45000 : next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Compute metrics in real-time based on state
  useEffect(() => {
    if (redisEnabled) {
      setCacheHitRate(92 + Math.random() * 5);
      setDbQueriesSec(Math.round(concurrentUsers * 0.012));
      const baseLatency = 25;
      const loadFactor = (concurrentUsers / 30000) * 15;
      setAvgLatency(Math.round(baseLatency + loadFactor));
      setServerLoad(Math.min(98, Math.round(15 + (concurrentUsers / 30000) * 20)));
    } else {
      setCacheHitRate(0);
      setDbQueriesSec(Math.round(concurrentUsers * 1.8));
      const baseLatency = 140; 
      const queuePenalty = (concurrentUsers / 12000) * 180; 
      setAvgLatency(Math.round(baseLatency + queuePenalty));
      setServerLoad(Math.min(100, Math.round(55 + (concurrentUsers / 12000) * 45)));
    }
  }, [concurrentUsers, redisEnabled]);

  return (
    <div className="w-full bg-white/10 border border-white/20 rounded-[32px] p-6 lg:p-10 relative overflow-hidden shadow-2xl backdrop-blur-2xl text-white mt-12 mb-12">
      
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-300 bg-white/10 px-3 py-1 rounded-full border border-white/10 mb-2 uppercase tracking-widest font-mono">
            <Activity className="h-3 w-3 animate-pulse text-blue-400" /> Pan-INDIA Systems Blueprint
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            CROSSBARS <span className="text-slate-300 font-medium">Pan-India Scale Infrastructure</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Live simulation of <strong className="text-white">CROSSBARS High-Performance Stack</strong> handling peak evening hours (05:00 PM - 09:00 PM) when millions of turf bookings occur.
          </p>
        </div>

        {/* Caching control switch */}
        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/10 self-start md:self-center shadow-lg">
          <div className="text-right">
            <div className="text-[10px] font-black text-slate-200 uppercase tracking-wider">Redis Cache Override</div>
            <div className="text-xs text-slate-400 font-medium">Bypass cache layer</div>
          </div>
          <button
            type="button"
            onClick={() => setRedisEnabled(!redisEnabled)}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 cursor-pointer relative ${
              redisEnabled ? 'bg-[#007AFF]' : 'bg-white/10'
            }`}
          >
            <div className={`h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 transform ${
              redisEnabled ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      {/* Grid: 1. Telemetry Dashboard, 2. Dynamic Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Dynamic Architecture metrics panel */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">
              Engine Telemetry Sim
            </h4>

            {/* Concurrent active simulation tuner */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="flex justify-between text-xs text-slate-200 mb-2 font-bold">
                <span>Concurrent Connections</span>
                <span className="font-mono text-white font-black">{concurrentUsers.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="3000"
                max="45000"
                step="1000"
                value={concurrentUsers}
                onChange={(e) => setConcurrentUsers(Number(e.target.value))}
                className="w-full accent-[#007AFF] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
                <span>3k idle</span>
                <span>Peak Evening Load (45k)</span>
              </div>
            </div>

            {/* Simulated Live telemetry cards */}
            <div className="grid grid-cols-2 gap-3">
              
              <div className="bg-white/5 p-3 rounded-2xl border border-white/10 shadow-lg">
                <span className="text-[9px] font-bold text-slate-350 uppercase block">Edge Latency</span>
                <span className="text-xl font-black font-mono text-white mt-1 block">
                  {avgLatency}ms
                </span>
                <span className={`text-[8px] font-bold uppercase ${
                  avgLatency < 50 ? 'text-blue-400' : avgLatency < 120 ? 'text-amber-400' : 'text-rose-455 text-rose-400'
                }`}>
                  {avgLatency < 50 ? '● Ultra Fast' : avgLatency < 120 ? '● Moderate' : '● DB BottleNeck'}
                </span>
              </div>

              <div className="bg-white/5 p-3 rounded-2xl border border-white/10 shadow-lg">
                <span className="text-[9px] font-bold text-slate-350 uppercase block">Redis Cache Hit</span>
                <span className="text-xl font-black font-mono text-white mt-1 block">
                  {cacheHitRate.toFixed(1)}%
                </span>
                <span className="text-[8px] text-slate-400 font-medium block">
                  {redisEnabled ? 'Bypassing DB disk IO' : 'Cache disabled'}
                </span>
              </div>

              <div className="bg-white/5 p-3 rounded-2xl border border-white/10 shadow-lg">
                <span className="text-[9px] font-bold text-slate-355 text-slate-350 uppercase block">Database Load</span>
                <span className="text-xl font-black font-mono text-white mt-1 block">
                  {dbQueriesSec.toLocaleString()}/s
                </span>
                <span className="text-[8px] text-slate-400 font-medium block">Active Queries</span>
              </div>

              <div className="bg-white/5 p-3 rounded-2xl border border-white/10 shadow-lg">
                <span className="text-[9px] font-bold text-slate-350 uppercase block">Cluster CPU Load</span>
                <span className="text-xl font-black font-mono text-white mt-1 block">
                  {serverLoad}%
                </span>
                <span className={`text-[8px] font-bold uppercase ${
                  serverLoad < 50 ? 'text-emerald-400' : serverLoad < 80 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {serverLoad < 50 ? 'Health OK' : serverLoad < 80 ? 'Warning' : 'Throttling'}
                </span>
              </div>

            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mt-4">
            <span className="text-[10px] uppercase font-bold text-blue-300 tracking-wider flex items-center gap-1.5 font-sans">
              <ShieldCheck className="h-3.5 w-3.5" /> High Availability Stack
            </span>
            <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
              If an evening match booking goes viral in Hyderabad and Delhi simultaneously, our distributed system prevents database locks using lockless slot allocations and atomic state counters.
            </p>
          </div>
        </div>

        {/* Right Side: High Visual Architecture explanation with details of stack */}
        <div className="lg:col-span-8 bg-white/5 border border-white/15 rounded-3xl p-6 lg:p-8 space-y-6 flex flex-col justify-between shadow-2xl">
          
          <h3 className="text-slate-300 text-xs font-bold tracking-tight uppercase font-mono">
            Structured Stack Blueprints
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Tech Stack 1 */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 shadow-md">
                  <Cpu className="h-3.5 w-3.5 text-blue-400" />
                </div>
                <h4 className="text-xs font-bold text-white">Next.js SSR & Serverless Clusters</h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Server-Side Rendered layouts are optimized and served globally. Write operations are dispatched securely through isolated serverless functions on AWS/Vercel platform to handle random traffic spikes.
              </p>
            </div>

            {/* Tech Stack 2 */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 shadow-md">
                  <Zap className="h-3.5 w-3.5 text-yellow-400" />
                </div>
                <h4 className="text-xs font-bold text-white">Redis Multi-AZ Memory Cache Layer</h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Handles heavy read-traffic of the <strong>"Live Match Feed"</strong>. Turf schedules are cached close to users, resulting in sub-15ms response times. Live updates are pushed over WebSockets.
              </p>
            </div>

            {/* Tech Stack 3 */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 shadow-md">
                  <Earth className="h-3.5 w-3.5 text-sky-400" />
                </div>
                <h4 className="text-xs font-bold text-white">Anycast Cloudflare Edge CDN</h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Route requests to the nearest edge location. A user in Delhi-NCR hits the <strong>del-1</strong> node, and a user in Bengaluru hits the <strong>blr-1</strong> node, bypassing round-trips to any single central server.
              </p>
            </div>

            {/* Tech Stack 4 */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 shadow-md">
                  <Database className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <h4 className="text-xs font-bold text-white">PostgreSQL with PgBouncer Cluster</h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Our relational core database handles bookings with full ACID transaction safety. Utilizing connection pooling prevents socket exhaustion under heavy load, keeping writes snappy.
              </p>
            </div>

          </div>

          {/* Database Schema Visual Concept */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-3 text-center text-[10px] font-mono text-slate-300">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-white font-black mb-1 text-[11px]">users TABLE</div>
              id (UUID) PK • name • phone • wallet_balance_inr (DECIMAL)
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-white font-black mb-1 text-[11px]">matches TABLE</div>
              id • turf_id • sport • format • scheduled_time • slots_total
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-white font-black mb-1 text-[11px]">bookings TABLE</div>
              id PK • user_id FK • match_id FK • paid_amount_inr • txn_status
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
