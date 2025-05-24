
export class Turn {

    constructor(player, currentTurnScore = 0, currentRollScore = 0) {
        this.player = player;
        this.currentTurnScore = currentTurnScore;
        this.currentRollScore = currentRollScore;
        // this.dice = [];
    }

    // addDice(dice) {
    //     this.dice.push(dice); //might need to re-look into this.
    // }

    calcScore() {
        const score = checkScore(); //need to figure out how to calc this on only the current roll.
        this.currentTurnScore = score;
        this.showScore(); // Show the updated score
    }

    showScore(){
        const scoreContainer = document.getElementById('playersScoresContainer');
        const currentPlayer = this.player; // Get the current player's name
        currentPlayer.fullScore = this.player.score + this.currentTurnScore; // Calculate the full score

        //check to see if player score div already exists
        const existingScoreDiv = document.getElementById(`player-${currentPlayer.id}-score`);
        if (existingScoreDiv) {
            existingScoreDiv.textContent = `${currentPlayer.name}'s score: ${currentPlayer.fullScore}`;
            return; // Exit if the score div already exists
        }
        const playerScore = document.createElement('div');
        playerScore.className = 'player-score';
        playerScore.id = `player-${currentPlayer.id}-score`;
        playerScore.textContent = `${currentPlayer.name}'s score: ${currentPlayer.fullScore}`;
        scoreContainer.appendChild(playerScore);
    }

    endTurn(farkle = false) {
        // End the turn and calculate score
        // const score = checkScore();
        // this.player.score += score;
        // this.showScore();
        if(!farkle){
            this.player.score += this.currentTurnScore; // Add the current score to the player's total score
        }
        this.currentTurnScore = 0; // Reset the current score for the new turn
        this.showScore(); // Show the updated score
        this.resetTurn();
        newTurn(this.player.nextPlayer); // Start a new turn for the next player
    }

    resetTurn() {
        const diceContainer = document.getElementById('diceContainer');
        diceContainer.innerHTML = ''; // Clear previous dice
        diceArr.length = 0; // Clear the dice array
    }
}