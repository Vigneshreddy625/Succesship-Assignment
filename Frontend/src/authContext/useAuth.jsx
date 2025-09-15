import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/users/current-user`, {
          withCredentials: true,
        });
        if (response.data.data) {
          setUser(response.data.data);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const { fullName, email, password } = userData;

      if (!fullName || !email || !password) {
        throw new Error("All fields are required");
      }

      const response = await axios.post(`/users/register`, userData, {
        withCredentials: true,
      });

      return response.data;
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Registration failed"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials, navigate) => {
    try {
      setLoading(true);
      setError(null);

      const { email, password } = credentials;

      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const response = await axios.post(`/users/login`, credentials, {
        withCredentials: true,
      });

      const { user: userData } = response.data.data;
      setUser(userData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUserDetails = async (details) => {
    try {
      console.log("🔄 Starting updateUserDetails with:", details);
      setLoading(true);
      setError(null);

      const response = await axios.patch(`/users/update-details`, details, {
        withCredentials: true,
      });

      console.log("✅ Full update response:", response);
      console.log("✅ Response data:", response.data);

      const updatedUser = response.data.user;
      console.log("📦 Found user in response.data.user:", updatedUser);

      if (updatedUser && updatedUser.email) {
        setUser(updatedUser);
        console.log("✅ Updated user state:", updatedUser);
      } else {
        console.error("❌ Invalid user data received:", updatedUser);
        throw new Error("Invalid user data received from server");
      }

      return updatedUser;
    } catch (err) {
      console.error("❌ Update user details error:", err);
      console.error("❌ Error response:", err.response?.data);

      if (err.response?.status === 401) {
        console.log("🚫 Auth error during update, clearing user");
        setUser(null);
      }

      setError(
        err.response?.data?.message || err.message || "Failed to update details"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);

      await axios.post(
        `/users/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      console.log("🔄 Refreshing token...");
      const response = await axios.post(
        `/users/refresh-token`,
        {},
        { withCredentials: true }
      );

      const accessToken = response.data.accessToken;
      console.log("✅ Token refreshed successfully");

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      return accessToken;
    } catch (err) {
      console.error("❌ Token refresh failed:", err);
      setUser(null);
      throw err;
    }
  };

  const deleteUser = async (id) => {
    try {
      setLoading(true);
      setError(null);

      await axios.delete(
        `/users/delete-user/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      setUser(null);
      return true;
    } catch (error) {
      console.error("Delete request failed:", error);
      setError(
        error.response?.data?.message || error.message || "Delete failed"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        console.log("📤 Request:", config.method?.toUpperCase(), config.url);
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        console.log("📥 Response:", response.status, response.config.url);
        return response;
      },
      async (error) => {
        console.log(
          "❌ Response error:",
          error.response?.status,
          error.config?.url
        );

        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url?.includes("refresh-token")
        ) {
          originalRequest._retry = true;
          console.log("🔄 Attempting token refresh for failed request");

          try {
            await refreshToken();
            console.log("✅ Retrying original request after token refresh");
            return axios(originalRequest);
          } catch (err) {
            console.error("❌ Token refresh failed, clearing user");
            setUser(null);
            return Promise.reject(err);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateUserDetails,
    refreshToken,
    deleteUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const withAuth = (Component) => {
  const AuthenticatedComponent = (props) => {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
      return <LoadingScreen />;
    }

    if (!isAuthenticated) {
      return <div>Please login to access this page</div>;
    }

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
};