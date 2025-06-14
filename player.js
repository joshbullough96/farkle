export class Player {
    constructor(name, id) {
        this.name = name;
        this.id = id;
        this.score = 0;
        this.tempScore = 0; // Temporary score for the current turn
        this.nextPlayer = null; // Initialize nextPlayer to null
        this.isWinner = false; // Flag to track if the player has won
    }

    showWinner() {
        alert(`${this.name} has won with ${this.score + this.tempScore} points! 🎉`);
    }

    showScore() {
        const scoreContainer = document.getElementById('playersScoresContainer');
        const score = this.score + this.tempScore; // Get the current player's score
        this.isWinner = score >= this.game.scoreTo; // Check if the player has won
        //check to see if player score div already exists
        const existingScoreDiv = document.getElementById(`player-${this.id}-score`);
        if (existingScoreDiv) {
            existingScoreDiv.textContent = `${this.name}'s score: ${score}`;
            if (this.isWinner) {
                this.showWinner();
            }
            return; // Exit if the score div already exists
        }
        const playerScore = document.createElement('div');
        playerScore.className = 'player-score';
        playerScore.id = `player-${this.id}-score`;
        playerScore.textContent = `${this.name}'s score: ${this.score}`;
        scoreContainer.appendChild(playerScore);
        if (this.isWinner) {
            this.showWinner();
        }
    }

}