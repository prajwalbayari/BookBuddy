import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatApi } from '../../../api/chatApi';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatWindow = ({ selectedUser, currentUser, onMessageSent, onBack, receiverName }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const handleBackToHome = () => {
    navigate('/user/home');
  };

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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
    <div className="flex flex-col h-full bg-white">
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
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {(receiverName || selectedUser.name)?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          
          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{receiverName || selectedUser.name}</h3>
          </div>
          
          {/* Back to Home Button */}
          <button
            onClick={handleBackToHome}
            className="hidden md:flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Home</span>
          </button>
          
          {/* Close Button */}
          <button
            onClick={onBack}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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
