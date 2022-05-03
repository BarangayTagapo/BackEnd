import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  fName: {
    type: String,
    required: [true, 'First name cannot be empty'],
    minlength: 5,
    maxlength: 45,
    trim: true,
  },
  mName: {
    type: String,
    maxlength: 15,
  },
  lName: {
    type: String,
    required: [true, 'Last name cannot be empty'],
    minlength: 5,
    maxlength: 25,
    trim: true,
  },
  access: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    minlength: 6,
    required: [true, 'Password cannot be empty'],
  },
  image: {
    type: String,
  },
});

// Hash password when creating new user
UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // Make sure anyone requested to register account to be not accepted
  this.access = false;
});

// Creating token after logging in
// Prevent new registered account to have an admin access
UserSchema.methods.createToken = function () {
  let isAdmin = false;
  if (this.email === process.env.SYSTEMEMAIL) isAdmin = true;
  return jwt.sign(
    { userId: this._id, isAdmin, access: this.access, name: this.fName },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    }
  );
};

// Verify password when logging in
UserSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', UserSchema);
