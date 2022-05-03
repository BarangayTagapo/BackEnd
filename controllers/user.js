import APIError from '../errors/APIError.js';
import { deleteImage } from '../middleware/upload.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

// remove password property when retrieving user(s)
const filteredUserInfo = (user) => {
  const newUser = { ...user._doc };
  delete newUser.password;
  return newUser;
};

// Get current user's info using token
export const getCurrentUserInfo = async (req, res) => {
  let user = await User.findOne({ _id: req.user.userId });
  user = filteredUserInfo(user);
  res.status(200).json(user);
};

// Get All user
export const getAllUser = async (req, res) => {
  const users = await User.find({});
  res.json({ success: true, users });
};

// Get single user
export const getUser = async (req, res) => {
  const { userId } = req.params;
  let user = await User.findOne({ _id: userId });

  // User does not exist
  if (!user) throw APIError.notFound('User not found');
  user = filteredUserInfo(user);
  res.status(200).json(user);
};

// Delete user
export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  // Only allow the admin and user to delete account to modify access status
  if (!req.user.isAdmin && req.user.userId !== userId)
    throw APIError.forbidden('Invalid Action');

  const user = await User.findOne({ _id: userId });

  if (user.email === process.env.SYSTEMEMAIL)
    throw APIError.forbidden('Invalid Action');

  // Delete user's image
  user.image && deleteImage(user.image);
  // Delete from db
  await User.findOneAndDelete({ _id: userId });

  res.json({ success: true, message: 'User deleted' });
};

// Update user
export const updateUser = async (req, res, next) => {
  console.log(req.file);
  const { userId } = req.params;
  // Parsing infos from form data
  const parsedInfo = JSON.parse(req.body.info);
  const { email, access } = parsedInfo;
  const confirmPass = req.body.confirmPassword;
  // Getting user's info
  let user = await User.findOne({ _id: userId });

  // ####### Security for editing account #####

  // Throw error when entered wrong id
  if (!user) throw APIError.notFound('User not found');

  // Only allow the current user and admin to edit user's account
  if (req.user.userId !== userId && !req.user.isAdmin)
    throw APIError.forbidden('You can only edit your account');

  // Check if user inputted correct password
  const isVerified = await user.comparePassword(confirmPass);
  // Prevent access when confirm password was incorrect
  if (!isVerified) throw APIError.forbidden('Incorrect password');

  // Prevent non admin to change their email to admin's email
  if (email === process.env.SYSTEMEMAIL)
    throw APIError.forbidden('Invalid email');

  // Prevent non admin to change their accept status
  if (access && !req.user.isAdmin) throw APIError.forbidden('Invalid action');

  //  ####### Update account when clear #######

  // Delete previous image if there is one
  if (req.file && user.image) {
    deleteImage(user.image);
  }
  // Replace previous image with the new one
  if (req.file.filename) parsedInfo.image = req.file.filename;

  // Hashing password if existed
  if (parsedInfo.password) {
    const salt = await bcrypt.genSalt(10);
    parsedInfo.password = await bcrypt.hash(parsedInfo.password, salt);
  }

  // Update user to db
  await User.findOneAndUpdate({ _id: userId }, parsedInfo, {
    runValidators: true,
    new: true,
  });

  res.json({
    success: true,
    message: 'User updated',
  });
};

// Get all user that granted an access
export const getAllStaffs = async (req, res) => {
  const users = await User.find({ access: true });
  const staffs = users.map((user) => filteredUserInfo(user));
  res.status(200).json({ succes: true, staffs });
};

// Get all access request
export const getAllRequest = async (req, res) => {
  const users = await User.find({ access: false });
  const requests = users.map((user) => filteredUserInfo(user));
  res.status(200).json({ succes: true, requests });
};

export const grantAccess = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.query;

  // Only allow the admin to modify access status
  if (!req.user.isAdmin) throw APIError.forbidden('Invalid Action');

  const user = await User.updateOne(
    { _id: userId },
    { access: JSON.parse(status) }
  );

  // Throw error when entered wrong id
  if (!user) throw APIError.notFound('User not found');

  res.status(200).json({ message: 'User modified' });
};
