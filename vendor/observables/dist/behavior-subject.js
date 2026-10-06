import { Subject } from "./subject.js";
/**
 * A `Subject` that remembers its latest value and replays it
 * immediately to every new subscriber.
 */
export class BehaviorSubject extends Subject {
  #value;
  constructor(initialValue){
    super();
    this.#value = initialValue;
  }
  get value() {
    return this.#value;
  }
  subscribe(observer) {
    const unsubscribe = super.subscribe(observer);
    observer(this.#value);
    return unsubscribe;
  }
  next(value) {
    this.#value = value;
    super.next(value);
  }
}
