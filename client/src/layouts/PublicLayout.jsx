import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Sparkles, ArrowRight, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#capabilities', label: 'Capabilities' },
  { href: '#intelligence', label: 'AI Intelligence' },
  { href: '#preview', label: 'Dashboard' },
];

// Keep in sync with the `min-[870px]:`
const DESKTOP_NAV_QUERY = '(min-width: 870px)';

export const PublicLayout = () => {
  const { isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // While the drawer is open: close on Escape, lock page scroll, and
  // close automatically if the window is resized up to the desktop layout.
  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    const mediaQuery = window.matchMedia(DESKTOP_NAV_QUERY);
    const handleResize = (event) => {
      if (event.matches) setMenuOpen(false);
    };
    const previousOverflow = document.body.style.overflow;

    document.addEventListener('keydown', handleKeyDown);
    mediaQuery.addEventListener('change', handleResize);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      mediaQuery.removeEventListener('change', handleResize);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

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

          <nav className="hidden min-[870px]:flex items-center gap-8 text-sm font-medium text-slate-400">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-white transition-colors">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <div className="hidden sm:flex items-center gap-4">
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

            {/* Hamburger toggle (shown below 870px) */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="min-[870px]:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/*
        Mobile drawer. Rendered outside <header> on purpose: the header uses
        backdrop-blur, which would otherwise make `fixed` position relative
        to the header instead of the viewport.
      */}
      <div
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
        className={`min-[870px]:hidden fixed inset-0 z-[60] bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
      <aside
        id="mobile-menu"
        aria-hidden={!menuOpen}
        className={`min-[870px]:hidden fixed top-0 bottom-0 right-0 z-[70] w-72 max-w-[85vw] bg-slate-925 border-l border-slate-800/80 shadow-2xl flex flex-col transition-[transform,visibility] duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0 visible' : 'translate-x-full invisible'
        }`}
      >
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80">
          <span className="font-bold text-base tracking-wide text-white">NEXUS</span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto text-sm font-medium text-slate-300">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-3.5 py-2.5 rounded-xl hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Auth actions (the header copies are hidden below the sm breakpoint) */}
        <div className="p-3 border-t border-slate-800/80 flex flex-col gap-2 sm:hidden">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-nexus-600 hover:bg-nexus-500 text-white text-sm font-medium rounded-xl transition-all"
            >
              <span>Go to Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-center px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white border border-slate-800 rounded-xl transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-nexus-600 hover:bg-nexus-500 text-white text-sm font-medium rounded-xl transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </aside>

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