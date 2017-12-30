'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

var Emitter = require('tiny-emitter');
var Game = require('../../app/scripts/models/game');

describe('game', function () {

  // Place chips at the given columns in the given order
  function placeChips(args) {
    args.columns.forEach(function (column) {
      args.game.placePendingChip({column: column});
    });
  }

  it('should place pending chip', function () {
    var game = new Game();
    game.setPlayers(2);
    game.startGame();
    game.placePendingChip({column: 2});
    expect(game.grid.columns[2]).to.have.length(1);
    expect(game.grid.columns[2][0].player).to.equal(game.players[0]);
  });

  it('should win horizontally', function () {
    var game = new Game();
    game.setPlayers(2);
    game.startGame();
    sinon.spy(Emitter.prototype, 'emit');
    try {
      placeChips({
        game: game,
        columns: [2, 2, 3, 3, 4, 4, 5]
      });
      expect(Emitter.prototype.emit).to.have.been.calledWith('game:declare-winner');
    } finally {
      Emitter.prototype.emit.restore();
    }
    expect(game.winner).not.to.be.null;
    expect(game.winner.name).to.equal('Human 1');
  });

  it('should win vertically', function () {
    var game = new Game();
    game.setPlayers(2);
    game.startGame();
    sinon.spy(Emitter.prototype, 'emit');
    try {
      placeChips({
        game: game,
        columns: [0, 1, 0, 1, 0, 1, 0]
      });
      expect(Emitter.prototype.emit).to.have.been.calledWith('game:declare-winner');
    } finally {
      Emitter.prototype.emit.restore();
    }
    expect(game.winner).not.to.be.null;
    expect(game.winner.name).to.equal('Human 1');
  });

  it('should win diagonally', function () {
    var game = new Game();
    game.setPlayers(2);
    game.startGame();
    sinon.spy(Emitter.prototype, 'emit');
    try {
      placeChips({
        game: game,
        columns: [3, 4, 4, 3, 5, 5, 5, 6, 6, 6, 6]
      });
      expect(Emitter.prototype.emit).to.have.been.calledWith('game:declare-winner');
    } finally {
      Emitter.prototype.emit.restore();
    }
    expect(game.winner).not.to.be.null;
    expect(game.winner.name).to.equal('Human 1');
  });

  it('should win with two connect-fours at once', function () {
    var game = new Game();
    game.setPlayers(2);
    game.startGame();
    sinon.spy(Emitter.prototype, 'emit');
    try {
      placeChips({
        game: game,
        columns: [0, 1, 1, 1, 2, 2, 2, 0, 6, 5, 5, 5, 4, 4, 4, 3, 3, 3, 3]
      });
      expect(Emitter.prototype.emit).to.have.been.calledWith('game:declare-winner');
    } finally {
      Emitter.prototype.emit.restore();
    }
    expect(game.winner).not.to.be.null;
    expect(game.winner.name).to.equal('Human 1');
  });

  it('should win on connections of more than four', function () {
    var game = new Game();
    game.setPlayers(2);
    game.startGame();
    sinon.spy(Emitter.prototype, 'emit');
    try {
      placeChips({
        game: game,
        columns: [2, 2, 3, 3, 4, 4, 6, 6, 5]
      });
      expect(Emitter.prototype.emit).to.have.been.calledWith('game:declare-winner');
    } finally {
      Emitter.prototype.emit.restore();
    }
    expect(game.winner).not.to.be.null;
    expect(game.winner.name).to.equal('Human 1');
  });

  it('should end when grid becomes full', function () {
    var game = new Game();
    game.setPlayers(2);
    game.startGame();
    sinon.spy(Emitter.prototype, 'emit');
    try {
      placeChips({
        game: game,
        columns: [
          0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0,
          2, 3, 2, 3, 2, 3, 3, 2, 3, 2, 3, 2,
          4, 5, 4, 5, 4, 5, 5, 4, 5, 4, 5, 4,
          6, 6, 6, 6, 6, 6
        ]
      });
      expect(Emitter.prototype.emit).to.have.been.calledWith('game:declare-tie');
    } finally {
      Emitter.prototype.emit.restore();
    }
    expect(game.winner).to.be.null;
    expect(game.inProgress).to.be.false;
    expect(game.players[0].score).to.equal(0);
    expect(game.players[1].score).to.equal(0);
  });

});
