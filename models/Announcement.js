import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema(
  {
    creatorId: mongoose.Schema.Types.ObjectId,
    creator: String,
    category: {
      type: String,
      default: 'schedule',
      enum: ['schedule', 'scholarship', 'pwd', 'clinic'],
    },
    image: String,
    title: {
      type: String,
      required: [true, 'Please enter title'],
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Announcement', AnnouncementSchema);
