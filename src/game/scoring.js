class Scoring {
  static calculateGuesserPoints(timeRemaining, totalTime, rank) {
    // Simple formula: Base points + Time bonus
    // Rank 1: 300 + time bonus
    // Rank 2: 200 + time bonus
    // Rank 3+: 100 + time bonus
    
    let base = 100;
    if (rank === 1) base = 300;
    else if (rank === 2) base = 200;
    
    const timeBonus = Math.floor((timeRemaining / totalTime) * 100);
    return base + timeBonus;
  }

  static calculateDrawerPoints(correctGuessesCount) {
    // Drawer gets 50 points per correct guess
    return correctGuessesCount * 50;
  }
}

module.exports = Scoring;
