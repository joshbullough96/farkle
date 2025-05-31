export class Roll {
    constructor(rollNumber = 0) {
        this.rollNumber = rollNumber;
        this.selectedDice = [];
        this.score = 0;
        this.isScored = false;  // Flag to track if dice from this roll have been scored
    }

    addSelectedDie(die) {
        if (!this.selectedDice.includes(die)) {
            this.selectedDice.push(die);
            die.rollNumber = this.rollNumber; // Track which roll this die was selected in
        }
    }

    removeSelectedDie(die) {
        const index = this.selectedDice.indexOf(die);
        if (index > -1) {
            this.selectedDice.splice(index, 1);
            die.rollNumber = null;
        }
    }

    // calculateScore() {
    //     // Only calculate score for dice that were selected in this roll
    //     const diceFromThisRoll = this.selectedDice.filter(die => !die.scored);
    //     let score = 0;

    //     // Group dice by their values
    //     const valueCounts = diceFromThisRoll.reduce((acc, die) => {
    //         acc[die.value] = (acc[die.value] || 0) + 1;
    //         return acc;
    //     }, {});

    //     // Calculate score based on the combinations
    //     // (Using the same scoring logic as before, but only for dice from this roll)
    //     // ... scoring logic will be implemented in Turn class ...

    //     this.score = score;
    //     return score;
    // }

    // markDiceAsScored() {
    //     this.selectedDice.forEach(die => {
    //         die.scored = true;
    //         die.el.classList.add('scored'); // Add scored class to the die element
    //     });
    //     this.isScored = true;
    // }
    
}