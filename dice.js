import { Die } from './die.js';

// Dice is now a utility class with static methods
export class Dice {
    // Initializes a new set of dice, keeping selected dice from the previous roll
    static initAll(turn, existingDice = []) {
        let dice = [];
        let diceCount = 0;

        if (existingDice.length > 0) {
            // Keep only selected dice and mark them as resolved
            dice = existingDice.filter(die => die.selected);
            dice.forEach(die => die.resolved = true);
        }

        diceCount = 6 - dice.length;

        for (let i = 0; i < diceCount; i++) {
            const id = `dice-${i + 1}`;
            const value = Math.floor(Math.random() * 6) + 1;
            const dieObj = new Die(id, value, turn);
            dice.push(dieObj);
        }

        dice.forEach(die => die.init());
        return dice;
    }

    // Rolls all unselected dice in the array, returns a promise that resolves when all are done
    static async rollDice(diceArr) {
        diceArr.forEach(die => {
            die.show();
        });
        //const vals = [2, 2, 3, 3, 4, 6];
        await Promise.all(diceArr.filter(die => !die.selected).map((die, index) => die.roll())); //for testing: vals[index]
    }

    // Returns only the selected dice from the array
    static getSelected(diceArr) {
        return diceArr.filter(die => die.selected);
    }

    // Returns only the unselected dice from the array
    static getUnselected(diceArr) {
        return diceArr.filter(die => !die.selected);
    }

    // Resets all dice in the array to their default state (not selected, not scored, not resolved)
    static resetAll(diceArr) {
        diceArr.forEach(die => {
            die.selected = false;
            die.scored = false;
            die.resolved = false;
            die.el.classList.remove('selected', 'scored');
        });
    }

    // Updates the UI to show all dice in the array in the dice container
    static updateUI(diceArr) {
        const diceContainer = document.getElementById('diceContainer');
        diceContainer.innerHTML = '';
        diceArr.forEach(die => die.show());
    }
}