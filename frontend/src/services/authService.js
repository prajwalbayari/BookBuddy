import { authApi } from "../api/authApi";

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.isInitialized = false;
    this.hasLoggedOut = false; // Track if user has explicitly logged out
  }

  // Initialize auth state by checking both localStorage and cookie authentication
  async init() {
    if (this.isInitialized) return;
    
    // Check if user has explicitly logged out
    const hasLoggedOut = localStorage.getItem('hasLoggedOut') === 'true';
    if (hasLoggedOut || this.hasLoggedOut) {
      this.currentUser = null;
      this.isAuthenticated = false;
      this.isInitialized = true;
      return;
    }
    
    try {
      // First check if we have a valid cookie-based session
      const cookieAuth = await this.checkCookieAuth();
      if (cookieAuth.success) {
        this.handleAuthSuccess(cookieAuth.user, cookieAuth.token, false); // Don't store in localStorage if from cookie
        this.isInitialized = true;
        return;
      }
    } catch (error) {
      console.log("Cookie auth check failed:", error);
      // Clear potentially stale localStorage data if cookie auth fails
      this.handleAuthLogout();
      this.isInitialized = true;
      return;
    }

    // If cookie auth failed, clear everything to ensure clean state
    this.handleAuthLogout();
    this.isInitialized = true;
  }

  // Check authentication status using cookies
  async checkCookieAuth() {
    try {
      const response = await authApi.checkAuth();
      return {
        success: true,
        user: response.user,
        token: response.token
      };
    } catch (error) {
      return { success: false };
    }
  }

  // User signup
  async signup(userData) {
    try {
      const response = await authApi.signup(userData);
      return response;
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  }

  // User login
  async login(credentials) {
    try {
      const response = await authApi.login(credentials);
      return this.handleAuthSuccess(response.user, response.token);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  // Admin login
  async adminLogin(credentials) {
    try {
      const response = await authApi.adminLogin(credentials);
      return this.handleAuthSuccess(response.admin, response.token);
    } catch (error) {
      console.error("Admin login failed:", error);
      throw error;
    }
  }

  // User logout
  async logout() {
    try {
      await authApi.logout();
      this.hasLoggedOut = true; // Mark that user has explicitly logged out
      this.handleAuthLogout();
    } catch (error) {
      console.error("Logout failed:", error);
      this.hasLoggedOut = true; // Mark logout even on error
      this.handleAuthLogout();
    }
  }

  // Handle successful authentication
  handleAuthSuccess(user, token, storeInLocalStorage = true) {
    this.currentUser = user;
    this.isAuthenticated = true;
    this.hasLoggedOut = false; // Reset logout flag on successful auth
    
    // Clear the logout flag from localStorage
    localStorage.removeItem('hasLoggedOut');

    // Only store in localStorage if explicitly requested (for login actions)
    if (storeInLocalStorage) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("currentUser", JSON.stringify(user));
    }

    return { user, token };
  }

  // Handle logout
  handleAuthLogout() {
    this.currentUser = null;
    this.isAuthenticated = false;

    // Clear authentication-related storage aggressively
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    
    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=");
      const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
      if (name) {
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname + ";";
      }
    });
  }

  // Check if user is authenticated
  isAuth() {
    return this.isAuthenticated;
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }
}

export const authService = new AuthService();

// Initialize auth service
authService.init();
