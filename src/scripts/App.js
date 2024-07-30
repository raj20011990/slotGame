import * as PIXI from "pixi.js";
import { Loader } from "./Core/Loader";
import { MainScene } from "./Stage/MainScene";
import { dispatcher, Globals } from "./Core/Globals";
import { LoadingScene } from "./Stage/Loading";
import { SlotResponse } from "./SlotEngine/SlotResponse";
import { Model } from "./Parser/Model";
import { Parser } from "./Parser/Parser";

export class App {
    run() {
        this.app = new PIXI.Application({ resizeTo: window });
        document.body.appendChild(this.app.view);
        this._initializeSlotAndParser();
        this._initializeSlotEngine();
        this._addEventListener()
        this._displayLoading()
        this._loadAssets();
        this._start();
        
    }

    _addEventListener() {
        dispatcher.on("LOAD_MAIN_GAME", this._onLoadMainGame.bind(this));
    }
    _initializeSlotAndParser() {
        this.model = new Model();
        new Parser(this.model)
    }
    _initializeSlotEngine() {
        new SlotResponse();
    }
    _onLoadMainGame() {
        if (Globals.initResponseReceived) {
            this.scene.removeEventListener();
            this.app.stage.removeChild(this.scene.container);
            this.scene = new MainScene(this.model);
            this.app.stage.addChild(this.scene.container);
        }
        Globals.initResponseReceived = false;
    }
    _displayLoading() {
        this.scene = new LoadingScene()
        this.app.stage.addChild(this.scene.container);
    }

    _loadAssets() {
        this.loader = new Loader(this.app.loader);
        this.loader.start();
    }

    _start() {
        this.app.ticker.add((deltaTime) => {
            this.scene.update(deltaTime);
        });


    }
}