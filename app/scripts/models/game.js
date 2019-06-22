import Emitter from 'tiny-emitter';
import Grid from './grid.js';
import HumanPlayer from './human-player.js';
import AIPlayer from './ai-player.js';
import Chip from './chip.js';

// A game between two players; the same Game instance is re-used for successive
// rounds
class Game extends Emitter {

  constructor({ grid = new Grid({ columnCount: 7, rowCount: 6 }), players = [], debug = false } = {}) {
    super();
    // The two-dimensional array representing the entire game grid
    this.grid = grid;
    // The list of all players for this game
    this.players = players;
    // The type of game (e.g. 1-Player, 2-Player, or Online)
    this.type = null;
    // The current player is null when a game is not in progress
    this.currentPlayer = null;
    // Whether or not the game is in progress
    this.inProgress = false;
    // The chip above the grid that is about to be placed
    this.pendingChip = null;
    // The winning player of the game
    this.winner = null;
    // Keep track of the columns where chips are placed in debug mode (extremely
    // useful for creating new unit tests from real games)
    if (debug) {
      this.debug = true;
      this.columnHistory = [];
    } else {
      this.debug = false;
    }
  }

  startGame({ startingPlayer } = {}) {
    if (startingPlayer) {
      this.currentPlayer = startingPlayer;
    } else {
      this.currentPlayer = this.players[0];
    }
    this.inProgress = true;
    this.emit('game:start');
    this.startTurn();
  }

  // End the game without resetting the grid
  endGame() {
    if (this.winner) {
      this.winner.score += 1;
    }
    this.inProgress = false;
    this.currentPlayer = null;
    this.pendingChip = null;
    this.emit('game:end');
    this.type = null;
    if (this.debug) {
      this.columnHistory.length = 0;
    }
  }

  // Reset the game and grid completely without starting a new game (endGame
  // should be called somewhere before this method is called)
  resetGame() {
    this.winner = null;
    this.grid.resetGrid();
  }

  // Initialize or change the current set of players
  setPlayers({ gameType }) {
    // Instantiate new players as needed (if user is about to play the first game
    // or if the user is switching modes)
    if (this.players.length === 0) {
      if (gameType === '1P') {
        // If user chose 1-Player mode, the user will play against the AI
        this.players.push(new HumanPlayer({ name: 'Human', color: 'red' }));
        this.players.push(new AIPlayer({ name: 'Mr. A.I.', color: 'black' }));
      } else if (gameType === '2P') {
        // If user chooses 2-Player mode, the user will play against another
        // human
        this.players.push(new HumanPlayer({ name: 'Human 1', color: 'red' }));
        this.players.push(new HumanPlayer({ name: 'Human 2', color: 'blue' }));
      }
    } else if (gameType !== this.type) {
      // If user switches game type (e.g. from 1-Player to 2-Player mode),
      // recreate set of players
      this.players.length = 0;
      this.setPlayers({ gameType });
      return;
    }
    this.type = gameType;
  }

  // Retrieve the player that isn't the given player
  getOtherPlayer(player) {
    if (player === this.players[0]) {
      return this.players[1];
    } else {
      return this.players[0];
    }
  }

  // Start the turn of the current player
  startTurn() {
    this.pendingChip = new Chip({ player: this.currentPlayer });
    if (this.currentPlayer.getNextMove) {
      this.currentPlayer.getNextMove({ game: this }).then((nextMove) => {
        this.emit('async-player:get-next-move', this.currentPlayer, nextMove);
      });
    }
  }

  // End the turn of the current player and switch to the next player
  endTurn() {
    if (this.inProgress) {
      // Switch to next player's turn
      this.currentPlayer = this.getOtherPlayer(this.currentPlayer);
      this.startTurn();
    }
  }

  // Insert the current pending chip into the columns array at the given index
  placePendingChip({ column }) {
    this.grid.placeChip({
      chip: this.pendingChip,
      column
    });
    if (this.debug) {
      this.columnHistory.push(column);
      // The column history will only be logged on non-production sites, so we
      // can safely disable the ESLint error
      // eslint-disable-next-line no-console
      console.log(this.columnHistory.join(', '));
    }
    this.pendingChip = null;
    // Check for winning connections (i.e. four in a row)
    this.checkForWin();
    // Check if the grid is completely full
    this.checkForTie();
    // If the above checks have not ended the game, continue to next player's
    // turn
    this.endTurn();
  }

  // Check if the game has tied, and end the game if it is
  checkForTie() {
    if (this.grid.checkIfFull()) {
      this.emit('game:declare-tie');
      this.endGame();
    }
  }

  // Determine if a player won the game with four chips in a row (horizontally,
  // vertically, or diagonally)
  checkForWin() {
    let connections = this.grid.getConnections({
      baseChip: this.grid.lastPlacedChip,
      minConnectionSize: 4
    });
    if (connections.length > 0) {
      // Mark chips in only the first winning connection, and // only mark the
      // first four chips of this connection (since only a // connect-four is
      // needed to win
      connections[0].length = 4;
      connections[0].forEach((chip) => {
        chip.winning = true;
      });
      this.winner = this.grid.lastPlacedChip.player;
      this.emit('game:declare-winner', this.winner);
      this.endGame();
    }
  }

}

export default Game;
