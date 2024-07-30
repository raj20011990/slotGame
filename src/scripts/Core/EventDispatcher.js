import { Event } from "./Event";

export class EventDispatcher {
  constructor() {
    this.subscribedEvents = {};
  }

  on(type, handler, data) {
    if (typeof type === "undefined") {
      throw new Error("Please provide an Event Type");
    }
    if (typeof handler === "undefined") {
      throw new Error("Please provide an Event Handler");
    }

    if (!this.subscribedEvents.hasOwnProperty(type)) {
      this.subscribedEvents[type] = [];
    }

    this.subscribedEvents[type].push({
      func: handler,
      data: data || null,
    });

    return handler;
  }

  off(type, handler) {
    if (typeof type === "undefined") {
      throw new Error("Please provide an Event Type");
    }
    if (!this.subscribedEvents.hasOwnProperty(type)) {
      console.info("%c Event " + type + " is not available");
      return;
    }
    const eventLen = this.subscribedEvents[type].length;
    const subscrEvent = this.subscribedEvents[type];
    let i;
    if (handler) {
      if (eventLen === 1 && subscrEvent[0].func === handler) {
        delete this.subscribedEvents[type];
        return;
      }
      for (i = eventLen - 1; i > -1; i--) {
        if (subscrEvent[i].func === handler) {
          subscrEvent.splice(i, 1);
          break;
        }
      }
    } else {
      delete this.subscribedEvents[type];
    }
  }

  fireEvent(type, data) {
    if (typeof type === "undefined") {
      throw new Error("Please provide an Event Type");
    }
    let event = new Event(type, data);
    if (this.subscribedEvents.hasOwnProperty(event.type)) {
      const eventLen = this.subscribedEvents[event.type].length;
      let i;
      let eventObj;
      if (eventLen) {
        for (i = eventLen - 1; i > -1; i--) {
          eventObj = this.subscribedEvents[event.type][i];
          event.timeStamp = +new Date();

          event.target = eventObj.scope || this;
          eventObj.func.call(eventObj.scope, event, eventObj.data);
          if (
            this.subscribedEvents[event.type] &&
            (eventObj.once || event.removed)
          ) {
            if (this.subscribedEvents[event.type].length === 0) {
              delete this.subscribedEvents[event.type];
            } else {
              this.subscribedEvents[event.type].splice(i, 1);
            }
            event.removed = false;
          }
        }
      } else {
        console.info(
          `%c Event ${type.toString()} is not subscribed now`,
          "background:purple;color:white"
        );
      }
      event = null;
    } else {
      console.info(
        `%c Event ${type.toString()} is not subscribed anywhere`
      );
    }
  }
}
