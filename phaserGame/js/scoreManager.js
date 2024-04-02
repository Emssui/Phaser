class ScoreManager {
    constructor() {
        this.score = 0;
    }

    increaseScore(amount) {
        this.score += amount;
    }

    getScore() {
        return this.score;
    }
}

const scoreManager = new ScoreManager();
