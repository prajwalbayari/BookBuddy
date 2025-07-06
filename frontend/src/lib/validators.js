// Form validation utilities

/**
 * Validate signup form data
 * @param {object} formData - Form data object
 * @returns {object} Validation errors
 */
export const validateSignupForm = (formData) => {
  const errors = {};
  
  // Name validation
  if (!formData.name || !formData.name.trim()) {
    errors.name = 'Name is required';
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }
  
  // Email validation
  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Password validation
  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }
  
  // Confirm password validation
  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return errors;
};

/**
 * Validate login form data
 * @param {object} formData - Form data object
 * @returns {object} Validation errors
 */
export const validateLoginForm = (formData) => {
  const errors = {};
  
  // Email validation
  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Password validation
  if (!formData.password) {
    errors.password = 'Password is required';
  }
  
  return errors;
};

/**
 * Validate book review form data
 * @param {object} formData - Form data object
 * @returns {object} Validation errors
 */
export const validateReviewForm = (formData) => {
  const errors = {};
  
  // Rating validation
  if (!formData.rating) {
    errors.rating = 'Rating is required';
  } else if (formData.rating < 1 || formData.rating > 5) {
    errors.rating = 'Rating must be between 1 and 5';
  }
  
  // Review text validation
  if (!formData.review || !formData.review.trim()) {
    errors.review = 'Review text is required';
  } else if (formData.review.trim().length < 10) {
    errors.review = 'Review must be at least 10 characters long';
  } else if (formData.review.trim().length > 1000) {
    errors.review = 'Review must be less than 1000 characters';
  }
  
  return errors;
};

/**
 * Validate profile update form data
 * @param {object} formData - Form data object
 * @returns {object} Validation errors
 */
export const validateProfileForm = (formData) => {
  const errors = {};
  
  // Name validation
  if (!formData.name || !formData.name.trim()) {
    errors.name = 'Name is required';
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }
  
  // Email validation
  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Bio validation (optional)
  if (formData.bio && formData.bio.length > 500) {
    errors.bio = 'Bio must be less than 500 characters';
  }
  
  return errors;
};

/**
 * Validate password change form data
 * @param {object} formData - Form data object
 * @returns {object} Validation errors
 */
export const validatePasswordChangeForm = (formData) => {
  const errors = {};
  
  // Current password validation
  if (!formData.currentPassword) {
    errors.currentPassword = 'Current password is required';
  }
  
  // New password validation
  if (!formData.newPassword) {
    errors.newPassword = 'New password is required';
  } else if (formData.newPassword.length < 6) {
    errors.newPassword = 'New password must be at least 6 characters long';
  }
  
  // Confirm new password validation
  if (!formData.confirmNewPassword) {
    errors.confirmNewPassword = 'Please confirm your new password';
  } else if (formData.newPassword !== formData.confirmNewPassword) {
    errors.confirmNewPassword = 'New passwords do not match';
  }
  
  // Check if new password is different from current
  if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword) {
    errors.newPassword = 'New password must be different from current password';
  }
  
  return errors;
};

/**
 * Generic required field validator
 * @param {any} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} Error message or null
 */
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return null;
};

/**
 * Generic email validator
 * @param {string} email - Email to validate
 * @returns {string|null} Error message or null
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return 'Email is required';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

/**
 * Generic length validator
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} Error message or null
 */
export const validateLength = (value, minLength, maxLength, fieldName) => {
  if (!value) return null;
  
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`;
  }
  
  if (maxLength && value.length > maxLength) {
    return `${fieldName} must be less than ${maxLength} characters long`;
  }
  
  return null;
};