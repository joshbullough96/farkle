import { Dice } from './dice.js';
import { Roll } from './roll.js'; 
import { Wait } from './utilities.js';

export class Turn {
    constructor(turnScore = 0, dice = null) {
        this.turnScore = turnScore;
        this.dice = dice || [];
        this.rolls = [];
        this.currentRoll = null;
        this.selectedDice = [];
    }
    
    startTurn(player) {
        if(this.player && this.player.isWinner) {
            Swal.fire({
                title: "Game Over",
                text: `${this.player.name} has already won the game!`,
                icon: "warning"
            });
            return;
        }
        this.player = player;
        this.resetTurn(); // Reset the turn state
        this.resetUI();
        this.dice = Dice.initAll(this);
    }

    startNewRoll() {
        // If there's a current roll, finalize its score before starting new roll
        if (this.currentRoll) {
            const score = this.currentRoll.score;
            this.markDiceAsScored(); // Mark dice from previous roll as scored
            this.turnScore += score; // Add the score to turn total
        }

        const rollNumber = this.rolls.length + 1;
        this.currentRoll = new Roll(rollNumber);
        this.rolls.push(this.currentRoll);
    }

    async rollDice() {
        if(this.currentRoll && this.currentRoll.rollNumber > 0 && (this.selectedDice.length === 0 || this.selectedDice.every(die => die.scored))) {
            Swal.fire({
                title: "Not allowed",
                text: "You must select at least one die to roll.",
                icon: "warning"
            });
            return false;
        }
        if (this.player.isWinner) {
            await Swal.fire({
                title: "Game Over",
                text: `${this.player.name} has already won the game!`,
                icon: "warning"
            });
            return false;
        }
        this.startNewRoll();
        await Dice.rollDice(this.dice);
        return true;
    }

    async endTurn(farkle = false) {
        if (farkle) {
            this.player.tempScore = 0; // Reset temporary score
            this.player.showScore();
            //wait for the alert to be answered before resetting.
            await Swal.fire({
                title: "Farkle!",
                text: "You did not score any points this turn.",
                icon: "warning"
            });
            this.resetUI();
            return;
        }

        // Mark the final roll's dice as scored and add its score
        if (this.currentRoll && this.currentRoll.score > 0) {
            this.markDiceAsScored(); // Mark the dice as scored
            this.turnScore += this.currentRoll.score;
        }

        // Only add score to player's total if it wasn't a farkle
        if ((this.player.score + this.turnScore) < 500) {
            this.player.tempScore = 0;
            this.player.score = 0;
            this.player.showScore();
            //wait for the alert to be answered before resetting.
            await Swal.fire({
                title: "Uh Oh!",
                text: "You did not score enough points, your score has been reset to zero.",
                icon: "warning"
            });
            this.resetUI();
            return;
        }

        //add the turn score to the player's total score if it is greater than 500 and not a farkle.
        this.player.score += this.turnScore;
        // wait 1 second before clearing the dice.
        await Wait.delay(1000);
        this.resetUI(); 
    }
    

    resetTurn(reroll = false) {
        if (!reroll) {
            this.turnScore = 0; // Reset the turn score
        }
        this.dice = []; // Reset the dice property
    }
    
    resetUI() {
        const diceContainer = document.getElementById('diceContainer');
        diceContainer.innerHTML = ''; // Clear previous dice
        document.getElementById('playerTurn').textContent = `${this.player.name}'s Turn`; // Update the current player display
    }

    checkFarkle() {
        const unselectedDice = this.dice.filter(die => !die.selected && !die.scored);
        const hasOnes = unselectedDice.some(dice => dice.value === 1);
        const hasFives = unselectedDice.some(dice => dice.value === 5);
        const valueCounts = unselectedDice.reduce((acc, dice) => {
            acc[dice.value] = (acc[dice.value] || 0) + 1;
            return acc;
        }, {});
        
        const hasThreeOfAKindPlus = Object.values(valueCounts).some(count => count >= 3);
        const hasThreePairs = Object.values(valueCounts).filter(count => count === 2).length >= 3;
        const hasStraight = unselectedDice.length === 6 && 
            new Set(unselectedDice.map(d => d.value)).size === 6;

        return !(hasOnes || hasFives || hasThreeOfAKindPlus || hasThreePairs || hasStraight);
    }

    calcScore() {

        // need to fix reroll logic so it will allow rerolling multiple times and not zero out the score.
        // need to check the four of a kind, five of a kind, six of a kind, and straight logic.

        const allowReroll = async () => {
            // wait for the alert to be answered before resetting.
            await Swal.fire({
                title: "Hot Dice!",
                text: "Congrats you get to roll again.",
                icon: "success"
            });
            const reroll = true;
            this.resetTurn(reroll); // 'this' is correct here
            this.resetUI();
            this.dice = Dice.initAll(this);
        };

        let score = 0;
        let tempScored = [];

        // Calculate score based on the selected dice
        this.selectedDice = this.dice.filter(dice => dice.selected && !dice.scored); // Only consider unscored selected dice that haven't been scored already.
        
        //four of a kind with a pair
        // Check for four of a kind and a pair (with different values)
        const valueCounts = this.selectedDice.reduce((acc, dice) => {
            acc[dice.value] = (acc[dice.value] || 0) + 1;
            return acc;
        }, {});

        const fourOfAKindValue = Object.keys(valueCounts).find(val => valueCounts[val] === 4);
        const fourOfAKind = !!fourOfAKindValue;

        const pairValue = Object.keys(valueCounts).find(val => valueCounts[val] === 2 && val !== fourOfAKindValue);
        const hasPair = !!pairValue;

        if (fourOfAKind && hasPair) { 
            score += 1500; // Example score for four of a kind with a pair
            allowReroll();
            return score; //allow reroll.
        }

        //two triplets
        const tripletCount = Object.keys(valueCounts).filter(val => valueCounts[val] === 3).length;

        if (tripletCount >= 2) {
            score += 2500; // Example score for two triplets
            allowReroll();
            return score; //allow reroll.
        }

        //three pairs
        const paircount = Object.keys(valueCounts).filter(val => valueCounts[val] === 2).length;

        if (paircount >= 3) {
            score += 1500; // Example score for three pairs
            allowReroll();
            return score; //allow reroll.
        }

        //straight
        const isStraight = this.selectedDice.length === 6 && this.selectedDice.sort((a, b) => a.value - b.value).every((dice, index) => dice.value === index + 1);
        if (isStraight) {
            score += 1500; // Example score for a straight
            allowReroll();
            return score; //allow reroll.
        }

        //six of a kind
        const sixOfAKindValue = Object.keys(valueCounts).find(val => valueCounts[val] === 6);
        const sixOfAKind = !!sixOfAKindValue;
        // Object.values(this.selectedDice.reduce((acc, dice) => {
        //     acc[dice.value] = (acc[dice.value] || 0) + 1; 
        //     return acc;
        // }, {})).filter(count => count >= 6).length === 1;
        if (sixOfAKind) {
            score += 3000; // Example score for six of a kind
            allowReroll();
            return score; //allow reroll.
        }

        //five of a kind
        const fiveOfAKindValue = Object.keys(valueCounts).find(val => valueCounts[val] === 5);
        const fiveOfAKind = !!fiveOfAKindValue; // Check if there is a five of a kind
        if (fiveOfAKind) {
            tempScored.push(...this.selectedDice.filter(die => die.value === fiveOfAKindValue).map(die => die.id));
            score += 3000; // Example score for five of a kind
        }

        //four of a kind. This was calculated above.
        if(fourOfAKind) {
            tempScored.push(...this.selectedDice.filter(die => die.value === fourOfAKindValue).map(die => die.id));
            score += 1000; // Example score for four of a kind
        }

        //three of a kind
        const threeOfAKindValue = Object.keys(valueCounts).find(val => valueCounts[val] === 3);
        const threeOfAKind = !!threeOfAKindValue; // Check if there is a three of a kind

        if (threeOfAKind) {
            // console.log(`Three of a kind found: ${threeOfAKindValue}`);
            //sixes           
            if (threeOfAKindValue == 6) {
                tempScored.push(...this.selectedDice.filter(dice => dice.value === 6).map(die => die.id));
                score += 600; // Example score for three sixes
            }
            //fives
            // const fiveCount = this.selectedDice.filter(dice => dice.value === 5).length;
            if (threeOfAKindValue == 5) {
                tempScored.push(...this.selectedDice.filter(dice => dice.value === 5).map(die => die.id));
                score += 500; // Example score for three fives
            }
            //fours
            // const fourCount = this.selectedDice.filter(dice => dice.value === 4).length;
            // fourCount >= 3
            if (threeOfAKindValue == 4) {
                tempScored.push(...this.selectedDice.filter(dice => dice.value === 4).map(die => die.id));
                score += 400; // Example score for three fours
            }
            //threes
            // const threeCount = this.selectedDice.filter(dice => dice.value === 3).length;
            if (threeOfAKindValue == 3) {
                tempScored.push(...this.selectedDice.filter(dice => dice.value === 3).map(die => die.id));
                score += 300; // Example score for three threes
            }
            //twos
            // const twoCount = this.selectedDice.filter(dice => dice.value === 2).length;
            if (threeOfAKindValue == 2) {
                tempScored.push(...this.selectedDice.filter(dice => dice.value === 2).map(die => die.id));
                score += 200; // Example score for three twos
            }
            //ones are calculated below.
        }   

        //ones
        const oneCount = this.selectedDice.filter(dice => dice.value === 1).length;
        if(oneCount < 4) {
            tempScored.push(...this.selectedDice.filter(dice => dice.value === 1).map(die => die.id));
            score += oneCount * 100; // Example score for one one
        }

        //fives
        const fiveCount = this.selectedDice.filter(dice => dice.value === 5).length;
       
        if(fiveCount < 3){
            tempScored.push(...this.selectedDice.filter(dice => dice.value === 5).map(die => die.id));
            score += fiveCount * 50; // Example score for one five
        } 

        tempScored = [...new Set(tempScored)]; // Remove duplicates

        if((this.dice.filter(dice => dice.scored).length + tempScored.length) === 6) {
            allowReroll(); // Reset the turn state
        }

        return score;

    }
    
    updateScore() {
        // Calculate score only for newly selected dice in the current roll
        const newScore = this.calcScore();
        this.currentRoll.score = newScore;
        this.player.tempScore = this.turnScore + newScore;
        this.player.showScore();
    }

    markDiceAsScored() {
        this.selectedDice.forEach(die => {
            die.scored = true;
            die.el.classList.add('scored'); // Add scored class to the die element
        });
        this.isScored = true;
    }

}