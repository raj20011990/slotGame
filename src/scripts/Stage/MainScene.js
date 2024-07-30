import * as PIXI from "pixi.js";
import { ButtonPanel } from "../Components/ButtonPanel";
import { GameFlowManager } from "../Components/GameFlowManager";
import { ReelPanel } from "../Components/ReelPanel";
import { WinPanel } from "../Components/WinPanel";
import { Globals } from "../Core/Globals";

export class MainScene {
    constructor(model) {
        this.model = model;
        this.container = new PIXI.Container();
        this.reelPanel = null;
        this._initalizeGameFlowManager();
        this._createBackground();
        this._createReelContainer();
        this._createButtonContainer();
        this._createWinLineContainer();
    }

    _createBackground() {
        this.bg = new PIXI.Sprite(Globals.resources["bg"].texture);
        this.bg.width = window.innerWidth;
        this.bg.height = window.innerHeight;
        this.container.addChild(this.bg);
    }

    _createReelContainer() {
        this.reelPanel = new ReelPanel(this.model);
        this.reelPanel.container.pivot.set(0.5);
        this.reelPanel.container.scale.set(0.5);
        this.container.addChild(this.reelPanel.container);

    }

    update(deletaTime){
        this.reelPanel.update(deletaTime);
    }

    _createButtonContainer(){
        const grid = new ButtonPanel();
        grid.container.pivot.set(0.5);
        grid.container.scale.set(0.5);
        this.container.addChild(grid.container);
    }

    _createWinLineContainer(){
        const grid = new WinPanel();
        grid.container.pivot.set(0.5);
        grid.container.scale.set(0.5);
        this.container.addChild(grid.container);
    }

    _initalizeGameFlowManager(){
        new GameFlowManager(this.model);
    }

}