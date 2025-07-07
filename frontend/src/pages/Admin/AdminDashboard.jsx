import React, { useState } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import Requests from '../../components/Admin/Requests';
import Statistics from '../../components/Admin/Statistics';

const AdminDashboard = () => {
  // Set default to 'statistics' so admin sees statistics first
  const [selected, setSelected] = useState('statistics');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - responsive */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-64 lg:w-80 
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        bg-white shadow-xl lg:shadow-none border-r border-gray-200
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">BookBuddy Admin</h1>
          <div className="w-8" />
        </div>
        
        {/* Content area */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {selected === 'requests' && <Requests />}
          {selected === 'statistics' && <Statistics />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
