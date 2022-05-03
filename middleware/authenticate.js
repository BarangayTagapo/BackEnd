import jwt from 'jsonwebtoken';
import APIError from '../errors/APIError.js';

export default async (req, res, next) => {
  // header's token
  const authToken = await req.headers.authorization;

  // Token not found or invalid
  if (!authToken || !authToken.startsWith('Bearer '))
    throw APIError.unauthorized('Invalid Token');

  // token
  const token = authToken.split('Bearer ')[1];

  try {
    // Verify token
    const user = jwt.verify(token, process.env.JWT_SECRET);

    // Only accept request who were accepted
    if (!user.access) {
      next(
        APIError.forbidden(
          'Please wait for the admin to accept your register request'
        )
      );
    }

    req.user = user;
    next();
  } catch (error) {
    throw APIError.unauthorized('User not verified');
  }
};
