import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import ThemeToggle from '../ThemeToggle';

const AdminSidebar = ({ onSelect, selected }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { 
      id: 'statistics', 
      label: 'Statistics', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      id: 'requests', 
      label: 'Book Requests', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    }
  ];

  return (
    <aside className="h-full w-full flex flex-col bg-gradient-to-b from-blue-600 to-blue-700 dark:from-gray-800 dark:to-gray-900 text-white">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-blue-500 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold">BookBuddy</h2>
            <p className="text-blue-200 dark:text-gray-400 text-xs mt-1">Admin Dashboard</p>
          </div>
          <ThemeToggle />
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-3 rounded-lg text-left transition-all duration-200 text-xs sm:text-sm ${
              selected === item.id 
                ? 'bg-white dark:bg-gray-700 text-blue-700 dark:text-white shadow-md' 
                : 'text-blue-100 dark:text-gray-300 hover:bg-blue-500 dark:hover:bg-gray-700 hover:text-white'
            }`}
            onClick={() => onSelect(item.id)}
          >
            <div className="flex-shrink-0">
              {item.icon}
            </div>
            <span className="font-medium truncate">{item.label}</span>
          </button>
        ))}
      </nav>
      
      {/* Footer */}
      <div className="p-3 sm:p-4 border-t border-blue-500 dark:border-gray-700 flex-shrink-0">
        <button
          className="w-full flex items-center space-x-3 px-3 sm:px-4 py-3 rounded-lg text-left text-red-200 dark:text-red-300 hover:bg-red-600 dark:hover:bg-red-700 hover:text-white transition-all duration-200 text-xs sm:text-sm"
          onClick={async () => {
            try {
              await logout();
              // Add a small delay to ensure state is cleared before navigation
              setTimeout(() => {
                toast.success('Logged out successfully!', { duration: 2000 });
                navigate('/', { replace: true });
              }, 100);
            } catch (error) {
              console.error('Logout error:', error);
              toast.success('Logged out successfully!', { duration: 2000 });
              navigate('/', { replace: true });
            }
          }}
        >
          <div className="flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <span className="font-medium truncate">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
