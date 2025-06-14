// JavaScript source code
export class Game {
    constructor(scoreTo) {
        this.scoreTo = scoreTo;
    }

    updateScoreToUI() {
        $('#scoreTo').text(this.scoreTo);
    }
}