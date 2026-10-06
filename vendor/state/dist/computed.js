import { trackDependencies, trackRead } from "./internal/tracker.js";
/** Lazily derives a read-only signal and tracks dependencies while it has observers. */ export function computed(compute, options = {}) {
  const equals = options.equals ?? Object.is;
  const listeners = new Set();
  const dependents = new Set();
  let dependencies = new Set();
  let dependencyUnsubscribes = [];
  let value;
  let initialized = false;
  let observing = false;
  const hasObservers = ()=>listeners.size > 0 || dependents.size > 0;
  const stopObserving = ()=>{
    if (hasObservers()) return;
    observing = false;
    for (const unsubscribe of dependencyUnsubscribes)unsubscribe();
    dependencyUnsubscribes = [];
  };
  const bindDependencies = ()=>{
    for (const unsubscribe of dependencyUnsubscribes)unsubscribe();
    dependencyUnsubscribes = [
      ...dependencies
    ].map((dependency)=>dependency.onChange(recompute));
  };
  const evaluate = ()=>{
    let next;
    dependencies = trackDependencies(()=>{
      next = compute();
    });
    const changed = !initialized || !equals(value, next);
    if (changed) value = next;
    initialized = true;
    if (observing) bindDependencies();
    return changed;
  };
  function recompute() {
    if (!evaluate()) return;
    for (const listener of [
      ...listeners
    ])listener(value);
    for (const dependent of [
      ...dependents
    ])dependent();
  }
  const startObserving = ()=>{
    if (observing) return;
    if (!initialized) evaluate();
    observing = true;
    bindDependencies();
  };
  const handle = {
    onChange (callback) {
      dependents.add(callback);
      startObserving();
      return ()=>{
        dependents.delete(callback);
        stopObserving();
      };
    }
  };
  const read = ()=>{
    trackRead(handle);
    if (!observing || !initialized) evaluate();
    return value;
  };
  read.subscribe = (listener)=>{
    if (!observing || !initialized) evaluate();
    listeners.add(listener);
    startObserving();
    listener(value);
    return ()=>{
      listeners.delete(listener);
      stopObserving();
    };
  };
  return read;
}
