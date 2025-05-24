export class Dice {
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