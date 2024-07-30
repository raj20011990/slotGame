import * as PIXI from "pixi.js";
import { dispatcher } from "../Core/Globals";

export class LoadingScene {
    constructor() {
        this.container = new PIXI.Container();
        this._addView()
        this._addEventListener();

    }

    _addEventListener() {
        dispatcher.on("LOADING_PROGRESS", this._onInitialLoadinProcess.bind(this));
        dispatcher.on("LOADING_COMPLETE", this._onInitialLoadingComplete.bind(this));
    }

    _addView() {
        this.loadingText = new PIXI.Text("LOADING", {
            font: '600 10pt Open Sans',
            fill: 'white'
        });
        this.loadingPercentage = new PIXI.Text("0", {
            font: '600 10pt Open Sans',
            fill: 'white',
            align: 'left'
        });
        this.loadingText.x = window.innerWidth / 2 - this.loadingText.width / 2 - 10;
        this.loadingText.y = window.innerHeight / 2 - this.loadingText.height / 2 - 50;

        this.loadingPercentage.x = window.innerWidth / 2 - this.loadingPercentage.width / 2
        this.loadingPercentage.y = window.innerHeight / 2 - this.loadingPercentage.height / 2;
        this.loadingPercentage.anchor.set(0.5)
        this.container.addChild(this.loadingText);
        this.container.addChild(this.loadingPercentage);

    }
    _onInitialLoadinProcess(event) {
        this.loadingPercentage.text = Math.round(event.data) + "%";
    }

    _onInitialLoadingComplete() {
        dispatcher.fireEvent("LOAD_MAIN_GAME");

    }

    removeEventListener() {
        dispatcher.off("LOADING_PROGRESS", this._onInitialLoadinProcess.bind(this));
        dispatcher.off("LOADING_COMPLETE", this._onInitialLoadingComplete.bind(this));
    }

    update(deletaTime) {

    }
}