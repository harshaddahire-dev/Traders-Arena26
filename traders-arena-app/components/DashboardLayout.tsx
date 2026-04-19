'use client';

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Calculator, BookOpen, Bot, MessageSquare, LogOut, User, Image as ImageIcon } from 'lucide-react';
import Dashboard from './Dashboard';
import Calculators from './Calculators';
import TradeDiary from './TradeDiary';

export default function DashboardLayout({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProfile, setShowProfile] = useState(false);
  const [budget, setBudget] = useState<string | null>(null);
  const [username, setUsername] = useState('Trader');
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    const savedBudget = localStorage.getItem('arena_budget');
    if (savedBudget) setBudget(savedBudget);
    
    const savedUsername = localStorage.getItem('arena_username');
    if (savedUsername) setUsername(savedUsername);

    const savedPic = localStorage.getItem('arena_profile_pic');
    if (savedPic) setProfilePic(savedPic);
  }, []);

  const handlePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        localStorage.setItem('arena_profile_pic', base64String);
        setProfilePic(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('arena_auth');
    onLogout();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'bg-[#FF99D6]' },
    { id: 'calculators', label: 'Calculators', icon: Calculator, color: 'bg-[#A3E6B6]' },
    { id: 'diary', label: 'Trade Diary', icon: BookOpen, color: 'bg-[#C3EEFA]' },
    { id: 'ai', label: 'AI Insights', icon: Bot, color: 'bg-black text-white', locked: true },
    { id: 'zeno', label: 'Ask Zeno', icon: MessageSquare, color: 'bg-black text-white', locked: true },
  ];

  return (
    <div className="flex h-screen bg-[#F9F5F0] text-black font-sans selection:bg-[#A984FF] overflow-hidden">
      
      {/* Left Sidebar */}
      <aside className="w-20 md:w-64 bg-white border-r-3 border-black flex flex-col z-40 relative shrink-0">
        <div className="h-24 flex items-center justify-center md:justify-center md:px-6 border-b-3 border-black bg-[#E4F0FF]">
          <div className="bg-white text-black border-3 border-black px-4 py-2 rounded-xl text-xl md:text-2xl font-black tracking-tighter hidden md:block uppercase shadow-[4px_4px_0_0_#A984FF] hover:shadow-[6px_6px_0_0_#FF99D6] transition-all duration-300">
            TRADERS<br/>ARENA
          </div>
          <div className="w-10 h-10 border-3 border-black rounded-full bg-[#A984FF] md:hidden shadow-[3px_3px_0_0_#000]"></div>
        </div>

        <nav className="flex-1 py-8 space-y-4 px-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => !item.locked && setActiveTab(item.id)}
                disabled={item.locked}
                className={`w-full flex items-center justify-center md:justify-start gap-4 px-4 py-3 rounded-xl border-3 border-black transition-all font-black text-sm uppercase tracking-tight
                  ${isActive
                    ? `${item.color} neo-shadow-sm translate-y-[-2px]`
                    : 'bg-white hover:bg-[#F9F5F0] neo-shadow-hover'}
                  ${item.locked ? 'opacity-40 cursor-not-allowed grayscale bg-gray-200' : ''}
                `}
                title={item.locked ? 'Available in Pro Arena' : ''}
              >
                <item.icon size={22} strokeWidth={isActive ? 3 : 2} className={isActive && item.locked ? 'text-white' : 'text-black'} />
                <span className="hidden md:flex flex-1 justify-between items-center text-sm">
                  {item.label}
                  {item.locked && <LockIcon />}
                </span>
              </button>
            )
          })}
        </nav>

        {/* User Button Mini */}
        <div className="p-4 border-t-3 border-black bg-[#E4F0FF]">
          <button
            onClick={() => setShowProfile(true)}
            className="w-full flex items-center gap-3 p-3 bg-white border-3 border-black rounded-xl font-black uppercase text-sm neo-shadow-sm neo-shadow-hover transition-transform text-black hover:-translate-y-1">
             <div className="w-10 h-10 rounded-full border-3 border-black bg-[#FFB38E] flex items-center justify-center shrink-0 overflow-hidden">
               {profilePic ? (
                 <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <User size={20} strokeWidth={3}/>
               )}
             </div>
             <span className="hidden md:block truncate text-left w-full pl-1">{username}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto relative scroll-smooth bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:24px_24px] [background-position:0_0,12px_12px] [background-color:var(--color-bg-base)]">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'calculators' && <Calculators />}
        {activeTab === 'diary' && <TradeDiary />}
      </main>

      {/* Profile Popup */}
      {showProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 pt-10 pb-10" onClick={(e) => { if(e.target === e.currentTarget) setShowProfile(false);}}>
          <div className="bg-white border-4 border-black rounded-[32px] w-full max-w-md p-8 relative shadow-[8px_8px_0_0_#000] max-h-[90vh] overflow-y-auto">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowProfile(false);
              }} 
              className="absolute top-6 right-6 w-12 h-12 bg-[#FF99D6] border-4 border-black rounded-full flex items-center justify-center font-bold text-2xl shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#000] transition-all z-50">
              &times;
            </button>
            
            <div className="flex flex-col items-center mb-8 relative">
              <label htmlFor="profile-upload" className="w-32 h-32 rounded-full border-4 border-black bg-[#FFB38E] flex items-center justify-center mb-4 shadow-[4px_4px_0_0_#000] relative group cursor-pointer overflow-hidden z-10">
                 {profilePic ? (
                   <img src={profilePic} alt="Profile" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                 ) : (
                   <User size={60} className="text-black group-hover:opacity-0 transition-opacity" strokeWidth={3} />
                 )}
                 <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <ImageIcon size={32} className="text-white" strokeWidth={3}/>
                 </div>
              </label>
              <input type="file" id="profile-upload" accept="image/*" className="hidden" onChange={handlePicUpload} />
              <h3 className="text-4xl font-black uppercase text-center w-full truncate">{username}</h3>
            </div>
            
            <div className="space-y-6 mb-10">
              <div>
                <label className="text-xs font-black tracking-tight uppercase mb-2 block text-gray-500">Change Username</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    defaultValue={username}
                    id="profile-username"
                    className="w-full bg-[#f9f5f0] border-4 border-black rounded-xl p-4 font-black text-xl focus:outline-none focus:bg-[#C3EEFA]" 
                  />
                  <button 
                    className="bg-[#FCF49F] border-4 border-black text-black px-6 rounded-xl font-black uppercase transition-transform neo-shadow hover:-translate-y-1 text-lg"
                    onClick={() => {
                        const val = (document.getElementById('profile-username') as HTMLInputElement).value;
                        if(val) {
                            localStorage.setItem('arena_username', val);
                            setUsername(val);
                            alert("Username updated. Please refresh if you don't see it everywhere.");
                        }
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-black tracking-tight uppercase mb-2 block text-gray-500">Edit Monthly Budget ($)</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    defaultValue={budget || ''}
                    id="profile-budget"
                    className="w-full bg-[#f9f5f0] border-4 border-black rounded-xl p-4 font-black text-xl focus:outline-none focus:bg-[#A3E6B6]" 
                  />
                  <button 
                    className="bg-[#FCF49F] border-4 border-black text-black px-6 rounded-xl font-black uppercase transition-transform neo-shadow hover:-translate-y-1 text-lg"
                    onClick={() => {
                        const val = (document.getElementById('profile-budget') as HTMLInputElement).value;
                        if(val) {
                            localStorage.setItem('arena_budget', val);
                            setBudget(val);
                            alert("Budget updated!");
                        }
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={handleLogout} 
              className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl border-4 border-black bg-black font-black text-2xl text-white hover:bg-[#EF4444] hover:text-black transition-colors neo-shadow hover:-translate-y-1">
              <LogOut size={28} strokeWidth={3} />
              DISCONNECT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  )
}