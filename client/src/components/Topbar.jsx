import React, { useState } from 'react';
import { Menu, Search, Bell, Sparkles, User, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Topbar = ({ setMobileOpen }) => {
  const { user, profile, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative hidden sm:block w-64 md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search skills, career paths, tools..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-nexus-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Readiness Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-nexus-600/10 border border-nexus-500/20 rounded-full text-xs text-nexus-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-nexus-400" />
          <span>Readiness Score: <strong className="text-white">{profile?.readinessScore || 70}%</strong></span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-nexus-500 ring-2 ring-slate-950" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-xs font-bold text-slate-200 tracking-wide uppercase">Nexus Intelligence Notifications</h4>
                <span className="text-[10px] text-nexus-400 bg-nexus-500/10 px-2 py-0.5 rounded">Live</span>
              </div>
              <div className="py-2 space-y-2.5">
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-200">Resume ATS Scan Active</p>
                    <p className="text-[11px] text-slate-400">Target role keywords matched for Software Engineering.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <Sparkles className="w-4 h-4 text-nexus-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-200">New AI Recommendation</p>
                    <p className="text-[11px] text-slate-400">Learn Docker containerization to boost readiness score +14%.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-nexus-600/30 border border-nexus-500/40 flex items-center justify-center font-bold text-xs text-nexus-300">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'N'}
          </div>
          <span className="hidden sm:inline-block text-xs font-medium text-slate-200">{user?.name || 'Account'}</span>
        </button>
      </div>
    </header>
  );
};

export const PageHeader = ({ title, subtitle, actionText, onAction, actionIcon: ActionIcon }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-nexus-600 hover:bg-nexus-500 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-nexus-600/20 active:scale-95 shrink-0"
        >
          {ActionIcon && <ActionIcon className="w-4 h-4" />}
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};

export const StatCard = ({ title, value, change, icon: Icon, color = 'text-nexus-400', progress }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm hover:border-slate-700/80 transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-xl bg-slate-800/80 ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
        {change && (
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {change}
          </span>
        )}
      </div>
      {progress !== undefined && (
        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
          <div className="bg-nexus-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
        </div>
      )}
    </div>
  );
};
