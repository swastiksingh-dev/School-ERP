import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { MessageSquare, Send, Users, ChevronRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { STAGGER } from '../../constants/animations';
import { useChats, useMessages, useSendMessage, useClassesByTeacher } from '../../hooks/queries';
import toast from 'react-hot-toast';

export function TeacherMessages() {
  const teacherId = 't1';
  const userId = 'demo-teacher';
  const [tab, setTab] = useState<'individual' | 'broadcast'>('individual');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [broadcastText, setBroadcastText] = useState('');
  const [broadcastClass, setBroadcastClass] = useState('');
  const [sentBroadcasts, setSentBroadcasts] = useState<{ text: string; target: string; time: string }[]>([]);

  const { data: myClasses } = useClassesByTeacher(teacherId);
  const { data: chats } = useChats(userId);
  const { data: messages } = useMessages(selectedChatId ?? undefined);
  const sendMessage = useSendMessage();
  const contactList = useMemo(() => {
    if (!chats) return [];
    return chats
      .filter(c => c.type === 'individual')
      .map(c => {
        const other = c.participants.find(p => p.id !== teacherId && p.id !== userId);
        return { chatId: c.id, name: other?.name ?? 'Unknown', lastMessage: c.lastMessage, time: c.lastMessageTime, unread: c.unreadCount };
      });
  }, [chats, teacherId, userId]);

  const selectedChat = useMemo(() => chats?.find(c => c.id === selectedChatId), [chats, selectedChatId]);

  const handleSend = () => {
    if (!inputText.trim() || !selectedChatId) return;
    sendMessage.mutate(
      { chatId: selectedChatId, senderId: userId, senderName: 'Priya Verma', text: inputText.trim() },
      { onSuccess: () => { setInputText(''); }, onError: () => { toast.error('Failed to send message'); } }
    );
  };

  const handleBroadcast = () => {
    if (!broadcastText.trim()) { toast.error('Enter a message'); return; }
    if (!broadcastClass) { toast.error('Select a class'); return; }
    const cls = myClasses?.find(c => c.id === broadcastClass);
    const target = cls?.name ?? broadcastClass;
    setSentBroadcasts(prev => [{
      text: broadcastText.trim(),
      target,
      time: new Date().toLocaleString(),
    }, ...prev]);
    toast.success(`Broadcast sent to ${target}`);
    setBroadcastText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <motion.div variants={STAGGER.container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={STAGGER.item(0)}>
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Messages</h2>
      </motion.div>

      <motion.div variants={STAGGER.item(1)} className="flex gap-2">
        <Button variant={tab === 'individual' ? 'primary' : 'secondary'} onClick={() => { setTab('individual'); setSelectedChatId(null); }}>
          <MessageSquare className="h-4 w-4" /> Individual
        </Button>
        <Button variant={tab === 'broadcast' ? 'primary' : 'secondary'} onClick={() => setTab('broadcast')}>
          <Users className="h-4 w-4" /> Broadcast
        </Button>
      </motion.div>

      {tab === 'individual' && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <h3 className="mb-3 font-display text-sm font-semibold text-slate-900 dark:text-white">Contacts</h3>
            <div className="space-y-1">
              {contactList.map(contact => (
                <button
                  key={contact.chatId}
                  onClick={() => setSelectedChatId(contact.chatId)}
                  className={`flex w-full items-center gap-3 rounded-xl p-3 text-left text-sm transition-colors ${
                    selectedChatId === contact.chatId
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-300'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    {contact.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{contact.name}</p>
                    <p className="truncate text-xs text-slate-400">{contact.lastMessage ?? 'No messages'}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                </button>
              ))}
              {contactList.length === 0 && (
                <p className="py-8 text-center text-sm text-slate-400">No conversations yet</p>
              )}
            </div>
          </Card>

          <Card className="lg:col-span-2">
            {selectedChat ? (
              <>
                <h3 className="mb-4 font-display text-base font-semibold text-slate-900 dark:text-white">
                  {selectedChat.participants.find(p => p.id !== teacherId && p.id !== userId)?.name ?? 'Chat'}
                </h3>
                <div className="mb-4 max-h-80 space-y-3 overflow-y-auto">
                  {(messages ?? []).map(m => {
                    const isMe = m.senderId === userId || m.senderId === teacherId;
                    return (
                      <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                          isMe
                            ? 'bg-brand-600 text-white'
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                        }`}>
                          <p>{m.text}</p>
                          <p className={`mt-1 text-right text-[10px] ${isMe ? 'text-white/70' : 'text-slate-400'}`}>
                            {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-end gap-2">
                  <textarea
                    value={inputText} onChange={e => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown} rows={2}
                    placeholder="Type your message..."
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none ring-1 ring-transparent transition-all focus:border-brand-500 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                  <Button onClick={handleSend} disabled={!inputText.trim() || sendMessage.isPending}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex h-64 items-center justify-center">
                <p className="text-sm text-slate-400">Select a contact to start messaging</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {tab === 'broadcast' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">Send Broadcast</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Target Class</label>
                <select value={broadcastClass} onChange={e => setBroadcastClass(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                  <option value="">All my classes</option>
                  {(myClasses ?? []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Message</label>
                <textarea value={broadcastText} onChange={e => setBroadcastText(e.target.value)} rows={4}
                  placeholder="Type your broadcast message..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none ring-1 ring-transparent transition-all focus:border-brand-500 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <Button className="w-full" onClick={handleBroadcast} disabled={!broadcastText.trim()}>
                <Send className="h-4 w-4" /> Send Broadcast
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">Sent Broadcasts</h3>
            {sentBroadcasts.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">No broadcasts sent yet</p>
            ) : (
              <div className="space-y-3">
                {sentBroadcasts.map((b, i) => (
                  <div key={i} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-slate-900 dark:text-white">{b.text}</p>
                      <span className="shrink-0 rounded bg-brand-100 px-2 py-0.5 text-[10px] font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">{b.target}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{b.time}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </motion.div>
  );
}
