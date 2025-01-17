let io;

export const initializeSocketManager = (socketIo) => {
  io = socketIo;
  
  io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

export const emitFeedbackUpdate = (feedback) => {
  if (io) {
    io.emit('newFeedback', feedback);
  }
};