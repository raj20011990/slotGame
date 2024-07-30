import * as PIXI from "pixi.js";
import { dispatcher, Globals, ReelConfig, symbolDdownPos, symbolYPos } from "../Core/Globals";
import gsap from "gsap";

export class Reel {
  constructor(reelId, symbolCount, model) {
    this.model = model;
    this.container = new PIXI.Container();
    this.reelId = reelId;
    this.dropIndex = 2;
    this.symbolCount = symbolCount;
    this.width = ReelConfig.symbolWidth;
    this.height = ReelConfig.symbolHeight;
    this.container.position.x = 0;
    this.container.position.y = 0;
    this.reelHeight = 0;
    this.symbolArray = [];
    this.counter = 0;
    this._addStaticSymbols();
  }

  _addStaticSymbols() {
    for (let i = 0; i < this.symbolCount; i++) {
      let item = new PIXI.Sprite(
        Globals.resources[`symbol_${this.model.reelGrid[this.reelId][i]}`].texture
      );
      item.position.y = i * this.height;
      this.container.addChild(item);
      this.symbolArray.push(item);
    }
    this.reelHeight = ReelConfig.symbolHeight * this.container.children.length;


  }
  moveReelSymbols() {
    this.spin = true;
    if (this.dropIndex >= 0) {
      const symbol = this.container.children[this.dropIndex];
      console.log("REEL MOVING  ", this.counter, "  ::   ", this.reelId, "  ::    y : ", symbol.y)
      gsap.to(symbol, { y: symbolDdownPos[this.dropIndex], duration: 0.5, onComplete: this._onComplete.bind(this), onCompleteParams: [this.container, symbol] });
      this.dropIndex--;
      gsap.delayedCall(100, this.moveReelSymbols());
    }
  }
  _onComplete(container, symbol) {
    gsap.killTweensOf(symbol);
    container.removeChild(symbol);

  }

  update(deletaTime) {
    //blank function
  }

  updateSymbols() {
    this.container.removeChildren();
    for (let i = 0; i < this.symbolArray.length; i++) {
      let item = new PIXI.Sprite(
        Globals.resources[`symbol_${this.model.reelGrid[this.reelId][i]}`].texture
      );

      item.position.y = this.symbolArray[i].y;
      // console.log("RRRRRRRRRRRRRRRR   ::::::   ", item.position.y, "   ::   ", item.y, " :::   ", this.symbolArray[i].y)

      this.container.addChild(item);
    }
    this.dropIndex = 2;
    this.counter = 0;
  }

  updateSymbolGridOnTop() {
    this.container.removeChildren();
    this.symbolArray = []
    for (let i = 0; i < this.symbolCount; i++) {
      let item = new PIXI.Sprite(
        Globals.resources[`symbol_${this.model.reelGrid[this.reelId][i]}`].texture
      );
      item.position.y = (i * this.height) - this.reelHeight;
      this.container.addChild(item);
      this.symbolArray.push(item);
    }
    this.dropIndex = 2;
    this.counter = 0;

  }
  removeWinningSymbols(arr) {

    if (arr.includes(-1)) {
      let counter = 0
      let arrObj = []
      for (let i = arr.length - 1; i >= 0; i--) {
        const symbol = this.container.children[i];
        if (arr[i] == -1) {
          symbol.y = -((counter + 1) * this.height);
          this.symbolArray.splice(i, 1);
          arrObj.unshift(symbol)
          counter++
        }
      }
      this.symbolArray = arrObj.concat(this.symbolArray)

    }
  }

  showSymbols() {
    if (this.dropIndex >= 0) {
      const symbol = this.container.children[this.dropIndex]
      gsap.to(symbol, { y: symbolYPos[this.dropIndex], duration: 0.5, onComplete: this._onCompleteUpdate.bind(this), onCompleteParams: [this.container, symbol] });
      this.dropIndex--;
      gsap.delayedCall(100, this.showSymbols());
    }
  }

  _onCompleteUpdate(container, symbol) {
    gsap.killTweensOf(symbol);
    if (this.counter < 3) {
      this.symbolArray[this.counter].y = this.counter * this.height;

    }
    this.counter++;
    console.log("REEL STOPPING  ", this.counter, "  ::   ", this.reelId)
    if (this.counter == 3 && this.reelId == 4) {
      dispatcher.fireEvent("REEL_STOPPED");
      console.log("REEL STOPPED")
      this.counter = 0;
    }
  }
}
