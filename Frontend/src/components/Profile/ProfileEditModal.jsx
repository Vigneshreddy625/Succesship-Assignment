import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X, User, Mail, Phone, Calendar, Info } from "lucide-react";
import { useAuth} from "../../authContext/useAuth";

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUserDetails } = useAuth();
  const popupRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [formData, setFormData] = useState({
    gender: "",
    mobile: "",
    dob: "",
  });

  useEffect(() => {
    if (isOpen && user) {
      console.log("🔄 Setting form data from user:", user);
      setFormData({
        gender: user.gender || "",
        mobile: user.mobile || "",
        dob: user.dob ? user.dob.split("T")[0] : "",
      });
    }
  }, [isOpen, user]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
    return `${formattedDate} · ${formattedTime}`;
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      console.log("📝 Submitting form data:", formData);
      
      const filteredData = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value && value.trim() !== "") {
          acc[key] = value.trim();
        }
        return acc;
      }, {});
      
      console.log("📝 Filtered data to send:", filteredData);
      
      await updateUserDetails(filteredData);
      
      console.log("✅ Profile updated successfully");
      onClose();
    } catch (error) {
      console.error("❌ Profile update failed:", error);
      setSubmitError(error.response?.data?.message || error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm md:p-4"
    >
      <motion.div
        ref={popupRef}
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="w-full md:max-w-xl h-full md:h-auto max-h-full md:max-h-[90vh] bg-white md:rounded-2xl shadow-lg overflow-hidden border flex flex-col"
      >
        <div className="relative h-20 bg-gradient-to-r from-blue-500 to-indigo-500">
          <button
            onClick={onClose}
            className="absolute top-3 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="absolute -bottom-6 left-6">
            <div className="w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="px-6 pt-10 pb-6 overflow-y-auto h-full">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Profile Details
          </h2>

          {submitError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{submitError}</p>
            </div>
          )}

          <div className="space-y-4">
            <ProfileField label="Full Name" icon={<User />} value={user?.fullName} disabled />
            <ProfileField label="Email ID" icon={<Mail />} value={user?.email} disabled />
            <ProfileField
              label="Mobile Number"
              icon={<Phone />}
              value={formData.mobile}
              onChange={handleChange("mobile")}
              disabled={isSubmitting}
            />
            <ProfileField
              label="Gender"
              icon={<User />}
              type="select"
              value={formData.gender}
              options={["Male", "Female"]}
              onChange={handleChange("gender")}
              disabled={isSubmitting}
            />
            <ProfileField
              label="Date of Birth"
              icon={<Calendar />}
              type="date"
              value={formData.dob}
              onChange={handleChange("dob")}
              disabled={isSubmitting}
            />
            <ProfileField
              label="Member Since"
              icon={<Calendar />}
              value={user?.createdAt ? formatDateTime(user.createdAt) : ""}
              disabled
            />
          </div>
        </div>

        <div className="p-3 sm:p-4 bg-gray-50 flex justify-end">
          <div className="flex gap-3 sm:gap-4">
            <button
              className="px-4 border border-gray-400 sm:px-6 py-2 sm:py-2.5 text-sm font-medium bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-lg transform transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg transform transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Info"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

function ProfileField({
  label,
  icon,
  value,
  disabled,
  type = "text",
  onChange,
  options = [],
}) {
  const isPlaceholder = value?.includes?.("not added");

  return (
    <div className="flex items-start space-x-3">
      <div className="mt-1 flex-shrink-0 text-gray-400">{icon}</div>
      <div className="flex-1">
        <label className="text-xs text-gray-500">{label}</label>

        {type === "select" ? (
          <select
            value={value}
            disabled={disabled}
            onChange={onChange}
            className={`w-full bg-gray-50 mt-1 border rounded-lg px-3 py-2 text-sm ${
              disabled
                ? "border-gray-200 text-gray-600 cursor-not-allowed"
                : isPlaceholder
                ? "text-gray-400 italic"
                : "text-gray-900"
            }`}
          >
            <option value="">Select</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value || ""}
            disabled={disabled}
            readOnly={disabled}
            onChange={onChange}
            className={`w-full bg-gray-50 mt-1 border rounded-lg px-3 py-2 text-sm ${
              disabled
                ? "border-gray-200 text-gray-600 cursor-not-allowed"
                : isPlaceholder
                ? "text-gray-400 italic"
                : "text-gray-900"
            }`}
          />
        )}
      </div>
    </div>
  );
}

export default ProfileModal;