import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { Toaster, toast } from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login, adminLogin, isAuthenticated, setIsAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Prevent authenticated users from accessing login page
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim() || !formData.password) {
      newErrors.all = "All fields are required";
      return newErrors;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Show only the first validation error as a toast
      const firstError = Object.values(newErrors).find(msg => !!msg);
      if (firstError) toast.error(firstError, { duration: 4000 });
      return;
    }
    setIsLoading(true);
    try {
      if (formData.role === "admin") {
        await adminLogin({
          adminEmail: formData.email,
          password: formData.password,
        });
        toast.success("Logged in successfully!", { duration: 4000 });
        setFormData({ email: "", password: "", role: "user" });
        navigate("/admin/dashboard", { replace: true });
      } else {
        await login({
          userEmail: formData.email,
          password: formData.password,
          role: formData.role,
        });
        toast.success("Logged in successfully!", { duration: 4000 });
        setFormData({ email: "", password: "", role: "user" });
        // Use navigate with replace to ensure correct redirect
        navigate("/user/home", { replace: true });
      }
    } catch (error) {
      const errorMsg = error.message || "Login failed. Please try again.";
      setErrors({ submit: errorMsg });
      toast.error(errorMsg, { duration: 4000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <Toaster position="top-center" />
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-100 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 2h12a2 2 0 0 1 2 2v16l-7-3-7 3V4a2 2 0 0 1 2-2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your BookBuddy account</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Login as
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`relative flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  formData.role === "user" 
                    ? "border-blue-500 bg-blue-50 text-blue-700" 
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={formData.role === "user"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <span className="font-medium">User</span>
                  </div>
                </label>
                <label className={`relative flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  formData.role === "admin" 
                    ? "border-blue-500 bg-blue-50 text-blue-700" 
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === "admin"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                    </svg>
                    <span className="font-medium">Admin</span>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Create one here
              </Link>
            </p>
          </div>
        </Card>

        {/* Additional links */}
        <div className="text-center mt-6">
          <a 
            href="#" 
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
