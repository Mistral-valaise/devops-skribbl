const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('internal server error');
        }
    });

    const io = new Server(server, {
        path: '/api/socket',
        addTrailingSlash: false,
    });

    io.on('connection', (socket) => {
        console.log('Client connected', socket.id);

        socket.on('disconnect', () => {
            console.log('Client disconnected', socket.id);
        });

        // Game logic placeholders
        socket.on('join-room', (roomId, user) => {
            socket.join(roomId);
            console.log(`${user} joined room ${roomId}`);
            io.to(roomId).emit('user-joined', user);
        });

        socket.on('draw', (data) => {
            // Broadcast drawing data to room
            const { roomId, ...drawData } = data;
            socket.to(roomId).emit('draw', drawData);
        });

        socket.on('chat-message', (data) => {
            const { roomId, message, user } = data;
            io.to(roomId).emit('chat-message', { user, message });
        });
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});
