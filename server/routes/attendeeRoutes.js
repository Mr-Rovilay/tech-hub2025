import express from 'express';
import { createAttendee, getAttendeeByQRCode } from '../controllers/attendeeController.js';

const router = express.Router();

router.post('/', createAttendee);
router.get('/:qrCode', getAttendeeByQRCode);

export default router;