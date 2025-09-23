import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const SelectAccount = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/api/auth/google/accounts/${formId}`, { withCredentials: true });
        const list = data.connections || [];
        setAccounts(list);
        if (Array.isArray(list) && list.length === 0) {
          // Auto-start OAuth when no accounts connected
          window.location.href = `${apiUrl}/api/auth/google?formId=${formId}`;
        }
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to fetch accounts");
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, [apiUrl, formId]);

  const handleSelect = (connectionId) => {
    const acc = accounts.find(a => a._id === connectionId);
    if (acc?.sheetId) {
      navigate(`/sheets/existing?connectionId=${connectionId}`);
    } else {
      navigate(`/sheets/create?connectionId=${connectionId}`);
    }
  };

  const handleConnectNew = () => {
    window.location.href = `${apiUrl}/api/auth/google?formId=${formId}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Select a Google account</h2>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 text-red-700 border border-red-200 px-3 py-2 text-sm">{error}</div>
      )}

      {accounts.length > 0 ? (
        <div className="space-y-3">
          {accounts.map((acc) => (
            <button
              key={acc._id}
              onClick={() => handleSelect(acc._id)}
              className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
            >
              <img src={acc.profilePicture} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
              <div className="text-left">
                <div className="font-medium">{acc.accountName || acc.googleEmail}</div>
                <div className="text-sm text-gray-500">{acc.googleEmail}</div>
              </div>
              {acc.sheetId && (
                <span className="ml-auto text-xs px-2 py-1 rounded bg-green-100 text-green-700">Connected</span>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-gray-600">No connected accounts found for this form.</div>
      )}

      <div className="mt-6">
        <button
          onClick={handleConnectNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Connect new Google account
        </button>
      </div>
    </div>
  );
};

export default SelectAccount;


