import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const ExistingSheet = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const connectionId = useMemo(() => searchParams.get('connectionId'), [searchParams]);
  const [sheetInfo, setSheetInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSheetInfo = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const response = await axios.get(`${apiUrl}/api/sheets/check`, {
          withCredentials: true
        , params: { connectionId }
        });
        
        if (response.data.success && response.data.hasSheet) {
          setSheetInfo(response.data.sheet);
        }
      } catch (error) {
        console.error("Error fetching sheet info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSheetInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!sheetInfo) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">No Sheet Connected</h2>
          <p className="text-gray-600">You don't have any sheets connected to your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Account Already Connected</h2>
          <p className="text-gray-600 mb-4">
            Your account is already connected with a Google Sheet.
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h3 className="font-medium text-gray-800 mb-2">Connected Sheet Details:</h3>
          <div className="text-left space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-600">Sheet Name:</span>
              <p className="text-sm text-gray-800">{sheetInfo.name || 'Unnamed Sheet'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Sheet ID:</span>
              <p className="text-sm text-gray-800 font-mono break-all">{sheetInfo.sheetId}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Connected On:</span>
              <p className="text-sm text-gray-800">
                {new Date(sheetInfo.addedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          <p>You can access your connected sheet through Google Sheets.</p>
        </div>
      </div>
    </div>
  );
};

export default ExistingSheet;
