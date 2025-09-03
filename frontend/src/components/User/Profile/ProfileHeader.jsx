import { useState } from 'react';
import toast from 'react-hot-toast';

const ProfileHeader = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    userName: user?.userName || '',
    userEmail: user?.userEmail || '',
    location: user?.location || '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      userName: user?.userName || '',
      userEmail: user?.userEmail || '',
      location: user?.location || '',
    });
    setIsEditing(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-white dark:border-gray-200 shadow-lg bg-white dark:bg-gray-100 flex items-center justify-center">
              <span className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-700">
                {getInitials(user?.userName)}
              </span>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 break-words">
              {user?.userName || 'User'}
            </h1>
            <p className="text-blue-100 dark:text-blue-200 mb-1 text-sm sm:text-base break-all">{user?.userEmail}</p>
            {user?.location && (
              <p className="text-blue-100 dark:text-blue-200 flex items-center justify-center sm:justify-start text-sm sm:text-base">
                <svg className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="break-words">{user.location}</span>
              </p>
            )}
          </div>

          {/* Edit Button */}
          <div className="flex-shrink-0 w-full sm:w-auto">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto bg-white dark:bg-gray-100 text-blue-600 dark:text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-200 transition-colors shadow-sm text-sm sm:text-base"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors disabled:opacity-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-white text-blue-600 px-3 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 text-sm"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-t border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="userEmail"
                  name="userEmail"
                  value={formData.userEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter your location"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
