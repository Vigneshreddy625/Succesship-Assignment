import React, {useState} from 'react';
import DeleteAccountModal from "./DeleteModal"
import { useAuth } from '../../authContext/useAuth';

const DeleteAccount = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const {deleteUser, user, error: authError, loading: authLoading, isAuthenticated} = useAuth();

  const handleOpenDeleteModal = () => {
    if (agreeTerms && user) {
      setOpenDelete(true);
    }
  };

const onConfirmDelete = async () => {
  try {
    if (!user || !user._id) {
      console.error("User ID is missing");
      return;
    }
    
    console.log("Deleting user with ID:", user._id); 
    await deleteUser(user._id);

  } catch (error) {
    console.error("Error during account deletion:", error);
  } finally {
    setOpenDelete(false);
  }
};

  const handleKeepAccount = () => {
    window.history.back();
  };

  if (authLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  console.log(user);

  if (!isAuthenticated) {
    return <div className="flex justify-center items-center h-64">Please login to access this page</div>;
  }

  return (
    <>
    <div className="max-w-xl mx-auto px-6 py-4 border rounded-md border-gray-300">
      <h1 className="text-lg font-semibold mb-4">Delete Account</h1>
      <div className="space-y-4">
        <h2 className="text-md font-medium">
          Is this goodbye? Are you sure you don't want to reconsider?
        </h2>

        <div className="pt-2">
          <label className="flex items-start space-x-2">
            <input 
              type="checkbox" 
              className="mt-1" 
              checked={agreeTerms}
              onChange={() => setAgreeTerms(!agreeTerms)}
            />
            <span className="text-sm">I agree to all the terms and conditions*</span>
          </label>
        </div>

        {authError && (
          <div className="text-red-500 text-sm py-1">
            {authError}
          </div>
        )}

        <div className="flex space-x-4 pt-2">
          <button 
            className={`flex-1 py-2 text-sm border border-pink-500 text-pink-500 rounded-md ${agreeTerms ? 'hover:bg-pink-50' : 'opacity-50 cursor-not-allowed'}`}
            onClick={handleOpenDeleteModal}
            disabled={!agreeTerms || authLoading}
          >
            {authLoading ? 'PROCESSING...' : 'DELETE ANYWAY'}
          </button>
          <button 
            className="flex-1 py-2 text-sm bg-pink-500 text-white rounded-md hover:bg-pink-600"
            onClick={handleKeepAccount}
          >
            KEEP ACCOUNT
          </button>
        </div>
      </div>
    </div>
    <DeleteAccountModal 
      isOpen={openDelete} 
      onClose={() => setOpenDelete(false)} 
      onConfirm={onConfirmDelete}
      loading={authLoading}
    />
    </>
  );
};

export default DeleteAccount;