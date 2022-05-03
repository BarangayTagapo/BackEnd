import Announcement from '../models/Announcement.js';
import APIError from '../errors/APIError.js';
import { deleteImage } from '../middleware/upload.js';

export const getAllPost = async (req, res) => {
  const { category } = req.query;
  const announcements = category
    ? await Announcement.find({ category })
    : await Announcement.find({});
  res.json({ success: true, announcements });
};

export const getPost = async (req, res) => {
  const { postId } = req.params;

  const announcement = await Announcement.findOne({ _id: postId });

  if (!announcement) throw APIError.notFound('Post not found');

  res.json({ success: true, announcement });
};

export const createPost = async (req, res) => {
  if (req.file) req.body.image = req.file.filename;

  req.body.creator = req.user.name;

  await Announcement.create(req.body);

  res.json({ success: true, message: 'Post created' });
};

export const editPost = async (req, res) => {
  const { postId } = req.params;
  req.body.creatorId = req.user.userId;
  req.body.creator = req.user.name;

  const post = await Announcement.findOne({ _id: postId });

  if (!post) throw APIError.notFound('Post not found');

  if (req.file) req.body.image = req.file.filename;

  await Announcement.findByIdAndUpdate({ _id: postId }, req.body, {
    runValidators: true,
    new: true,
  });

  if (req.file && post.image) deleteImage(post.image);

  res.json({ message: 'post updated' });
};

export const deletePost = async (req, res) => {
  const { postId } = req.params;

  const post = await Announcement.findOne({ _id: postId });

  if (!post) throw APIError.notFound('Post not found');

  await Announcement.findOneAndDelete({ _id: postId });

  post.image && deleteImage(post.image);

  res.json({ message: 'Post deleted' });
};
