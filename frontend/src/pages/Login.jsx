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
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-4">
      {/* <Toaster position="top-center" /> */}
      <div className="w-full max-w-md">
        <Card>
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600 mt-2">
              Login to your BookBuddy account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex space-x-6 justify-center mb-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={formData.role === "user"}
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
                  checked={formData.role === "admin"}
                  onChange={handleChange}
                  className="mr-2 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-700">Admin</span>
              </label>
            </div>

            <div className="mb-2">
              <label
                htmlFor="email"
                className="form-label block mb-1 text-gray-700 font-medium"
              >
                Email Address
              </label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                // error removed
                // required removed
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="mb-2">
              <label
                htmlFor="password"
                className="form-label block mb-1 text-gray-700 font-medium"
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
                // error removed
                // required removed
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/*
            {errors.submit && (
              <div className="text-red-500 text-sm text-center">
                {errors.submit}
              </div>
            )}
            */}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary-600 hover:underline font-medium"
              >
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
