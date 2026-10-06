let activeTracker = null;
/** Called by a signal's getter to register itself as a dependency of the currently running computed/effect (if any). */ export function trackRead(signal) {
  activeTracker?.add(signal);
}
/** Runs `run`, capturing every signal read (via `trackRead`) during its execution. */ export function trackDependencies(run) {
  const previous = activeTracker;
  const dependencies = new Set();
  activeTracker = dependencies;
  try {
    run();
  } finally{
    activeTracker = previous;
  }
  return dependencies;
}
