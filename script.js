// This is a basic JavaScript file template.
// You can add your JavaScript code below.

let activeTurn = null;

const diceArr = [];
const players = [];

function checkFarkle() {

    // Check if all dice are selected and have the same value
    const unselectedDice = diceArr.filter(dice => !dice.el.classList.contains('selected'));
    // const firstValue = selectedDice[0].value;
    // const allSameValue = selectedDice.every(dice => dice.value === firstValue);
    const hasOnes = unselectedDice.some(dice => dice.value === 1);

    const hasFives = unselectedDice.some(dice => dice.value === 5);

    const hasPairsOrMore = Object.values(unselectedDice.reduce((acc, dice) => {
        acc[dice.value] = (acc[dice.value] || 0) + 1;
        return acc;
    }, {})).some(count => count > 2);

    const hasStraight = unselectedDice.length === 6 && unselectedDice.every((dice, index) => dice.value === index + 1);

    if(!(hasOnes || hasFives || hasPairsOrMore || hasStraight)) {
        // Farkle condition met
        alert("Farkle! You do not have any of 1s, 5s, or a combination of pairs or triplets or more or a straight.");
        setTimeout(()=>{
            const farkle = true;
            activeTurn.endTurn(farkle); // Reset the turn for the current player
        }, 1000); // Delay to allow the alert to be seen
    }

}

function allowReroll() {
    confirm('According to our calculations you can now reroll.');
    activeTurn.resetTurn();
}

function checkScore() {

    let score = 0;

    // Calculate score based on the selected dice
    const selectedDice = diceArr.filter(dice => dice.el.classList.contains('selected') && !dice.scored); // Only consider unscored selected dice that haven't been scored already.
    
    //four of a kind with a pair
    const fourOfAKind = Object.values(selectedDice.reduce((acc, dice) => {
        acc[dice.value] = (acc[dice.value] || 0) + 1;
        return acc;
    }, {})).some(count => count === 4);

    const hasPair = Object.values(selectedDice.reduce((acc, dice) => {
        acc[dice.value] = (acc[dice.value] || 0) + 1;
        return acc;
    }, {})).some(count => count >= 2);
    if (fourOfAKind && hasPair) { 
        score += 1500; // Example score for four of a kind with a pair
        allowReroll();
        return score; //allow reroll.
    }

    //two triplets
    const tripletCount = Object.values(selectedDice.reduce((acc, dice) => {
        acc[dice.value] = (acc[dice.value] || 0) + 1;
        return acc;
    }, {})).filter(count => count >= 3).length;
    if (tripletCount >= 2) {
        score += 2500; // Example score for two triplets
        allowReroll();
        return score; //allow reroll.
    }

    //three pairs
    const paircount = Object.values(selectedDice.reduce((acc, dice) => {
        acc[dice.value] = (acc[dice.value] || 0) + 1;
        return acc;
    }, {})).filter(count => count >= 2).length;
    if (paircount >= 3) {
        score += 1500; // Example score for three pairs
        allowReroll();
        return score; //allow reroll.
    }

    //straight
    const isStraight = selectedDice.length === 6 && selectedDice.every((dice, index) => dice.value === index + 1);
    if (isStraight) {
        score += 1500; // Example score for a straight
        allowReroll();
        return score; //allow reroll.
    }

    //six of a kind
    const sixOfAKind = Object.values(selectedDice.reduce((acc, dice) => {
        acc[dice.value] = (acc[dice.value] || 0) + 1; 
        return acc;
    }, {})).filter(count => count >= 6).length === 1;
    if (sixOfAKind) {
        score += 3000; // Example score for six of a kind
        allowReroll();
        return score; //allow reroll.
    }

    //five of a kind
    const fiveOfAKind = Object.values(selectedDice.reduce((acc, dice) => {
        acc[dice.value] = (acc[dice.value] || 0) + 1; 
        return acc;
    }, {})).filter(count => count >= 5).length === 1;
    if (sixOfAKind) {
        score += 3000; // Example score for six of a kind
    }

    //four of a kind. This was calculated above.
    if(fourOfAKind) {
        score += 1000; // Example score for four of a kind
    }

    //three of a kind
    const threeOfAKind = Object.values(selectedDice.reduce((acc, dice) => {
        acc[dice.value] = (acc[dice.value] || 0) + 1;
        return acc;
    }, {})).some(count => count === 3);
    if (threeOfAKind) {
        //sixes
        const sixCount = selectedDice.filter(dice => dice.value === 6).length;
        if (sixCount >= 3) {
            score += 600; // Example score for three sixes
        }
        //fives
        const fiveCount = selectedDice.filter(dice => dice.value === 5).length;
        if (fiveCount >= 3) {
            score += 500; // Example score for three sixes
        }
        //fours
        const fourCount = selectedDice.filter(dice => dice.value === 4).length;
        if (fourCount >= 3) {
            score += 400; // Example score for three fours
        }
        //threes
        const threeCount = selectedDice.filter(dice => dice.value === 3).length;
        if (threeCount >= 3) {
            score += 300; // Example score for three threes
        }
        //twos
        const twoCount = selectedDice.filter(dice => dice.value === 2).length;
        if (twoCount >= 3) {
            score += 200; // Example score for three twos
        }        
        //ones are calculated below.
    }

    //ones
    const oneCount = selectedDice.filter(dice => dice.value === 1).length;
    if (oneCount >= 1) {
        score += oneCount * 100; // Example score for ones
    }

    //fives
    const fiveCount = selectedDice.filter(dice => dice.value === 5).length;
    if (fiveCount >= 3) {
        score += (fiveCount - 3) * 50; // Example score for fives
    } else {
        score += fiveCount * 50; // Example score for one five
    }

    //if all the dice are selected and scored, allow reroll.
    // if (selectedDice.length === 6 && selectedDice.every(dice => dice.scored)) {
    //     allowReroll();
    // }

    return score;

}

class Turn {

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

class Player {
    constructor(name, id, nextPlayer = null, score = 0) {
        this.name = name;
        this.id = id;
        this.score = score;
        this.nextPlayer = null; // Initialize nextPlayer to null
    }

    async rollDice() {

        const diceContainer = document.getElementById('diceContainer');
        diceContainer.innerHTML = ''; // Clear previous dice

        const selectedDice = diceArr.filter(dice => dice.el.classList.contains('selected'));

        if (selectedDice.length === 0) {
            diceArr.length = 0; // Clear the dice array if no dice are selected
        } else {
            diceArr.length = 0; 
            selectedDice.forEach(dice => {
                diceArr.push(dice); // Keep only the selected dice
            });
        }

        selectedDice.forEach(dice => {
            dice.resolved = true; // Mark the dice as resolved
            dice.scored = true; // Mark the dice as scored  
            dice.el.classList.add('scored'); // Add a class to indicate the dice has been scored
        });

        const diceCount = 6 - selectedDice.length; // Number of dice to roll based minus selected dice
        
        for (let i = 0; i < diceCount; i++) {
            const dice = document.createElement('div');
            dice.className = 'dice';
            dice.id = `dice-${i + 1}`;
            const diceValue = Math.floor(Math.random() * 6) + 1; // Random number between 1 and 6
            const diceObj = new Dice(dice.id, dice, diceValue);
            diceArr.push(diceObj); // Add the Dice object to the array
        }

        // Wait for all dice to finish rolling
        await Promise.all(diceArr.filter(x=>!x.selected).map(dice => {
            dice.roll();
        }));

        // Initialize the dice
        diceArr.forEach(dice => {
            dice.init();
        });

    }
}

class Dice {
    constructor(id, el, value = '', selected = false, scored = false) {
        this.id = id;
        this.el = el;
        this.value = value;
        this.selected = selected;
        this.resolved = false; // Track if the dice has been resolved
        this.scored = scored;
    }

    init() {
        this.el.addEventListener('click', () => {
            this.select();
        });
        this.show();
    }

    select() {
        this.el.classList.toggle('selected');
        this.selected = !this.selected; // Toggle the selected state
        if(!this.selected) {
            this.scored = false; // Reset scored state if deselected
            this.el.classList.remove('scored'); // Remove scored class if deselected
        }
        activeTurn.calcScore(); // Calculate score for the active player for the turn
    }

    show() {
        if(this.selected || this.resolved){
            this.el.textContent = this.value;
        }
        const diceContainer = document.getElementById('diceContainer');
        diceContainer.appendChild(this.el);
    }

    roll() {
        return new Promise(resolve => {
            const rollDuration = Math.random() * 1000 + 500; // Random duration between 500ms and 1500ms
            this.el.classList.add('realistic-roll-animation');
            setTimeout(() => {
                this.el.textContent = this.value; // Update the displayed value
                this.el.classList.remove('realistic-roll-animation');
                this.el.style.transform = 'rotate(0deg)'; // Reset rotation to 0
                this.resolved = true; // Mark the dice as resolved
                this.show(); // Show the dice after rolling
                resolve(); // Resolve the promise when the roll is complete
            }, rollDuration);
        });
    }

}

function newTurn(player){
    const turn = new Turn(player);
    activeTurn = turn; //set the active turn.
    turn.showScore(); // Show the initial score
    document.getElementById('playersContainer').textContent = `${player.name}'s Turn`; // Update the current player display
}

function main() {
    if(window.location.hash === "#play") {
        const playerCount = parseInt(sessionStorage.getItem('playerCount'), 10); // Retrieve player count
        if (!playerCount || isNaN(playerCount)) {
            alert('Player count not set. Returning to startup.');
            window.location.href = "startup.html#startup";
            return;
        }

        for (let i = 1; i <= playerCount; i++) {
            const player = new Player(`Player ${i}`, i);
            players.push(player);
        }

        // Link players in a circular order
        players.forEach((player, index) => {
            player.nextPlayer = players[(index + 1) % players.length];
        });

        // Start the first player's turn
        newTurn(players[0]);
    }
}

$('#startBtn').click(() => {
    // Load play page
    window.location.href = "startup.html#startup"; 
});

$('#playBtn').click(() => {
    // Load play page
    const playerSelect = document.getElementById('playerCount');
    const playerCount = playerSelect.value;
    sessionStorage.setItem('playerCount', playerCount); // Store player count in sessionStorage
    window.location.href = "play.html#play";
});

$('#backBtn').click(() => {
    if(window.location.hash == "#play") {
        window.location.href = "startup.html#startup"; 
    }
    if(window.location.hash == "#startup") {
        window.location.href = "index.html"; 
    }
});

// Add event listener to the roll button
$('#rollBtn').click(async () => {
    $('#rollBtn').disabled = true; // Disable the button to prevent multiple clicks
    await activeTurn.player.rollDice();
    // Check for Farkle after all dice have rolled
    setTimeout(() => {
        checkFarkle();
        $('#rollBtn').disabled = false; // Disable the button to prevent multiple clicks
    }, 1000); // Delay to allow for the rolling animation to finish
});

// Add event listener to the roll button
$('#endTurnBtn').click(async () => {
    activeTurn.endTurn();
});

main();