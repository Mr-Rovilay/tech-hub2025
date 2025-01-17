import Feedback from '../models/feedbackModel.js';
import Attendee from '../models/attendeeModel.js';
import { emitFeedbackUpdate } from '../utils/socketManager.js';

export const submitFeedback = async (req, res) => {
  try {
    const { attendeeId, expectations, experience, keyTakeaways, improvements } = req.body;
    
    const attendee = await Attendee.findById(attendeeId);
    if (!attendee) {
      return res.status(404).json({ message: 'Attendee not found' });
    }
    
    if (attendee.hasFeedback) {
      return res.status(400).json({ message: 'Feedback already submitted' });
    }
    
    const feedback = new Feedback({
      attendee: attendeeId,
      expectations,
      experience,
      keyTakeaways,
      improvements,
    });
    
    await feedback.save();
    attendee.hasFeedback = true;
    await attendee.save();
    
    emitFeedbackUpdate(feedback);
    
    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().populate('attendee', 'name');
    res.json(feedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};