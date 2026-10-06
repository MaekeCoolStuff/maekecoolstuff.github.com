/** An in-memory `HistoryAdapter` for tests — no real `location`/`history`/`popstate` needed. */ export function createFakeHistoryAdapter(initialPath) {
  let path = initialPath;
  const popStateListeners = new Set();
  return {
    getPath: ()=>path,
    pushPath: (next)=>{
      path = next;
    },
    onPopState: (listener)=>{
      popStateListeners.add(listener);
      return ()=>popStateListeners.delete(listener);
    },
    firePopState: (next)=>{
      path = next;
      for (const listener of popStateListeners)listener();
    }
  };
}
