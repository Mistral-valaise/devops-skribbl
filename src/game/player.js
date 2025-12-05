class Player {
  constructor(id, nickname) {
    this.id = id;
    this.nickname = nickname;
    this.score = 0;
    this.isConnected = true;
  }
}

module.exports = Player;
