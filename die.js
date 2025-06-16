import { Wait } from './utilities.js'

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

    hasNoCombos() {

        // ones or fives
        if (this.value === 1 || this.value === 5) return false;

        // all dice that have not been banked.
        const unscoredDice = this.turn.dice.filter(die => !die.scored);

        const valueCounts = unscoredDice.reduce((acc, dice) => {
            acc[dice.value] = (acc[dice.value] || 0) + 1;
            return acc;
        }, {});

        const threeOfAKindPlusValue = Object.keys(valueCounts).find(val => valueCounts[val] >= 3 && this.value === parseInt(val));
        // is part of a 3 of a kind or higher
        const threeOfAKindPlus = !!threeOfAKindPlusValue;
        if (threeOfAKindPlus) {
            return false;
        }

        // is part of a straight
        const isStraight = unscoredDice === 6 && unscoredDice.every((dice, index) => dice.value === index + 1);
        if (isStraight) {
            return false;
        }

        // three pairs.
        const paircount = Object.keys(valueCounts).filter(val => valueCounts[val] === 2).length;
        if (paircount === 3) {
            return false;
        }

        // is a pair that is part of a four of a kind or higher or three pairs.
        const fourOfAKindValue = Object.keys(valueCounts).find(val => valueCounts[val] === 4);
        const fourOfAKind = !!fourOfAKindValue;
        if (fourOfAKind && paircount === 1) {
            return false
        }

        return true
    }



    select() {

        async function flashUI(el) {
            el.classList.add('flash-red-border');
            await Wait.delay(1350); //wait 1.35s
            el.classList.remove('flash-red-border');
        }

        if (this.scored) {
            return; // Don't allow re-selecting scored dice
        }

        if (!this.selected && this.hasNoCombos()) {
            flashUI(this.el);
            //flash a red border to denote no combinations.
            return; //Don't allow selecting because there are no combos.'
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
}