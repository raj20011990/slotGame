import * as PIXI from "pixi.js";
import gsap from "gsap";

import {
  dispatcher,
  Globals,
  MessageTextPosition,
  SymbolId,
  WinLinePanelConfig,
  WinTextPosition,
} from "../Core/Globals";

export class WinPanel {
  constructor() {
    this.container = new PIXI.Container();
    this.container.x = WinLinePanelConfig.x;
    this.container.y = WinLinePanelConfig.y;
    this._addEventListner();
    this._winLineText();
  }

  _addEventListner() {
    dispatcher.on(
      "SHOW_WIN_LINE_PRESENTATION",
      this._onShowWinLinePresentation.bind(this),
      this
    );
    dispatcher.on(
      "RESET_WIN_LINE_PRESENTATION",
      this._resetWinLinePresenatation.bind(this),
      this
    );
    dispatcher.on(
      "SHOW_IDLE_PRESENTATION",
      this._onIdlePresentation.bind(this),
      this
    );
  }

  _winLineText() {
    this.lineWinText = new PIXI.Text("", {
      font: "400 10pt Open Sans",
      fill: "black",
      align: "center",
    });
    this.totalWinText = new PIXI.Text(Globals.gameIdleText, {
      font: "400 10pt Open Sans",
      fill: "black",
      align: "center",
    });
    this.totalWinText.position.set(
      MessageTextPosition.x,
      MessageTextPosition.y
    );
    this.lineWinText.position.set(WinTextPosition.x, WinTextPosition.y);
    this.totalWinText.anchor.set(0.5, 0.5);
    this.lineWinText.anchor.set(0.5, 0.5);
    this.container.addChild(this.lineWinText);
    this.container.addChild(this.totalWinText);
  }
  _onShowWinLinePresentation(event) {
    const winningsObj = event.data;
    this.currentLineIndex = 0;
    this.totalWinText.text = Globals.gameTotalWinText + winningsObj.totalWin;
    this._playLineWin(winningsObj);
  }

  _playLineWin(winningsObj) {
    this.timer && clearTimeout(this.timer);
    if (Globals.line_win) {
      this.lineWinText.text =
        "Payline: " +
        winningsObj.winnings[this.currentLineIndex].payline +
        " Pays: " +
        winningsObj.winnings[this.currentLineIndex].payout +
        " of " +
        winningsObj.winnings[this.currentLineIndex].count +
        " x " +
        SymbolId[winningsObj.winnings[this.currentLineIndex].symbol];
    } else {
      this.lineWinText.text =
        "Symbol " +
        SymbolId[winningsObj.winnings[this.currentLineIndex].symbol] +
        " Pays: " +
        winningsObj.winnings[this.currentLineIndex].payout +
        " in " +
        winningsObj.winnings[this.currentLineIndex].offsets.length +
        " ways";
    }

    this.currentLineIndex++;
    if (this.currentLineIndex > this.model.winning.length - 1) {
      this.currentLineIndex = 0;
    }
    this.timer = setTimeout(
      this.playLineWin.bind(this),
      Globals.lineWinPresntationDelay
    );
  }

  _resetWinLinePresenatation() {
    this.timer && clearTimeout(this.timer);
    this.lineWinText.text = "";
    this.totalWinText.text = Globals.gameWaitText;
  }

  _onIdlePresentation() {
    this.totalWinText.text = Globals.gameIdleText;
  }
}
