import mongoose from "mongoose";

const formSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    hobby: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assumes you have a User model
      required: true,
    },
  },
  { timestamps: true }
);

export const Form = mongoose.model("Form", formSchema);