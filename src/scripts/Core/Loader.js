import { LoaderConfig } from "./LoaderConfig";
import { dispatcher, Globals } from "./Globals";

export class Loader {
  constructor(loader) {
    this.loader = loader;
    this.resources = LoaderConfig;
  }

  start() {
    return new Promise((resolve) => {
      for (let key in this.resources) {
        this.loader.add(key, this.resources[key]);
      }

      this.loader.onProgress.add(this.showProgress.bind(this));
      this.loader.onComplete.add(this.onComplete.bind(this));
      this.loader.load();
      dispatcher.fireEvent("INIT_REQUEST");
    });
  }

  showProgress(e) {
    console.log(e.progress);
    dispatcher.fireEvent("LOADING_PROGRESS", e.progress);
  }

  onComplete(e) {
    Globals.resources = e.resources;
    dispatcher.fireEvent("LOADING_COMPLETE");
  }
}
