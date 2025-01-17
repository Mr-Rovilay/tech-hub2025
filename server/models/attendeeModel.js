import mongoose from 'mongoose';

const attendeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  qrCode: {
    type: String,
    required: true,
    unique: true,
  },
  hasFeedback: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.model('Attendee', attendeeSchema);