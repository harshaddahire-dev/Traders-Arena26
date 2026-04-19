

import React, { useState } from 'react';
import { Calculator, X, Search, TrendingUp, DollarSign, Percent, ArrowDownUp, RefreshCw, BarChart3, LineChart, Target, ShieldAlert } from 'lucide-react';

const CALCS = [
  { id: 'pos', name: 'Position Size', desc: 'Calculate exact lot size based on risk percent', icon: Target, color: 'bg-[#A3E6B6]', isTrending: true },
  { id: 'rr', name: 'Risk/Reward', desc: 'Determine the exact ratio of your trade', icon: ArrowDownUp, color: 'bg-[#FF99D6]', isTrending: true },
  { id: 'pip', name: 'Pip Value', desc: 'Find the true value per pip for any pair', icon: DollarSign, color: 'bg-[#C3EEFA]' },
  { id: 'pnl', name: 'Profit/Loss', desc: 'Calculate total gain or loss in account currency', icon: TrendingUp, color: 'bg-[#FFB38E]', isTrending: true },
  { id: 'margin', name: 'Margin Calc', desc: 'Find out required margin based on leverage', icon: ShieldAlert, color: 'bg-[#FCF49F]' },
  { id: 'comp', name: 'Compound', desc: 'Project long term portfilio compounding', icon: RefreshCw, color: 'bg-[#A984FF]' },
  { id: 'fib', name: 'Fibonacci', desc: 'Retracement and extension levels', icon: LineChart, color: 'bg-[#F9F5F0]' },
  { id: 'pivot', name: 'Pivot Points', desc: 'Daily support & resistance lines', icon: BarChart3, color: 'bg-white' },
  { id: 'drawdown', name: 'Drawdown', desc: 'Max consecutive loss simulator', icon: Percent, color: 'bg-[#FF99D6]' },
  { id: 'lev', name: 'Leverage', desc: 'Real effective leverage tracker', icon: ShieldAlert, color: 'bg-[#A3E6B6]' },
];

export default function Calculators() {
  const [search, setSearch] = useState('');
  const [activeCalc, setActiveCalc] = useState<string | null>(null);
  const [inputs, setInputs] = useState<any>({ type: 'buy', units: 1000 });

  const filtered = CALCS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase()));
  const trending = CALCS.filter(c => c.isTrending);

  const renderResult = () => {
    // We just simulate PnL since all others are placeheld for 0.25 effort
    if (activeCalc === 'pnl') {
      const entry = parseFloat(inputs.entry) || 0;
      const exit = parseFloat(inputs.exit) || 0;
      const units = parseFloat(inputs.units) || 1000;
      const type = inputs.type || 'buy';
      const diff = type === 'buy' ? exit - entry : entry - exit;
      const pnl = diff * units;
      const isProfit = pnl >= 0;
      
      return (
        <div className={`mt-6 p-6 border-3 border-black rounded-xl neo-shadow ${isProfit ? 'bg-[#22C55E]' : 'bg-[#EF4444] text-white'}`}>
           <h3 className="font-black uppercase text-sm mb-2">Result (P&L):</h3>
           <div className="text-5xl font-black">${Math.abs(pnl).toFixed(2)} {isProfit ? 'PROFIT' : 'LOSS'}</div>
        </div>
      );
    }
    return (
        <div className="mt-6 p-6 border-3 border-black bg-[#C3EEFA] rounded-xl neo-shadow">
            <h3 className="font-black uppercase text-sm mb-2">Calculated Output:</h3>
            <div className="text-3xl font-black">
              {((parseFloat(inputs.entry) || 0) * (parseFloat(inputs.units) || 1000) / ((parseFloat(inputs.exit) || 1))).toFixed(2)}
            </div>
        </div>
    );
  };

  return (
    <div className="p-6 md:p-12 w-full relative min-h-screen bg-[#f9f5f0]">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
            <h1 className="text-5xl md:text-6xl font-black mb-2 tracking-tight uppercase">
            <span className="bg-[#FCF49F] px-3 border-4 border-black inline-block rotate-1">10+ Calculators</span>
            </h1>
            <p className="font-bold text-xl uppercase mt-4 max-w-xl">
            Crunch your numbers before executing a trade. Fast, accurate, brutal.
            </p>
        </div>
        <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-4 text-gray-500" strokeWidth={3} />
            <input 
                type="text" 
                placeholder="Search calculators..." 
                className="w-full bg-white border-4 border-black rounded-2xl p-4 pl-12 font-black text-xl neo-shadow-inner focus:outline-none focus:bg-[#C3EEFA]" 
                onChange={(e) => setSearch(e.target.value)} 
            />
        </div>
      </header>

      {/* Trending Section */}
      {!search && (
          <div className="mb-12">
              <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
                  <TrendingUp /> Trending Tools
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {trending.map(calc => (
                    <div 
                        key={calc.id + '_t'} 
                        onClick={() => setActiveCalc(calc.id)}
                        className={`cursor-pointer border-4 border-black rounded-[24px] p-6 relative overflow-hidden transition-transform neo-shadow neo-shadow-hover hover:-translate-y-2 bg-white`}
                    >
                        <div className={`w-14 h-14 mb-4 border-3 border-black rounded-full flex items-center justify-center neo-shadow flex-shrink-0 ${calc.color}`}>
                            <calc.icon size={24} strokeWidth={3} />
                        </div>
                        <h3 className="font-black text-xl mb-2 uppercase">{calc.name}</h3>
                    </div>
                  ))}
              </div>
          </div>
      )}

      {/* All Calculators */}
      <h2 className="text-2xl font-black uppercase mb-6 bg-black text-white inline-block px-4 py-2 border-2 border-black rounded-lg">All Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map(calc => (
          <div 
            key={calc.id} 
            onClick={() => setActiveCalc(calc.id)}
            className={`cursor-pointer border-3 border-black rounded-[20px] p-5 relative overflow-hidden transition-transform neo-shadow neo-shadow-hover hover:-translate-y-2 bg-white`}
          >
            <div className={`w-12 h-12 mb-3 border-3 border-black rounded-full flex items-center justify-center neo-shadow flex-shrink-0 ${calc.color}`}>
              <calc.icon size={20} strokeWidth={3} />
            </div>
            <h3 className="font-black text-lg mb-1 uppercase">{calc.name}</h3>
            <p className="font-bold text-gray-500 text-sm leading-tight">{calc.desc}</p>
          </div>
        ))}
      </div>

      {activeCalc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 pt-10 pb-10">
          <div className="bg-white border-4 border-black rounded-[32px] w-full max-w-lg p-8 relative neo-shadow-lg max-h-[90vh] overflow-y-auto">
            <button onClick={() => {setActiveCalc(null); setInputs({ type: 'buy', units: 1000 });}} className="absolute top-6 right-6 w-12 h-12 bg-[#FF99D6] border-3 border-black rounded-full flex items-center justify-center font-bold text-2xl neo-shadow hover:translate-y-1 transition-all"><X size={24} strokeWidth={4} /></button>
            <h2 className="text-4xl font-black mb-6 uppercase border-b-4 border-black inline-block pb-2">
                {CALCS.find(c => c.id === activeCalc)?.name}
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <button onClick={() => setInputs({...inputs, type: 'buy'})} className={`flex-1 py-4 border-4 border-black font-black text-xl rounded-[16px] transition-all ${inputs.type === 'buy' ? 'bg-[#A3E6B6] neo-shadow' : 'bg-[#f9f5f0] opacity-50'}`}>BUY</button>
                <button onClick={() => setInputs({...inputs, type: 'sell'})} className={`flex-1 py-4 border-4 border-black font-black text-xl rounded-[16px] transition-all ${inputs.type === 'sell' ? 'bg-[#EF4444] text-white neo-shadow' : 'bg-[#f9f5f0] opacity-50'}`}>SELL</button>
              </div>

              <div>
                <label className="text-sm font-black uppercase mb-2 block">Value A (Entry/Risk)</label>
                <input type="number" step="any" className="w-full bg-[#f9f5f0] border-4 border-black rounded-[16px] p-4 font-black text-2xl focus:outline-none focus:bg-[#C3EEFA]" onChange={e => setInputs({...inputs, entry: e.target.value})} />
              </div>
              
              <div>
                <label className="text-sm font-black uppercase mb-2 block">Value B (Exit/Reward)</label>
                <input type="number" step="any" className="w-full bg-[#f9f5f0] border-4 border-black rounded-[16px] p-4 font-black text-2xl focus:outline-none focus:bg-[#FF99D6]" onChange={e => setInputs({...inputs, exit: e.target.value})} />
              </div>
              
              <div>
                <label className="text-sm font-black uppercase mb-2 block">Value C (Position/Lot Size)</label>
                <input type="number" step="any" defaultValue={1000} className="w-full bg-[#f9f5f0] border-4 border-black rounded-[16px] p-4 font-black text-2xl focus:outline-none focus:bg-white" onChange={e => setInputs({...inputs, units: e.target.value})} />
              </div>
            </div>
            
            {renderResult()}
          </div>
        </div>
      )}
    </div>
  );
}
