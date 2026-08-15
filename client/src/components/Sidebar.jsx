import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  User,
  FileText,
  Zap,
  Compass,
  Target,
  MapPin,
  FolderGit2,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Assistant', path: '/assistant', icon: Bot, badge: 'AI' },
  { name: 'My Profile', path: '/profile', icon: User },
  { name: 'Resume', path: '/resume', icon: FileText },
  { name: 'Skills', path: '/skills', icon: Zap },
  { name: 'Career Paths', path: '/career-paths', icon: Compass },
  { name: 'Job Match', path: '/job-match', icon: Target },
  { name: 'Learning Roadmap', path: '/roadmap', icon: MapPin },
  { name: 'Projects', path: '/projects', icon: FolderGit2 },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-925 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-nexus-600/20 border border-nexus-500/30 flex items-center justify-center text-nexus-400">
              <Sparkles className="w-5 h-5 text-nexus-400" />
            </div>
            <div>
              <span className="font-bold text-base tracking-wide text-white">NEXUS</span>
              <span className="font-semibold text-xs text-nexus-400 ml-1 bg-nexus-500/10 px-1.5 py-0.5 rounded border border-nexus-500/20">AI</span>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                    isActive
                      ? 'bg-nexus-600/15 text-nexus-300 border border-nexus-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold uppercase bg-nexus-500/20 text-nexus-400 px-1.5 py-0.2 rounded border border-nexus-500/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-slate-800/80">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-300 shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'N'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'User'}</p>
                <p className="text-[11px] text-slate-400 truncate">{profile?.headline || 'Tech Professional'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
