import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { initializeSocketManager } from './utils/socketManager.js';
import connectDB from "./db/db.js";
import attendeeRoutes from './routes/attendeeRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';


const PORT = process.env.PORT || 5000;
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST']
  }
});



app.use(cors());
app.use(express.json());

// Initialize socket manager
initializeSocketManager(io);

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/attendees', attendeeRoutes);
app.use('/api/feedback', feedbackRoutes);

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => console.log('A user disconnected'));
});

// Connect to the database and start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });
