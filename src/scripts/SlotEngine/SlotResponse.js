import { Globals, dispatcher } from "../Core/Globals";
import { SlotMath } from "./SlotMath";

export class SlotResponse {
  constructor() {
    this._addEventListener();
  }

  _addEventListener() {
    dispatcher.on("INIT_REQUEST", this._processInitRequest.bind(this), this);
    dispatcher.on("SPIN_REQUEST", this._processSpinRequest.bind(this), this);
  }

  _processInitRequest() {
    const response = {};
    response.positions = [0, 0, 0, 0, 0];
    response.grid = this._processGrid(
      response.positions,
      SlotMath.reelSet,
      SlotMath.rowCount
    );
    response.type = "INIT";
    dispatcher.fireEvent("INIT_RESPONSE", response);
  }

  _processSpinRequest() {
    const response = {};
    // response.positions = [0, 0, 0, 0, 0];
    response.positions = this._processRNGposition(SlotMath.reelSet);
    response.grid = this._processGrid(
      response.positions,
      SlotMath.reelSet,
      SlotMath.rowCount
    );
    if (Globals.line_win) {
      response.winnings = this._calculateLineWinning(
        response.grid,
        SlotMath.payLines.length
      );
    } else {
      response.winnings = this._calculateWaysWinning(response.grid);
    }
    response.type = "SPIN";
    dispatcher.fireEvent("SPIN_RESPONSE", response);
  }

  _transpose(a) {
    return Object.keys(a[0]).map(function (c) {
      return a.map(function (r) {
        return r[c];
      });
    });
  }

  _calculateWaysWinning(grid, multiplier = 1) {
    let symbolList = [];
    for (var i = 0; i < grid.length; i++) {
      for (var j in grid[i]) {
        const symbol = Number(grid[i][j]);
        symbolList.push(symbol);
      }
    }
    symbolList = symbolList.filter((v, i, a) => a.indexOf(v) === i);
    let winnings = [];
    for (var s in symbolList) {
      const symbol = symbolList[s];
      let winSymbolOffsets = [];
      let currentSymbolOffsets = [];
      let flag = false;
      for (var col = 0; col < grid.length; col++) {
        for (var row = 0; row < grid[col].length; row++) {
          let currentSymbol = Number(grid[col][row]);
          if (currentSymbol == symbol) {
            if (col == 0) {
              currentSymbolOffsets.push("n," + (row * grid.length + col));
            } else {
              for (var o in winSymbolOffsets) {
                let offset = winSymbolOffsets[o];
                offset = offset + "," + (row * grid.length + col);
                currentSymbolOffsets.push(offset);
              }
            }
            flag = true;
          }
        }
        if (flag) {
          winSymbolOffsets = [];
          winSymbolOffsets = winSymbolOffsets.concat(currentSymbolOffsets);

          currentSymbolOffsets = [];
          flag = false;
        } else {
          break;
        }
      }
      const symbolWinning = this._detectWaysWins(
        symbol,
        winSymbolOffsets,
        multiplier
      );
      if (symbolWinning.length > 0) {
        winnings = winnings.concat(symbolWinning);
      }
    }
    return winnings;
  }

  _detectWaysWins(symbol, winSymbolOffsets = [], multiplier = 1) {
    let symbolWinnings = [];
    let symbolOffset = [];
    let symbolWin = 0;
    const winSymbolPosition = [];

    for (var o in winSymbolOffsets) {
      const offset = winSymbolOffsets[o];
      let offsetList = offset.split(",").splice(1, offset.split(",").length);
      const payout = SlotMath.payTable[symbol][offsetList.length - 1];

      if (payout > 0) {
        for (var i in offsetList) {
          if (!winSymbolPosition.includes(Number(offsetList[i]))) {
            winSymbolPosition.push(Number(offsetList[i]));
          }
        }

        symbolOffset.push(offsetList);
        symbolWin += payout;
      }
    }
    winSymbolPosition.length &&
      winSymbolPosition.sort(function (a, b) {
        return a - b;
      });
    if (symbolWin > 0) {
      symbolWin = symbolWin * multiplier;
      symbolWinnings.push({
        symbol: symbol,
        offsets: symbolOffset,
        payout: symbolWin,
        winSymbolPosition: winSymbolPosition,
      });
    }

    return symbolWinnings;
  }

  _calculateLineWinning(grid, linesCount, multiplier = 1) {
    let winnings = [];
    for (var line = 0; line < linesCount; line++) {
      const win = this._detectLineWin(grid, line, multiplier);
      if (win.payout > 0) {
        winnings.push(win);
      }
    }
    return winnings;
  }

  _detectLineWin(grid, line, multiplier = 1) {
    let symbolCount = 0;
    let symbolID = -1;
    let payLine = SlotMath.payLines[line];
    let reelsCount = grid.length;

    for (var column = 0; column < reelsCount; column++) {
      const row = payLine[column];
      const currSymbolID = Number(grid[column][row]);
      if (symbolID == -1) {
        symbolCount++;
        symbolID = currSymbolID;
        continue;
      }

      if (symbolID == currSymbolID) {
        symbolCount++;
      } else {
        break;
      }
    }

    let symbolWin = 0;
    if (symbolID > -1 && symbolCount > 0) {
      symbolWin = SlotMath.payTable[symbolID][symbolCount - 1];
    }

    let winSymbolID = symbolID;
    let winSymbolCount = symbolCount;
    let winSymbolPayout = symbolWin;

    let offsets = [];
    for (var i = 0; i < winSymbolCount; i++) {
      offsets.push(payLine[i] * reelsCount + i);
    }

    return {
      symbol: winSymbolID,
      payline: line + 1,
      count: winSymbolCount,
      payout: winSymbolPayout * multiplier,
      offsets: offsets,
    };
  }
  _processGrid(stops, reelSet, rowCount) {
    let symbolGrid = [];
    for (let col = 0; col < rowCount.length; col++) {
      let index = stops[col];
      let reel = [];
      const len = rowCount[col];
      for (var row = 0; row < len; row++) {
        reel.push(reelSet[col][index]);
        index = index + 1;
        index = index % reelSet[col].length;
      }
      symbolGrid.push(reel);
    }
    return symbolGrid;
  }

  _processRNGposition(reelSet) {
    const position = Array.from(new Array(reelSet.length), (value, i) =>
      Math.floor(Math.random() * reelSet[i].length)
    );
    return position;
  }
}
