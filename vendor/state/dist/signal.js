import { BehaviorSubject, Subject } from "../../observables/dist/index.js";
import { trackRead } from "./internal/tracker.js";
/** Creates a fine-grained reactive value: `set()` only notifies when the value actually changes. */ export function createSignal(initial) {
  const value = new BehaviorSubject(initial);
  const changes = new Subject();
  // stable identity so reading the same signal twice in one run dedupes in the tracked-dependency set
  const handle = {
    onChange: (callback)=>changes.subscribe(callback)
  };
  const get = ()=>{
    trackRead(handle);
    return value.value;
  };
  const set = (next)=>{
    if (!Object.is(next, value.value)) {
      value.next(next);
      changes.next();
    }
  };
  return [
    get,
    set
  ];
}
