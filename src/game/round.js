class Round {
  constructor(roundNumber, drawerId, word, duration) {
    this.roundNumber = roundNumber;
    this.drawerId = drawerId;
    this.word = word;
    this.startTime = Date.now();
    this.endTime = this.startTime + (duration * 1000);
    this.guessedPlayerIds = new Set();
  }

  isExpired() {
    return Date.now() >= this.endTime;
  }

  getTimeRemaining() {
    return Math.max(0, Math.ceil((this.endTime - Date.now()) / 1000));
  }
}

module.exports = Round;
