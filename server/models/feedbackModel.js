import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  attendee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attendee',
    required: true,
  },
  expectations: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor'],
    required: true,
  },
  keyTakeaways: {
    type: String,
    required: true,
  },
  improvements: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Feedback', feedbackSchema);