import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import img from "../assets/logo.jpg";
import { useAuth } from "../authContext/useAuth";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });

      
      navigate("/account/profile"); 
    } catch (error) {
      setErrorMessage(error.message || "Login failed");
      setErrors((prev) => ({
        ...prev,
        general: error.message || "Login failed",
      }));
    } finally {
      setIsLoading(false);
    }
  };

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
              Log In
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
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
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {errorMessage && (
                <p className="text-red-400 text-center">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl text-white font-semibold shadow hover:shadow-gray-700/50 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 transition-transform hover:scale-105 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Log In
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </div>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-200">
              Don't have an account?{" "}
              <button onClick={() => navigate("/signup")}
                className="text-gray-300 hover:text-white font-semibold underline decoration-gray-400 hover:decoration-white transition-all"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}