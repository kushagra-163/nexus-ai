import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { useAuth } from '../context/AuthContext';
import { Sparkles } from 'lucide-react';

export const AppLayout = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-nexus-600/20 border border-nexus-500/30 flex items-center justify-center animate-spin text-nexus-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-400 font-medium">Loading Nexus Workspace...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect un-onboarded users to onboarding page
  if (user && !user.onboardingCompleted && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Navigation Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Viewport Container */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        <Topbar setMobileOpen={setMobileOpen} />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
