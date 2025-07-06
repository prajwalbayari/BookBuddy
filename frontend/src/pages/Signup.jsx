import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { authService } from '../services/authService';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    try {
      await authService.signup({
        userName: formData.name,
        userEmail: formData.email,
        password: formData.password,
      });
      alert('Signup successful! You can now login.');
    } catch (error) {
      setErrors({ submit: error.message || 'Signup failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-4">
      <div className="w-full max-w-md">
        <Card>
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-600 mt-2">Join Book Buddy and start your reading journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="mb-2">
              <label htmlFor="name" className="form-label block mb-1 text-gray-700 font-medium">Full Name</label>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.name && <div className="text-red-500 text-xs mt-1 text-center">{errors.name}</div>}
            </div>

            <div className="mb-2">
              <label htmlFor="email" className="form-label block mb-1 text-gray-700 font-medium">Email</label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.email && <div className="text-red-500 text-xs mt-1 text-center">{errors.email}</div>}
            </div>

            <div className="mb-2">
              <label htmlFor="password" className="form-label block mb-1 text-gray-700 font-medium">Password</label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.password && <div className="text-red-500 text-xs mt-1 text-center">{errors.password}</div>}
            </div>

            <div className="mb-2">
              <label htmlFor="confirmPassword" className="form-label block mb-1 text-gray-700 font-medium">Confirm Password</label>
              <Input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.confirmPassword && <div className="text-red-500 text-xs mt-1 text-center">{errors.confirmPassword}</div>}
            </div>

            {errors.submit && (
              <div className="text-red-500 text-sm text-center">
                {errors.submit}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Creating Account...' : 'Register'}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:underline font-medium">
                Login here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;