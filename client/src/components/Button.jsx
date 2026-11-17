import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  const variants = {
    primary: 'bg-nexus-600 hover:bg-nexus-500 text-white shadow-lg shadow-nexus-600/25 focus:ring-nexus-500 active:scale-[0.98]',
    secondary: 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-xs dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 dark:border-slate-700/60 focus:ring-slate-400 dark:focus:ring-slate-500 active:scale-[0.98]',
    outline: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-nexus-500 hover:text-nexus-600 shadow-xs dark:bg-transparent dark:border-slate-700 dark:hover:border-nexus-500 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/40 focus:ring-nexus-500',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 dark:hover:bg-slate-800/60 dark:text-slate-400 dark:hover:text-slate-200 focus:ring-slate-400 dark:focus:ring-slate-500',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 focus:ring-rose-500 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={twMerge(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className={clsx('w-4 h-4', size === 'lg' && 'w-5 h-5')} />
      ) : null}
      <span>{children}</span>
    </button>
  );
};
