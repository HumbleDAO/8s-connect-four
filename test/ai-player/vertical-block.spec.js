import utils from './utils.js';

import Game from '../../app/scripts/models/game.js';

describe('AI player', function () {

  it('should block vertical opponent win (#1)', function () {
    let game = new Game();
    game.setPlayers('1P');
    utils.placeChips({
      game,
      columns: [3, 2, 3, 2, 3]
    });
    game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).to.equal(3);
    });
  });

  it('should block vertical opponent win (#2)', function () {
    let game = new Game();
    game.setPlayers('1P');
    utils.placeChips({
      game,
      columns: [2, 0, 4, 3, 3, 0, 4, 0, 0, 2, 4]
    });
    game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).to.equal(4);
    });
  });

  it('should block vertical opponent win (#3)', function () {
    let game = new Game();
    game.setPlayers('1P');
    utils.placeChips({
      game,
      columns: [0, 3, 4, 4, 5, 4, 5, 4, 5, 5, 4, 5, 3, 3, 3, 3, 3, 4, 0, 5, 0]
    });
    game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).to.equal(0);
    });
  });

  it('should block vertical opponent win (#4)', function () {
    let game = new Game();
    game.setPlayers('1P');
    utils.placeChips({
      game,
      columns: [2, 3, 4, 3, 3, 3, 1, 2, 4, 5, 2, 4, 0, 2, 0, 3, 0, 0, 5, 0, 5, 0, 5]
    });
    game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).to.equal(5);
    });
  });

});
