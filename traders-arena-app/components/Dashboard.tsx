'use client';

import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Activity, BarChart2, Star, Brain } from 'lucide-react';

export default function Dashboard() {
  const [budget, setBudget] = useState<string | null>(null);
  const [username, setUsername] = useState('Trader');
  const [showBudgetSetup, setShowBudgetSetup] = useState(false);
  const [inputBudget, setInputBudget] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('arena_username');
    if (savedName) setUsername(savedName);

    const savedBudget = localStorage.getItem('arena_budget');
    if (!savedBudget) {
      setShowBudgetSetup(true);
    } else {
      setBudget(savedBudget);
    }
  }, []);

  const handleSetBudget = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('arena_budget', inputBudget);
    setBudget(inputBudget);
    setShowBudgetSetup(false);
  };

  return (
    <div className="p-6 md:p-12 w-full">
      <header className="mb-10">
        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight uppercase flex flex-col sm:flex-row sm:items-center gap-4">
          <span className="bg-[#A3E6B6] px-4 py-1 border-4 border-black inline-block -rotate-1 neo-shadow">Welcome, {username}</span>
        </h1>
        <p className="font-bold text-xl uppercase mt-4 max-w-xl">Here is your brutal performance reality check.</p>
      </header>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white border-4 border-black rounded-3xl p-6 neo-shadow hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-center mb-4">
            <span className="font-black uppercase text-sm">Monthly Budget</span>
            <div className="w-12 h-12 bg-[#FCF49F] border-3 border-black rounded-full flex items-center justify-center neo-shadow">
              <Target size={24} strokeWidth={3} />
            </div>
          </div>
          <div className="text-5xl font-black">${budget || '0'}</div>
          <div className="text-sm font-bold text-gray-500 mt-2 uppercase tracking-wide">Starting Balance</div>
        </div>

        <div className="bg-[#C3EEFA] border-4 border-black rounded-3xl p-6 neo-shadow hover:-translate-y-1 transition-transform text-black flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="font-black uppercase text-sm">Win Rate</span>
            <div className="w-12 h-12 bg-white border-3 border-black rounded-full flex items-center justify-center neo-shadow">
              <TrendingUp size={24} strokeWidth={3} />
            </div>
          </div>
          <div className="text-5xl font-black">---%</div>
          <div className="text-sm font-bold mt-2 uppercase tracking-wide">Log trades to see</div>
        </div>

        <div className="bg-[#FF99D6] border-4 border-black rounded-3xl p-6 neo-shadow hover:-translate-y-1 transition-transform text-black flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="font-black uppercase text-sm">Active Phase</span>
            <div className="w-12 h-12 bg-white border-3 border-black rounded-full flex items-center justify-center neo-shadow">
              <Activity size={24} strokeWidth={3} />
            </div>
          </div>
          <div className="text-4xl font-black">FUNDED</div>
          <div className="text-sm font-bold mt-2 uppercase tracking-wide">Account Status</div>
        </div>

        <div className="bg-white border-4 border-black rounded-3xl p-6 neo-shadow hover:-translate-y-1 transition-transform flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <BarChart2 size={120} strokeWidth={4} />
          </div>
          <div className="flex justify-between items-center mb-4 relative z-10">
            <span className="font-black uppercase text-sm">Net P&L</span>
            <div className="w-12 h-12 bg-[#A984FF] border-3 border-black rounded-full flex items-center justify-center neo-shadow">
              <BarChart2 size={24} strokeWidth={3} className="text-white" />
            </div>
          </div>
          <div className="text-5xl font-black relative z-10 text-[#22C55E]">+ $0.00</div>
          <div className="text-sm font-bold mt-2 uppercase tracking-wide relative z-10">This Month</div>
        </div>
      </div>
        
      {/* Middle Section AI Check (Mocked for looks) */}
      <h2 className="text-2xl font-black mb-6 uppercase flex items-center gap-2">
        <Brain strokeWidth={3}/> Weekly Insights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border-4 border-black rounded-[32px] p-8 neo-shadow pb-12">
          <div className="bg-[#F9F5F0] border-4 border-black border-dashed rounded-3xl p-6 text-center text-gray-500 font-black uppercase text-xl flex items-center justify-center min-h-[150px]">
             Log trades to generate psychology heatmaps.
          </div>
          <div className="bg-[#F9F5F0] border-4 border-black border-dashed rounded-3xl p-6 text-center text-gray-500 font-black uppercase text-xl flex items-center justify-center min-h-[150px]">
             Log trades to generate strategy breakdown.
          </div>
      </div>

      {showBudgetSetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white border-4 border-black rounded-[32px] w-full max-w-sm p-8 relative neo-shadow-lg text-center animate-in zoom-in duration-200">
            <div className="w-20 h-20 bg-[#FCF49F] border-4 border-black rounded-full mx-auto flex items-center justify-center mb-6 neo-shadow">
              <Target size={40} strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Set Your Bankroll</h2>
            <p className="font-bold text-gray-600 mb-8">What is the total account balance you are trading with?</p>
            
            <form onSubmit={handleSetBudget} className="space-y-6">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-2xl">$</span>
                <input 
                  type="number" 
                  required
                  className="w-full bg-[#F9F5F0] border-4 border-black rounded-xl py-4 pl-12 pr-4 font-black text-3xl focus:outline-none focus:bg-[#C3EEFA]"
                  placeholder="10000"
                  onChange={e => setInputBudget(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-[#A984FF] border-4 border-black py-4 rounded-xl font-black uppercase text-xl text-black hover:bg-[#8e6bea] hover:-translate-y-1 transition-all neo-shadow hover:neo-shadow-hover"
              >
                Set Bankroll &rarr;
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}