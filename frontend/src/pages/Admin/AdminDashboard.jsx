import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-100 to-primary-300 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-primary-700 mb-6">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold shadow hover:bg-primary-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
