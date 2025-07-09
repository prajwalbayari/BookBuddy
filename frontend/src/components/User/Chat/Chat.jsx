import { useState, useEffect } from 'react';
import { chatApi } from '../../../api/chatApi';
import { useAuth } from '../../../hooks/useAuth';
import ChatMembersList from './ChatMembersList';
import ChatWindow from './ChatWindow';

const Chat = ({ initialSelectedUser = null }) => {
  const { user } = useAuth();
  const [chatMembers, setChatMembers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChatMembers();
  }, []);

  // Set initial selected user if provided
  useEffect(() => {
    if (initialSelectedUser && initialSelectedUser.selectedUserId) {
      // If we have initial user data, create a user object to be used
      const initialUser = {
        _id: initialSelectedUser.selectedUserId,
        userName: initialSelectedUser.userName || 'Book Owner',
        name: initialSelectedUser.userName || 'Book Owner',
        receiverName: initialSelectedUser.userName || 'Book Owner',
      };
      setSelectedUser(initialUser);
    }
  }, [initialSelectedUser]);

  const fetchChatMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await chatApi.getChatMembers();
      if (response.data && response.data.success) {
        setChatMembers(response.data.chatMembers);
      } else {
        setError('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error fetching chat members:', err);
      setError(`Failed to load chat members: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMemberSelect = (member) => {
    setSelectedUser(member);
  };

  const updateLastMessage = (newMessage) => {
    setChatMembers(prev => 
      prev.map(member => 
        member._id === newMessage.receiverId || member._id === newMessage.senderId
          ? { ...member, lastMessageText: newMessage.text, lastMessageTime: new Date() }
          : member
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-center">
          <p className="text-lg font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile: Show only sidebar or chat */}
      <div className={`${selectedUser ? 'hidden' : 'flex'} md:flex w-full md:w-80 bg-white border-r border-gray-200 flex-shrink-0 shadow-sm`}>
        <ChatMembersList
          members={chatMembers}
          selectedUser={selectedUser}
          onMemberSelect={handleMemberSelect}
          currentUser={user}
        />
      </div>
      
      {/* Chat Window */}
      <div className={`${selectedUser ? 'flex' : 'hidden'} md:flex flex-1 flex-col`}>
        {selectedUser ? (
          <ChatWindow
            selectedUser={selectedUser}
            currentUser={user}
            onMessageSent={updateLastMessage}
            onBack={() => setSelectedUser(null)}
            receiverName={selectedUser.receiverName || selectedUser.name}
          />
        ) : (
          <div className="hidden md:flex items-center justify-center h-full bg-gray-50">
            <div className="text-center max-w-md px-6 py-8 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="mb-6">
                <div className="mx-auto h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to BookBuddy Chat</h3>
              <p className="text-gray-600">Select a conversation from the sidebar to start messaging.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
