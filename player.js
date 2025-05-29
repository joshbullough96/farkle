export class Player {
    constructor(name, id, nextPlayer = null, score = 0, tempScore = 0) {
        this.name = name;
        this.id = id;
        this.score = score;
        this.tempScore = tempScore; // Temporary score for the current turn
        this.nextPlayer = null; // Initialize nextPlayer to null
    }

    showScore() {
        const scoreContainer = document.getElementById('playersScoresContainer');
        const score = this.score + this.tempScore; // Get the current player's score

        //check to see if player score div already exists
        const existingScoreDiv = document.getElementById(`player-${this.id}-score`);
        if (existingScoreDiv) {
            existingScoreDiv.textContent = `${this.name}'s score: ${score}`;
            return; // Exit if the score div already exists
        }
        const playerScore = document.createElement('div');
        playerScore.className = 'player-score';
        playerScore.id = `player-${this.id}-score`;
        playerScore.textContent = `${this.name}'s score: ${this.score}`;
        scoreContainer.appendChild(playerScore);
    }
    
}