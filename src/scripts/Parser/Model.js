export class Model {
  constructor() {
    this._grid = [];
    this._position = [];
    this._winning = [];
    this._totalWin = 0;
  }
  set reelGrid(grid) {
    this._grid = grid;
  }
  get reelGrid() {
    return this._grid;
  }

  set stopPosition(position) {
    this._position = position;
  }
  get stopPosition() {
    return this._position;
  }

  set winningPaylines(winning) {
    this._winning = winning;
  }

  get winningPaylines() {
    return this._winning;
  }

  set totalWin(win) {
    this._totalWin = win;
  }
  get totalWin() {
    return this._totalWin;
  }

  resetData() {
    this._grid = [];
    this._position = [];
    this._winning = [];
    this._totalWin = 0;
  }
}
