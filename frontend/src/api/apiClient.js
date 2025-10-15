import { API_BASE_URL, ALT_API_BASE_URL } from '../config/constants';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.altBaseURL = ALT_API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.useAltURL = false; // Flag to track which URL to use
  }

  async request(endpoint, options = {}) {
    // Use the alternate URL if the previous request failed
    const baseURL = this.useAltURL ? this.altBaseURL : this.baseURL;
    const url = `${baseURL}${endpoint}`;
    
    const config = {
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options,
      credentials: 'include', // Ensure cookies (jwt) are sent with every request
    };

    // Don't set Content-Type for FormData - let browser handle it
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // For non-JSON responses
      if (!response.headers.get('content-type')?.includes('application/json')) {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return { success: true, message: 'Operation completed successfully' };
      }
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      // If the error is a network error and we're using the primary URL, try the alternate URL
      if (
        !this.useAltURL && 
        (error.message === 'Failed to fetch' || 
         error.message.includes('NetworkError') || 
         error.message.includes('ECONNREFUSED') ||
         error.message.includes('Network request failed'))
      ) {
        this.useAltURL = true;
        console.log(`Trying alternate URL: ${this.altBaseURL}`);
        return this.request(endpoint, options);
      }

      // Add more context to the error message
      if (error.message === 'Failed to fetch') {
        error.message = `Network connection error. Please check your internet connection and try again. (URL: ${url})`;
      }

      throw error;
    }
  }

  // HTTP methods
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options = {}) {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body,
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();