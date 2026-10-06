import { createSignal } from "./signal.js";
import { effect } from "./effect.js";
import { computed } from "./computed.js";
/** A small store: plain actions that read/set state directly, no reducers or dispatching. */ export function createStore(config) {
  let initialState = config.state;
  try {
    initialState = config.persist?.load(config.state) ?? config.state;
  } catch  {
    initialState = config.state;
  }
  const [get, setSignal] = createSignal(initialState);
  const commit = (next)=>{
    if (Object.is(next, get())) return;
    setSignal(next);
    try {
      config.persist?.save(next);
    } catch  {
    // Persistence failures must not roll back valid in-memory state.
    }
  };
  const update = (updater)=>{
    commit(updater(get()));
  };
  const set = (next)=>{
    if (typeof next === "function") {
      update(next);
      return;
    }
    commit(next);
  };
  const actions = config.actions({
    get,
    set,
    update
  });
  return {
    state: get,
    actions,
    // block body: discard listener's return value so it's never mistaken for an effect cleanup function
    subscribe: (listener)=>effect(()=>{
        listener(get());
      }),
    select: (selector, options)=>computed(()=>selector(get()), options)
  };
}
