import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';

export const AuthLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-nexus-600/10 dark:bg-nexus-600/20 border border-nexus-500/20 dark:border-nexus-500/30 flex items-center justify-center animate-spin text-nexus-600 dark:text-nexus-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Authenticating Nexus Session...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-nexus-500 selection:text-white transition-colors duration-200 relative">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl dark:shadow-2xl backdrop-blur-md">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-nexus-600/10 dark:bg-nexus-600/20 border border-nexus-500/20 dark:border-nexus-500/30 flex items-center justify-center text-nexus-600 dark:text-nexus-400 mb-3 shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-wide">NEXUS AI</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Your Career. Connected by Intelligence.</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};
