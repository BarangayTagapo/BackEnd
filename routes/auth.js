import express from 'express';
import { createUser, loginUser } from '../controllers/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/register', upload.single('image'), createUser);
router.post('/login', loginUser);

export default router;
