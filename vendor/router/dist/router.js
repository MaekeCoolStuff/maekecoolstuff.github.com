import { BehaviorSubject } from "../../observables/dist/index.js";
import { matchRoute } from "./route-matcher.js";
import { createBrowserHistoryAdapter } from "./history-adapter.js";
/** A History-API-based router: matches the current path against `routes` and notifies subscribers on change. */ export function createRouter(routes, options = {}) {
  const history = options.history ?? createBrowserHistoryAdapter();
  function resolve(path) {
    for (const route of routes){
      const match = matchRoute(route.path, path);
      if (match) {
        return {
          path,
          params: match.params,
          component: route.component
        };
      }
    }
    return {
      path,
      params: {},
      component: null
    };
  }
  // BehaviorSubject: a subscriber (e.g. a freshly mounted <router-outlet>) immediately
  // receives the current route, not just future navigations.
  const changes = new BehaviorSubject(resolve(history.getPath()));
  history.onPopState(()=>{
    const path = history.getPath();
    if (path === changes.value.path) return;
    changes.next(resolve(path));
  });
  return {
    get current () {
      return changes.value;
    },
    navigate (path) {
      if (path === changes.value.path) return;
      history.pushPath(path);
      changes.next(resolve(path));
    },
    subscribe (listener) {
      return changes.subscribe(listener);
    }
  };
}
