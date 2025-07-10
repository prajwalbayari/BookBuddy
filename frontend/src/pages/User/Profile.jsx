import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { userApi } from '../../api/userApi';
import { booksApi } from '../../api/booksApi';
import ProfileHeader from '../../components/User/Profile/ProfileHeader';
import ProfileDetails from '../../components/User/Profile/ProfileDetails';
import UserBooks from '../../components/User/Profile/UserBooks';

const Profile = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [userBooks, setUserBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    fetchUserData();
    
    // Check for success message from navigation state
    if (location.state?.message) {
      toast.success(location.state.message);
      if (location.state.activeTab) {
        setActiveTab(location.state.activeTab);
      }
      // Clear the navigation state
      window.history.replaceState({}, document.title);
    } else if (location.state?.activeTab) {
      // Just set active tab if only that is provided
      setActiveTab(location.state.activeTab);
      // Clear the navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [profileResponse, booksResponse] = await Promise.all([
        userApi.getProfile(),
        booksApi.getMyBooks()
      ]);

      setProfile(profileResponse.data);
      setUserBooks(booksResponse.data || []);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load profile data');
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      const response = await userApi.updateProfile(updatedData);
      setProfile(response.data);
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      throw new Error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchUserData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Profile Header */}
        <ProfileHeader 
          user={profile || user} 
          onUpdate={handleProfileUpdate}
        />

        {/* Navigation Tabs */}
        <div className="mt-6 sm:mt-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'details'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile Details
              </button>
              <button
                onClick={() => setActiveTab('books')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'books'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Books ({userBooks.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'details' && (
            <ProfileDetails 
              user={profile || user} 
              onUpdate={handleProfileUpdate}
              bookCount={userBooks.length}
            />
          )}
          {activeTab === 'books' && (
            <UserBooks 
              books={userBooks} 
              onRefresh={fetchUserData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
