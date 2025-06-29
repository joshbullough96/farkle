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
    
}