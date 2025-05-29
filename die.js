export class Die {
    constructor(id, value = '', turn) {
        this.id = id;
        this.value = value;
        this.turn = turn; // Reference to the current turn
        this.rollNumber = null;  // Track which roll this die was selected in
        this.scored = false;     // Track if this die has been scored
    }

    createDieElementUI() {
        const die = document.createElement('div');
        die.className = 'die';
        die.classList.add('hidden'); // Initially hidden
        die.addEventListener('click', () => {
            this.select();
        });
        const diceContainer = document.getElementById('diceContainer');
        diceContainer.appendChild(die);
        return die;
    }

    init() {
        const dieElement = this.createDieElementUI();
        this.el = dieElement;
    }

    select() {
        if (this.scored) {
            return; // Don't allow re-selecting scored dice
        }
        
        this.el.classList.toggle('selected');
        this.selected = !this.selected; // Toggle the selected state
        
        if (this.selected) {
            // Add this die to the current roll when selected
            this.turn.currentRoll.addSelectedDie(this);
        } else {
            // Remove this die from the current roll when deselected
            this.turn.currentRoll.removeSelectedDie(this);
            this.scored = false;
            this.el.classList.remove('scored'); // Remove scored class if deselected
        }
        
        this.turn.updateScore(); // Calculate score for the active player for the turn
    }

    show() {
        if(this.selected || this.resolved){
            this.el.textContent = this.value;
        }
        this.el.classList.remove('hidden'); // Show the die
    }

    roll() {
        return new Promise(resolve => {
            const rollDuration = Math.random() * 1000 + 500; // Random duration between 500ms and 1500ms
            this.el.classList.add('realistic-roll-animation');
            setTimeout(() => {
                this.value = Math.floor(Math.random() * 6) + 1;
                this.el.textContent = this.value; // Update the displayed value
                this.el.classList.remove('realistic-roll-animation');
                this.el.style.transform = 'rotate(0deg)'; // Reset rotation to 0
                this.resolved = true; // Mark the die as resolved
                resolve(); // Resolve the promise when the roll is complete
            }, rollDuration);
        });
    }

    // calcScore() {
    //     const rollScore = activeTurn.calcScore(); // Calculate score for the active player for the turn
    //     activeTurn.player.tempScore = rollScore; // Set the temporary score for the player
    //     activeTurn.player.showScore(); // Update the player's score display
    // }
}