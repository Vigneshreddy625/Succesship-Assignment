import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogle = () => {
    window.location.href = `${apiUrl}/api/auth/google`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login({ email, password });
      if (result.success) {
        navigate("/account", { replace: true });
      } else {
        setError(result.message || "Login failed");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow- border border-gray-200">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Welcome Back</h1>
        <p className="text-center text-gray-500 mb-6">Sign in to continue</p>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 text-red-700 border border-red-200 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 text-white py-2.5 font-medium hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-gray-400 text-sm">or</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        <button
          onClick={handleGoogle}
          className="cursor-pointer w-full flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow-md"
        >
          <span className="text-xl"><FcGoogle /></span>
          <span className="font-medium">Continue with Google</span>
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;


