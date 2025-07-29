import { authApi } from "../api/authApi";

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.isInitialized = false;
  }

  // Initialize auth state by checking both localStorage and cookie authentication
  async init() {
    if (this.isInitialized) return;
    
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
    }

    // Fallback to localStorage if cookie auth fails
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("currentUser");

    if (token && user) {
      this.isAuthenticated = true;
      this.currentUser = JSON.parse(user);
    }
    
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
      this.handleAuthLogout();
    } catch (error) {
      console.error("Logout failed:", error);
      this.handleAuthLogout();
    }
  }

  // Handle successful authentication
  handleAuthSuccess(user, token, storeInLocalStorage = true) {
    this.currentUser = user;
    this.isAuthenticated = true;

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

    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
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
