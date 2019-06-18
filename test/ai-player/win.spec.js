import utils from './utils.js';

import Game from '../../app/scripts/models/game.js';

describe('AI player', function () {

  it('should win horizontally on turn', function () {
    let game = new Game();
    game.setPlayers('1P');
    utils.placeChips({
      game: game,
      columns: [1, 2, 1, 3, 1, 1, 2, 4, 2]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(5);
  });

  it('should win vertically on turn', function () {
    let game = new Game();
    game.setPlayers('1P');
    utils.placeChips({
      game: game,
      columns: [3, 2, 3, 2, 5, 2, 4]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(2);
  });

  it('should win diagonally on turn', function () {
    let game = new Game();
    game.setPlayers('1P');
    utils.placeChips({
      game: game,
      columns: [1, 2, 3, 3, 2, 4, 4, 4, 5, 5, 5]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(5);
  });

});
