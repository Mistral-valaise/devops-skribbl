const Round = require('./round');
const WORDS = require('./words');

class Room {
  constructor(id, hostId) {
    this.id = id;
    this.hostId = hostId;
    this.players = new Map(); // socketId -> Player
    this.state = 'LOBBY'; // LOBBY, PLAYING, ENDED
    this.settings = {
      maxRounds: 3,
      drawTime: 80
    };
    this.currentRound = null;
    this.roundsPlayed = 0;
    this.drawerQueue = [];
  }

  addPlayer(player) {
    this.players.set(player.id, player);
  }

  removePlayer(playerId) {
    this.players.delete(playerId);
  }

  getPlayer(playerId) {
    return this.players.get(playerId);
  }

  getPlayers() {
    return Array.from(this.players.values());
  }

  startGame() {
    if (this.players.size < 2) {
      throw new Error('Not enough players to start');
    }
    this.state = 'PLAYING';
    this.roundsPlayed = 0;
    this.drawerQueue = Array.from(this.players.keys());
    this.startNextRound();
  }

  startNextRound() {
    if (this.roundsPlayed >= this.settings.maxRounds * this.players.size) {
      this.state = 'ENDED';
      return null;
    }

    // Rotate drawer
    const drawerId = this.drawerQueue.shift();
    this.drawerQueue.push(drawerId);

    // Pick random word
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];

    this.currentRound = new Round(
      this.roundsPlayed + 1,
      drawerId,
      word,
      this.settings.drawTime
    );
    
    this.roundsPlayed++;
    return this.currentRound;
  }
}

module.exports = Room;
