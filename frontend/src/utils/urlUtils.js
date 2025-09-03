/**
 * Utility functions for URL handling and sanitization
 */

/**
 * Sanitizes a URL to prevent XSS attacks and ensure safe navigation
 * @param {string} url - The URL to sanitize
 * @returns {string|null} - Sanitized URL or null if invalid
 */
export const sanitizeUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const trimmedUrl = url.trim();
  
  // Check for dangerous protocols
  const dangerousProtocols = /^(javascript|data|vbscript|file|about):/i;
  if (dangerousProtocols.test(trimmedUrl)) {
    console.warn('Blocked dangerous URL protocol:', trimmedUrl);
    return null;
  }

  // Ensure URL has a protocol (default to https)
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }
  
  // Add https:// if no protocol specified
  return `https://${trimmedUrl}`;
};

/**
 * Validates if a URL is safe to display and navigate to
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if URL is safe
 */
export const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const sanitized = sanitizeUrl(url);
    if (!sanitized) return false;
    
    // Additional validation using URL constructor
    new URL(sanitized);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Formats URL for display (truncates if too long)
 * @param {string} url - The URL to format
 * @param {number} maxLength - Maximum length for display
 * @returns {string} - Formatted URL for display
 */
export const formatUrlForDisplay = (url, maxLength = 50) => {
  if (!url) return '';
  
  if (url.length <= maxLength) {
    return url;
  }
  
  return url.substring(0, maxLength - 3) + '...';
};
