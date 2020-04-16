/*
 *  Copyright (c) 2018-present, Evgeny Nadymov
 *
 * This source code is licensed under the GPL v.3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

class EventEmitter {
  constructor() {
    this.observers = {};
  }

  subscribe(events, listener) {
    events.split(' ').forEach((event) => {
      this.observers[event] = this.observers[event] || [];
      this.observers[event].push(listener);
      console.log('Subscribing: ', event);
    });
    return this;
  }

  unsubscribe(event, listener) {
    if (!this.observers[event]) return;
    if (!listener) {
      delete this.observers[event];
      return;
    }

    this.observers[event] = this.observers[event].filter((l) => l !== listener);
  }

  notify(event, ...args) {
    console.log('Notifing ', Object.keys(this.observers).length, ' Observers');
    if (this.observers[event]) {
      console.log('Single Event: ', this.observers[event]);
      const cloned = [].concat(this.observers[event]);
      cloned.forEach((observer) => {
        observer(...args);
      });
    }

    if (this.observers['*']) {
      console.log('All Events: ', this.observers);
      const cloned = [].concat(this.observers['*']);
      cloned.forEach((observer) => {
        observer.apply(observer, [event, ...args]);
      });
    }
  }
}

export default EventEmitter;
