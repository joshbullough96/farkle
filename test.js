import { Turn } from './turn.js';
import { Roll } from './roll.js';
import readline from 'readline';

async function test(){
    // Simulate player and turn
    const player = { name: 'Test Player', score: 0, nextPlayer: null };
    const turn = new Turn();
    turn.startTurnConsole(player);

    // Simulate rolling dice
    let rolling = true;
    while (rolling) {
        rolling = await waitForEnter();
        if (!rolling) break;
        turn.startNewRollConsole();
        turn.dice.filter(die => !die.selected && !die.scored).forEach((die, index) => {
            // simulate 3 of a kind
            die.value = 6;
            if (index < 3) {
                die.selected = true; // Simulate selecting the die
            } else {
                die.selected = false; // Simulate not selecting the die
            }
        });
        const score = turn.updateScoreConsole();
        console.log(`Score for this roll: ${score}`);
        console.log('Current roll score:', turn.currentRoll.score);
        console.log('Turn score:', turn.turnScore);
        console.log('Total Score:', turn.player.score);
    }
    console.log('Turn', turn);
}

 // Simulate rolling dice on button press (Node.js doesn't have buttons, so use stdin)
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function waitForEnter() {
    return new Promise(resolve => {
        rl.question('Press Enter to roll dice (or type "q" to quit): ', (input) => {
            if (input.trim().toLowerCase() === 'q') {
                rl.close();
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

test();