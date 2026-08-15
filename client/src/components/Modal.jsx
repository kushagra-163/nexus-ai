import React, { useEffect } from 'react';
import { X, AlertCircle, Inbox } from 'lucide-react';
import { Button } from './Button';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${maxWidth} bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-10 overflow-hidden`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export const EmptyState = ({ icon: Icon = Inbox, title, description, actionText, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
      <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center mb-4 text-nexus-400">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-slate-200 mb-1">{title}</h4>
      <p className="text-sm text-slate-400 max-w-md mb-6">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export const ErrorState = ({ message = 'Something went wrong while loading data.', onRetry }) => {
  return (
    <div className="flex items-start gap-4 p-4 border border-rose-500/20 bg-rose-500/5 rounded-2xl">
      <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
      <div className="flex-1">
        <h5 className="text-sm font-semibold text-rose-300">Nexus Service Alert</h5>
        <p className="text-xs text-rose-400/90 mt-0.5">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 text-xs font-semibold text-rose-300 underline hover:text-rose-200 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};
