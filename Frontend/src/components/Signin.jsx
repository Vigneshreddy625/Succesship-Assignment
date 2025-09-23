import React from "react";
import { FcGoogle } from "react-icons/fc"; // Google icon

const Signin = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handleGoogle = () => {
    window.location.href = `${apiUrl}/api/auth/google`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow- border border-gray-200">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Sign in to continue to your account
        </p>
        <button
          onClick={handleGoogle}
          className="cursor-pointer w-full flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FcGoogle className="text-2xl" />
          <span className="font-medium">Continue with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Signin;