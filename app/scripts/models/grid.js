'use strict';

var _ = require('underscore');

function Grid(args) {
  this.columnCount = args.columnCount;
  this.rowCount = args.rowCount;
  // The columns array where columns containing placed chips are stored
  this.columns = [];
  this.resetGrid();
}

// Return true if the grid is completely full; otherwise, return false
Grid.prototype.checkIfFull = function () {
  var grid = this;
  return _.every(grid.columns, function (column) {
    return column.length === grid.rowCount;
  });
};

// Reset the grid by removing all placed chips
Grid.prototype.resetGrid = function () {
  this.columns.length = 0;
  for (var c = 0; c < this.columnCount; c += 1) {
    this.columns.push([]);
  }
};

// Return the index of the next available slot for the given column
Grid.prototype.getNextAvailableSlot = function (args) {
  var nextRowIndex = this.columns[args.column].length;
  if (nextRowIndex < this.rowCount) {
    return nextRowIndex;
  } else {
    // Return null if there are no more available slots in this column
    return null;
  }
};

// Place the given chip into the specified column on the grid
Grid.prototype.placeChip = function (args) {
  this.columns[args.column].push(args.chip);
  args.chip.column = args.column;
  args.chip.row = this.columns[args.column].length - 1;
};

// Find same-color neighbors connected to the given chip in the given direction
Grid.prototype.findConnectedNeighbors = function (chip, direction) {
  var neighbor = chip;
  var connectedNeighbors = [];
  while (true) {
    var nextColumn = neighbor.column + direction.x;
    // Stop if the left/right edge of the grid has been reached
    if (this.columns[nextColumn] === undefined) {
      break;
    }
    var nextRow = neighbor.row + direction.y;
    var nextNeighbor = this.columns[nextColumn][nextRow];
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

// Get all connections of four chips (including connections of four within
// larger connections) which the last placed chip is apart of
Grid.prototype.getConnections = function (args) {
  var grid = this;
  var connections = [];
  Grid.connectionDirections.forEach(function (direction) {
    var connection = [args.baseChip];
    // Check for connected neighbors in this direction
    connection.push.apply(connection, grid.findConnectedNeighbors(args.baseChip, direction));
    // Check for connected neighbors in the opposite direction
    connection.push.apply(connection, grid.findConnectedNeighbors(args.baseChip, {
      x: -direction.x,
      y: -direction.y
    }));
    if (connection.length >= args.connectionSize) {
      connections.push(connection);
    }
  });
  return connections;
};

// The relative directions to check when checking for connected chip neighbors
Grid.connectionDirections = [
  {x: 0, y: -1}, // Bottom-middle
  {x: -1, y: -1}, // Bottom-left
  {x: -1, y: 0}, // Left-middle
  {x: -1, y: 1} // Top-left
];

// Compute the grid's heuristic score for use by the AI player
Grid.prototype.getScore = function (currentPlayer, isMaxPlayer) {
  var gridScore = 0;
  var connections;
  var c, r;
  // The heuristic function needs to be fast, so use native loops
  for (c = 0; c < this.columnCount; c += 1) {
    for (r = 0; r < this.rowCount; r += 1) {
      // If grid slot is empty
      if (this.columns[c][r] === undefined) {
        // Search for connections of three or more chips that are connected to
        // the empty slot
        connections = this.getConnections({
          // We want getConnections() to find connections of three chips and an
          // empty slot, but to do so, we must pretend the empty slot is a chip
          baseChip: {column: c, row: r, player: currentPlayer},
          connectionSize: 4
        });
        gridScore += connections.length * (isMaxPlayer ? 1 : -1);
      } else {
        // Give player the maximum/minimum score if a connection of four or more
        // is found
        // Search for connections of three or more chips that are connected to
        // the empty slot
        connections = this.getConnections({
          baseChip: this.columns[c][r],
          connectionSize: 4
        });
        if (connections.length >= 1 && this.columns[c][r].player === currentPlayer) {
          if (isMaxPlayer) {
            gridScore = 1000;
          } else {
            gridScore = -1000;
          }
          return gridScore;
        }
      }
    }
  }
  return gridScore;
};

module.exports = Grid;
