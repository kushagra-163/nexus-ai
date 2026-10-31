import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { PageHeader } from '../components/Topbar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ChatMessage } from '../components/ChatMessage';
import { Modal } from '../components/Modal';
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

  // Search & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loadingThreads, setLoadingThreads] = useState(false);

  // Rename State
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);

  // Delete Confirmation State
  const [conversationToDelete, setConversationToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const messagesEndRef = useRef(null);
  const isFirstRender = useRef(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      const data = await fetchConversations('', 1);
      if (isMounted && data && data.length > 0) {
        selectConversation(data[0]);
      }
    };
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      setPage(1);
      fetchConversations(searchQuery, 1);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchConversations = async (search = searchQuery, pageNum = page) => {
    setLoadingThreads(true);
    try {
      const res = await API.get('/chat/conversations', {
        params: {
          search: search?.trim() || undefined,
          page: pageNum,
          limit: 15,
        },
      });
      if (res.data.success) {
        setConversations(res.data.data);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
        return res.data.data;
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err.message);
    } finally {
      setLoadingThreads(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPage(newPage);
    fetchConversations(searchQuery, newPage);
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
      const isNew = !activeConversation;
      const payload = {
        conversationId: activeConversation?._id || null,
        content: text,
      };

      const res = await API.post('/chat/message', payload);
      if (res.data.success) {
        const { conversation } = res.data.data;
        setActiveConversation(conversation);
        setMessages(conversation.messages);

        // Refresh thread list: if this is a newly created conversation, reset to page 1 to show it
        if (isNew) {
          setPage(1);
          setSearchQuery('');
          fetchConversations('', 1);
        } else {
          fetchConversations(searchQuery, page);
        }
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

  const handleStartRename = (conv, e) => {
    e.stopPropagation();
    setEditingId(conv._id);
    setEditingTitle(conv.title);
  };

  const handleCancelRename = (e) => {
    if (e) e.stopPropagation();
    setEditingId(null);
    setEditingTitle('');
  };

  const handleSaveRename = async (id, e) => {
    if (e) e.stopPropagation();
    const trimmed = editingTitle.trim();
    if (!trimmed) return;

    const currentConv = conversations.find((c) => c._id === id);
    if (currentConv && currentConv.title === trimmed) {
      setEditingId(null);
      setEditingTitle('');
      return;
    }

    setIsRenaming(true);
    try {
      const res = await API.patch(`/chat/conversations/${id}`, {
        title: trimmed,
      });
      if (res.data.success) {
        const updatedTitle = res.data.data?.title || trimmed;
        setConversations((prev) =>
          prev.map((c) => (c._id === id ? { ...c, title: updatedTitle } : c))
        );
        if (activeConversation?._id === id) {
          setActiveConversation((prev) => (prev ? { ...prev, title: updatedTitle } : null));
        }
        setEditingId(null);
        setEditingTitle('');
      }
    } catch (err) {
      console.error('Rename conversation error:', err.message);
    } finally {
      setIsRenaming(false);
    }
  };

  const handlePromptDelete = (conv, e) => {
    e.stopPropagation();
    setConversationToDelete(conv);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!conversationToDelete) return;
    setIsDeleting(true);
    try {
      await API.delete(`/chat/conversations/${conversationToDelete._id}`);
      const deletedId = conversationToDelete._id;
      const updated = conversations.filter((c) => c._id !== deletedId);
      setConversations(updated);
      if (activeConversation?._id === deletedId) {
        if (updated.length > 0) {
          selectConversation(updated[0]);
        } else {
          startNewConversation();
        }
      }
      setIsDeleteModalOpen(false);
      setConversationToDelete(null);

      // If last item on current page was deleted and page > 1, go to previous page
      const targetPage = updated.length === 0 && page > 1 ? page - 1 : page;
      if (targetPage !== page) {
        setPage(targetPage);
      }
      fetchConversations(searchQuery, targetPage);
    } catch (err) {
      console.error('Delete conversation error:', err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter threads client-side by title AND message text for instant UI responsiveness
  const displayedConversations = conversations.filter((conv) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const titleMatch = conv.title?.toLowerCase().includes(q);
    const messageMatch = conv.messages?.some((msg) =>
      msg.content?.toLowerCase().includes(q)
    );
    return titleMatch || messageMatch;
  });

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
        <Card hover={false} className="lg:col-span-1 flex flex-col p-4 space-y-3 h-full">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Sessions History</span>
            <button
              onClick={startNewConversation}
              className="p-1 rounded-lg text-nexus-400 hover:bg-nexus-500/10 transition-colors"
              title="Start New Thread"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* SEARCH BOX */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or message..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-8 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-nexus-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5"
                title="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* THREAD LIST */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {displayedConversations.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500 space-y-2">
                {searchQuery ? (
                  <>
                    <p>No conversations found matching "{searchQuery}"</p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-nexus-400 hover:underline inline-block text-[11px]"
                    >
                      Clear search
                    </button>
                  </>
                ) : (
                  <p>No past conversations</p>
                )}
              </div>
            ) : (
              displayedConversations.map((conv) => {
                const active = activeConversation?._id === conv._id;
                const isEditingThis = editingId === conv._id;

                if (isEditingThis) {
                  return (
                    <div
                      key={conv._id}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full p-2 rounded-xl text-xs bg-slate-900 border border-nexus-500/50 flex items-center gap-1.5 shadow-sm"
                    >
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSaveRename(conv._id, e);
                          } else if (e.key === 'Escape') {
                            e.preventDefault();
                            handleCancelRename(e);
                          }
                        }}
                        autoFocus
                        disabled={isRenaming}
                        className="flex-1 bg-transparent border-none text-slate-100 text-xs focus:outline-none px-1"
                      />
                      <button
                        type="button"
                        onClick={(e) => handleSaveRename(conv._id, e)}
                        disabled={isRenaming || !editingTitle.trim()}
                        className="p-1 text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 rounded transition-colors disabled:opacity-50"
                        title="Save title (Enter)"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleCancelRename(e)}
                        disabled={isRenaming}
                        className="p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded transition-colors"
                        title="Cancel (Esc)"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                }

                const queryTrim = searchQuery.toLowerCase().trim();
                const matchedInMessageOnly =
                  queryTrim &&
                  !conv.title?.toLowerCase().includes(queryTrim) &&
                  conv.messages?.some((m) => m.content?.toLowerCase().includes(queryTrim));

                return (
                  <div
                    key={conv._id}
                    onClick={() => selectConversation(conv)}
                    className={`w-full p-2.5 rounded-xl text-xs font-medium text-left flex items-center justify-between transition-all cursor-pointer group ${
                      active
                        ? 'bg-nexus-600/20 text-nexus-300 border border-nexus-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex flex-col truncate flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2 truncate">
                        <MessageSquare className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        <span className="truncate">{conv.title}</span>
                      </div>
                      {matchedInMessageOnly && (
                        <span className="text-[10px] text-nexus-400 pl-5.5 truncate">
                          Matched in message
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleStartRename(conv, e)}
                        className="p-1 text-slate-500 hover:text-nexus-400 hover:bg-slate-800/80 rounded transition-colors"
                        title="Rename session"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handlePromptDelete(conv, e)}
                        className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800/80 rounded transition-colors"
                        title="Delete session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* PAGINATION CONTROLS */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400 px-1">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={!pagination.hasPrevPage || loadingThreads}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-medium">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={!pagination.hasNextPage || loadingThreads}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

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

      {/* DELETE CONVERSATION CONFIRMATION MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setConversationToDelete(null);
          }
        }}
        title="Delete Conversation"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Are you sure you want to delete session{' '}
            <span className="font-semibold text-white">"{conversationToDelete?.title}"</span>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              variant="secondary"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setConversationToDelete(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              loading={isDeleting}
              icon={Trash2}
            >
              Delete Session
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
