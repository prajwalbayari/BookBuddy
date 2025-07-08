import { useState, useEffect, useRef } from 'react';
import { chatApi } from '../../api/chatApi';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatWindow = ({ selectedUser, currentUser, onMessageSent, onBack, receiverName }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await chatApi.getMessages(selectedUser._id);
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (err) {
      setError('Failed to load messages');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    try {
      setSending(true);
      const messageData = {
        receiverId: selectedUser._id,
        text: messageText.trim()
      };

      const response = await chatApi.sendMessage(messageData);
      if (response.data.success) {
        const newMessage = response.data.data;
        setMessages(prev => [...prev, newMessage]);
        onMessageSent(newMessage);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-600 text-center">
          <p className="text-lg font-semibold">Error</p>
          <p>{error}</p>
          <button
            onClick={fetchMessages}
            className="mt-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex items-center space-x-3">
          {/* Back Button for Mobile */}
          <button
            onClick={onBack}
            className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* User Avatar */}
          <div className="flex-shrink-0 relative">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-sm">
                {(receiverName || selectedUser.name)?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          
          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{receiverName || selectedUser.name}</h3>
            <p className="text-sm text-gray-500 truncate">{selectedUser.email}</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden bg-gray-50">
        <MessageList
          messages={messages}
          currentUser={currentUser}
          selectedUser={selectedUser}
          receiverName={receiverName || selectedUser.name}
        />
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={sending}
          recipientName={receiverName || selectedUser.name}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
