import React, {useState} from "react";
import { useAuth } from "../../authContext/useAuth"
import ProfileModal from "./ProfileEditModal"

export default function Profile() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const {user} = useAuth();
  const formatDateTime = (dateString) => {
  const date = new Date(dateString);

  const formattedDate = date.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${formattedDate}`;
};

  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-gray-300 ">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Profile Details</h2>

        <div className="space-y-5">
          <ProfileItem label="Full Name" value={user.fullName} />
          <ProfileItem label="Email ID" value={user.email} />
          <ProfileItem label="Mobile Number" value={user.mobile} />
          <ProfileItem label="Gender" value={user.gender}/>
          <ProfileItem label="Date of Birth" value={formatDateTime(user.dob)} />
          <ProfileItem label="Member Since" value={formatDateTime(user.createdAt)} />
        </div>

        <button onClick={() => setIsProfileOpen(true)} className="cursor-pointer mt-8 w-full bg-blue-500 hover:bg-blue-600 transition-colors text-white text-sm font-medium py-2 rounded-md shadow-sm">
          Edit Profile
        </button>
      </div>
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}

function ProfileItem({ label, value }) {
  const displayValue = value ? value : "- not added -";
  const isPlaceholder = displayValue === "- not added -";

  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600 text-sm">{label}</span>
      <span className={`text-sm ${isPlaceholder ? 'text-gray-400 italic' : 'text-gray-800 font-medium'}`}>
        {displayValue}
      </span>
    </div>
  );
}