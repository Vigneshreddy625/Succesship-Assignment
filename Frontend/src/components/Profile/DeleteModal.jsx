import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X, AlertCircle, Loader2 } from 'lucide-react';

const DeleteAccountModal = ({ isOpen, onClose, onConfirm, loading }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const modalVariants = {
    hidden: { 
      scale: 0.8, 
      opacity: 0,
      y: 20
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  const iconVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        delay: 0.2,
        type: "spring",
        stiffness: 500,
        damping: 15
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      } 
    },
    tap: { scale: 0.95 }
  };

  const handleDelete = () => {
    if (!isConfirming) {
      setIsConfirming(true);
      setTimeout(() => setIsConfirming(false), 3000);
      return;
    }
    
    onConfirm();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
        >
          <motion.div 
            className="bg-white rounded-2xl shadow-2xl max-w-[360px] md:max-w-md w-full relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-400/10 to-purple-500/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/10 to-emerald-500/10 rounded-full blur-3xl"></div>
            </div>
            
            <motion.button 
              onClick={onClose} 
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-800 transition-colors z-10"
              whileHover={{ rotate: 90 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              disabled={loading}
            >
              <X size={24} />
            </motion.button>
            
            <motion.div 
              className="relative z-10 mx-auto w-20 h-20 my-4 bg-white rounded-full flex items-center justify-center shadow-lg"
              variants={iconVariants}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-400 rounded-full opacity-10"></div>
              <Trash2 size={32} className="text-red-500" strokeWidth={2} />
            </motion.div>
            
            <div className="relative z-10 px-8 pb-8 pt-2">
              <motion.h2 
                className="text-xl font-bold text-center text-gray-900 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                You are about to delete your account
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-gray-800 text-center mb-1">
                  This action cannot be undone and all your data will be permanently lost.
                </p>
                <p className="text-gray-7 text-center mb-1">
                  Are you sure?
                </p>
                <hr className='my-4'/>
              </motion.div>
              
              <div className="flex justify-end space-x-4">
                <motion.button 
                  onClick={onClose} 
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  disabled={loading}
                >
                  Cancel
                </motion.button>
                
                <motion.button 
                  onClick={handleDelete}
                  disabled={loading}
                  className={`px-6 py-2.5 flex items-center justify-center gap-2 font-medium rounded-lg transition-all shadow-lg ${
                    loading ? 'bg-gray-400 text-white cursor-not-allowed' :
                    isConfirming 
                      ? 'bg-red-600 text-white shadow-red-600/20' 
                      : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/20'
                  }`}
                  variants={buttonVariants}
                  whileHover={loading ? {} : "hover"}
                  whileTap={loading ? {} : "tap"}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : isConfirming ? (
                    <>
                      <AlertCircle size={18} />
                      <span>Confirm Delete</span>
                    </>
                  ) : (
                    <span>Delete</span>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteAccountModal;