import { Dice } from './dice.js';
import { Roll } from './roll.js'; 

export class Turn {
    constructor(turnScore = 0, dice = null) {
        this.turnScore = turnScore;
        this.dice = dice || [];
        this.rolls = [];
        this.currentRoll = null;
    }

    async startTurn(player) {
        this.player = player;
        this.resetUI();
        this.resetTurn();
        this.dice = Dice.initAll(this);
        this.startNewRoll();
    }

    startNewRoll() {
        const rollNumber = this.rolls.length + 1;
        this.currentRoll = new Roll(rollNumber);
        this.rolls.push(this.currentRoll);
    }

    endTurn(farkle = false) {
        if (!farkle) {
            // Only add score to player's total if it wasn't a farkle
            if ((this.player.score + this.turnScore) < 500) {
                this.player.tempScore = 0;
                this.player.score = 0;
                this.player.showScore();
                alert('You did not score enough points, your score has been reset to zero.');
            } else {
                this.player.score += this.turnScore;
            }
        }
        this.startTurn(this.player.nextPlayer);
    }

    resetTurn() {
        this.turnScore = 0; // Reset the turn score
        this.dice = []; // Reset the dice property
    }
    
    resetUI() {
        const diceContainer = document.getElementById('diceContainer');
        diceContainer.innerHTML = ''; // Clear previous dice
        document.getElementById('playersContainer').textContent = `${this.player.name}'s Turn`; // Update the current player display
    }

    checkFarkle() {
        const unselectedDice = this.dice.filter(die => !die.selected && !die.scored);
        const hasOnes = unselectedDice.some(dice => dice.value === 1);
        const hasFives = unselectedDice.some(dice => dice.value === 5);
        const valueCounts = unselectedDice.reduce((acc, dice) => {
            acc[dice.value] = (acc[dice.value] || 0) + 1;
            return acc;
        }, {});
        
        const hasPairsOrMore = Object.values(valueCounts).some(count => count >= 3);
        const hasStraight = unselectedDice.length === 6 && 
            new Set(unselectedDice.map(d => d.value)).size === 6;

        return !(hasOnes || hasFives || hasPairsOrMore || hasStraight);
    }

    calcScore() {
        const allowReroll = () => {
            const cont = confirm('According to our calculations you can now reroll.');
            if (!cont) return;
            this.resetTurn(); // 'this' is correct here
        };

        let score = 0;

        // Calculate score based on the selected dice
        const selectedDice = this.dice.filter(dice => dice.selected && !dice.scored); // Only consider unscored selected dice that haven't been scored already.
        
        //four of a kind with a pair
        // Check for four of a kind and a pair (with different values)
        const valueCounts = selectedDice.reduce((acc, dice) => {
            acc[dice.value] = (acc[dice.value] || 0) + 1;
            return acc;
        }, {});
        const fourOfAKindValue = Object.keys(valueCounts).find(val => valueCounts[val] === 4);
        const pairValue = Object.keys(valueCounts).find(val => valueCounts[val] === 2 && val !== fourOfAKindValue);
        const fourOfAKind = !!fourOfAKindValue;
        const hasPair = !!pairValue;
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

        return score;

    }

    updateScore() {
        // Calculate score only for newly selected dice in the current roll
        const newScore = this.calcScore();
        
        if (newScore > 0) {
            // Mark the current roll's dice as scored
            this.currentRoll.markDiceAsScored();
            // Add the new score to the turn's total
            this.turnScore += newScore;
            // Update the player's temporary score display
            this.player.tempScore = this.turnScore;
            this.player.showScore();
        }
    }

}