import mongoose from 'mongoose';

const googleConnectionSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Form',
      required: true,
    },
    googleEmail: { 
        type: String, 
        required: true 
    },
    refreshToken: { 
        type: String, 
        required: true 
    }, 
    accessToken: { 
        type: String 
    }, 
    profilePicture: { 
        type: String 
    },
    accountName: { 
        type: String 
    },
    sheetId: { 
        type: String
    },
    sheetName: { 
        type: String
    },
    addedFields: { 
        type: [String], 
        default: [] 
    },
    connectedAt: { 
        type: Date, 
        default: Date.now 
    },
  },
  { timestamps: true }
);

export const GoogleConnection = mongoose.model(
  'GoogleConnection',
  googleConnectionSchema
);
