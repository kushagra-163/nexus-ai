import React from 'react';
import { clsx } from 'clsx';

export const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <div
      className={clsx(
        'bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 md:p-6 backdrop-blur-sm transition-all duration-200',
        hover && 'hover:border-slate-700/80 hover:bg-slate-900/80',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const Badge = ({ children, variant = 'indigo', className = '' }) => {
  const variants = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    slate: 'bg-slate-800/80 text-slate-300 border-slate-700/50',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide',
        variants[variant] || variants.indigo,
        className
      )}
    >
      {children}
    </span>
  );
};

export const ProgressBar = ({ progress = 0, color = 'bg-nexus-500', height = 'h-2', showLabel = false }) => {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full space-y-1">
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
          <span>Completion Progress</span>
          <span className="text-slate-200">{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${color} ${height} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

export const Skeleton = ({ className = '' }) => {
  return <div className={`animate-pulse bg-slate-800/80 rounded-xl ${className}`} />;
};
