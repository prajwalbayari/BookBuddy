import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state
    const initAuth = () => {
      const currentUser = authService.getCurrentUser();
      const isAuth = authService.isAuth();
      
      setUser(currentUser);
      setIsAuthenticated(isAuth);
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const result = await authService.login(credentials);
      setUser(result.user);
      setIsAuthenticated(true);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const result = await authService.signup(userData);
      setUser(result.user);
      setIsAuthenticated(true);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local state
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (userData) => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    updateProfile,
  };
};