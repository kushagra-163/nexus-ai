import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Plus,
  Trash2,
  Sparkles,
  MessageSquare,
  RefreshCw,
  User,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { PageHeader } from '../components/Topbar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ChatMessage } from '../components/ChatMessage';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const suggestedPrompts = [
  "How strong is my profile for an AI Engineer role?",
  "What high-priority skills should I learn next?",
  "Analyze my current career path and readiness score.",
  "Give me a 6-month roadmap to become a Full Stack Developer.",
  "Which of my portfolio projects should I improve?",
  "How can I improve my resume ATS compatibility score?"
];

export const AIAssistantPage = () => {
  const { profile } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const fetchConversations = async () => {
    try {
      const res = await API.get('/chat/conversations');
      if (res.data.success) {
        setConversations(res.data.data);
        if (res.data.data.length > 0) {
          selectConversation(res.data.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err.message);
    }
  };

  const selectConversation = (conv) => {
    setActiveConversation(conv);
    setMessages(conv.messages || []);
  };

  const startNewConversation = () => {
    setActiveConversation(null);
    setMessages([]);
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text || !text.trim()) return;

    // Optimistically append user message
    const tempUserMsg = { role: 'user', content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, tempUserMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const payload = {
        conversationId: activeConversation?._id || null,
        content: text,
      };

      const res = await API.post('/chat/message', payload);
      if (res.data.success) {
        const { conversation, reply } = res.data.data;
        setActiveConversation(conversation);
        setMessages(conversation.messages);

        // Refresh thread list
        fetchConversations();
      }
    } catch (err) {
      console.error('Failed to send chat message:', err.message);
      // Append error notification
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, Nexus AI encountered a network issue. Please check your connection and try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConversation = async (id, e) => {
    e.stopPropagation();
    try {
      await API.delete(`/chat/conversations/${id}`);
      const updated = conversations.filter((c) => c._id !== id);
      setConversations(updated);
      if (activeConversation?._id === id) {
        if (updated.length > 0) {
          selectConversation(updated[0]);
        } else {
          startNewConversation();
        }
      }
    } catch (err) {
      console.error('Delete conversation error:', err.message);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Assistant Workspace"
        subtitle="Context-aware career strategist and technical mentor"
        actionText="New Session"
        onAction={startNewConversation}
        actionIcon={Plus}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-230px)] min-h-[550px]">
        {/* CONVERSATION THREAD SIDEBAR */}
        <Card hover={false} className="lg:col-span-1 flex flex-col p-4 space-y-4 h-full">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Sessions History</span>
            <button
              onClick={startNewConversation}
              className="p-1 rounded-lg text-nexus-400 hover:bg-nexus-500/10 transition-colors"
              title="Start New Thread"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {conversations.map((conv) => {
              const active = activeConversation?._id === conv._id;
              return (
                <div
                  key={conv._id}
                  onClick={() => selectConversation(conv)}
                  className={`w-full p-3 rounded-xl text-xs font-medium text-left flex items-center justify-between transition-all cursor-pointer group ${
                    active
                      ? 'bg-nexus-600/20 text-nexus-300 border border-nexus-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{conv.title}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteConversation(conv._id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* USER CONTEXT BADGE */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live Profile Context</span>
              </span>
              <span className="text-nexus-400 font-bold">Active</span>
            </div>
            <p className="text-[11px] font-semibold text-slate-200 truncate">
              {profile?.headline || 'Tech Professional'}
            </p>
          </div>
        </Card>

        {/* CHAT MESSAGES VIEWPORT */}
        <Card hover={false} className="lg:col-span-3 flex flex-col p-4 sm:p-6 h-full relative">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-6 overflow-y-auto">
              <div className="w-14 h-14 rounded-3xl bg-nexus-600/20 border border-nexus-500/40 flex items-center justify-center text-nexus-400">
                <Bot className="w-7 h-7" />
              </div>
              <div className="space-y-2 max-w-md">
                <h3 className="text-lg font-bold text-white">How can Nexus AI assist your career today?</h3>
                <p className="text-xs text-slate-400">
                  Select a suggested prompt below or type your custom query. Nexus AI synthesizes your skills, projects, and target role context.
                </p>
              </div>

              {/* SUGGESTED PROMPTS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl text-left">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="p-3.5 bg-slate-900 border border-slate-800 hover:border-nexus-500/50 rounded-xl text-xs text-slate-300 hover:text-white transition-all flex items-center justify-between group"
                  >
                    <span>"{prompt}"</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-nexus-400 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {messages.map((msg, idx) => (
                <ChatMessage
                  key={idx}
                  role={msg.role}
                  content={msg.content}
                  timestamp={msg.timestamp}
                />
              ))}
              {loading && (
                <div className="flex items-center gap-3 text-xs text-nexus-400 my-4 animate-pulse">
                  <Bot className="w-4 h-4" />
                  <span>Nexus AI is synthesizing recommendations...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* MESSAGE INPUT FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="pt-4 border-t border-slate-800 flex items-center gap-3"
          >
            <input
              type="text"
              placeholder="Ask Nexus AI about skills, resume improvements, job matching..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={loading}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-nexus-500 transition-colors"
            />
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={!inputMessage.trim() || loading}
              icon={Send}
            >
              Send
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
