import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user has explicitly logged out
        const hasLoggedOut = localStorage.getItem('hasLoggedOut') === 'true';
        if (hasLoggedOut) {
          setUser(null);
          setIsAuthenticated(false);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        await authService.init();
        const currentUser = authService.getCurrentUser();
        const isAuth = authService.isAuth();
        
        setUser(currentUser);
        setIsAuthenticated(isAuth);
        setIsAdmin(currentUser?.role === 'admin');
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    // Listen for auth changes in localStorage (for multi-tab and instant UI update)
    const handleStorage = async () => {
      // Check for explicit logout flag
      const hasLoggedOut = localStorage.getItem('hasLoggedOut') === 'true';
      if (hasLoggedOut || authService.hasLoggedOut) {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        return;
      }
      await initializeAuth();
    };

    window.addEventListener('storage', handleStorage);
    
    // Initialize on mount
    initializeAuth();
    
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = async (credentials) => {
    try {
      const result = await authService.login(credentials);
      // Clear logout flag since user is logging in
      localStorage.removeItem('hasLoggedOut');
      setUser(result.user);
      setIsAuthenticated(true);
      setIsAdmin(result.user?.role === 'admin');
      // Broadcast login event for instant UI update
      window.dispatchEvent(new Event('storage'));
      return result;
    } catch (error) {
      throw error;
    }
  };

  const adminLogin = async (credentials) => {
    try {
      const result = await authService.adminLogin(credentials);
      // Clear logout flag since admin is logging in
      localStorage.removeItem('hasLoggedOut');
      setUser(result.user);
      setIsAuthenticated(true);
      setIsAdmin(result.user?.role === 'admin');
      window.dispatchEvent(new Event('storage'));
      return result;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const result = await authService.signup(userData);
      if (result?.user) {
        // Clear logout flag since user is signing up
        localStorage.removeItem('hasLoggedOut');
        setUser(result.user);
        setIsAuthenticated(true);
        setIsAdmin(result.user?.role === 'admin');
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      // First, immediately clear React state
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setLoading(false);
      
      // Mark that user has explicitly logged out
      localStorage.setItem('hasLoggedOut', 'true');
      
      // Clear all authentication-related storage completely
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("currentUser");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      
      // Clear the auth service state
      await authService.logout();
      
      // Force re-initialization to clear any cached state
      authService.isInitialized = false;
      authService.hasLoggedOut = true;
      
      // Clear all cookies aggressively
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
        if (name) {
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname + ";";
        }
      });
      
      // Broadcast logout event for instant UI update
      window.dispatchEvent(new Event('storage'));
      
    } catch (error) {
      console.error('Logout failed:', error);
      // Even on error, ensure local state is cleared
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setLoading(false);
      
      localStorage.setItem('hasLoggedOut', 'true');
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("currentUser");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      
      authService.handleAuthLogout();
      authService.hasLoggedOut = true;
      
      window.dispatchEvent(new Event('storage'));
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
  };
};