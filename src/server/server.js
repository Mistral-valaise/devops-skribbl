const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const socketHandler = require('./socket');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server);

// Initialize socket handlers
socketHandler(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
