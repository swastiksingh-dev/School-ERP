import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Search, ChevronLeft, Circle, CheckCheck, Smile, Check } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { STAGGER } from '../../constants/animations';
import { useAuth } from '../../hooks/useAuth';
import { useChats, useMessages, useSendMessage } from '../../hooks/queries';
import toast from 'react-hot-toast';

const AVATAR_COLORS = [
  'bg-brand-500',
  'bg-blue-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-emerald-500',
  'bg-orange-500',
];

function getAvatarColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatRelativeTime(ts: string) {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

function getDeliveryStatus(msg: { read: boolean; senderId: string; timestamp: string }, isSent: boolean) {
  if (!isSent) return null;
  if (msg.read) return { label: 'Read', icon: CheckCheck, color: 'text-blue-400' };
  const d = new Date(msg.timestamp);
  const now = new Date();
  if (now.getTime() - d.getTime() > 60000) return { label: 'Delivered', icon: CheckCheck, color: '' };
  return { label: 'Sent', icon: Check, color: '' };
}

const RECENT_EMOJIS = ['😊', '👍', '❤️', '😂', '🙏', '🎉', '🔥', '✨', '😅', '🙌', '💯', '😍', '🤔', '👏', '😢', '💪', '✅', '⭐', '🙏', '😎'];

export function StudentMessages() {
  const { user } = useAuth();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [text, setText] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showMessageSearch, setShowMessageSearch] = useState(false);
  const [messageSearchQuery, setMessageSearchQuery] = useState('');
  const [emojiOpen, setEmojiOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);

  const chatUserId = user?.uid === 'demo-student' ? 's1' : user?.uid;
  const { data: chats, isLoading: chatsLoading } = useChats(chatUserId);
  const { data: messages, isLoading: messagesLoading } = useMessages(selectedChatId ?? undefined);
  const { mutate: sendMessage, isPending: sending } = useSendMessage();

  const selectedChat = chats?.find((c) => c.id === selectedChatId);
  const otherParticipant = selectedChat?.participants.find((p) => p.id !== chatUserId);

  const filteredChats = chats?.filter((c) => {
    const other = c.participants.find((p) => p.id !== chatUserId);
    return other?.name.toLowerCase().includes(search.toLowerCase());
  });

  const filteredMessages = useMemo(() => {
    if (!messageSearchQuery.trim()) return messages;
    const q = messageSearchQuery.toLowerCase();
    return messages?.filter((m) => m.text.toLowerCase().includes(q));
  }, [messages, messageSearchQuery]);

  const isOnline = (chatId: string) => {
    const hash = chatId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return hash % 3 !== 0;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (showChat) inputRef.current?.focus();
  }, [showChat, selectedChatId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) setEmojiOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = () => {
    if (!text.trim() || !selectedChatId || !chatUserId) return;
    const currentUserName =
      selectedChat?.participants.find((p) => p.id === chatUserId)?.name ??
      `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() ??
      'You';
    sendMessage(
      { chatId: selectedChatId, senderId: chatUserId, senderName: currentUserName, text: text.trim() },
      {
        onSuccess: () => {
          setText('');
          toast.success('Message sent');
          inputRef.current?.focus();
        },
        onError: () => toast.error('Failed to send message'),
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertEmoji = (emoji: string) => {
    setText((t) => t + emoji);
    setEmojiOpen(false);
    inputRef.current?.focus();
  };

  const selectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setShowChat(true);
    setMessageSearchQuery('');
    setShowMessageSearch(false);
  };

  if (chatsLoading) {
    return (
      <motion.div variants={STAGGER.container} initial="hidden" animate="show" className="space-y-4">
        <motion.div variants={STAGGER.item(0)}>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Messages</h2>
        </motion.div>
        <Card className="flex h-[min(75vh,600px)] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div variants={STAGGER.container} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={STAGGER.item(0)}>
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Messages</h2>
        <p className="text-sm text-slate-500">Stay connected with teachers and classmates</p>
      </motion.div>

      <motion.div variants={STAGGER.item(1)}>
        <Card className="flex h-[min(75vh,600px)] flex-row overflow-hidden p-0">
          {/* Contact List */}
          <div
            className={`w-full flex-shrink-0 flex-col border-r border-slate-200 dark:border-slate-800 lg:w-80 ${
              showChat ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <div className="border-b border-slate-100 px-4 py-4 dark:border-slate-800">
              <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Inbox</h3>
              <div className="relative mt-3">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search conversations…"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredChats?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="mb-2 h-10 w-10 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm text-slate-500">No conversations yet</p>
                </div>
              ) : (
                filteredChats?.map((chat) => {
                  const other = chat.participants.find((p) => p.id !== chatUserId);
                  const isActive = chat.id === selectedChatId;
                  return (
                    <button
                      key={chat.id}
                      onClick={() => selectChat(chat.id)}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                        isActive ? 'bg-brand-50 dark:bg-brand-900/20' : ''
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${getAvatarColor(other?.id ?? chat.id)}`}
                      >
                        {other?.name.charAt(0) ?? '?'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {other?.name ?? 'Unknown'}
                          </span>
                          {chat.lastMessageTime && (
                            <span className="ml-2 flex-shrink-0 text-[11px] text-slate-400">
                              {formatRelativeTime(chat.lastMessageTime)}
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 flex items-center justify-between">
                          <span className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {chat.lastMessage ?? 'No messages yet'}
                          </span>
                          {chat.unreadCount > 0 && (
                            <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-600 px-1.5 text-[11px] font-bold text-white">
                              {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex flex-1 flex-col ${!showChat ? 'hidden lg:flex' : 'flex'}`}>
            {!selectedChatId ? (
              <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                  <MessageSquare className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                  Your Messages
                </h3>
                <p className="mt-1 text-sm text-slate-500">Select a conversation to start chatting</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                  <button
                    onClick={() => setShowChat(false)}
                    className="-ml-1 flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
                    aria-label="Back to conversations"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${getAvatarColor(otherParticipant?.id ?? selectedChatId)}`}
                  >
                    {otherParticipant?.name.charAt(0) ?? '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {otherParticipant?.name ?? 'Unknown'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowMessageSearch((s) => !s)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Search className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className={`flex items-center gap-1 text-xs ${isOnline(selectedChatId) ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                      <Circle className={`h-2 w-2 ${isOnline(selectedChatId) ? 'fill-current' : 'fill-none stroke-current'}`} />
                      {isOnline(selectedChatId) ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                {showMessageSearch && (
                  <div className="border-b border-slate-200 px-4 py-2 dark:border-slate-800">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                      <input
                        value={messageSearchQuery}
                        onChange={(e) => setMessageSearchQuery(e.target.value)}
                        placeholder="Search in chat…"
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-500"
                        autoFocus
                      />
                    </div>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto px-4 py-4">
                  {messagesLoading ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
                    </div>
                  ) : messages?.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-center">
                      <div>
                        <MessageSquare className="mx-auto mb-2 h-8 w-8 text-slate-300 dark:text-slate-600" />
                        <p className="text-sm text-slate-500 dark:text-slate-400">No messages yet</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          Send a message to start the conversation
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredMessages?.map((msg) => {
                        const isSent = msg.senderId === chatUserId;
                        const delivery = getDeliveryStatus(msg, isSent);
                        return (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                                isSent
                                  ? 'rounded-br-md bg-brand-600 text-white'
                                  : 'rounded-bl-md bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                              }`}
                            >
                              {!isSent && (
                                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                  {msg.senderName}
                                </p>
                              )}
                              <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                              <div
                                className={`mt-1 flex items-center justify-end gap-1 ${
                                  isSent ? 'text-white/70' : 'text-slate-400 dark:text-slate-500'
                                }`}
                              >
                                <span className="text-[10px]">{formatRelativeTime(msg.timestamp)}</span>
                                {delivery && (
                                  <delivery.icon className={`h-3 w-3 ${delivery.color}`} />
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                      {filteredMessages?.length === 0 && showMessageSearch && (
                        <div className="py-8 text-center text-sm text-slate-400">No messages match your search.</div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                <div className="flex items-end gap-2 border-t border-slate-200 p-3 dark:border-slate-800">
                  <div className="relative" ref={emojiRef}>
                    <button
                      type="button"
                      onClick={() => setEmojiOpen((o) => !o)}
                      className="flex h-11 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      aria-label="Emoji picker"
                    >
                      <Smile className="h-4 w-4" />
                    </button>
                    <AnimatePresence>
                      {emojiOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute bottom-12 left-0 right-0 z-50 mx-auto w-56 rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-900 sm:left-0 sm:right-auto"
                        >
                          <div className="grid grid-cols-5 gap-1">
                            {RECENT_EMOJIS.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => insertEmoji(emoji)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <input
                    ref={inputRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message…"
                    className="min-h-[44px] flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-500"
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!text.trim() || sending}
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white transition-colors hover:bg-brand-700 disabled:opacity-50 disabled:hover:bg-brand-600"
                    aria-label="Send"
                  >
                    {sending ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
