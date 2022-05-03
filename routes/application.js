import express from 'express';
import {
  createApplication,
  deleteApplication,
  editApplication,
  getAllApplications,
  getApplication,
} from '../controllers/application.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router
  .route('/')
  .get(getAllApplications)
  .post(upload.single('image'), createApplication);
router
  .route('/:appId')
  .get(getApplication)
  .delete(deleteApplication)
  .patch(editApplication);

export default router;
