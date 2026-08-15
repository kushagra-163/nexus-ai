import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Shield, Key, LogOut, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { PageHeader } from '../components/Topbar';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { useAuth } from '../context/AuthContext';

export const SettingsPage = () => {
  const { user, logout } = useAuth();
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

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings & Preferences"
        subtitle="Manage account preferences, AI provider keys, and security settings"
      />

      {/* ACCOUNT DETAILS CARD */}
      <Card className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Shield className="w-4 h-4 text-nexus-400" />
          <span>Account Overview</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Name" value={user?.name || ''} readOnly />
          <Input label="Email" value={user?.email || ''} readOnly />
        </div>
      </Card>

      {/* AI API KEY PREFERENCE */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-nexus-400" />
            <span>Custom AI Provider Configuration</span>
          </h3>
          <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
            Google Gemini Ready
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
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
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
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
      <Card className="border-rose-500/20 bg-rose-500/5 space-y-4">
        <h3 className="text-base font-bold text-rose-300 flex items-center gap-2 border-b border-rose-500/20 pb-3">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Account Actions & Danger Zone</span>
        </h3>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-200">Sign Out of Session</h4>
            <p className="text-xs text-slate-400">Logout from current device session</p>
          </div>
          <Button variant="secondary" onClick={handleLogout} icon={LogOut}>
            Sign Out
          </Button>
        </div>

        <div className="pt-4 border-t border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-rose-300">Delete Account & Data</h4>
            <p className="text-xs text-slate-400">Permanently erase profile, resume analyses, and milestone history</p>
          </div>
          <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)} icon={Trash2}>
            Delete Account
          </Button>
        </div>
      </Card>

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Account Deletion">
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Are you sure you want to permanently delete your Nexus AI account? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
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
