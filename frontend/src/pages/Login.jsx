import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login, adminLogin } = useAuth();

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
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      if (formData.role === 'admin') {
        await adminLogin({
          adminEmail: formData.email,
          password: formData.password,
        });
        alert('Login successful as admin!');
      } else {
        await login({
          userEmail: formData.email,
          password: formData.password,
          role: formData.role,
        });
        alert('Login successful as user!');
      }
    } catch (error) {
      setErrors({ submit: error.message || 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-4">
      <div className="w-full max-w-md">
        <Card>
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Login to your BookBuddy account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex space-x-6 justify-center mb-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={formData.role === 'user'}
                  onChange={handleChange}
                  className="mr-2 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-700">User</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === 'admin'}
                  onChange={handleChange}
                  className="mr-2 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-700">Admin</span>
              </label>
            </div>

            <div className="mb-2">
              <label htmlFor="email" className="form-label block mb-1 text-gray-700 font-medium">Email Address</label>
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
            </div>

            <div className="mb-2">
              <label htmlFor="password" className="form-label block mb-1 text-gray-700 font-medium">Password</label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
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
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-600 hover:underline font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;