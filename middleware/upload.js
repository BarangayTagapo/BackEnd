import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({
  storage: storage,
  // Only accepts image extension
  fileFilter: (req, file, cb) => {
    // accept only png/jpg
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png'
      ? cb(null, true)
      : cb(
          new Error(
            `Profile picture must be png/jpg. ${file.mimetype} is not supported`
          )
        );
  },
  // File sized limits: 6.5mb
  limits: {
    fileSize: 1024 * 1024 * 6.5,
  },
});

export const deleteImage = (image) =>
  fs.unlink(`./images/${image}`, (err) => {
    console.log(err);
    // if (err) throw err.message;
  });

export default upload;
