function isStorageEnvelope(value) {
  return typeof value === "object" && value !== null && typeof value.version === "number" && Object.hasOwn(value, "state");
}
function rejectUnsupportedValues(_key, value) {
  if (typeof value === "function" || typeof value === "symbol") {
    throw new TypeError("Persistent state cannot contain functions or symbols.");
  }
  return value;
}
export function localStorageAdapter(options) {
  const report = (error, operation)=>{
    try {
      options.onError?.(error, operation);
    } catch  {
    // Error reporting must not make persistence fatal.
    }
  };
  const getStorage = ()=>{
    const storage = options.storage ?? globalThis.localStorage;
    if (!storage) throw new Error("localStorage is not available.");
    return storage;
  };
  const select = options.select ?? ((state)=>state);
  const hydrate = options.hydrate ?? ((_initialState, persistedState)=>persistedState);
  return {
    load (initialState) {
      try {
        const serialized = getStorage().getItem(options.key);
        if (serialized === null) return undefined;
        const parsed = JSON.parse(serialized);
        const envelope = isStorageEnvelope(parsed) ? parsed : null;
        let persistedState;
        if (envelope?.version === options.version) {
          persistedState = options.validate(envelope.state) ? envelope.state : undefined;
        } else {
          const value = envelope?.state ?? parsed;
          const storedVersion = envelope?.version ?? 0;
          persistedState = options.migrate?.(value, storedVersion);
          if (persistedState !== undefined && !options.validate(persistedState)) {
            persistedState = undefined;
          }
        }
        return persistedState === undefined ? undefined : hydrate(initialState, persistedState);
      } catch (error) {
        report(error, "load");
        return undefined;
      }
    },
    save (state) {
      try {
        const persistedState = select(state);
        if (!options.validate(persistedState)) {
          throw new TypeError("Persistent state failed validation.");
        }
        const serialized = JSON.stringify({
          version: options.version,
          state: persistedState
        }, rejectUnsupportedValues);
        getStorage().setItem(options.key, serialized);
      } catch (error) {
        report(error, "save");
      }
    },
    remove () {
      try {
        getStorage().removeItem(options.key);
      } catch (error) {
        report(error, "remove");
      }
    }
  };
}
