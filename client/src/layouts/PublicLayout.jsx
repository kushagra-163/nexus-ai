import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Sparkles, ArrowRight, Menu, X, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';

export const PublicLayout = () => {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle escape key and click outside to close mobile drawer
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'AI Intelligence', href: '#capabilities' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col selection:bg-nexus-500 selection:text-white transition-colors duration-200">
      {/* Sticky Responsive Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-3 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-nexus-600/10 dark:bg-nexus-600/20 border border-nexus-500/20 dark:border-nexus-500/30 flex items-center justify-center text-nexus-600 dark:text-nexus-400 group-hover:scale-105 transition-transform duration-200 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-wide">NEXUS</span>
              <span className="font-semibold text-xs text-nexus-600 dark:text-nexus-400 ml-1 bg-nexus-500/10 px-2 py-0.5 rounded border border-nexus-500/20">AI</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700 dark:text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-nexus-600 dark:hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Right Controls (Theme Toggle + Auth CTAs) */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-nexus-600 hover:bg-nexus-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-nexus-600/25 hover:shadow-nexus-600/35 active:scale-95"
              >
                <span>Go to Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-nexus-600 dark:hover:text-white transition-colors px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-xs"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-4.5 py-2 bg-nexus-600 hover:bg-nexus-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-nexus-600/25 hover:shadow-nexus-600/35 active:scale-95"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Controls: Theme Toggle + Hamburger Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80 shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-nexus-500/50 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer Menu */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden mt-3 border border-slate-200/90 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl rounded-2xl p-4 space-y-4 shadow-xl animate-fade-in"
          >
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 hover:text-nexus-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/80 transition-colors flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>
              ))}
            </nav>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-col gap-2.5">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-nexus-600 hover:bg-nexus-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-nexus-600/25"
                >
                  <span>Go to Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-nexus-600 dark:hover:text-white transition-colors py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-nexus-600 hover:bg-nexus-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-nexus-600/25"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Public Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-12 px-6 bg-slate-100/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-nexus-600 dark:text-nexus-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-300">Nexus AI Engine</span>
            <span>— Intelligent Career & Skill Platform</span>
          </div>
          <p>© {new Date().getFullYear()} Nexus AI. Built for full-stack portfolio excellence.</p>
        </div>
      </footer>
    </div>
  );
};
