import { Chat } from '../../components/User';
import { useLocation } from 'react-router-dom';

const ChatPage = () => {
  const location = useLocation();
  const initialChatData = location.state || null;

  return (
    <div className="h-screen overflow-hidden">
      <Chat initialSelectedUser={initialChatData} />
    </div>
  );
};

export default ChatPage;
