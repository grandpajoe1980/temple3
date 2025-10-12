import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ChatBubbleLeftIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  UserCircleIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import LoadingSpinner from '../../shared/LoadingSpinner';
import ComposeMessageModal from './ComposeMessageModal';
import { messageService } from '../../../services/messages';
import { useNotification } from '../../../contexts/NotificationContext';
import { useTenant } from '../../../contexts/TenantContext';
import { useAuth } from '../../../hooks/useAuth';

const buildConversations = (messages, currentUserId) => {
  const map = new Map();

  messages.forEach(message => {
    const isOwn = message.senderId === currentUserId;
    const otherId = isOwn ? message.recipientId : message.senderId;
    if (!otherId) return;
    const otherName = isOwn ? message.recipientName : message.senderName;
    const key = `${otherId}|${message.subject || 'General'}`;
    const existing = map.get(key);
    const messageEntry = {
      id: message.id,
      content: message.content,
      timestamp: message.timestamp,
      isOwn,
      subject: message.subject,
      isRead: message.isRead,
      senderId: message.senderId,
      recipientId: message.recipientId
    };

    if (existing) {
      existing.messages.push(messageEntry);
      if (!message.isRead && message.recipientId === currentUserId) {
        existing.unread += 1;
      }
      if (existing.lastTimestamp < message.timestamp) {
        existing.lastTimestamp = message.timestamp;
        existing.lastMessage = messageEntry;
      }
    } else {
      map.set(key, {
        id: key,
        subject: message.subject,
        participantId: otherId,
        participantName: otherName,
        unread: !message.isRead && message.recipientId === currentUserId ? 1 : 0,
        lastTimestamp: message.timestamp,
        lastMessage: messageEntry,
        messages: [messageEntry]
      });
    }
  });

  const conversations = Array.from(map.values()).map(convo => ({
    ...convo,
    messages: convo.messages.sort((a, b) => a.timestamp - b.timestamp)
  }));

  return conversations.sort((a, b) => b.lastTimestamp - a.lastTimestamp);
};

const mapMessage = (message) => ({
  id: message.id,
  subject: message.subject || 'General',
  content: message.content,
  timestamp: new Date(message.created_at || message.createdAt),
  isRead: message.is_read,
  senderId: message.sender_id,
  recipientId: message.recipient_id,
  senderName: `${message.sender_first_name ?? ''} ${message.sender_last_name ?? ''}`.trim() || 'Unknown',
  recipientName: `${message.recipient_first_name ?? ''} ${message.recipient_last_name ?? ''}`.trim() || 'Unknown'
});

export default function Messages() {
  const { showError, showSuccess } = useNotification();
  const { currentTenant } = useTenant();
  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const selectedConversation = useMemo(
    () => conversations.find(conversation => conversation.id === selectedConversationId) || null,
    [conversations, selectedConversationId]
  );

  const loadMessages = useCallback(async () => {
    if (!currentTenant) {
      setConversations([]);
      setSelectedConversationId(null);
      return;
    }
    setLoading(true);
    try {
      const [inboxResponse, sentResponse] = await Promise.all([
        messageService.getInbox({ limit: 100 }),
        messageService.getSent({ limit: 100 })
      ]);
      const inboxMessages = (inboxResponse.messages || []).map(mapMessage);
      const sentMessages = (sentResponse.messages || []).map(mapMessage);
      const combined = [...inboxMessages, ...sentMessages];
      setConversations(buildConversations(combined, user?.id));
    } catch (error) {
      console.error('Failed to load messages', error);
      showError('Unable to load tenant messages.');
    } finally {
      setLoading(false);
    }
  }, [currentTenant, showError, user?.id]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (!selectedConversation) return;
    const unread = selectedConversation.messages.filter(message => !message.isRead && message.recipientId === user?.id);
    if (unread.length === 0) return;

    unread.forEach(async (message) => {
      try {
        await messageService.markAsRead(message.id);
        setConversations(prev => prev.map(conversation => {
          if (conversation.id !== selectedConversation.id) return conversation;
          return {
            ...conversation,
            unread: Math.max(0, conversation.unread - 1),
            messages: conversation.messages.map(item => item.id === message.id ? { ...item, isRead: true } : item)
          };
        }));
      } catch (error) {
        console.error('Failed to mark message as read', error);
      }
    });
  }, [selectedConversation, user?.id]);

  const filteredConversations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return conversations;
    return conversations.filter(conversation =>
      conversation.participantName.toLowerCase().includes(term)
      || conversation.subject.toLowerCase().includes(term)
    );
  }, [conversations, searchTerm]);

  const handleSelectConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
    setMessageText('');
  };

  const handleSendReply = async (event) => {
    event.preventDefault();
    if (!selectedConversation || !messageText.trim()) return;
    setSending(true);
    try {
      const payload = {
        recipientId: selectedConversation.participantId,
        subject: selectedConversation.subject,
        content: messageText.trim()
      };
      const response = await messageService.send(payload);
      const newMessage = mapMessage(response.data);
      newMessage.timestamp = new Date();
      newMessage.senderId = user?.id;
      newMessage.recipientId = selectedConversation.participantId;
      newMessage.isRead = false;
      newMessage.senderName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'You';
      newMessage.recipientName = selectedConversation.participantName;
      setConversations(prev => prev.map(conversation => {
        if (conversation.id !== selectedConversation.id) return conversation;
        const updatedMessages = [...conversation.messages, { ...newMessage, isOwn: true }];
        return {
          ...conversation,
          messages: updatedMessages,
          lastMessage: { ...newMessage, isOwn: true },
          lastTimestamp: new Date()
        };
      }));
      setMessageText('');
      showSuccess('Message sent');
    } catch (error) {
      console.error('Failed to send reply', error);
      showError(error.response?.data?.error || 'Unable to send message.');
    } finally {
      setSending(false);
    }
  };

  const handleComposeSend = async ({ recipientId, subject, content }) => {
    try {
      await messageService.send({ recipientId, subject, content });
      showSuccess('Message sent');
      setComposeOpen(false);
      await loadMessages();
    } catch (error) {
      console.error('Failed to send message', error);
      showError(error.response?.data?.error || 'Unable to send message.');
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] bg-gradient-to-br from-slate-100 via-white to-slate-100 py-8">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex">
          <div className="w-80 border-r border-slate-100 flex flex-col">
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Messages</h2>
                <button
                  className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition"
                  onClick={() => setComposeOpen(true)}
                  aria-label="Compose message"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search conversations"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="py-12 flex justify-center">
                  <LoadingSpinner label="Loading conversations" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500">
                  No conversations yet.
                </div>
              ) : (
                filteredConversations.map(conversation => (
                  <button
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation.id)}
                    className={`w-full p-4 flex items-start gap-3 text-left transition ${
                      selectedConversationId === conversation.id ? 'bg-blue-50' : 'hover:bg-slate-50'
                    } border-b border-slate-100`}
                  >
                    <UserCircleIcon className="h-10 w-10 text-slate-300 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-slate-900 truncate">
                          {conversation.participantName}
                        </h3>
                        <span className="text-xs text-slate-400">
                          {formatDistanceToNow(new Date(conversation.lastTimestamp), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">{conversation.subject}</p>
                      <p className="text-sm text-slate-500 truncate mt-1">
                        {conversation.lastMessage?.content || 'No messages yet'}
                      </p>
                      {conversation.unread > 0 && (
                        <span className="inline-flex mt-2 items-center justify-center text-xs font-semibold text-white bg-blue-600 rounded-full h-5 w-5">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                <div className="p-5 border-b border-slate-100 flex items-center gap-3">
                  <UserCircleIcon className="h-10 w-10 text-slate-300" />
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {selectedConversation.participantName}
                    </h3>
                    <p className="text-sm text-slate-500">{selectedConversation.subject}</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/60">
                  {selectedConversation.messages.map(message => (
                    <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xl ${message.isOwn ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block px-4 py-3 rounded-2xl shadow-sm ${
                          message.isOwn ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-100'
                        }`}>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p className={`text-[11px] mt-2 ${message.isOwn ? 'text-blue-100' : 'text-slate-400'}`}>
                            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendReply} className="p-5 border-t border-slate-100 bg-white">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type your reply"
                      className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={sending}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <ChatBubbleLeftIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Select a conversation</h3>
                  <p className="text-slate-500">
                    Choose a member to start messaging within your tenant.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ComposeMessageModal
        isOpen={composeOpen}
        onClose={() => setComposeOpen(false)}
        onSend={handleComposeSend}
      />
    </div>
  );
}
