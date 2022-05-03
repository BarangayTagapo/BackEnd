import APIError from '../errors/APIError.js';
import fs from 'fs';

export default (err, req, res, next) => {
  // Remove image file if there's error
  if (req.file) {
    fs.unlink(`./images/${req.file.filename}`, (err) => {
      if (err) throw err.message;
    });
  }

  if (err instanceof APIError)
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });

  // mongoose errors
  if (err.name === 'CastError')
    return res.status(400).json({ success: false, message: 'Invalid user id' });

  // Input criteria not met
  if (err.name == 'ValidationError') {
    const errorkeys = Object.keys(err.errors);
    const message = errorkeys.map(
      (invalid) => err.errors[invalid].properties.message
    );
    return res.status(400).json({ success: false, message });
  }

  // Repeated email
  if (err.code === 11000) {
    const value = err.keyValue.email;
    return res
      .status(400)
      .json({ success: false, message: `Email ${value} is already taken` });
  }

  // res.status(500).json(err);

  res.status(500).json({
    success: false,
    message: 'Something went wrong. Please try again later',
  });
};
