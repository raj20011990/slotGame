import * as PIXI from "pixi.js";
import { ButtonPanelConfig, dispatcher, Globals } from "../Core/Globals";

export class ButtonPanel {
  constructor() {
    this.container = new PIXI.Container();
    this.container.x = ButtonPanelConfig.x;
    this.container.y = ButtonPanelConfig.y;
    this.container.sortableChildren = true;
    this._addEventListner();
    this._addButtonPanel();
  }

  _addEventListner() {
    dispatcher.on(
      "UPDATE_SPIN_BUTTON_STATE",
      this._updateSpinButtonState.bind(this),
      this
    );
  }

  _addButtonPanel() {
    this.lineWinText = new PIXI.Text("", {
      font: "200 8pt Open Sans",
      fill: "black",
      align: "center"
    });
    this.lineMessage = new PIXI.Text("", {
      font: "200 8pt Open Sans",
      fill: "black",
      align: "center"
    });
    this.lineMessage.text = "Press Button to switch Line/Ways Win Feature."

    this.lineMessage.anchor.set(0, 0.5);
    this.lineMessage.position.set(80, 200);
    this.container.addChild(this.lineMessage);
    this.lineWinText.anchor.set(0.5, 0.5);
    this.lineWinText.position.set(0, 250);
    this.container.addChild(this.lineWinText);
    this.lineWinText.text = "Line Win Enabled"
    this.spinButton = new PIXI.Sprite(Globals.resources[`spin_Button`].texture);
    this.spinButton.anchor.set(0.5);
    this.spinButton.interactive = true;
    this.spinButton.buttonMode = true;
    this.container.addChild(this.spinButton);
    this.spinButton.on("pointerdown", this._onSpinButtonClick, this);

    this.indicatorButton = new PIXI.Sprite(Globals.resources[`indicator`].texture);
    this.indicatorButton.anchor.set(0.5);
    this.indicatorButton.scale.set(0.5)
    this.indicatorButton.interactive = true;
    this.indicatorButton.buttonMode = true;
    this.indicatorButton.y = 200;
    this.container.addChild(this.indicatorButton);
    this.indicatorButton.on("pointerdown", this._onIndicatorButtonclicked, this);
  }
  _onIndicatorButtonclicked(){
    Globals.line_win = !Globals.line_win;
    this.lineWinText.text = Globals.line_win ? "Line Win Enabled" : "Ways Win Enabled";
    this.container.removeChild(this.lineMessage);
    dispatcher.fireEvent("RESET_WIN_LINE_PRESENTATION");

  }
  _updateSpinButtonState(event) {
    this.spinButton && (this.spinButton.interactive = event.data);
    this.indicatorButton && (this.indicatorButton.interactive = event.data);

  }
  _onSpinButtonClick() {
    dispatcher.fireEvent("SPIN_BUTTON_CLICKED");
  }
}
