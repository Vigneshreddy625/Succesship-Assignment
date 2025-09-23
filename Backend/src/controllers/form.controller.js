import { User } from "../models/user.model.js";
import { Form } from "../models/Form.model.js";

export const addForm = async (req, res) => {
  try {
    const authUserId = req?.user?._id;
    if (!authUserId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { name, email, hobby, age, phoneNumber } = req.body || {};
    if (!name || !email || !hobby || typeof age !== 'number' || !phoneNumber) {
      return res.status(400).json({ message: 'name, email, hobby, age, phoneNumber are required' });
    }

    const form = new Form({ name, email, hobby, age, phoneNumber, user: authUserId });
    await form.save();

    const user = await User.findById(authUserId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(201).json({ message: 'Form added successfully', form, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const getUserForms = async (req, res) => {
  try {
    const authUserId = req?.user?._id;
    if (!authUserId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(authUserId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const forms = await Form.find({ user: authUserId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "User forms fetched successfully",
      user: { _id: user._id, fullName: user.fullName, email: user.email },
      forms,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};