import { formatDistanceToNow } from 'date-fns';

const ChatMembersList = ({ members, selectedUser, onMemberSelect, currentUser }) => {
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
          <div className="p-6 text-center text-gray-500">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z" />
              </svg>
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
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
                  selectedUser?._id === member._id 
                    ? 'bg-primary-50 border-r-3 border-primary-500 shadow-sm' 
                    : 'hover:shadow-sm'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0 relative">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
                      <span className="text-white font-semibold text-lg">
                        {(member.receiverName || member.name)?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {member.receiverName || member.name}
                      </p>
                      {member.lastMessageTime && (
                        <p className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {formatTime(member.lastMessageTime)}
                        </p>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-500 truncate mb-1">
                      {member.email}
                    </p>
                    
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
