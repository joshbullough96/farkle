export class Player {
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