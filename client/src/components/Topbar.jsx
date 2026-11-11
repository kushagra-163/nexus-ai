import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  User,
  LogOut,
  CheckCircle2,
  ChevronRight,
  X,
  Settings as SettingsIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SEARCH_MODULES = [
  { title: 'Dashboard', path: '/dashboard', description: 'Overview, career metrics & readiness', category: 'Core' },
  { title: 'AI Assistant', path: '/assistant', description: 'Chat with AI career mentor and advisor', category: 'AI Tools' },
  { title: 'Resume Intelligence', path: '/resume', description: 'ATS analysis and resume audit', category: 'AI Tools' },
  { title: 'Skill Inventory', path: '/skills', description: 'Technical skills and gap analysis matrix', category: 'Intelligence' },
  { title: 'Career Paths', path: '/career-paths', description: 'Explore career paths, salaries & trends', category: 'Intelligence' },
  { title: 'Job Matching', path: '/job-match', description: 'Analyze job compatibility and apply', category: 'Intelligence' },
  { title: 'Learning Roadmap', path: '/roadmap', description: 'Milestones, phases, and learning plan', category: 'Growth' },
  { title: 'Project Intelligence', path: '/projects', description: 'Portfolio showcase and project audits', category: 'Growth' },
  { title: 'Analytics', path: '/analytics', description: 'Skill growth and readiness trends', category: 'Growth' },
  { title: 'Profile', path: '/profile', description: 'User info, target role and bio', category: 'Settings' },
  { title: 'Settings', path: '/settings', description: 'Account settings and preferences', category: 'Settings' },
];

export const Topbar = ({ setMobileOpen }) => {
  const { user, profile, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  const searchRef = useRef(null);
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsSearchFocused(false);
        setShowNotifications(false);
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const filteredModules = searchQuery.trim()
    ? SEARCH_MODULES.filter((item) => {
        const query = searchQuery.toLowerCase().trim();
        return (
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
        );
      })
    : [];

  const handleSelectModule = (path) => {
    navigate(path);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && filteredModules.length > 0) {
      handleSelectModule(filteredModules[0].path);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* GLOBAL QUICK SEARCH */}
        <div ref={searchRef} className="relative hidden sm:block w-64 md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search skills, career paths, tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onKeyDown={handleSearchKeyDown}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-nexus-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchFocused(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Quick Search Dropdown Results */}
          {isSearchFocused && searchQuery.trim() && (
            <div className="absolute left-0 mt-2 w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in max-h-80 overflow-y-auto">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800 mb-1">
                Quick Results ({filteredModules.length})
              </div>
              {filteredModules.length > 0 ? (
                filteredModules.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleSelectModule(item.path)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-slate-800/70 transition-colors group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-nexus-400">
                          {item.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-nexus-400 shrink-0" />
                  </button>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-slate-500">
                  No matching tools or pages found for &ldquo;{searchQuery}&rdquo;.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Readiness Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-nexus-600/10 border border-nexus-500/20 rounded-full text-xs text-nexus-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-nexus-400" />
          <span>
            Readiness Score: <strong className="text-white">{profile?.readinessScore || 70}%</strong>
          </span>
        </div>

        {/* Notifications Dropdown */}
        <div ref={notificationsRef} className="relative">
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
                <h4 className="text-xs font-bold text-slate-200 tracking-wide uppercase">
                  Nexus Intelligence Notifications
                </h4>
                <span className="text-[10px] text-nexus-400 bg-nexus-500/10 px-2 py-0.5 rounded">
                  Live
                </span>
              </div>
              <div className="py-2 space-y-2.5">
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-200">Resume ATS Scan Active</p>
                    <p className="text-[11px] text-slate-400">
                      Target role keywords matched for Software Engineering.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <Sparkles className="w-4 h-4 text-nexus-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-200">New AI Recommendation</p>
                    <p className="text-[11px] text-slate-400">
                      Learn Docker containerization to boost readiness score +14%.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 pl-2 pr-2 py-1 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-nexus-600/30 border border-nexus-500/40 flex items-center justify-center font-bold text-xs text-nexus-300">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'N'}
            </div>
            <span className="hidden sm:inline-block text-xs font-medium text-slate-200">
              {user?.name || 'Account'}
            </span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-fade-in space-y-2">
              <div className="p-2 border-b border-slate-800">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Developer'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email || 'user@example.com'}</p>
                {profile?.targetRole && (
                  <span className="inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded bg-nexus-500/10 text-nexus-300 border border-nexus-500/20">
                    {profile.targetRole}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors text-left"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors text-left"
                >
                  <SettingsIcon className="w-4 h-4 text-slate-400" />
                  <span>Settings & Preferences</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    logout();
                    setShowProfileMenu(false);
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors text-left font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
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
          <div
            className="bg-nexus-500 h-1.5 rounded-full"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
};
