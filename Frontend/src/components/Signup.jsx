import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Circle } from "lucide-react";
import img from "../assets/logo.jpg";
import { useAuth } from "../authContext/useAuth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      setSignupSuccess(true);
    } catch (error) {
      setSignupSuccess(false);
      setErrorMessage(error.message || "Signup failed");
      setErrors((prev) => ({
        ...prev,
        general: error.message || "Signup failed",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (signupSuccess && countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (signupSuccess && countdown === 0) {
      navigate("/login");
    }
  }, [signupSuccess, countdown, navigate]);

  return (
    <div className="relative min-h-screen bg-gray-900 overflow-hidden">
      <div className="fixed inset-0">
        <img
          src={img}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 overflow-hidden">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-xl">
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-gray-100 to-white bg-clip-text text-transparent mb-6">
              Create Account
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-100 block mb-1">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-white" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-400/50 focus:outline-none transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-100 block mb-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-white" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-400/50 focus:outline-none transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-100 block mb-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-white" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-400/50 focus:outline-none transition-all"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-100 block mb-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-white" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-400/50 focus:outline-none transition-all"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-lg transition duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Circle className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Creating account...
                  </span>
                ) : (
                  "Sign up"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-200">
              Already have an account?{" "}
              <button
                className="text-gray-300 hover:text-white font-semibold underline decoration-gray-400 hover:decoration-white transition-all"
                onClick={() => navigate("/login")}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>

      {signupSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-20">
          <div className="bg-gray-300 p-8 rounded-xl shadow-lg text-center text-black">
            <h2 className="text-2xl font-semibold mb-4">Signup Successful!</h2>
            <p>
              Redirecting to login in {countdown} second
              {countdown !== 1 ? "s" : ""}...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
