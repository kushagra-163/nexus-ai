import React, { useState } from 'react';
import { Bot, User, Copy, Check, Sparkles } from 'lucide-react';

export const ChatMessage = ({ role, content, timestamp }) => {
  const [copied, setCopied] = useState(false);
  const isUser = role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple Markdown text formatter for clean rendering
  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');

    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-sm font-bold text-slate-100 mt-3 mb-1">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-base font-bold text-white mt-4 mb-2">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-300 my-1">
            {line.substring(2)}
          </li>
        );
      }
      if (line.startsWith('```')) {
        return null; // Ignore fence markers for simple line view
      }
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="text-xs sm:text-sm text-slate-200 leading-relaxed my-1">
          {line}
        </p>
      );
    });
  };

  return (
    <div className={`flex gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-nexus-600/20 border border-nexus-500/30 flex items-center justify-center text-nexus-400 shrink-0 mt-1">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm relative group ${
        isUser
          ? 'bg-nexus-600 text-white rounded-tr-none'
          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
      }`}>
        {!isUser && (
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-nexus-400">
              <Sparkles className="w-3 h-3" />
              <span>Nexus AI Assistant</span>
            </div>
            <button
              onClick={handleCopy}
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100"
              title="Copy response"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

        <div className="space-y-1">{renderFormattedText(content)}</div>

        {timestamp && (
          <span className="block text-[10px] text-right mt-2 text-slate-400/80">
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-xs text-indigo-300 shrink-0 mt-1">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
