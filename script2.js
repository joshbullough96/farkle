// This is a basic JavaScript file template.
// You can add your JavaScript code below.
import { Player } from '/player.js'
import { Turn } from '/turn.js'
import { Dice } from '/dice.js'

let activeTurn = null;
const players = [];

function newTurn(player){
    activeTurn = new Turn(); // Create new turn and set as active
    activeTurn.startTurn(player); // Start the turn for the player
}

function main() {
    if(window.location.hash === "#play") {
        const playerCount = parseInt(sessionStorage.getItem('playerCount'), 10); // Retrieve player count
        if (!playerCount || isNaN(playerCount)) {
            alert('Player count not set. Returning to startup.');
            window.location.href = "startup.html#startup";
            return;
        }

        for (let i = 1; i <= playerCount; i++) {
            const player = new Player(`Player ${i}`, i);
            players.push(player);
        }

        // Link players in a circular order
        players.forEach((player, index) => {
            player.nextPlayer = players[(index + 1) % players.length];
            player.showScore();
        });

        // Start the first player's turn
        newTurn(players[0]);
    }
}

$('#startBtn').click(() => {
    // Load play page
    window.location.href = "startup.html#startup"; 
});

$('#playBtn').click(() => {
    // Load play page
    const playerSelect = document.getElementById('playerCount');
    const playerCount = playerSelect.value;
    sessionStorage.setItem('playerCount', playerCount); // Store player count in sessionStorage
    window.location.href = "play.html#play";
});

$('#backBtn').click(() => {
    if(window.location.hash == "#play") {
        window.location.href = "startup.html#startup"; 
    }
    if(window.location.hash == "#startup") {
        window.location.href = "index.html"; 
    }
});

// Add event listener to the roll button
$('#rollBtn').click(async () => {
    $('#rollBtn').disabled = true; // Disable the button to prevent multiple clicks
    await Dice.rollDice(activeTurn); // Roll the dice for the active turn
    const farkle = activeTurn.checkFarkle(); // Check for Farkle condition
    if (farkle) {
        activeTurn.endTurn(true); // End the turn with Farkle
        return;
    }
    $('#rollBtn').disabled = false; // Disable the button to prevent multiple clicks
});

// Add event listener to the roll button
$('#endTurnBtn').click(async () => {
    activeTurn.endTurn();
});

main();