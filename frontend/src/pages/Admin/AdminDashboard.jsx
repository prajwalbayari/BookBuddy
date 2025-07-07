import React, { useState } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import Requests from '../../components/Admin/Requests';
import Statistics from '../../components/Admin/Statistics';

const AdminDashboard = () => {
  // Set default to 'statistics' so admin sees statistics first
  const [selected, setSelected] = useState('statistics');

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar 20% - static */}
      <div className="w-1/5 min-w-[200px] max-w-xs h-screen bg-gray-100 border-r flex-shrink-0">
        <AdminSidebar onSelect={setSelected} selected={selected} />
      </div>
      {/* Main Content 80% - scrollable */}
      <div className="w-4/5 h-screen overflow-y-auto bg-white">
        {selected === 'requests' && <Requests />}
        {selected === 'statistics' && <Statistics />}
      </div>
    </div>
  );
};

export default AdminDashboard;
