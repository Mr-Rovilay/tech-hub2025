import Attendee from "../models/attendeeModel.js";
import { generateQRCode } from "../services/qrCodeService.js";


export const createAttendee = async (req, res) => {
  try {
    const { name, email } = req.body;
    const qrCode = await generateQRCode(email);
    const attendee = new Attendee({ name, email, qrCode });
    await attendee.save();
    res.status(201).json(attendee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAttendeeByQRCode = async (req, res) => {
  try {
    const { qrCode } = req.params;
    const attendee = await Attendee.findOne({ qrCode });
    if (!attendee) {
      return res.status(404).json({ message: 'Attendee not found' });
    }
    res.json(attendee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};