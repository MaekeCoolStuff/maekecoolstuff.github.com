/** Small async state machine for loading, success, empty and error UI states. */ export function createAsyncState(isEmpty = ()=>false, options = {}) {
  const concurrency = options.concurrency ?? "all";
  if (concurrency !== "all" && concurrency !== "latest") {
    throw new TypeError('Async concurrency must be "all" or "latest"');
  }
  let request = 0;
  let current = {
    status: "idle",
    data: null,
    error: null,
    empty: false
  };
  let lastLoader = null;
  const listeners = new Set();
  function publish(next) {
    current = next;
    for (const listener of listeners)listener(current);
  }
  return {
    get state () {
      return current;
    },
    async load (loader) {
      const currentRequest = ++request;
      lastLoader = loader;
      publish({
        status: "loading",
        data: current.data,
        error: null,
        empty: false
      });
      try {
        const data = await loader();
        if (concurrency === "latest" && currentRequest !== request) return data;
        publish({
          status: "success",
          data,
          error: null,
          empty: isEmpty(data)
        });
        return data;
      } catch (error) {
        if (concurrency === "latest" && currentRequest !== request) return null;
        publish({
          status: "error",
          data: current.data,
          error,
          empty: false
        });
        return null;
      }
    },
    retry () {
      return lastLoader ? this.load(lastLoader) : Promise.resolve(null);
    },
    reset () {
      request++;
      lastLoader = null;
      publish({
        status: "idle",
        data: null,
        error: null,
        empty: false
      });
    },
    subscribe (listener) {
      listeners.add(listener);
      listener(current);
      return ()=>listeners.delete(listener);
    }
  };
}
