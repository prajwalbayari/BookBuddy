import { authApi } from "../api/authApi";

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
  }

  // Initialize auth state from localStorage
  init() {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("currentUser");

    if (token && user) {
      this.isAuthenticated = true;
      this.currentUser = JSON.parse(user);
    }
  }

  // User signup
  async signup(userData) {
    try {
      const response = await authApi.signup(userData);
      // console.log("Signup response:", response);
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
      // In real implementation, this would be:
      await authApi.logout();

      this.handleAuthLogout();
    } catch (error) {
      console.error("Logout failed:", error);
      this.handleAuthLogout();
    }
  }

  // Get current user profile
  async getProfile() {
    try {
      // In real implementation, this would be:
      // const response = await authApi.getProfile();
      // return response.user;

      return this.currentUser;
    } catch (error) {
      console.error("Get profile failed:", error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(userData) {
    try {
      // In real implementation, this would be:
      // const response = await authApi.updateProfile(userData);
      // this.currentUser = response.user;
      // localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      // return response.user;

      // Mock update
      this.currentUser = { ...this.currentUser, ...userData };
      localStorage.setItem("currentUser", JSON.stringify(this.currentUser));
      return this.currentUser;
    } catch (error) {
      console.error("Update profile failed:", error);
      throw error;
    }
  }

  // Handle successful authentication
  handleAuthSuccess(user, token) {
    this.currentUser = user;
    this.isAuthenticated = true;

    localStorage.setItem("authToken", token);
    localStorage.setItem("currentUser", JSON.stringify(user));

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

  // Get auth token
  getToken() {
    return localStorage.getItem("authToken");
  }
}

export const authService = new AuthService();

// Initialize auth service
authService.init();
