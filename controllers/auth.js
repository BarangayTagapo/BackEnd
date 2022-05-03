import APIError from '../errors/APIError.js';
import User from '../models/User.js';

// Create new user
export const createUser = async (req, res) => {
  if (req.file) req.body.image = req.file.filename;
  await User.create(req.body);
  res.status(201).json({
    success: true,
    message:
      'Register request sent. Please wait for the admin to accept your request.',
  });
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // No email or password
  if (!email || !password)
    throw APIError.badRequest('Please provide email and password');

  // Getting the user
  const user = await User.findOne({ email });
  // Checking if user exists
  if (!user) throw APIError.badRequest('Email and password does not match');

  // User not granted a access
  if (!user.access)
    throw APIError.forbidden(
      'Please wait for the admin to accept your register request'
    );

  // Checking if email and password match
  const isVerified = await user.comparePassword(password);
  if (!isVerified)
    throw APIError.badRequest('Email and password does not match');

  // If verified. Send back token
  const token = user.createToken();
  res.status(200).json({ success: true, token });
};
