export class Event {
  constructor(type, data) {
    this.type = type;

    this.data = data === void 0 ? null : data;
    this.removed = false;
  }
  remove() {
    this.removed = true;
  }

  toString() {
    return `[Event (type=${this.type}, timeStamp=${this.timeStamp})]`;
  }
}
