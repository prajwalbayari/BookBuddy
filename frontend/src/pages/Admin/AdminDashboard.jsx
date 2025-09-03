import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import Requests from '../../components/Admin/Requests';
import Statistics from '../../components/Admin/Statistics';
import { useAuth } from '../../hooks/useAuth';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, loading } = useAuth();
  // Set default to 'statistics' so admin sees statistics first
  const [selected, setSelected] = useState('statistics');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Ensure proper authentication - redirect if not authenticated admin
  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isAdmin, loading, navigate]);

  // Additional check on mount to prevent flash of admin content
  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      navigate('/', { replace: true });
    }
  }, []);

  // Show loading while auth state is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  // Don't render if not authenticated admin
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 admin:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - responsive for all screen sizes */}
      <div className={`
        fixed admin:relative inset-y-0 left-0 z-50 
        w-64 sm:w-72 lg:w-80 admin:w-72 2xl:w-80
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        admin:translate-x-0 transition-transform duration-300 ease-in-out
        bg-white dark:bg-gray-800 shadow-xl admin:shadow-none border-r border-gray-200 dark:border-gray-700
        flex-shrink-0
      `}>
        <AdminSidebar 
          onSelect={(option) => {
            setSelected(option);
            setSidebarOpen(false);
          }} 
          selected={selected} 
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile header */}
        <div className="admin:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">BookBuddy Admin</h1>
          <div className="w-8" />
        </div>
        
        {/* Content area - responsive container */}
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="min-h-full">
            {selected === 'requests' && <Requests />}
            {selected === 'statistics' && <Statistics />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
