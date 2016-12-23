'use strict';

var m = require('mithril');
var _ = require('underscore');
var Dashboard = require('./dashboard');
var Grid = require('./grid');
var Player = require('./player');
var Chip = require('./chip');

function Game(args) {
  this.grid = args.grid;
  this.players = [];
  // The current player is null when a game is not in progress
  this.currentPlayer = null;
  // Whether or not the game is in progress
  this.inProgress = false;
  // The chip above the grid that is about to be placed
  this.pendingChip = null;
  // The chip that was most recently placed in the board
  this.lastPlacedChip = null;
  // The winning player of the game
  this.winner = null;
}

Game.prototype.startGame = function (args) {
  // Create new players if there are none
  if (this.players.length === 0) {
    this.players.push(
        new Player({color: 'red', playerNum: 1}),
        new Player({color: 'blue', playerNum: 2})
    );
  }
  this.currentPlayer = this.players[0];
  this.inProgress = true;
  this.startTurn();
};

// End the game without resetting the grid
Game.prototype.endGame = function () {
  this.inProgress = false;
  this.currentPlayer = null;
  this.pendingChip = null;
};

// Start the turn of the current player
Game.prototype.startTurn = function () {
  this.pendingChip = new Chip({player: this.currentPlayer});
};

// End the turn of the current player and switch to the next player
Game.prototype.endTurn = function () {
  if (this.inProgress) {
    // Switch to next player's turn
    if (this.currentPlayer === this.players[0]) {
      this.currentPlayer = this.players[1];
    } else {
      this.currentPlayer = this.players[0];
    }
    this.startTurn();
  }
};

// Return the index of the next available row for the given column
Game.prototype.getNextAvailableSlot = function (args) {
  var nextRowIndex = this.grid.columns[args.column].length;
  if (nextRowIndex < this.grid.rowCount) {
    return nextRowIndex;
  } else {
    // Return null if thee are no more available slots in this column
    return null;
  }
};

// Insert the current pending chip into the columns array at the given index
Game.prototype.placePendingChip = function (args) {
  if (this.pendingChip) {
    this.grid.columns[args.column].push(this.pendingChip);
    this.lastPlacedChip = this.pendingChip;
    this.lastPlacedChip.column = args.column;
    this.lastPlacedChip.row = this.grid.columns[args.column].length - 1;
    this.pendingChip = null;
  }
};

// Find same-color neighbors connected to the given chip in the given direction
Game.prototype.findConnectedNeighbors = function (chip, direction) {
  var neighbor = chip;
  var connectedNeighbors = [];
  while (true) {
    var nextColumn = neighbor.column + direction.x;
    // Stop if the left/right edge of the grid has been reached
    if (this.grid.columns[nextColumn] === undefined) {
      break;
    }
    var nextRow = neighbor.row + direction.y;
    var nextNeighbor = this.grid.columns[nextColumn][nextRow];
    // Stop if the top/bottom edge of the grid has been reached or if the
    // neighboring slot is empty
    if (nextNeighbor === undefined) {
      break;
    }
    // Stop if this neighbor is not the same color as the original chip
    if (nextNeighbor.player !== chip.player) {
      break;
    }
    // Assume at this point that this neighbor chip is connected to the original
    // chip in the given direction
    neighbor = nextNeighbor;
    connectedNeighbors.push(nextNeighbor);
  }
  return connectedNeighbors;
};
// Determine if a player won the game with four chips in a row (horizontally,
// vertically, or diagonally)
Game.prototype.checkForWinner = function () {
  var game = this;
  _.forEach(Game.connectionDirections, function (direction) {
    var connectedChips = [game.lastPlacedChip];
    // Check for connected neighbors in this direction
    connectedChips.push.apply(connectedChips, game.findConnectedNeighbors(game.lastPlacedChip, direction));
    // Check for connected neighbors in the opposite direction
    connectedChips.push.apply(connectedChips, game.findConnectedNeighbors(game.lastPlacedChip, {
      x: -direction.x,
      y: -direction.y
    }));
    // If four connected same-color chips are found, mark them as highlighted
    if (connectedChips.length === 4) {
      game.winner = game.lastPlacedChip.player;
      _.forEach(connectedChips, function (neighbor) {
        neighbor.highlighted = true;
      });
      game.endGame();
      return;
    }
  });
};
// The relative directions to check when checking for connected chip neighbors
Game.connectionDirections = [
  {x: 0, y: -1}, // Bottom-middle
  {x: 1, y: -1}, // Bottom-right
  {x: 1, y: 0}, // Right-middle
  {x: 1, y: 1} // Top-right
];

// Reset the game and grid completely without starting a new game
Game.prototype.resetGame = function (args) {
  this.endGame();
  this.lastPlacedChip = null;
  this.winner = null;
  this.grid.resetGrid();
};

Game.Component = {};

Game.Component.controller = function () {
  return {
    game: new Game({
      grid: new Grid({
        columnCount: 7,
        rowCount: 6
      })
    })
  };
};

Game.Component.view = function (ctrl) {
  return [
    m(Dashboard.Component, ctrl.game),
    m(Grid.Component, ctrl.game)
  ];
};

module.exports = Game;
