import { effect as createEffect } from "../../state/dist/effect.js";
function isMatchableTarget(target) {
  return typeof target.matches === "function";
}
export function createConnectionScope(element, root) {
  const abortController = new AbortController();
  const cleanups = [];
  let disposed = false;
  const reportCleanupError = (error)=>{
    console.error("Nala component cleanup failed.", error);
  };
  const runCleanup = (cleanup)=>{
    try {
      cleanup();
    } catch (error) {
      reportCleanupError(error);
    }
  };
  const onCleanup = (cleanup)=>{
    if (disposed) {
      runCleanup(cleanup);
      return;
    }
    cleanups.push(cleanup);
  };
  const listen = (targetOrType, typeOrListener, listenerOrOptions, explicitOptions)=>{
    if (disposed) return;
    const usesDefaultTarget = typeof targetOrType === "string";
    const target = usesDefaultTarget ? element : targetOrType;
    const type = usesDefaultTarget ? targetOrType : typeOrListener;
    const listener = usesDefaultTarget ? typeOrListener : listenerOrOptions;
    const options = usesDefaultTarget ? listenerOrOptions : explicitOptions;
    const signal = options?.signal ? AbortSignal.any([
      abortController.signal,
      options.signal
    ]) : abortController.signal;
    target.addEventListener(type, listener, {
      ...options,
      signal
    });
  };
  const delegate = (type, selector, listener, options)=>{
    listen(root, type, (event)=>{
      const path = event.composedPath();
      for (const target of path){
        if (target === root) break;
        if (isMatchableTarget(target) && target.matches(selector)) {
          listener(event, target);
          return;
        }
      }
    }, options);
  };
  const helpers = {
    query: (selector)=>root.querySelector(selector),
    queryAll: (selector)=>Array.from(root.querySelectorAll(selector)),
    listen,
    delegate,
    effect (callback) {
      if (disposed) return;
      onCleanup(createEffect(callback));
    },
    onCleanup
  };
  return {
    helpers,
    dispose () {
      if (disposed) return;
      disposed = true;
      abortController.abort();
      for(let index = cleanups.length - 1; index >= 0; index--){
        runCleanup(cleanups[index]);
      }
      cleanups.length = 0;
    }
  };
}
