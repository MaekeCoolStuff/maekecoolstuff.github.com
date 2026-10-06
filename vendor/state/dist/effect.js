import { trackDependencies } from "./internal/tracker.js";
/** Runs `callback` immediately, and again whenever a signal read inside it changes. Returns a dispose function. */ export function effect(callback) {
  let unsubscribes = [];
  let cleanup;
  let disposed = false;
  function run() {
    if (disposed) return;
    cleanup?.();
    for (const unsubscribe of unsubscribes)unsubscribe();
    const dependencies = trackDependencies(()=>{
      const result = callback();
      // guard: a callback returning a non-void, non-function value (e.g. an
      // arrow function with an implicit expression body) must never be
      // mistaken for a cleanup function.
      cleanup = typeof result === "function" ? result : undefined;
    });
    unsubscribes = [
      ...dependencies
    ].map((dependency)=>dependency.onChange(run));
  }
  run();
  return function dispose() {
    disposed = true;
    cleanup?.();
    for (const unsubscribe of unsubscribes)unsubscribe();
  };
}
