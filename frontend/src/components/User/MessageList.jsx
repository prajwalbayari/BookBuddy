import { format, isToday, isYesterday } from 'date-fns';

const MessageList = ({ messages, currentUser, selectedUser, receiverName }) => {
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'MMM dd, HH:mm');
    }
  };

  const isMyMessage = (message) => {
    return message.senderId._id === currentUser._id || message.senderId === currentUser._id;
  };

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 px-4">
        <div className="text-center text-gray-500 max-w-sm">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
          <p className="text-sm text-gray-500">Start the conversation with {receiverName || selectedUser.name}. Say hello!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
      {messages.map((message, index) => {
        const isMine = isMyMessage(message);
        const showAvatar = index === 0 || isMyMessage(messages[index - 1]) !== isMine;
        const showTimestamp = index === 0 || 
          new Date(message.createdAt).getTime() - new Date(messages[index - 1].createdAt).getTime() > 300000; // 5 minutes
        
        return (
          <div key={message._id} className="space-y-1">
            {/* Timestamp separator */}
            {showTimestamp && (
              <div className="flex justify-center">
                <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                  {formatMessageTime(message.createdAt)}
                </span>
              </div>
            )}
            
            {/* Message */}
            <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-xs sm:max-w-md lg:max-w-lg ${isMine ? 'flex-row-reverse' : 'flex-row'} space-x-2`}>
                {/* Avatar */}
                {!isMine && (
                  <div className="flex-shrink-0">
                    {showAvatar ? (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center shadow-sm">
                        <span className="text-white font-medium text-xs">
                          {(receiverName || selectedUser.name)?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    ) : (
                      <div className="h-8 w-8"></div>
                    )}
                  </div>
                )}
                
                {/* Message bubble */}
                <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`rounded-2xl px-4 py-2 shadow-sm ${
                      isMine
                        ? 'bg-primary-600 text-white rounded-br-md'
                        : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed break-words">{message.text}</p>
                  </div>
                  
                  {/* Message status and time */}
                  <div className={`mt-1 flex items-center space-x-1 ${isMine ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <span className="text-xs text-gray-500">
                      {format(new Date(message.createdAt), 'HH:mm')}
                    </span>
                  </div>
                </div>
                
                {/* My avatar */}
                {isMine && (
                  <div className="flex-shrink-0">
                    {showAvatar ? (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-sm">
                        <span className="text-white font-medium text-xs">
                          {currentUser.name?.charAt(0)?.toUpperCase() || 'M'}
                        </span>
                      </div>
                    ) : (
                      <div className="h-8 w-8"></div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
