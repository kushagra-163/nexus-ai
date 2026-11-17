import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = ({ className = '', showLabel = false }) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-800/80 shadow-xs transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-nexus-500/50 cursor-pointer ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        {isDark ? (
          <Sun className="w-5 h-5 transition-transform duration-300 transform rotate-0 scale-100 text-amber-400" />
        ) : (
          <Moon className="w-5 h-5 transition-transform duration-300 transform rotate-0 scale-100 text-indigo-600" />
        )}
      </div>
      {showLabel && (
        <span className="ml-2 text-sm font-medium">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};
