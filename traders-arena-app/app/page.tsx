'use client';

import React, { useState, useEffect } from 'react';
import LandingPage from '../components/LandingPage';
import DashboardLayout from '../components/DashboardLayout';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authData = localStorage.getItem('arena_auth');
    if (authData) setIsAuthenticated(true);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-[#0D1117] flex items-center justify-center text-white">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <LandingPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return <DashboardLayout onLogout={() => setIsAuthenticated(false)} />;
}
