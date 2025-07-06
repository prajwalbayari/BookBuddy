import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state
    const initAuth = () => {
      const currentUser = authService.getCurrentUser();
      const isAuth = authService.isAuth();
      
      setUser(currentUser);
      setIsAuthenticated(isAuth);
      setIsAdmin(currentUser?.role === 'admin');
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const result = await authService.login(credentials);
      setUser(result.user);
      setIsAuthenticated(true);
      setIsAdmin(result.user?.role === 'admin');
      return result;
    } catch (error) {
      throw error;
    }
  };

  const adminLogin = async (credentials) => {
    try {
      const result = await authService.adminLogin(credentials);
      setUser(result.user);
      setIsAuthenticated(true);
      setIsAdmin(true);
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
      setIsAdmin(result.user?.role === 'admin');
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
      setIsAdmin(false);
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local state
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  };

  const updateProfile = async (userData) => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
      setIsAdmin(updatedUser?.role === 'admin');
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    login,
    adminLogin,
    signup,
    logout,
    updateProfile,
  };
};