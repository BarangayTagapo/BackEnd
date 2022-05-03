import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['clearance', 'id'],
      required: [true, 'Please provide category'],
    },
    name: {
      type: String,
      required: [true, 'Please provide name'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Please provide your address'],
      trim: true,
    },
    purpose: {
      type: String,
      required: [true, 'Please provide your purpose'],
      trim: true,
    },
    contact: {
      type: String,
      required: [true, 'Please provide your purpose'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Please provide valid id'],
    },
    isDone: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Application', ApplicationSchema);
