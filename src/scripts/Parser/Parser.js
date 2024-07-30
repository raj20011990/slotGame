import { dispatcher, Globals } from "../Core/Globals";

export class Parser {
  constructor(model) {
    this.model = model;
    this._addEventListener();
  }

  _addEventListener() {
    dispatcher.on("INIT_RESPONSE", this._processInitResponse.bind(this));
    dispatcher.on("SPIN_RESPONSE", this._processSpinResponse.bind(this));
  }

  _processInitResponse(event) {
    console.log(event.data);
    this.model.reelGrid = event.data.grid;
    this.model.stopPosition = event.data.positions;
    Globals.initResponseReceived = true;
  }

  _processSpinResponse(event) {
    this.model.reelGrid = event.data.grid;
    this.model.stopPosition = event.data.positions;
    let totalWin = 0;
    if (event.data.winnings.length) {
      this.model.winningPaylines = event.data.winnings;
      event.data.winnings.forEach((element) => {
        totalWin += element.payout;
      });
    }
    this.model.totalWin = totalWin;
    Globals.spinResponseReceived = true;
    this.timer && clearTimeout(this.timer);
    this.timer = setTimeout(
      this._delayTimerforSpinResponse,
      Globals.serverResponseWaitTimer
    );
  }

  _delayTimerforSpinResponse() {
    this.timer && clearTimeout(this.timer);
    dispatcher.fireEvent("SPIN_RESPONSE_PROCESSED");
  }
}
