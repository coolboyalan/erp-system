import { AsyncLocalStorage } from "node:async_hooks";

class Storage {
  constructor() {
    this.als = new AsyncLocalStorage();
  }

  run(callback, initial = {}) {
    const store = new Map(Object.entries(initial));
    this.als.run(store, callback);
  }

  set(key, value) {
    const store = this.als.getStore();
    if (store) store.set(key, value);
  }

  get(key) {
    const store = this.als.getStore();
    return store?.get(key);
  }

  has(key) {
    const store = this.als.getStore();
    return store?.has(key);
  }
}

export const session = new Storage();

export default function () {
  return function (req, res, next) {
    session.run(() => next());
  };
}
