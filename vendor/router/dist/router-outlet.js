/** Renders the active route's component, and unmounts the previous one on route changes. */ export class RouterOutlet extends HTMLElement {
  #router = null;
  #unsubscribe = null;
  #mounted = null;
  set router(router) {
    this.#unsubscribe?.();
    this.#unsubscribe = null;
    this.#router = router;
    if (router && this.isConnected) {
      this.#subscribeAndRender(router);
    }
  }
  get router() {
    return this.#router;
  }
  connectedCallback() {
    if (this.#router && !this.#unsubscribe) {
      this.#subscribeAndRender(this.#router);
    }
  }
  disconnectedCallback() {
    this.#unsubscribe?.();
    this.#unsubscribe = null;
  }
  #subscribeAndRender(router) {
    this.#unsubscribe = router.subscribe((route)=>this.#renderRoute(route));
  }
  #renderRoute(route) {
    if (this.#mounted) {
      this.removeChild(this.#mounted);
      this.#mounted = null;
    }
    if (route.component) {
      this.#mounted = route.component();
      this.appendChild(this.#mounted);
    }
    globalThis.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto"
    });
  }
}
/** Registers `<router-outlet>` (or a custom tag name) as a custom element. */ export function defineRouterOutlet(tagName = "router-outlet") {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, RouterOutlet);
  }
}
