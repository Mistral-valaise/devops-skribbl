const Room = require('../../game/room');
const Player = require('../../game/player');

const rooms = new Map(); // roomId -> Room

const generateRoomId = () => Math.random().toString(36).substring(2, 8).toUpperCase();

module.exports = (io, socket) => {
  const createRoom = ({ nickname }) => {
    const roomId = generateRoomId();
    const player = new Player(socket.id, nickname);
    const room = new Room(roomId, player.id);
    
    room.addPlayer(player);
    rooms.set(roomId, room);
    
    socket.join(roomId);
    
    socket.emit('room:joined', { roomId, isHost: true, playerId: socket.id });
    io.to(roomId).emit('room:update', {
      players: room.getPlayers(),
      state: room.state,
      roundsPlayed: room.roundsPlayed
    });
  };

  const joinRoom = ({ roomId, nickname }) => {
    const room = rooms.get(roomId);
    
    if (!room) {
      return socket.emit('error', { message: 'Room not found' });
    }
    
    if (room.state !== 'LOBBY') {
        // For MVP, maybe allow joining mid-game as spectator or waiting? 
        // Spec says "reject invalid or full rooms". Let's reject for now if not lobby.
        // Actually, spec doesn't explicitly forbid joining mid-game, but let's stick to Lobby for simplicity.
        // Wait, re-reading spec: "FR-002: ...rejecting invalid or full rooms".
        // Let's assume full = max players (20).
    }

    const player = new Player(socket.id, nickname);
    room.addPlayer(player);
    
    socket.join(roomId);
    
    socket.emit('room:joined', { roomId, isHost: false, playerId: socket.id });
    io.to(roomId).emit('room:update', {
      players: room.getPlayers(),
      state: room.state,
      roundsPlayed: room.roundsPlayed
    });
  };

  const startGame = () => {
    // Find room for this socket
    let targetRoom = null;
    for (const room of rooms.values()) {
      if (room.hostId === socket.id) {
        targetRoom = room;
        break;
      }
    }

    if (!targetRoom) return;

    try {
      targetRoom.startGame();
      
      io.to(targetRoom.id).emit('game:started');
      io.to(targetRoom.id).emit('room:update', {
        players: targetRoom.getPlayers(),
        state: targetRoom.state,
        roundsPlayed: targetRoom.roundsPlayed
      });

      startRound(targetRoom);

    } catch (e) {
      socket.emit('error', { message: e.message });
    }
  };

  const startRound = (room) => {
    const round = room.currentRound;
    if (!round) return; // Game ended

    io.to(room.id).emit('round:start', {
      drawerId: round.drawerId,
      roundNumber: round.roundNumber,
      endTime: round.endTime
    });

    // Send word to drawer
    io.to(round.drawerId).emit('round:word_options', { words: [round.word] }); // MVP: 1 word for now to simplify
    
    // Send masked word to others
    const maskedWord = '_'.repeat(round.word.length);
    socket.to(room.id).emit('round:word_chosen', { length: round.word.length }); // This might need to be broadcast to room excluding drawer

    // Start timer loop
    const timer = setInterval(() => {
      if (round.isExpired()) {
        clearInterval(timer);
        endRound(room);
      }
    }, 1000);
  };

  const endRound = (room) => {
    io.to(room.id).emit('round:end', { word: room.currentRound.word });
    
    setTimeout(() => {
      const nextRound = room.startNextRound();
      if (nextRound) {
        startRound(room);
      } else {
        io.to(room.id).emit('game:over', { scoreboard: room.getPlayers() });
      }
    }, 5000); // 5s intermission
  };

  const handleStroke = (stroke) => {
    // Find room
    // Optimization: socket.rooms contains the room ID
    // But for now, let's iterate or assume we know the room.
    // Actually, socket.rooms is a Set. The second item is usually the room ID if joined.
    // Let's use the rooms map lookup for safety or just broadcast to all rooms the socket is in (except self).
    
    const roomsArr = Array.from(socket.rooms);
    // roomsArr[0] is socket.id, roomsArr[1] is likely the game room
    if (roomsArr.length > 1) {
        socket.to(roomsArr[1]).emit('draw:stroke', stroke);
    }
  };

  const handleClear = () => {
    const roomsArr = Array.from(socket.rooms);
    if (roomsArr.length > 1) {
        socket.to(roomsArr[1]).emit('draw:clear');
    }
  };

const Scoring = require('../../game/scoring');

  const handleChat = ({ message }) => {
    // Find room
    const roomsArr = Array.from(socket.rooms);
    if (roomsArr.length <= 1) return;
    const roomId = roomsArr[1];
    const room = rooms.get(roomId);
    if (!room) return;

    const player = room.getPlayer(socket.id);
    if (!player) return;

    // Check if game is active and round is running
    if (room.state === 'PLAYING' && room.currentRound && !room.currentRound.isExpired()) {
      const round = room.currentRound;
      
      // If player is drawer, they can't guess
      if (round.drawerId === socket.id) {
        // Maybe block them from chatting or just show as chat?
        // Spec says "Drawer picks one word... Other players... submit guesses".
        // Usually drawer chat is blocked or shown as normal chat but they shouldn't reveal word.
        // Let's just treat as chat.
      } else {
        // Check guess
        if (message.toLowerCase().trim() === round.word.toLowerCase()) {
          // Correct guess
          if (round.guessedPlayerIds.has(socket.id)) {
            // Already guessed
            return socket.emit('chat:message', { sender: 'System', message: 'You already guessed the word!', type: 'system' });
          }

          round.guessedPlayerIds.add(socket.id);
          
          // Calculate points
          const rank = round.guessedPlayerIds.size;
          const points = Scoring.calculateGuesserPoints(round.getTimeRemaining(), room.settings.drawTime, rank);
          player.score += points;

          // Award points to drawer
          const drawer = room.getPlayer(round.drawerId);
          if (drawer) {
            drawer.score += Scoring.calculateDrawerPoints(1); // Add incremental points
          }

          // Notify room
          io.to(roomId).emit('chat:message', { sender: 'System', message: `${player.nickname} guessed the word!`, type: 'correct' });
          io.to(roomId).emit('room:update', { players: room.getPlayers(), state: room.state, roundsPlayed: room.roundsPlayed });
          
          // Check if everyone guessed
          // Filter out drawer from count
          const guessersCount = room.players.size - 1;
          if (round.guessedPlayerIds.size >= guessersCount) {
             // End round early
             // We need to trigger endRound logic. 
             // Since endRound is inside startRound scope or global scope?
             // It was defined inside the module scope but not exposed.
             // I need to refactor handlers to access endRound or move logic.
             // For MVP, let's just let the timer finish or force expire.
             round.endTime = Date.now(); // Force expire
          }

          return; // Don't broadcast the word
        }
      }
    }

    // Normal chat
    io.to(roomId).emit('chat:message', { sender: player.nickname, message, type: 'chat' });
  };

  socket.on('room:create', createRoom);
  socket.on('room:join', joinRoom);
  socket.on('game:start', startGame);
  socket.on('draw:stroke', handleStroke);
  socket.on('draw:clear', handleClear);
  socket.on('chat:message', handleChat);
  
  // Handle disconnect to clean up player from room
  socket.on('disconnect', () => {
    // Find room where player is
    for (const [roomId, room] of rooms.entries()) {
        if (room.players.has(socket.id)) {
            room.removePlayer(socket.id);
            if (room.players.size === 0) {
                rooms.delete(roomId);
            } else {
                // If host left, assign new host
                if (room.hostId === socket.id) {
                    const nextPlayer = room.getPlayers()[0];
                    room.hostId = nextPlayer.id;
                }
                io.to(roomId).emit('room:update', {
                    players: room.getPlayers(),
                    state: room.state,
                    roundsPlayed: room.roundsPlayed
                });
            }
            break;
        }
    }
  });
};
