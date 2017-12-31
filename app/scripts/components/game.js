/* global ga:true */

import _ from 'underscore';
import m from 'mithril';
import classNames from 'classnames';
import Game from '../models/game';
import GridComponent from './grid';
import DashboardComponent from './dashboard';
import ScoreboardComponent from './scoreboard';

// The game UI, encompassing all UI pertaining to the game directly
var GameComponent = {};

GameComponent.oninit = function (vnode) {
  var game = new Game({
    // Only enable debug mode on non-production sites
    debug: (window.location.host !== 'projects.calebevans.me' && !window.__karma__)
  });
  var state = vnode.state;
  _.extend(state, {
    game: game,
    // Send the specified game data to the analytics server
    sendAnalytics: function (args) {
      if (typeof ga === 'function' && !game.debug) {
        ga('send', 'event', _.extend({
          eventCategory: game.humanPlayerCount === 1 ? '1-Player Game' : '2-Player Game'
        }, args));
      }
    }
  });
  // Configure hooks for analytics
  game.on('game:start', function () {
    state.sendAnalytics({eventAction: 'Start Game'});
  });
  game.on('game:end', function () {
    // The game ends automatically when a winner is declared or in the event of
    // a tie, but the game can also be ended at any time by the user; only
    // send analytics for when the user ends the game
    if (!game.winner && !game.grid.checkIfFull()) {
      state.sendAnalytics({eventAction: 'End Game (User)'});
    }
  });
  game.on('game:declare-winner', function (winner) {
    // Only send win analytics for 1-player games
    if (game.humanPlayerCount === 1) {
      state.sendAnalytics({
        eventAction: 'Win / Tie',
        eventLabel: winner.type === 'ai' ? 'AI Wins' : 'Human Wins',
        eventValue: game.grid.getChipCount(),
        nonInteraction: true
      });
    }
  });
  game.on('game:declare-tie', function () {
    if (game.humanPlayerCount === 1) {
      state.sendAnalytics({
        eventAction: 'Win / Tie',
        eventLabel: 'Tie',
        nonInteraction: true
      });
    }
  });
};

GameComponent.view = function (vnode) {
  return m('div#game', {
    class: classNames({'in-progress': vnode.state.game.inProgress})
  }, [
    m('div.game-column', [
      m('h1', 'Connect Four'),
      m(DashboardComponent, vnode.state)
    ]),
    m('div.game-column', [
      m(GridComponent, vnode.state),
      m(ScoreboardComponent, vnode.state)
    ])
  ]);
};

module.exports = GameComponent;
