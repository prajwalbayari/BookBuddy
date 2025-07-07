import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminSidebar = ({ onSelect, selected }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <aside className="h-full w-full flex flex-col bg-gray-100 border-r">
      <button
        className={`py-4 px-6 text-left text-lg font-semibold border-b hover:bg-primary-50 transition-colors ${selected === 'statistics' ? 'bg-primary-100 text-primary-700' : ''}`}
        onClick={() => onSelect('statistics')}
      >
        Statistics
      </button>
      <button
        className={`py-4 px-6 text-left text-lg font-semibold border-b hover:bg-primary-50 transition-colors ${selected === 'requests' ? 'bg-primary-100 text-primary-700' : ''}`}
        onClick={() => onSelect('requests')}
      >
        Requests
      </button>
      <div className="flex-1" />
      <button
        className="py-4 px-6 text-left text-lg font-semibold text-red-600 border-t hover:bg-red-50 transition-colors"
        onClick={async () => {
          await logout();
          navigate('/');
        }}
      >
        Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
