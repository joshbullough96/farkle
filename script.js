// This is a basic JavaScript file template.
// You can add your JavaScript code below.
import { Game } from './game.js';
import { Player } from './player.js';
import { Turn } from './turn.js';
import { Wait } from './utilities.js';

async function main() {
    if(window.location.hash === "#play") {

        let activeTurn = null;
        const players = [];

        async function rotateTurn(isFarkle = false) {
            let player;
            if (activeTurn) {
                player = activeTurn.player.nextPlayer; // Get the current player
                activeTurn.endTurn(isFarkle); // End the current turn if it exists
                await Wait.delay(2000); // Wait for 2 seconds before starting the next turn
            } else {
                player = players[0]; // If no active turn, start with the first player
            }
            activeTurn = new Turn(); // Create new turn and set as active
            activeTurn.startTurn(player); // Start the turn for the player
        }

        const playerCount = parseInt(sessionStorage.getItem('playerCount'), 10); // Retrieve player count
        if (!playerCount || isNaN(playerCount)) {
            await Wait.delay(1000);
            Swal.fire({
                title: "Setup Error",
                text: `Player count not set. Returning to startup.`,
                icon: "info"
            });
            window.location.href = "startup.html#startup";
            return;
        }


        const scoreTo = parseInt(sessionStorage.getItem('scoreTo'), 10); // Retrieve score to amount
        if (!scoreTo || isNaN(scoreTo)) {
            await Wait.delay(1000);
            Swal.fire({
                title: "Setup Error",
                text: `No winning score selected. Returning to startup.`,
                icon: "info"
            });
            window.location.href = "startup.html#startup";
            return;
        }

        //start a new game
        const game = new Game(scoreTo);
        game.updateScoreToUI()

        for (let i = 1; i <= playerCount; i++) {
            const player = new Player(`Player ${i}`, i);
            players.push(player);
        }

        // Link players in a circular order
        players.forEach((player, index) => {
            player.nextPlayer = players[(index + 1) % players.length];
            player.game = game;
            player.showScore();
        });

        // Start the first player's turn
        rotateTurn();

        // Add event listener to the roll button
        $('#rollBtn').click(async () => {
            await activeTurn.rollDice();
            const farkle = activeTurn.checkFarkle();
            if(farkle) {
                const isFarkle = true;
                rotateTurn(isFarkle); // End the turn with Farkle
                // Create a new turn for the next player
                return;
            }
        });

        // Add event listener to the roll button
        $('#endTurnBtn').click(async () => {
            rotateTurn();
        });

    }
}

$('#startBtn').click(() => {
    // Load play page
    window.location.href = "startup.html#startup"; 
});

$('#playBtn').click(() => {
    // Load play page
    const playerCount = $('#playerCount').val();
    const scoreTo = $('#scoreRange').val();
    sessionStorage.setItem('playerCount', playerCount); // Store player count in sessionStorage
    sessionStorage.setItem('scoreTo', scoreTo); 
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

$('#scoreRange').on('input', function () {
    $('#selectedScore').text($(this).val());
});

main();