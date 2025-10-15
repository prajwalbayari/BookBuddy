import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { authService } from "../../services/authService";
import { Toaster, toast } from "react-hot-toast";

const Signup = () => {
  // Form steps: 1 = Name/Email, 2 = OTP verification, 3 = Password creation
  const [formStep, setFormStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  
  // State for OTP timer
  const [otpTimer, setOtpTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Timer effect for OTP expiration
  useEffect(() => {
    if (isTimerRunning && otpTimer > 0) {
      timerRef.current = setTimeout(() => {
        setOtpTimer(prevTime => prevTime - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setIsTimerRunning(false);
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isTimerRunning, otpTimer]);

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

  // Reset OTP timer and start it
  const startOtpTimer = () => {
    setOtpTimer(60);
    setIsTimerRunning(true);
  };
  
  // Validate first form step (name and email)
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim() || !formData.email.trim()) {
      newErrors.all = "Name and email are required";
      return newErrors;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    return newErrors;
  };
  
  // Validate OTP
  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.otp.trim()) {
      newErrors.otp = "OTP is required";
      return newErrors;
    }
    if (formData.otp.length !== 6 || !/^\d+$/.test(formData.otp)) {
      newErrors.otp = "Please enter a valid 6-digit OTP";
    }
    return newErrors;
  };
  
  // Validate password creation
  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.password || !formData.confirmPassword) {
      newErrors.all = "All fields are required";
      return newErrors;
    }
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  // Handle sending OTP (step 1)
  const handleSendOtp = async (e) => {
    e.preventDefault();
    const newErrors = validateStep1();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.values(newErrors).find((msg) => !!msg);
      if (firstError) toast.error(firstError, { duration: 4000 });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await authService.sendOTP({
        userName: formData.name,
        userEmail: formData.email,
      });
      
      toast.success("OTP sent to your email", { duration: 4000 });
      
      // If we're in development and have a preview URL, show a clickable toast
      if (response.previewUrl) {
        toast(
          (t) => (
            <div onClick={() => {
              window.open(response.previewUrl, '_blank');
              toast.dismiss(t.id);
            }}>
              <b>📧 Click to view test email</b>
              <div className="text-xs mt-1">
                (This is only for development)
              </div>
            </div>
          ),
          { duration: 20000 }
        );
      }
      
      setFormStep(2);
      startOtpTimer();
    } catch (error) {
      const errorMsg = error.message || "Failed to send OTP. Please try again.";
      toast.error(errorMsg, { duration: 4000 });
      setErrors({ submit: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle OTP verification (step 2)
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const newErrors = validateStep2();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.values(newErrors).find((msg) => !!msg);
      if (firstError) toast.error(firstError, { duration: 4000 });
      return;
    }
    
    setIsLoading(true);
    try {
      await authService.verifyOTP({
        userEmail: formData.email,
        otp: formData.otp,
      });
      toast.success("Email verified successfully", { duration: 4000 });
      setFormStep(3);
    } catch (error) {
      const errorMsg = error.message || "OTP verification failed. Please try again.";
      toast.error(errorMsg, { duration: 4000 });
      setErrors({ otp: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle resend OTP
  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await authService.resendOTP({
        userEmail: formData.email,
      });
      
      toast.success("New OTP sent to your email", { duration: 4000 });
      
      // If we're in development and have a preview URL, show a clickable toast
      if (response.previewUrl) {
        toast(
          (t) => (
            <div onClick={() => {
              window.open(response.previewUrl, '_blank');
              toast.dismiss(t.id);
            }}>
              <b>📧 Click to view test email</b>
              <div className="text-xs mt-1">
                (This is only for development)
              </div>
            </div>
          ),
          { duration: 20000 }
        );
      }
      
      startOtpTimer();
    } catch (error) {
      const errorMsg = error.message || "Failed to resend OTP. Please try again.";
      toast.error(errorMsg, { duration: 4000 });
    } finally {
      setIsLoading(false);
    }
  };

  // Final form submission for account creation (step 3)
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    const newErrors = validateStep3();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.values(newErrors).find((msg) => !!msg);
      if (firstError) toast.error(firstError, { duration: 4000 });
      return;
    }
    
    setIsLoading(true);
    try {
      await authService.signup({
        userName: formData.name,
        userEmail: formData.email,
        password: formData.password,
      });
      toast.success("Account created successfully! You can now login.", {
        duration: 4000,
      });
      setFormData({ name: "", email: "", password: "", confirmPassword: "", otp: "" });
      navigate("/login");
    } catch (error) {
      const errorMsg = error.message || "Signup failed. Please try again.";
      toast.error(errorMsg, { duration: 4000 });
      setErrors({ submit: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Toaster position="top-center" />
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 dark:bg-blue-900 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-100 dark:bg-indigo-900 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 2h12a2 2 0 0 1 2 2v16l-7-3-7 3V4a2 2 0 0 1 2-2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Join BookBuddy</h1>
          <p className="text-gray-600 dark:text-gray-300">Create your account and start your reading journey</p>
        </div>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl border-0">
          {/* Step indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className={`h-2 rounded-full ${formStep >= 1 ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mx-2 border-2 border-gray-200 dark:border-gray-700">
                <span className={`text-sm font-medium ${formStep === 1 ? 'text-blue-500' : (formStep > 1 ? 'text-green-500' : 'text-gray-500 dark:text-gray-400')}`}>
                  {formStep > 1 ? '✓' : '1'}
                </span>
              </div>
              <div className="flex-1">
                <div className={`h-2 rounded-full ${formStep >= 2 ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mx-2 border-2 border-gray-200 dark:border-gray-700">
                <span className={`text-sm font-medium ${formStep === 2 ? 'text-blue-500' : (formStep > 2 ? 'text-green-500' : 'text-gray-500 dark:text-gray-400')}`}>
                  {formStep > 2 ? '✓' : '2'}
                </span>
              </div>
              <div className="flex-1">
                <div className={`h-2 rounded-full ${formStep >= 3 ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mx-2 border-2 border-gray-200 dark:border-gray-700">
                <span className={`text-sm font-medium ${formStep === 3 ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>
                  3
                </span>
              </div>
            </div>

          </div>

          {/* Step 1: Name and Email */}
          {formStep === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Full Name
                </label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP...
                  </div>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {formStep === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Email Verification</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  We've sent a 6-digit code to {formData.email}
                </p>
              </div>

              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Enter 6-digit OTP
                </label>
                <Input
                  type="text"
                  name="otp"
                  id="otp"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  value={formData.otp}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-center tracking-widest text-lg"
                />
              </div>

              {/* OTP Timer */}
              <div className="flex justify-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {otpTimer > 0 ? (
                    <span>OTP expires in: <span className="font-medium text-orange-500">{otpTimer}s</span></span>
                  ) : (
                    <span>OTP expired</span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  type="submit" 
                  disabled={isLoading || formData.otp.length !== 6}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </div>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>

                <Button 
                  type="button" 
                  variant="outline"
                  disabled={isLoading || otpTimer > 0}
                  onClick={handleResendOtp}
                  className="w-full border-2 border-gray-300 text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:border-blue-500 font-medium py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Resend OTP
                </Button>

                <Button
                  type="button"
                  variant="text"
                  onClick={() => setFormStep(1)}
                  className="w-full text-gray-500 hover:text-blue-600 font-medium py-2 transition-all duration-200"
                >
                  Change Email
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Password Creation */}
          {formStep === 3 && (
            <form onSubmit={handleCreateAccount} className="space-y-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Create Password</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Your email has been verified. Now create a secure password.
                </p>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Password
                </label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Confirm Password
                </label>
                <Input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          )}

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
