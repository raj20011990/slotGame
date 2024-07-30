import * as PIXI from "pixi.js";
import { dispatcher, ReelConfig } from "../Core/Globals";
import { Reel } from "./Reel";
import gsap from "gsap";

export class ReelPanel {
  constructor(model) {
    this.model = model;
    this.container = new PIXI.Container();
    this.reels = [];
    this.container.x = ReelConfig.x;
    this.container.y = ReelConfig.y;
    this.container.sortableChildren = true;
    this._addEventListner();
    this._addReel();
    this._addMask();
  }

  _addEventListner() {
    dispatcher.on("UPDATE_SYMBOL_GRID", this._updateSymbolGrid.bind(this));
    dispatcher.on("SPIN_BUTTON_CLICKED", this._spinReel.bind(this));
    dispatcher.on("SPIN_RESPONSE_PROCESSED", this._stopReel.bind(this));
  }

  _addMask() {
    let obj = new PIXI.Graphics();
    obj.beginFill(0xff0000);
    obj.drawRect(0, 0, this.container.width, this.container.height);
    obj.pivot.set(0.5, 0.5);
    this.container.addChild(obj);
    this.container.mask = obj;
  }
  _moveReel(reelId = 0) {
    if (reelId < 5) {
      this.reels[reelId].moveReelSymbols();
      gsap.delayedCall(0.1, this._moveReel.bind(this), [++reelId]);
    } else {
      gsap.killTweensOf(this._moveReel.bind(this));
    }
  }

  _spinReel() {
    this._moveReel(0);
  }
  _displayReel(reelId = 0) {
    if (reelId < 5) {
      this.reels[reelId].showSymbols();
      gsap.delayedCall(0.1, this._displayReel.bind(this), [++reelId]);
    } else {
      gsap.killTweensOf(this._displayReel.bind(this));
    }
  }
  _addReel() {
    for (let i = 0; i < ReelConfig.row; i++) {
      var reel = new Reel(i, ReelConfig.column, this.model);
      this.reels.push(reel);
      reel.container.position.x = (reel.width + ReelConfig.columnPadding) * i;
      this.container.addChild(reel.container);
    }
  }

  _stopReel() {
    this._updateSymbolGridOnTop();
    this._displayReel(0);
  }

  _updateSymbolGrid() {
    for (let i = 0; i < this.reels.length; i++) {
      this.reels[i].updateSymbols();
    }
  }
  _updateSymbolGridOnTop() {
    for (let i = 0; i < this.reels.length; i++) {
      this.reels[i].updateSymbolGridOnTop();
    }
  }
  update(deletaTime) {
    for (let i = 0; i < this.reels.length; i++) {
      this.reels[i].update(deletaTime);
    }
  }
}
