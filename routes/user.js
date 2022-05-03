import express from 'express';
import {
  getAllUser,
  getUser,
  deleteUser,
  updateUser,
  getCurrentUserInfo,
  getAllStaffs,
  getAllRequest,
  grantAccess,
} from '../controllers/user.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getAllUser);
router.get('/userInfo', getCurrentUserInfo);
router.get('/staffs', getAllStaffs);
router.get('/requests', getAllRequest);
router.patch('/access/:userId', grantAccess);
router
  .route('/:userId')
  .get(getUser)
  .delete(deleteUser)
  .patch(upload.single('image'), updateUser);

export default router;
