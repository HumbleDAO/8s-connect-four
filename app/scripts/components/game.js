'use strict';

var m = require('mithril');
var Game = require('../models/game');
var GridComponent = require('./grid');
var DashboardComponent = require('./dashboard');
var ScoreboardComponent = require('./scoreboard');


var GameComponent = {};

GameComponent.controller = function () {
  return {
    game: new Game()
  };
};

GameComponent.view = function (ctrl) {
  return [
    m(DashboardComponent, ctrl.game),
    m(GridComponent, ctrl.game),
    m(ScoreboardComponent, ctrl.game)
  ];
};

module.exports = GameComponent;
