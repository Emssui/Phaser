class ScoreManager {
    constructor() {
        this.score = 0;
        this.level = 0;
        this.totalScore = 0;
    }

    increaseScore(amount) {
        this.score += amount;
        this.totalScore += amount;
        this.level;
    }

    getScore() {
        return  this.score;
    }

    getlevel() {
        return  this.score;
    }
}

const scoreManager = new ScoreManager();
