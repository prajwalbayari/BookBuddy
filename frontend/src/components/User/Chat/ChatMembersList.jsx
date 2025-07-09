import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const ChatMembersList = ({ members, selectedUser, onMemberSelect, currentUser }) => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/user/home');
  };
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return '';
    }
  };

  const truncateMessage = (message, maxLength = 30) => {
    if (!message) return 'No messages yet';
    return message.length > maxLength ? `${message.substring(0, maxLength)}...` : message;
  };

  return (
    <div className="h-full flex flex-col w-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={handleBackToHome}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
            <p className="text-sm text-gray-500">{members.length} chat{members.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>
      
      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {members.length === 0 ? (
          <div className="p-6 text-center">
            <div className="mb-4">
              <div className="mx-auto h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z" />
                </svg>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No conversations yet</h3>
            <p className="text-xs text-gray-500">Start a new chat to see it here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {members.map((member) => (
              <div
                key={member._id}
                onClick={() => onMemberSelect(member)}
                className={`p-3 cursor-pointer transition-colors duration-200 ${
                  selectedUser?._id === member._id 
                    ? 'bg-blue-50 border-r-2 border-blue-500' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {(member.receiverName || member.name)?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {member.receiverName || member.name}
                      </p>
                      {member.lastMessageTime && (
                        <p className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {formatTime(member.lastMessageTime)}
                        </p>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 truncate">
                      {truncateMessage(member.lastMessageText)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMembersList;
