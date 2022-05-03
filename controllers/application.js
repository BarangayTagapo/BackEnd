import APIError from '../errors/APIError.js';
import { deleteImage } from '../middleware/upload.js';
import Application from '../models/Application.js';

export const getAllApplications = async (req, res) => {
  const applications = await Application.find({});

  res.json({ success: true, applications });
};

export const getApplication = async (req, res) => {
  const { appId } = req.params;

  const application = await Application.findOne({ _id: appId });

  if (!application) throw APIError.notFound('Application not found');

  res.json({ success: true, application });
};

export const createApplication = async (req, res) => {
  req.body.image = req.file.filename;

  await Application.create(req.body);

  res.json({
    success: true,
    message:
      'Application sent. Please wait 24 hours for your application to be proccessed and you can visit the barangay hall to receive the document',
  });
};

export const deleteApplication = async (req, res) => {
  const { appId } = req.params;

  const application = await Application.findByIdAndDelete(appId);

  if (!application) throw APIError.notFound('Application not found');

  deleteImage(application.image);

  res.json({ success: true, message: 'Application deleted' });
};

export const editApplication = async (req, res) => {
  const { appId } = req.params;

  const application = await Application.findOne({ _id: appId });

  if (!application) throw APIError.notFound('Application not found');

  await Application.findByIdAndUpdate(appId, { isDone: req.body.isDone });

  res.json({ success: true, message: 'Application updated' });
};
