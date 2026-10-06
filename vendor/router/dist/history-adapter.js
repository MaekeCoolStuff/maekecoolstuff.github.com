/** Abstracts browser navigation (`location`/`history`/`popstate`) so router logic is testable without a browser. */ export function createBrowserHistoryAdapter() {
  return {
    getPath: ()=>location.pathname,
    pushPath: (path)=>history.pushState(null, "", path),
    onPopState: (listener)=>{
      globalThis.addEventListener("popstate", listener);
      return ()=>globalThis.removeEventListener("popstate", listener);
    }
  };
}
