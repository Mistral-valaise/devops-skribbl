let socket;

export const initSocket = () => {
  socket = io();
  
  socket.on('connect', () => {
    console.log('Connected to server with ID:', socket.id);
  });

  return socket;
};

export const getSocket = () => socket;
