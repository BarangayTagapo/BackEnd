import express from 'express';
import {
  createPost,
  deletePost,
  editPost,
  getAllPost,
  getPost,
} from '../controllers/announcement.js';
import upload from '../middleware/upload.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

router
  .route('/')
  .get(getAllPost)
  .post([authenticate, upload.single('image')], createPost);
router
  .route('/:postId')
  .get(authenticate, getPost)
  .patch([authenticate, upload.single('image')], editPost)
  .delete(authenticate, deletePost);

export default router;
