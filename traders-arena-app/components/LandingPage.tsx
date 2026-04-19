

import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Zap, Globe, Lock, CheckCircle2, User, Mail, Key } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function LandingPage({ onLogin }: { onLogin: (username: string) => void }) {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [showTerms, setShowTerms] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', agree: false });
  const [loading, setLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage(null);

    if (authMode === 'signup' && !formData.agree) {
        setAuthMessage({ type: 'error', text: "You must agree to the Terms & Conditions." });
        return;
    }
    
    setLoading(true);

    if (authMode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username
          }
        }
      });

      if (error) {
        setAuthMessage({ type: 'error', text: "Error creating account: " + error.message });
      } else {
        setAuthMessage({ type: 'success', text: "Account created successfully! Check your email to verify (if enabled)." });
        setTimeout(() => {
          const user = formData.username || formData.email.split('@')[0] || 'Trader';
          localStorage.setItem('arena_username', user);
          onLogin(user);
        }, 1500);
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        setAuthMessage({ type: 'error', text: "Error logging in: " + error.message });
      } else {
        setAuthMessage({ type: 'success', text: "Successfully logged in!" });
        setTimeout(() => {
          const user = data.user?.user_metadata?.username || formData.email.split('@')[0] || 'Trader';
          localStorage.setItem('arena_username', user);
          onLogin(user);
        }, 500);
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F9F5F0] text-black font-sans selection:bg-[#FF99D6]">
      {/* Navbar */}
      <nav className="fixed w-full top-0 z-50 bg-[#F9F5F0] border-b-3 border-black p-3 flex justify-between items-center px-4 md:px-8">
        {/* Logo - Start */}
        <div className="text-xl md:text-2xl font-black tracking-tighter uppercase cursor-pointer group flex gap-1 relative items-center">
            <span className="transition-transform duration-300 group-hover:text-[#FF99D6] group-hover:-translate-y-1">Traders</span>
            <span className="transition-transform duration-300 group-hover:text-[#A984FF] group-hover:rotate-3 inline-block">Arena</span>
            <div className="absolute -bottom-1 left-0 w-0 h-[4px] bg-black transition-all duration-300 group-hover:w-full"></div>
        </div>
        
        {/* Links - Absolute Center */}
        <div className="hidden md:flex gap-6 font-black text-sm uppercase absolute left-1/2 -translate-x-1/2">
            <a href="#about" className="hover:text-[#A984FF] hover:-translate-y-1 transition-all cursor-pointer inline-block">About Us</a>
            <a href="#pricing" className="hover:text-[#FF99D6] hover:-translate-y-1 transition-all cursor-pointer inline-block">Pricing</a>
            <a href="#security" className="hover:text-[#22C55E] hover:-translate-y-1 transition-all cursor-pointer inline-block">Security</a>
            <a href="#contact" className="hover:text-[#FCF49F] hover:-translate-y-1 transition-all cursor-pointer inline-block">Contact Us</a>
        </div>
        
        {/* Sign In - End */}
        <button 
          onClick={() => setShowAuth(true)}
          className="bg-[#C3EEFA] border-2 border-black px-5 py-2 rounded-lg font-bold text-sm uppercase transition-transform hover:-translate-y-1 neo-shadow-sm hover:neo-shadow-hover"
        >
          Sign In
        </button>
      </nav>

      {/* Hero */}
      <section className="pt-24 md:pt-32 pb-12 px-4 max-w-5xl mx-auto flex flex-col items-center text-center mt-8">
        <div className="inline-block bg-[#FCF49F] border-2 border-black px-3 py-1 rounded-full text-xs md:text-sm font-bold mb-4 rotate-[-2deg] neo-shadow-sm">
          v2.0 is live worldwide 🌍
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[1.1] md:leading-none mb-6">
          The Only <span className="bg-[#A3E6B6] px-2 py-1 border-2 border-black inline-block -rotate-2 select-none my-1 md:my-0">Diary</span>
          <br className="hidden sm:block" /> You'll Ever Need.
        </h1>
        <p className="text-sm sm:text-base md:text-lg font-bold text-gray-700 max-w-xl mb-8 px-2">
          Track strict P&L, evaluate psychology, and manage risk with brutal honesty. No fluff.
        </p>
        <button 
          onClick={() => setShowAuth(true)}
          className="flex items-center gap-2 bg-[#FF99D6] border-3 border-black px-6 md:px-8 py-3 rounded-xl text-base md:text-lg font-black uppercase transition-all hover:bg-[#FFAD98] hover:-translate-y-1 neo-shadow-sm hover:neo-shadow-hover w-full sm:w-auto justify-center"
        >
          Get Started <ArrowRight strokeWidth={3} size={20} className="md:w-6 md:h-6" />
        </button>
      </section>

      {/* Partners / Backed By */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .pause-on-hover:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
        <section className="py-6 bg-white border-y-3 border-black overflow-x-hidden overflow-y-visible mb-8 md:mb-12 cursor-default pause-on-hover">
        <div className="mx-auto flex flex-col items-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-black mb-4 text-center px-4">Trusted by traders from top firms</p>
            
                <div className="relative w-full flex overflow-visible py-8 px-2">
                  <div className="flex w-max shrink-0 animate-marquee items-center gap-6 md:gap-12 px-3 pt-2 pb-2">
                    {/* First Set */}
                    <h3 className="text-sm md:text-lg font-black uppercase flex items-center justify-center gap-1 bg-[#A984FF] text-black px-4 py-2 border-2 border-black transition-transform cursor-pointer neo-shadow-sm hover:rotate-3 hover:scale-105 shrink-0">Alpha Capital</h3>
                    <h3 className="text-sm md:text-lg font-black uppercase flex items-center justify-center gap-1 bg-[#FF99D6] text-black px-4 py-2 border-2 border-black transition-transform cursor-pointer neo-shadow-sm hover:-rotate-3 hover:scale-105 shrink-0">Nova Funding</h3>
                    <h3 className="text-sm md:text-lg font-black uppercase flex items-center justify-center gap-1 bg-[#FCF49F] text-black px-4 py-2 border-2 border-black transition-transform cursor-pointer neo-shadow-sm hover:rotate-2 hover:scale-105 shrink-0"><Zap size={14} className="md:w-4 md:h-4"/> StrikeProp</h3>
                    <h3 className="text-sm md:text-lg font-black uppercase flex items-center justify-center gap-1 bg-[#C3EEFA] text-black px-4 py-2 border-2 border-black transition-transform cursor-pointer neo-shadow-sm hover:-rotate-2 hover:scale-105 shrink-0">Apex Edge</h3>
                    <h3 className="text-sm md:text-lg font-black uppercase flex items-center justify-center gap-1 bg-[#A3E6B6] text-black px-4 py-2 border-2 border-black transition-transform cursor-pointer neo-shadow-sm hover:rotate-3 hover:scale-105 shrink-0">Funded Next</h3>
                    <h3 className="text-sm md:text-lg font-black uppercase flex items-center justify-center gap-1 bg-[#FFB38E] text-black px-4 py-2 border-2 border-black transition-transform cursor-pointer neo-shadow-sm hover:-rotate-3 hover:scale-105 shrink-0">Top Tier</h3>
                    
                    {/* Duplicate Set for Seamless Loop */}
                    <h3 className="text-sm md:text-lg font-black uppercase flex items-center justify-center gap-1 bg-[#A984FF] text-black px-4 py-2 border-2 border-black transition-transform cursor-pointer neo-shadow-sm hover:rotate-3 hover:scale-105 shrink-0">Alpha Capital</h3>
                    <h3 className="text-sm md:text-lg font-black uppercase flex items-center justify-center gap-1 bg-[#FF99D6] text-black px-4 py-2 border-2 border-black transition-transform cursor-pointer neo-shadow-sm hover:-rotate-3 hover:scale-105 shrink-0">Nova Funding</h3>
                    <h3 className="text-sm md:text-lg font-black uppercase flex items-center justify-center gap-1 bg-[#FCF49F] text-black px-4 py-2 border-2 border-black transition-transform cursor-pointer neo-shadow-sm hover:rotate-2 hover:scale-105 shrink-0"><Zap size={14} className="md:w-4 md:h-4"/> StrikeProp</h3>
                    <h3 className="text-sm md:text-lg font-black uppercase flex items-center justify-center gap-1 bg-[#C3EEFA] text-black px-4 py-2 border-2 border-black transition-transform cursor-pointer neo-shadow-sm hover:-rotate-2 hover:scale-105 shrink-0">Apex Edge</h3>
                    <h3 className="text-sm md:text-lg font-black uppercase flex items-center justify-center gap-1 bg-[#A3E6B6] text-black px-4 py-2 border-2 border-black transition-transform cursor-pointer neo-shadow-sm hover:rotate-3 hover:scale-105 shrink-0">Funded Next</h3>
                    <h3 className="text-sm md:text-lg font-black uppercase flex items-center justify-center gap-1 bg-[#FFB38E] text-black px-4 py-2 border-2 border-black transition-transform cursor-pointer neo-shadow-sm hover:-rotate-3 hover:scale-105 shrink-0">Top Tier</h3>
                </div>
            </div>
        </div>
      </section>

      {/* About Us (Vision) */}
      <section id="about" className="py-12 md:py-16 bg-[#A984FF] border-y-3 border-black px-4 flex flex-col items-center justify-center">
        <div className="max-w-5xl w-full grid md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div className="bg-white border-3 border-black p-6 rounded-2xl neo-shadow-sm flex flex-col gap-3 transition-transform hover:-translate-y-2 hover:neo-shadow-hover">
                <h2 className="text-2xl md:text-3xl font-black uppercase text-center md:text-left">About Us</h2>
                <p className="text-sm font-bold leading-relaxed text-justify md:text-left">
                    Trading is 90% psychology and 10% execution. We built TRADERS ARENA to strip away the complex charts and focus purely on what makes you profitable: <strong>Discipline, Data, and Brutal Honesty</strong>. We want to turn gamblers into systematic snipers.
                </p>
            </div>
            <div className="bg-[#FCF49F] border-3 border-black p-6 rounded-2xl neo-shadow-sm transition-transform hover:-translate-y-2 hover:neo-shadow-hover">
                <h3 className="text-xl md:text-2xl font-black mb-4 uppercase text-center md:text-left">Industry Level Tools</h3>
                <ul className="space-y-3 font-bold text-xs md:text-sm">
                    <li className="flex items-center gap-2"><CheckCircle2 size={18} className="shrink-0"/> Advanced Risk/Reward Matrices</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={18} className="shrink-0"/> Emotion & Psychology Tracking</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={18} className="shrink-0"/> AI Driven Setup Recognition</li>
                </ul>
            </div>
        </div>

        {/* More Info / The Real Vision */}
        <div className="mt-8 max-w-5xl mx-auto w-full bg-black text-white p-6 md:p-8 rounded-2xl border-3 border-black neo-shadow-sm relative overflow-hidden transition-transform hover:-translate-y-2 hover:-rotate-1 cursor-default">
            <Globe className="absolute -right-10 -bottom-10 md:-right-6 md:-bottom-6 text-gray-800 opacity-20" size={160} />
            <h3 className="text-xl md:text-2xl font-black uppercase mb-3 text-[#FCF49F] text-center md:text-left">The Real Vision</h3>
            <p className="font-bold text-xs md:text-sm leading-relaxed text-gray-200 max-w-3xl relative z-10 text-justify md:text-left">
                Most trading journals are built by software engineers who don't trade. Traders Arena was developed in the trenches. We believe your real edge isn't in a magic indicator — it's in brutally reviewing your mistakes. By tracking emotional impulses, strict strategy discipline, and advanced setup data, our vision is to create outsized returns through raw accountability.
            </p>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="py-12 md:py-16 bg-[#F9F5F0] px-4 flex justify-center">
        <div className="max-w-3xl w-full text-center">
            <ShieldCheck size={48} strokeWidth={2} className="mx-auto mb-4 text-[#22C55E]" />
            <h2 className="text-2xl md:text-3xl font-black mb-4 uppercase">Bank-Grade Security</h2>
            <p className="text-xs md:text-sm font-bold bg-white border-3 border-black p-6 rounded-xl neo-shadow-sm text-justify md:text-center leading-relaxed">
                Your data is stored securely via end-to-end encrypted wrappers. We do not sell your trade history to HFT algorithms or hedge funds. You own your data. End of story.
            </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-12 md:py-16 bg-[#C3EEFA] border-y-3 border-black px-4 flex flex-col items-center">
        <div className="max-w-4xl w-full text-center mb-8 md:mb-10">
            <h2 className="text-3xl md:text-4xl font-black uppercase">Pricing</h2>
        </div>
        <div className="max-w-5xl w-full grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <div className="bg-white border-3 border-black p-6 rounded-2xl neo-shadow-sm flex flex-col">
                <h3 className="text-xl font-black uppercase mb-1">Free</h3>
                <div className="text-3xl font-black mb-4">$0<span className="text-sm">/mo</span></div>
                <ul className="space-y-3 text-sm font-bold flex-1 mb-6">
                    <li>✓ 5 Trade Journals / Month</li>
                    <li>✓ All Calculators Included</li>
                    <li>✓ Basic Local Storage</li>
                </ul>
                <button onClick={() => setShowAuth(true)} className="w-full py-3 border-3 border-black bg-white font-black uppercase rounded-xl hover:-translate-y-1 transition-transform hover:bg-[#C3EEFA]">Start Free</button>
            </div>
            {/* Amateur Plan */}
            <div className="bg-[#FCF49F] border-3 border-black p-6 rounded-2xl neo-shadow-sm flex flex-col">
                <h3 className="text-xl font-black uppercase mb-1">Amateur</h3>
                <div className="text-3xl font-black mb-4">$4<span className="text-sm">/mo</span></div>
                <ul className="space-y-3 text-sm font-bold flex-1 mb-6">
                    <li>✓ 30 Trade Journals / Month</li>
                    <li>✓ All Calculators Included</li>
                    <li>✓ Standard Support</li>
                </ul>
                <button onClick={() => setShowAuth(true)} className="w-full py-3 border-3 border-black bg-white font-black uppercase rounded-xl hover:-translate-y-1 transition-transform hover:bg-[#FCF49F]">Subscribe</button>
            </div>
            {/* Pro Arena Plan */}
            <div className="bg-[#FFAD98] border-3 border-black p-6 rounded-2xl neo-shadow-sm flex flex-col relative sm:col-span-2 md:col-span-1 md:-mt-2">
                <div className="bg-black text-white text-[10px] font-black uppercase inline-block px-2 py-1 rounded-full mb-3 self-start">Most Popular</div>
                <h3 className="text-xl font-black uppercase mb-1">Pro Arena</h3>
                <div className="text-3xl font-black mb-4">$29<span className="text-sm">/mo</span></div>
                <ul className="space-y-3 text-sm font-bold flex-1 mb-6">
                    <li>✓ Unlimited Trade Journals</li>
                    <li>✓ Local Data (Not on Cloud)</li>
                    <li>✓ Incoming Projects Early Access</li>
                    <li>✓ AI Insights & Pattern Rec.</li>
                </ul>
                <button onClick={() => setShowAuth(true)} className="w-full py-3 border-3 border-black bg-white font-black uppercase rounded-xl hover:-translate-y-1 transition-transform hover:bg-black hover:text-white">Go Pro</button>
            </div>
        </div>
      </section>

      {/* User Ratings / Demo Ratings */}
      <section id="reviews" className="py-12 md:py-16 bg-[#FF99D6] px-4 border-b-3 border-black flex justify-center">
        <div className="max-w-5xl w-full flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-black uppercase text-center mb-8 text-black bg-white border-3 border-black px-4 md:px-6 py-2 rounded-full -rotate-1 neo-shadow-sm whitespace-nowrap truncate w-[90%] md:w-auto">
                Arena Champions
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
                {/* Rating 1 */}
                <div className="bg-white border-3 border-black p-5 rounded-2xl neo-shadow-sm flex flex-col">
                    <div className="text-[#FF99D6] text-xs md:text-sm mb-3 font-bold tracking-widest">★★★★★</div>
                    <p className="text-xs md:text-sm font-bold mb-6 flex-1 text-gray-800 text-justify md:text-left">"Finally a diary that doesn't feel like a spreadsheet. The psychology tracking literally saved me from blowing my funded account."</p>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-[#A984FF] border-2 border-black rounded-full flex items-center justify-center font-black shrink-0">A</div>
                        <div className="truncate">
                            <div className="font-black text-[10px] md:text-xs uppercase truncate">Alex M.</div>
                            <div className="text-[8px] md:text-[10px] font-bold text-gray-500 uppercase truncate">Funded Trader</div>
                        </div>
                    </div>
                </div>
                {/* Rating 2 */}
                <div className="bg-[#FCF49F] border-3 border-black p-5 rounded-2xl neo-shadow-sm flex flex-col md:translate-y-4">
                    <div className="text-[#FF99D6] text-xs md:text-sm mb-3 font-bold tracking-widest">★★★★★</div>
                    <p className="text-xs md:text-sm font-bold mb-6 flex-1 text-gray-800 text-justify md:text-left">"The brutal honesty of the UI matches the trading environment perfectly. It's minimal but tracks everything I need to see."</p>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-white border-2 border-black rounded-full flex items-center justify-center font-black shrink-0">S</div>
                        <div className="truncate">
                            <div className="font-black text-[10px] md:text-xs uppercase truncate">Sarah T.</div>
                            <div className="text-[8px] md:text-[10px] font-bold text-gray-500 uppercase truncate">Retail Investor</div>
                        </div>
                    </div>
                </div>
                {/* Rating 3 */}
                <div className="bg-white border-3 border-black p-5 rounded-2xl neo-shadow-sm flex flex-col sm:col-span-2 md:col-span-1">
                    <div className="text-[#FF99D6] text-xs md:text-sm mb-3 font-bold tracking-widest">★★★★★</div>
                    <p className="text-xs md:text-sm font-bold mb-6 flex-1 text-gray-800 text-justify md:text-left">"Using Traders Arena made me realize I was revenge trading 30% of the time. The raw insight is genuinely priceless."</p>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-[#C3EEFA] border-2 border-black rounded-full flex items-center justify-center font-black shrink-0">D</div>
                        <div className="truncate">
                            <div className="font-black text-[10px] md:text-xs uppercase truncate">David L.</div>
                            <div className="text-[8px] md:text-[10px] font-bold text-gray-500 uppercase truncate">Prop Firm Applicant</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Contact Us */}
      <section id="contact" className="py-12 md:py-16 bg-[#F9F5F0] px-4 flex flex-col items-center">
        <div className="max-w-4xl w-full">
            <h2 className="text-3xl md:text-4xl font-black mb-8 uppercase text-center bg-[#FCF49F] border-3 border-black inline-block px-6 py-2 rounded-xl -rotate-1 shadow-[4px_4px_0_0_#000] mx-auto flex w-max">Contact Us</h2>
            <div className="bg-white border-3 border-black p-6 md:p-8 rounded-2xl shadow-[8px_8px_0_0_#000] flex flex-col md:flex-row gap-8">
                <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-2xl font-black uppercase mb-4">Get In Touch</h3>
                    <p className="font-bold text-sm mb-8 max-w-sm text-gray-600">Have a question, business inquiry, or feedback? Drop us a message and the founder will get back to you directly.</p>
                    <div className="flex items-center gap-3 bg-[#E4F0FF] border-3 border-black p-4 rounded-xl w-full max-w-sm shadow-[4px_4px_0_0_#000]">
                        <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center border-2 border-transparent shrink-0"><Mail size={24} strokeWidth={2.5} /></div>
                        <div className="overflow-hidden">
                            <div className="text-[10px] font-black uppercase text-gray-500 mb-1">Business & Support</div>
                            <a href="mailto:harshdahire26@gmail.com" className="font-black text-sm sm:text-base md:text-lg hover:text-[#A984FF] transition-colors truncate block">harshdahire26@gmail.com</a>
                        </div>
                    </div>
                </div>
                <div className="flex-1">
                    <form className="space-y-5 bg-[#F9F5F0] p-6 border-3 border-black rounded-xl" onSubmit={(e) => { e.preventDefault(); alert('Query sent successfully! We will get back to you soon.'); (e.target as HTMLFormElement).reset(); }}>
                        <div>
                            <label className="font-black uppercase text-xs block mb-2">Name</label>
                            <input type="text" required className="w-full border-3 border-black rounded-xl p-3 text-sm font-bold bg-white focus:bg-[#C3EEFA] outline-none transition-colors shadow-[inner_2px_2px_0_0_rgba(0,0,0,0.1)]" placeholder="Your Name" />
                        </div>
                        <div>
                            <label className="font-black uppercase text-xs block mb-2">Query</label>
                            <textarea required rows={4} className="w-full border-3 border-black rounded-xl p-3 text-sm font-bold bg-white focus:bg-[#FF99D6] outline-none transition-colors resize-none shadow-[inner_2px_2px_0_0_rgba(0,0,0,0.1)]" placeholder="How do I get access to..."></textarea>
                        </div>
                        <button type="submit" className="w-full py-4 bg-black text-white border-3 border-transparent hover:border-black rounded-xl font-black uppercase text-base hover:bg-[#A3E6B6] hover:text-black shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-y-1 transition-all">
                            Send Query &rarr;
                        </button>
                    </form>
                </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white p-6 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="text-lg md:text-xl font-black uppercase">Traders Arena <span className="text-[#A3E6B6]">v2.0</span></div>
            <div className="font-bold text-[10px] md:text-xs uppercase text-gray-300">
                <span className="flex flex-col sm:flex-row items-center gap-2">
                    <ShieldCheck size={16} className="text-[#FF99D6]"/>
                    © 2026 All Rights Reserved, by <span className="text-[#FCF49F] underline tracking-widest px-1">ARENAS FOUNDER</span>
                </span>
            </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white border-3 border-black rounded-3xl w-full max-w-sm p-6 relative neo-shadow-sm">
            <button onClick={() => setShowAuth(false)} className="absolute top-4 right-4 w-8 h-8 bg-[#FF99D6] border-2 border-black rounded-full font-bold text-lg hover:translate-y-1">&times;</button>
            
            <div className="flex gap-4 mb-6">
                <button onClick={() => setAuthMode('signup')} className={`flex-1 pb-2 border-b-3 font-black uppercase text-lg ${authMode === 'signup' ? 'border-black' : 'border-transparent text-gray-400'}`}>Sign Up</button>
                <button onClick={() => setAuthMode('signin')} className={`flex-1 pb-2 border-b-3 font-black uppercase text-lg ${authMode === 'signin' ? 'border-black' : 'border-transparent text-gray-400'}`}>Sign In</button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                    <label className="font-black uppercase text-[10px] block mb-1">Username</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input type="text" required className="w-full border-2 border-black rounded-lg p-2 pl-10 text-sm font-bold bg-[#f9f5f0] focus:bg-[#C3EEFA] outline-none" placeholder="Sniper_Joe" onChange={e => setFormData({...formData, username: e.target.value})} />
                    </div>
                </div>
              )}
              
              <div>
                  <label className="font-black uppercase text-[10px] block mb-1">{authMode === 'signin' ? 'Username or Email' : 'Email'}</label>
                  <div className="relative">
                      <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input type="text" required className="w-full border-2 border-black rounded-lg p-2 pl-10 text-sm font-bold bg-[#f9f5f0] focus:bg-[#C3EEFA] outline-none" placeholder="joe@example.com" onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
              </div>

              <div>
                  <label className="font-black uppercase text-[10px] block mb-1">Password</label>
                  <div className="relative">
                      <Key className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input type="password" required className="w-full border-2 border-black rounded-lg p-2 pl-10 text-sm font-bold bg-[#f9f5f0] focus:bg-[#FF99D6] outline-none" placeholder="••••••••" onChange={e => setFormData({...formData, password: e.target.value})} />
                  </div>
              </div>

              {authMode === 'signup' && (
                  <div className="flex items-center gap-3 bg-[#f9f5f0] p-3 border-2 border-black rounded-lg mt-2">
                      <input type="checkbox" id="terms" className="w-4 h-4 accent-black" onChange={e => setFormData({...formData, agree: e.target.checked})} />
                      <label htmlFor="terms" className="font-bold text-[10px] uppercase">I agree to <button type="button" onClick={()=>setShowTerms(true)} className="underline decoration-2 hover:text-[#A984FF]">Terms</button></label>
                  </div>
              )}

              <button type="submit" disabled={loading} className="w-full py-3 bg-[#A3E6B6] border-3 border-black rounded-lg font-black uppercase text-lg neo-shadow-sm hover:-translate-y-1 transition-transform mt-2 disabled:opacity-50 disabled:hover:translate-y-0">
                {loading ? 'Processing...' : (authMode === 'signup' ? "Create Account" : "Enter Arena")}
              </button>                
                {authMessage && (
                    <div className={`mt-4 p-3 border-3 border-black rounded-lg font-bold text-sm text-center ${authMessage.type === 'success' ? 'bg-[#A3E6B6]' : 'bg-[#FF99D6]'} shadow-[4px_4px_0_0_#000]`}>
                        {authMessage.text}
                    </div>
                )}
              {authMode === 'signin' && (
                <div className="text-center mt-4">
                    <button type="button" onClick={async () => {
                        if (!formData.email) return alert("Please enter your email to reset password.");
                        try {
                            const { error } = await supabase.auth.resetPasswordForEmail(formData.email);
                            if (error) throw error;
                            alert("Password reset email sent! Please check your inbox.");
                        } catch (err: any) {
                            alert(err.message || "Error sending reset email.");
                        }
                    }} className="text-sm font-bold text-gray-500 hover:text-black underline">
                        Forgot Password?
                    </button>
                </div>
              )}            </form>
          </div>
        </div>
      )}

      {/* Terms Popup */}
      {showTerms && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-[#FCF49F] border-3 border-black rounded-2xl w-full max-w-sm p-6 relative neo-shadow-sm">
              <h2 className="text-xl font-black uppercase mb-3 border-b-2 border-black pb-2">Terms & Conditions</h2>
              <div className="h-48 overflow-y-auto space-y-3 font-bold pr-2 bg-white border-2 border-black p-3 rounded-xl text-xs">
                  <p>1. Data is yours. We just provide the tools.</p>
                  <p>2. Don't YOLO your life savings. We calculate risk, you manage it.</p>
                  <p>3. Subscription fees are non-refundable after 14 days.</p>
                  <p>4. By using the site, you agree you are solely responsible for your trading P&L.</p>
              </div>
              <button onClick={()=>setShowTerms(false)} className="mt-4 w-full py-2 bg-black text-white font-black uppercase rounded-lg text-sm hover:-translate-y-1 transition-transform border-2 hover:bg-[#FF99D6] hover:text-black border-transparent hover:border-black">I Understand</button>
            </div>
          </div>
      )}
    </div>
  );
}
