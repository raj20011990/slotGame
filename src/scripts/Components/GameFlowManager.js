import { dispatcher, Globals } from "../Core/Globals";

export class GameFlowManager {
  constructor(model) {
    this.model = model;
    this._addEventListner();
  }

  _addEventListner() {
    dispatcher.on("SPIN_BUTTON_CLICKED", this._spinButtonClicked.bind(this));
    dispatcher.on(
      "REEL_STOPPED",
      this._onReelStopped.bind(this)
    );
  }

  _spinButtonClicked() {
    if (!Globals.spinButtonClicked) {
      Globals.spinButtonClicked = true;
      dispatcher.fireEvent("UPDATE_SPIN_BUTTON_STATE", false);
      dispatcher.fireEvent("RESET_WIN_LINE_PRESENTATION");
      this.model.resetData();
      dispatcher.fireEvent("SPIN_REQUEST");
    }
  }
  _onReelStopped() {
    Globals.spinButtonClicked = false;
      dispatcher.fireEvent("UPDATE_SPIN_BUTTON_STATE", true);
      dispatcher.fireEvent("UPDATE_SYMBOL_GRID");
      if (this.model.totalWin) {
        const winningObj = {
          winnings: this.model.winningPaylines,
          totalWin: this.model.totalWin
        }
        dispatcher.fireEvent("SHOW_WIN_LINE_PRESENTATION", winningObj);
      } else {
        dispatcher.fireEvent("SHOW_IDLE_PRESENTATION");
      }
  }
}
