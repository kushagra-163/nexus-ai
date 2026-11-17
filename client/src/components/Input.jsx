import React from 'react';

export const Input = ({
  label,
  error,
  icon: Icon,
  type = 'text',
  placeholder,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide uppercase">
          {label}
        </label>
      )}
      <div className="relative rounded-xl shadow-xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Icon className="h-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          className={`w-full bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-200 focus:outline-none focus:border-nexus-500 focus:ring-1 focus:ring-nexus-500 ${
            Icon ? 'pl-10' : 'px-3.5'
          } py-2.5 ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{error}</p>}
    </div>
  );
};

export const Textarea = ({
  label,
  error,
  placeholder,
  rows = 4,
  className = '',
  id,
  ...props
}) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={textareaId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide uppercase">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        placeholder={placeholder}
        className={`w-full bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-200 focus:outline-none focus:border-nexus-500 focus:ring-1 focus:ring-nexus-500 ${
          error ? 'border-rose-500' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{error}</p>}
    </div>
  );
};

export const Select = ({
  label,
  options = [],
  error,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide uppercase">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 text-sm transition-all duration-200 focus:outline-none focus:border-nexus-500 focus:ring-1 focus:ring-nexus-500 ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
            {opt.label || opt}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{error}</p>}
    </div>
  );
};
