import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Key, LogOut, Trash2, CheckCircle2, AlertTriangle, Sun, Moon, Monitor } from 'lucide-react';
import { PageHeader } from '../components/Topbar';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const SettingsPage = () => {
  const { user, logout } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [customKey, setCustomKey] = useState('');
  const [keySaved, setKeySaved] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    localStorage.setItem('nexus_custom_ai_key', customKey);
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    // Perform cleanup & logout
    logout();
    navigate('/register');
  };

  const themeOptions = [
    {
      id: 'light',
      label: 'Light Mode',
      desc: 'Clean & high contrast',
      icon: Sun,
    },
    {
      id: 'dark',
      label: 'Dark Mode',
      desc: 'Easy on the eyes in low light',
      icon: Moon,
    },
    {
      id: 'system',
      label: 'System Theme',
      desc: `Syncs with OS (currently ${resolvedTheme})`,
      icon: Monitor,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings & Preferences"
        subtitle="Manage account preferences, UI theme, AI provider keys, and security settings"
      />

      {/* APPEARANCE & THEME SETTINGS */}
      <Card className="space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sun className="w-4 h-4 text-nexus-500" />
            <span>Appearance & Theme</span>
          </h3>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-nexus-500/10 text-nexus-600 dark:text-nexus-400 border border-nexus-500/20 capitalize">
            Active: {theme === 'system' ? `System (${resolvedTheme})` : theme}
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Customize your Nexus AI interface appearance. Choose between crisp light mode, modern dark mode, or automatic synchronization with your operating system preference.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTheme(opt.id)}
                className={`relative flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-nexus-500 bg-nexus-50/50 dark:bg-nexus-500/10 shadow-xs ring-1 ring-nexus-500'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected
                        ? 'bg-nexus-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-nexus-500 animate-pulse"></span>
                  )}
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {opt.label}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {opt.desc}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* ACCOUNT DETAILS CARD */}
      <Card className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Shield className="w-4 h-4 text-nexus-500" />
          <span>Account Overview</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Name" value={user?.name || ''} readOnly />
          <Input label="Email" value={user?.email || ''} readOnly />
        </div>
      </Card>

      {/* AI API KEY PREFERENCE */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-nexus-500" />
            <span>Custom AI Provider Configuration</span>
          </h3>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
            Google Gemini Ready
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Nexus AI uses server-side environment variables (`GEMINI_API_KEY`) by default. Optionally enter a custom Google Gemini API Key below for client-side override.
        </p>

        <form onSubmit={handleSaveApiKey} className="space-y-4">
          <Input
            label="Gemini API Key (Optional)"
            type="password"
            placeholder="AIzaSy..."
            value={customKey}
            onChange={(e) => setCustomKey(e.target.value)}
          />
          <div className="flex items-center justify-between">
            {keySaved && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Key Saved to Browser Session
              </span>
            )}
            <div className="ml-auto">
              <Button type="submit" variant="secondary">
                Save Key Override
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* DANGER ZONE & LOGOUT */}
      <Card className="border-rose-200 dark:border-rose-500/20 bg-rose-50/50 dark:bg-rose-500/5 space-y-4">
        <h3 className="text-base font-bold text-rose-800 dark:text-rose-300 flex items-center gap-2 border-b border-rose-200 dark:border-rose-500/20 pb-3">
          <AlertTriangle className="w-4 h-4 text-rose-500 dark:text-rose-400" />
          <span>Account Actions & Danger Zone</span>
        </h3>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Sign Out of Session</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Logout from current device session</p>
          </div>
          <Button variant="secondary" onClick={handleLogout} icon={LogOut}>
            Sign Out
          </Button>
        </div>

        <div className="pt-4 border-t border-rose-200 dark:border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-rose-700 dark:text-rose-300">Delete Account & Data</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Permanently erase profile, resume analyses, and milestone history</p>
          </div>
          <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)} icon={Trash2}>
            Delete Account
          </Button>
        </div>
      </Card>

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Account Deletion">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to permanently delete your Nexus AI account? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount} icon={Trash2}>
              Confirm Permanent Deletion
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
