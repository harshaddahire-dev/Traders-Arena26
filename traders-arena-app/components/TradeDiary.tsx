

import React, { useState, useEffect } from 'react';
import { Plus, X, TrendingUp, TrendingDown, Trash2, Star, Search, ShieldAlert, LineChart } from 'lucide-react';

type Trade = {
  id: string; date: string; time: string; asset: string; type: 'BUY' | 'SELL';
  entry: number; sl: number; tp: number; exit: number; size: number; pnl: number; rr: number;
  strategy: string; timeframe: string; condition: 'Trending' | 'Ranging';
  rating: number; emotionBefore: string; emotionAfter: string;
  discipline: boolean; mistakes: string; confidence: number;
};

const ASSETS = [
    { cat: 'Major Pairs', list: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'NZD/USD'] },
    { cat: 'Commodities', list: ['XAU/USD', 'XAG/USD', 'USOIL', 'BRENT'] },
    { cat: 'Crypto', list: ['BTC/USD', 'ETH/USD', 'SOL/USDT', 'XRP/USDT'] }
];

export default function TradeDiary() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [viewNote, setViewNote] = useState<string | null>(null);
  const [tab, setTab] = useState<'info' | 'strategy' | 'psychology' | 'review'>('info');
  const [formData, setFormData] = useState<Partial<Trade>>({ 
      type: 'BUY', date: new Date().toISOString().split('T')[0], time: '12:00',
      timeframe: 'H1', condition: 'Trending', rating: 3, confidence: 5, discipline: true
  });
  const [assetSearch, setAssetSearch] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('arena_trades_v2');
    if (saved) setTrades(JSON.parse(saved));
  }, []);

  const saveTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrade = { ...formData, id: Date.now().toString() } as Trade;
    
    const diff = newTrade.type === 'BUY' ? newTrade.exit - newTrade.entry : newTrade.entry - newTrade.exit;
    newTrade.pnl = diff * newTrade.size;
    
    const rrRisk = Math.abs(newTrade.entry - newTrade.sl);
    const rrReward = Math.abs(newTrade.tp - newTrade.entry);
    newTrade.rr = rrRisk > 0 ? (rrReward / rrRisk) : 0;
    
    const updated = [newTrade, ...trades];
    setTrades(updated);
    localStorage.setItem('arena_trades_v2', JSON.stringify(updated));
    setShowForm(false);
  };

  const deleteTrade = (id: string) => {
    const updated = trades.filter(t => t.id !== id);
    setTrades(updated);
    localStorage.setItem('arena_trades_v2', JSON.stringify(updated));
  };

  return (
    <div className="p-6 md:p-12 w-full relative min-h-screen bg-[#F9F5F0]">
      <header className="mb-10 flex flex-col justify-between items-start gap-4">
        <div className="flex justify-between w-full items-center">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase">
                <span className="bg-[#FF99D6] px-3 border-4 border-black inline-block rotate-1">Trade</span> Diary
            </h1>
            <button onClick={() => setShowForm(true)} className="bg-[#A3E6B6] border-4 border-black text-black font-black py-4 px-6 rounded-xl flex items-center gap-2 neo-shadow hover:-translate-y-1 transition-transform uppercase text-xl">
                <Plus size={24} strokeWidth={4} /> New Trade
            </button>
        </div>
      </header>

      {/* Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white border-3 border-black rounded-xl p-4 neo-shadow flex flex-col items-center">
              <span className="text-xs font-black uppercase text-gray-500">Win Rate</span>
              <span className="text-2xl font-black">
                  {trades.length ? ((trades.filter(t=>t.pnl > 0).length / trades.length)*100).toFixed(0) : 0}%
              </span>
          </div>
          <div className="bg-[#22C55E] border-3 border-black rounded-xl p-4 neo-shadow flex flex-col items-center text-white">
              <span className="text-xs font-black uppercase text-black">Wins</span>
              <span className="text-2xl font-black">{trades.filter(t => t.pnl > 0).length}</span>
          </div>
          <div className="bg-[#EF4444] border-3 border-black rounded-xl p-4 neo-shadow flex flex-col items-center text-white">
              <span className="text-xs font-black uppercase text-black">Losses</span>
              <span className="text-2xl font-black">{trades.filter(t => t.pnl <= 0).length}</span>
          </div>
          <div className="bg-[#C3EEFA] border-3 border-black rounded-xl p-4 neo-shadow flex flex-col items-center col-span-2 md:col-span-3">
              <span className="text-xs font-black uppercase text-gray-500">Total Net P&L</span>
              <span className={`text-4xl font-black ${trades.reduce((a,b)=>a+b.pnl,0) >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                ${trades.reduce((sum, t) => sum + t.pnl, 0).toFixed(2)}
              </span>
          </div>
      </div>

      <div className="w-full overflow-x-auto bg-white border-4 border-black rounded-3xl neo-shadow-lg relative overflow-hidden">
        <table className="w-full min-w-[1200px] text-left border-collapse">
          <thead>
            <tr className="border-b-4 border-black bg-[#F9F5F0]">
              <th className="p-4 font-black text-xs uppercase border-r-4 border-black">Date/Time</th>
              <th className="p-4 font-black text-xs uppercase border-r-4 border-black">Asset</th>
              <th className="p-4 font-black text-xs uppercase border-r-4 border-black">Type</th>
              <th className="p-4 font-black text-xs uppercase border-r-4 border-black">Price Action (En, SL, TP, Ex)</th>
              <th className="p-4 font-black text-xs uppercase border-r-4 border-black">R:R</th>
              <th className="p-4 font-black text-xs uppercase border-r-4 border-black">P&L</th>
              <th className="p-4 font-black text-xs uppercase border-r-4 border-black">Strategy</th>
              <th className="p-4 font-black text-xs uppercase border-r-4 border-black">Note</th>
              <th className="p-4 font-black text-xs uppercase text-center w-20">Act</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => {
              const isProfit = trade.pnl >= 0;
              return (
                <tr key={trade.id} className={`border-b-3 border-black transition-colors ${isProfit ? 'bg-[#A3E6B6]/20' : 'bg-[#EF4444]/10'}`}>
                  <td className="p-4 font-bold text-sm border-r-3 border-black">
                      {trade.date}<br/><span className="text-gray-500 text-xs">{trade.time}</span>
                  </td>
                  <td className="p-4 font-black text-lg border-r-3 border-black">{trade.asset}</td>
                  <td className="p-4 border-r-3 border-black">
                    <span className={`px-3 py-1 rounded-lg border-2 border-black font-black text-xs uppercase ${trade.type === 'BUY' ? 'bg-[#A3E6B6]' : 'bg-[#EF4444] text-white'}`}>
                      {trade.type}
                    </span>
                  </td>
                  <td className="p-4 border-r-3 border-black text-xs font-bold font-mono space-y-1">
                      <div className="flex justify-between"><span>IN:</span><span>{trade.entry}</span></div>
                      <div className="flex justify-between text-gray-500"><span>SL/TP:</span><span>{trade.sl} / {trade.tp}</span></div>
                      <div className="flex justify-between text-black font-black bg-white px-1 border-2 border-black rounded"><span>OUT:</span><span>{trade.exit}</span></div>
                  </td>
                  <td className="p-4 font-black border-r-3 border-black bg-white">1:{trade.rr?.toFixed(2)||'0'}</td>
                  <td className="p-4 border-r-3 border-black">
                    <span className={`inline-flex items-center gap-2 font-black px-3 py-1 border-2 border-black rounded-lg neo-shadow-sm ${isProfit ? 'bg-[#22C55E] text-white' : 'bg-[#EF4444] text-white'}`}>
                      ${Math.abs(trade.pnl).toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-xs border-r-3 border-black uppercase">{trade.strategy} <br/><span className="text-gray-500">{trade.timeframe}</span></td>
                  <td 
                    onClick={() => trade.mistakes && setViewNote(trade.mistakes)}
                    className="p-4 font-bold text-xs border-r-3 border-black bg-white max-w-[150px] relative group cursor-pointer hover:bg-[#F9F5F0]">
                    <div className="truncate">{trade.mistakes || "-"}</div>
                    {trade.mistakes && (
                      <div className="hidden group-hover:block absolute z-50 bg-white text-black p-3 rounded-xl border-3 border-black top-full left-1/2 -translate-x-1/2 mt-2 w-64 whitespace-normal break-words shadow-[4px_4px_0_0_#FF99D6]">
                        <span className="font-black text-[#A984FF] uppercase mb-1 block">Full Note (Click to view larger)</span>
                        <div className="line-clamp-3">{trade.mistakes}</div>
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => deleteTrade(trade.id)} className="bg-white border-2 border-black p-2 rounded-lg hover:bg-[#EF4444] hover:text-white transition-colors neo-shadow-hover hover:-translate-y-1">
                      <Trash2 size={18} strokeWidth={3} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* TABS FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md px-4 py-4">
          <div className="bg-[#F9F5F0] border-4 border-black rounded-[24px] w-full max-w-2xl max-h-[90vh] flex flex-col relative neo-shadow-xl overflow-hidden">
            
            {/* Header */}
            <div className="bg-white p-4 border-b-4 border-black flex justify-between items-center z-10 relative">
                <h2 className="text-xl font-black uppercase tracking-tight">New Trade Entry</h2>
                <button type="button" onClick={() => setShowForm(false)} className="w-10 h-10 bg-[#FF99D6] border-4 border-black rounded-full flex items-center justify-center neo-shadow hover:translate-y-1 transition-all"><X strokeWidth={4} size={20}/></button>
            </div>

            {/* Tabs */}
            <div className="flex bg-[#FCF49F] border-b-4 border-black font-black uppercase text-xs md:text-sm divide-x-4 divide-black">
                {['info', 'strategy', 'psychology', 'review'].map(t => (
                    <button type="button" key={t} onClick={()=>setTab(t as any)} className={`flex-1 py-3 transition-colors ${tab===t ? 'bg-black text-white' : 'hover:bg-white'}`}>
                        {t}
                    </button>
                ))}
            </div>

            {/* Form Body Container */}
            <div className="p-4 md:p-6 overflow-y-auto flex-1 custom-scrollbar">
                <form id="tradeForm" onSubmit={saveTrade} className="space-y-4 max-w-xl mx-auto">
                    
                    {/* TAB: INFO */}
                    <div className={tab === 'info' ? 'block' : 'hidden'}>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div><label className="text-[10px] font-black uppercase mb-1 block">Date</label><input type="date" className="w-full bg-white border-3 border-black rounded-lg p-2 font-bold text-sm" required onChange={e=>setFormData({...formData, date: e.target.value})} defaultValue={formData.date}/></div>
                            <div><label className="text-[10px] font-black uppercase mb-1 block">Time</label><input type="time" className="w-full bg-white border-3 border-black rounded-lg p-2 font-bold text-sm" required onChange={e=>setFormData({...formData, time: e.target.value})} defaultValue={formData.time}/></div>
                        </div>

                        <div className="mb-3 relative">
                            <label className="text-[10px] font-black uppercase mb-1 block">Asset Selector</label>
                            <input type="text" placeholder="Search EUR/USD, BTC, Custom..." className="w-full bg-white border-3 border-black rounded-lg p-3 font-black text-sm mb-1" onChange={(e) => {setFormData({...formData, asset: e.target.value}); setAssetSearch(e.target.value);}} value={formData.asset||''}/>
                        </div>

                        <div className="flex gap-3 mb-4">
                            <button type="button" onClick={() => setFormData({...formData, type: 'BUY'})} className={`flex-1 py-2 border-3 border-black font-black text-lg rounded-xl ${formData.type === 'BUY' ? 'bg-[#A3E6B6] neo-shadow' : 'bg-white opacity-50'}`}>BUY (LONG)</button>
                            <button type="button" onClick={() => setFormData({...formData, type: 'SELL'})} className={`flex-1 py-2 border-3 border-black font-black text-lg rounded-xl ${formData.type === 'SELL' ? 'bg-[#EF4444] text-white neo-shadow' : 'bg-white opacity-50'}`}>SELL (SHORT)</button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 p-4 bg-white border-3 border-black rounded-2xl neo-shadow-sm mb-4">
                            <div><label className="text-[10px] font-black uppercase mb-1 block">Entry</label><input type="number" step="any" required className="w-full bg-[#f9f5f0] border-2 border-black rounded-lg p-2 font-black text-sm" onChange={e=>setFormData({...formData, entry: parseFloat(e.target.value)})}/></div>
                            <div><label className="text-[10px] font-black uppercase mb-1 block">Exit</label><input type="number" step="any" required className="w-full bg-[#FCF49F] border-2 border-black rounded-lg p-2 font-black text-sm" onChange={e=>setFormData({...formData, exit: parseFloat(e.target.value)})}/></div>
                            <div><label className="text-[10px] font-black uppercase mb-1 block">Stop Loss</label><input type="number" step="any" required className="w-full bg-[#f9f5f0] border-2 border-black rounded-lg p-2 font-black text-sm" onChange={e=>setFormData({...formData, sl: parseFloat(e.target.value)})}/></div>
                            <div><label className="text-[10px] font-black uppercase mb-1 block">Take Profit</label><input type="number" step="any" required className="w-full bg-[#f9f5f0] border-2 border-black rounded-lg p-2 font-black text-sm" onChange={e=>setFormData({...formData, tp: parseFloat(e.target.value)})}/></div>
                            <div className="col-span-2"><label className="text-[10px] font-black uppercase mb-1 block">Position / Lot Size</label><input type="number" step="any" required className="w-full bg-[#A3E6B6] border-2 border-black rounded-lg p-2 font-black text-base text-center" onChange={e=>setFormData({...formData, size: parseFloat(e.target.value)})}/></div>
                        </div>

                        <div className="bg-[#C3EEFA] border-3 border-black rounded-2xl p-4 neo-shadow flex justify-between items-center group">
                            <span className="font-black uppercase text-sm">Auto R:R (Projected)</span>
                            <span className="text-xl font-black bg-white border-3 border-black px-3 py-1 rounded-lg group-hover:scale-105 transition-transform">
                                1 : {Math.abs(formData.entry! - formData.sl!) > 0 ? (Math.abs(formData.tp! - formData.entry!) / Math.abs(formData.entry! - formData.sl!)).toFixed(2) : '0.00'}
                            </span>
                        </div>
                    </div>

                    {/* TAB: STRATEGY */}
                    <div className={tab === 'strategy' ? 'block space-y-4' : 'hidden'}>
                        <div><label className="font-black uppercase text-[10px]">Strategy Name</label><input type="text" className="w-full bg-white border-3 border-black rounded-lg p-3 font-bold text-sm mt-1" placeholder="e.g. London Breakout" required onChange={e=>setFormData({...formData, strategy: e.target.value})}/></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="font-black uppercase text-[10px]">Timeframe</label>
                                <select className="w-full bg-white border-3 border-black rounded-lg p-3 font-bold text-sm mt-1 outline-none" onChange={e=>setFormData({...formData, timeframe: e.target.value})}>
                                    <option>M1</option><option>M5</option><option>M15</option><option>H1</option><option>H4</option><option>D1</option>
                                </select>
                            </div>
                            <div><label className="font-black uppercase text-[10px]">Market Condition</label>
                                <select className="w-full bg-white border-3 border-black rounded-lg p-3 font-bold text-sm mt-1 outline-none" onChange={e=>setFormData({...formData, condition: e.target.value as any})}>
                                    <option>Trending</option><option>Ranging</option>
                                </select>
                            </div>
                        </div>
                        <div className="bg-[#F9F5F0] border-3 border-black border-dashed p-6 rounded-xl text-center cursor-pointer hover:bg-white transition-colors">
                            <LineChart className="mx-auto mb-2 text-gray-400" size={32} strokeWidth={2}/>
                            <span className="font-black uppercase text-[10px] text-gray-500">Upload Pre & Post Chart</span>
                            <div className="mt-1 text-[10px] font-bold text-[#FF99D6]">(Pro Feature Only)</div>
                        </div>
                    </div>

                    {/* TAB: PSYCHOLOGY & AI */}
                    <div className={tab === 'psychology' ? 'block space-y-4' : 'hidden'}>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="font-black uppercase text-[10px]">Emotion (Before)</label><input type="text" className="w-full bg-white border-3 border-black rounded-lg p-2 font-bold text-sm mt-1" placeholder="FOMO, Anxious..." onChange={e=>setFormData({...formData, emotionBefore: e.target.value})}/></div>
                            <div><label className="font-black uppercase text-[10px]">Emotion (After)</label><input type="text" className="w-full bg-white border-3 border-black rounded-lg p-2 font-bold text-sm mt-1" placeholder="Relieved, Angry..." onChange={e=>setFormData({...formData, emotionAfter: e.target.value})}/></div>
                        </div>
                        <div>
                            <label className="font-black uppercase text-[10px] flex justify-between">
                                Confidence Level <span>{formData.confidence || 5} / 10</span>
                            </label>
                            <input type="range" min="1" max="10" defaultValue="5" className="w-full h-4 accent-black mt-2" onChange={e=>setFormData({...formData, confidence: parseInt(e.target.value)})}/>
                        </div>
                        <div className="flex items-center gap-3 bg-white border-3 border-black p-3 rounded-xl">
                            <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#22C55E] border-black" onChange={e=>setFormData({...formData, discipline: e.target.checked})}/> 
                            <span className="font-black uppercase text-xs">Followed Discipline?</span>
                        </div>

                        {/* Artificial Intelligence Blur Panel */}
                        <div className="mt-4 bg-white border-3 border-black rounded-xl overflow-hidden relative pb-6">
                            <div className="bg-black text-[#A3E6B6] p-2 text-center font-black uppercase text-sm flex items-center justify-center gap-2">
                                <ShieldAlert size={16}/> AI Insights
                            </div>
                            <div className="p-4 filter blur-sm bg-[#F9F5F0]">
                                <div className="h-4 w-3/4 bg-gray-300 mb-2 rounded"></div>
                                <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
                            </div>
                            <div className="absolute inset-0 top-8 flex flex-col items-center justify-center">
                                <ShieldAlert size={32} strokeWidth={2} className="mb-2 text-black bg-[#FCF49F] rounded-full p-2 border-2 border-black"/>
                                <span className="bg-white border-2 border-black px-4 py-1 rounded-full font-black uppercase neo-shadow-sm text-xs">Unlock in Pro</span>
                            </div>
                        </div>
                    </div>

                    {/* TAB: REVIEW & RATINGS */}
                    <div className={tab === 'review' ? 'block space-y-4' : 'hidden'}>
                        <div className="flex flex-col items-center gap-2 py-4 bg-white border-3 border-black rounded-xl neo-shadow-sm">
                            <span className="font-black uppercase text-sm">Rate Execution</span>
                            <div className="flex gap-1">
                                {[1,2,3,4,5].map(r => (
                                    <Star key={r} onClick={()=>setFormData({...formData, rating: r})} fill={formData.rating! >= r ? '#FCF49F' : 'transparent'} strokeWidth={3} size={32} className="cursor-pointer hover:scale-110 transition-transform" />
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <label className="font-black uppercase text-[10px] block mb-1">Trade Note / What went right & wrong?</label>
                            <textarea required rows={4} className="w-full bg-white border-3 border-black rounded-xl p-3 font-bold text-sm focus:outline-none focus:bg-[#C3EEFA]" placeholder="Fell for a fakeout on the 1m tf. Sticking to 15m next time." onChange={e=>setFormData({...formData, mistakes: e.target.value})}></textarea>
                        </div>
                    </div>

                </form>
            </div>

            {/* Footer Form Submission */}
            <div className="bg-white p-4 border-t-4 border-black z-10 relative">
                <button type="submit" form="tradeForm" className="w-full bg-black text-white py-3 rounded-xl font-black uppercase text-lg hover:bg-[#FF99D6] hover:text-black border-4 border-transparent hover:border-black transition-all neo-shadow-sm hover:-translate-y-1">
                    Log Result &rarr;
                </button>
            </div>

          </div>
        </div>
      )}

      {/* Note View Modal */}
      {viewNote && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 pt-10 pb-10" onClick={(e) => { if(e.target === e.currentTarget) setViewNote(null);}}>
          <div className="bg-[#FCF49F] border-4 border-black rounded-[32px] w-full max-w-lg p-8 relative shadow-[8px_8px_0_0_#000] max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setViewNote(null)} 
              className="absolute top-6 right-6 w-12 h-12 bg-white border-4 border-black rounded-full flex items-center justify-center font-bold text-2xl shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#000] transition-all z-50">
              &times;
            </button>
            <h3 className="text-2xl font-black uppercase mb-6 border-b-4 border-black inline-block pb-2">Trade Note</h3>
            <p className="font-bold text-lg whitespace-pre-wrap">{viewNote}</p>
          </div>
        </div>
      )}
    </div>
  );
}
