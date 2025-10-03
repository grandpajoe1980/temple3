import { useState } from 'react';
import { 
  ChatBubbleLeftIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  UserCircleIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'Rev. John Smith',
      lastMessage: 'Thank you for reaching out. I\'ll be happy to help.',
      timestamp: new Date(Date.now() - 1800000), // 30 mins ago
      unread: 2,
      isGroup: false,
      avatar: null,
      messages: [
        {
          id: 1,
          sender: 'Rev. John Smith',
          content: 'Hello! How can I help you today?',
          timestamp: new Date(Date.now() - 3600000),
          isOwn: false
        },
        {
          id: 2,
          sender: 'You',
          content: 'I had a question about Sunday\'s service.',
          timestamp: new Date(Date.now() - 3000000),
          isOwn: true
        },
        {
          id: 3,
          sender: 'Rev. John Smith',
          content: 'Thank you for reaching out. I\'ll be happy to help.',
          timestamp: new Date(Date.now() - 1800000),
          isOwn: false
        }
      ]
    },
    {
      id: 2,
      name: 'Sunday Service Team',
      lastMessage: 'Sarah: See you all on Sunday!',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      unread: 0,
      isGroup: true,
      avatar: null,
      messages: [
        {
          id: 1,
          sender: 'Michael Brown',
          content: 'Good morning everyone! Just confirming we\'re all set for Sunday.',
          timestamp: new Date(Date.now() - 14400000),
          isOwn: false
        },
        {
          id: 2,
          sender: 'Sarah Williams',
          content: 'Yes! Everything is ready. See you all on Sunday!',
          timestamp: new Date(Date.now() - 7200000),
          isOwn: false
        }
      ]
    },
    {
      id: 3,
      name: 'Mary Johnson',
      lastMessage: 'You: Thanks for your help!',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      unread: 0,
      isGroup: false,
      avatar: null,
      messages: [
        {
          id: 1,
          sender: 'Mary Johnson',
          content: 'Hi! I heard you were coordinating the community outreach.',
          timestamp: new Date(Date.now() - 90000000),
          isOwn: false
        },
        {
          id: 2,
          sender: 'You',
          content: 'Yes! Would love your help if you\'re interested.',
          timestamp: new Date(Date.now() - 88000000),
          isOwn: true
        },
        {
          id: 3,
          sender: 'Mary Johnson',
          content: 'I\'d be happy to help! What do you need?',
          timestamp: new Date(Date.now() - 87000000),
          isOwn: false
        },
        {
          id: 4,
          sender: 'You',
          content: 'Thanks for your help!',
          timestamp: new Date(Date.now() - 86400000),
          isOwn: true
        }
      ]
    }
  ]);

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim() && selectedConversation) {
      const newMessage = {
        id: selectedConversation.messages.length + 1,
        sender: 'You',
        content: messageText,
        timestamp: new Date(),
        isOwn: true
      };

      setConversations(conversations.map(conv => {
        if (conv.id === selectedConversation.id) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: `You: ${messageText}`,
            timestamp: new Date()
          };
        }
        return conv;
      }));

      setSelectedConversation({
        ...selectedConversation,
        messages: [...selectedConversation.messages, newMessage]
      });

      setMessageText('');
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] bg-gray-50">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-full bg-white rounded-lg shadow overflow-hidden flex">
          {/* Conversations List */}
          <div className="w-80 border-r flex flex-col">
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Messages</h2>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map(conversation => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b ${
                    selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex-shrink-0">
                    <UserCircleIcon className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {conversation.name}
                      </h3>
                      <span className="text-xs text-gray-500 ml-2">
                        {formatDistanceToNow(new Date(conversation.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unread > 0 && (
                        <span className="ml-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center gap-3">
                  <UserCircleIcon className="h-10 w-10 text-gray-400" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedConversation.name}
                    </h3>
                    {selectedConversation.isGroup && (
                      <p className="text-sm text-gray-500">Group • 5 members</p>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md ${message.isOwn ? 'order-2' : 'order-1'}`}>
                        {!message.isOwn && (
                          <p className="text-xs text-gray-600 mb-1 px-3">
                            {message.sender}
                          </p>
                        )}
                        <div
                          className={`px-4 py-2 rounded-lg ${
                            message.isOwn
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.isOwn ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <ChatBubbleLeftIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-600">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
