(function() {

var GameComponent = {
  controller: function () {},
  view: function (ctrl) {
    return [
      m(GameGridComponent, new GameGrid({
          columnCount: 7,
          rowCount: 6,
          chipSize: 50,
          chipMargin: 6
        })
      )
    ];
  }
};

function GameGrid(args) {
  this.columnCount = args.columnCount;
  this.rowCount = args.rowCount;
  this.chipSize = args.chipSize;
  this.chipMargin = args.chipMargin;
}

var GameGridComponent = {
  controller: function () {
    return {
      getGridStyle: function (grid) {
        var gridWidth = grid.columnCount * (grid.chipSize + (grid.chipMargin * 2));
        var gridHeight = grid.rowCount * (grid.chipSize + (grid.chipMargin * 2));
        return {
          width: gridWidth + 'px',
          height: gridHeight + 'px'
        };
      },
      getChipStyle: function (c, r, grid) {
        var chipX = c * (grid.chipSize + (grid.chipMargin * 2)) + grid.chipMargin;
        var chipY = r * (grid.chipSize + (grid.chipMargin * 2)) + grid.chipMargin;
        return {
          width: grid.chipSize + 'px',
          height: grid.chipSize + 'px',
          transform: 'translate(' + chipX + 'px,' + chipY + 'px)'
        };
      }
    };
  },
  view: function (ctrl, grid) {
    return m('div', {id: 'grid', style: ctrl.getGridStyle(grid)},
      _.times(grid.columnCount, function (c) {
        return m('div', {class: 'column'}, _.times(grid.rowCount, function (r) {
          return m('div', {
            key: 'chip-' + c + '-' + r,
            class: 'chip-placeholder',
            style: ctrl.getChipStyle(c, r, grid)
          });
        }));
      })
    );
  }
};

m.mount(document.getElementById('game'), GameComponent);

}());
