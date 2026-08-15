import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PublicLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-nexus-500 selection:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-nexus-600/20 border border-nexus-500/30 flex items-center justify-center text-nexus-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-wide">NEXUS</span>
              <span className="font-semibold text-xs text-nexus-400 ml-1 bg-nexus-500/10 px-2 py-0.5 rounded border border-nexus-500/20">AI</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a>
            <a href="#intelligence" className="hover:text-white transition-colors">AI Intelligence</a>
            <a href="#preview" className="hover:text-white transition-colors">Dashboard</a>
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-nexus-600 hover:bg-nexus-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-nexus-600/25"
              >
                <span>Go to Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-nexus-600 hover:bg-nexus-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-nexus-600/25"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Public Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-12 px-6 bg-slate-925">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-nexus-400" />
            <span className="font-semibold text-slate-300">Nexus AI Engine</span>
            <span>— Intelligent Career & Skill Platform</span>
          </div>
          <p>© {new Date().getFullYear()} Nexus AI. Built for full-stack portfolio excellence.</p>
        </div>
      </footer>
    </div>
  );
};
