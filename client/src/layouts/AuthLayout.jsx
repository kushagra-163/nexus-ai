import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-nexus-600/20 border border-nexus-500/30 flex items-center justify-center animate-spin text-nexus-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-400 font-medium">Authenticating Nexus Session...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-nexus-500 selection:text-white">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-nexus-600/20 border border-nexus-500/30 flex items-center justify-center text-nexus-400 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">NEXUS AI</h2>
          <p className="text-xs text-slate-400 mt-1">Your Career. Connected by Intelligence.</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};
