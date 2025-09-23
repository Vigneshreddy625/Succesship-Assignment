import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [message, setMessage] = useState("Signing you in...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await checkAuth();
        // connectionId may be present after OAuth redirect
        const params = new URLSearchParams(window.location.search);
        const connectionId = params.get('connectionId');
        if (connectionId) {
          navigate(`/sheets/create?connectionId=${connectionId}`, { replace: true });
          return;
        }
        navigate("/sheets/create", { replace: true });
      } catch (_) {
        navigate("/sheets/create", { replace: true });
      }
    };

    const timer = setTimeout(handleCallback, 500);
    return () => clearTimeout(timer);
  }, [navigate, checkAuth]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default OAuthCallback;


