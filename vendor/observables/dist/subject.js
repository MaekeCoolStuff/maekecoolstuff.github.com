/**
 * A hot, multicast stream: values pushed via `next()` are broadcast
 * synchronously to every currently subscribed observer.
 */
export class Subject {
  #observers = new Set();
  #completed = false;
  subscribe(observer) {
    if (this.#completed) {
      return ()=>{};
    }
    this.#observers.add(observer);
    return ()=>{
      this.#observers.delete(observer);
    };
  }
  next(value) {
    if (this.#completed) {
      return;
    }
    // snapshot so an unsubscribe triggered during emission doesn't skip observers
    for (const observer of [
      ...this.#observers
    ]){
      observer(value);
    }
  }
  complete() {
    this.#completed = true;
    this.#observers.clear();
  }
  get completed() {
    return this.#completed;
  }
}
