import React, { useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";

axios.defaults.withCredentials = true;

const CreateSheet = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const connectionId = useMemo(() => searchParams.get('connectionId'), [searchParams]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // "create" | "connect"
  const [inputValue, setInputValue] = useState("");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSubmit = async () => {
    setMessage("");
    setIsError(false);
    setLoading(true);

    try {
      if (modalType === "create") {
        await axios.post(`${apiUrl}/api/sheets/create`, { connectionId, sheetName: inputValue });
      } else if (modalType === "connect") {
        await axios.post(`${apiUrl}/api/sheets/connect`, { connectionId, sheetId: inputValue });
      }
      setMessage("✅ Your Google account connected successfully");
    } catch (e) {
      setMessage(e?.response?.data?.message || "❌ Something went wrong");
      setIsError(true);
    } finally {
      setLoading(false);
      setModalOpen(false);
      setInputValue("");
      setModalType(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 flex justify-between items-center text-white">
        <div>
          <h2 className="text-3xl font-bold">Sheets Integration</h2>
          <p className="text-indigo-100">Connect your Google account with a Sheet.</p>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="text-right">
              <p className="text-sm text-indigo-200">Welcome,</p>
              <p className="font-medium">{user.name}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Two main actions */}
      <div className="max-w-3xl mx-auto flex gap-8 justify-center">
        <button
          onClick={() => {
            setModalType("create");
            setModalOpen(true);
          }}
          className="flex-1 py-6 bg-white rounded-xl shadow-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition transform hover:-translate-y-1 text-lg font-medium text-blue-700"
        >
          ➕ Create New Sheet
        </button>

        <button
          onClick={() => {
            setModalType("connect");
            setModalOpen(true);
          }}
          className="flex-1 py-6 bg-white rounded-xl shadow-lg border-2 border-green-200 hover:border-green-400 hover:shadow-xl transition transform hover:-translate-y-1 text-lg font-medium text-green-700"
        >
          🔗 Add Existing Sheet
        </button>
      </div>

      {/* Feedback */}
      {message && (
        <div
          className={`max-w-3xl mx-auto mt-8 p-4 rounded-xl text-center text-base font-medium shadow-md ${
            isError
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}
        >
          {message}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 animate-fadeIn">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {modalType === "create" ? "Enter Sheet Name" : "Enter Existing Sheet ID"}
            </h3>

            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={modalType === "create" ? "Sheet Name" : "Sheet ID"}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-5"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setInputValue("");
                  setModalType(null);
                }}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!inputValue || loading}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? "Processing..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateSheet;