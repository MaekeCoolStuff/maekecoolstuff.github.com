/** Pure decision logic: should this click be intercepted for SPA navigation, or left to the browser? */ export function shouldInterceptLinkClick(info) {
  if (info.defaultPrevented) return false;
  if (info.button !== 0) return false; // only plain left-clicks
  if (info.hasModifierKey) return false; // respect ctrl/cmd/shift/alt-click (open in new tab, etc.)
  if (!info.href) return false;
  if (info.target && info.target !== "_self") return false; // e.g. target="_blank"
  if (info.download !== null) return false;
  if (!info.isSameOrigin) return false;
  if (info.isSamePageFragment) return false;
  return true;
}
/** Intercepts clicks on same-origin `<a>` elements so navigation goes through the router instead of a page reload. */ export function attachLinkInterceptor(router, root = document) {
  function onClick(event) {
    const target = event.target;
    const anchor = target?.closest?.("a");
    if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;
    const url = new URL(anchor.href, location.href);
    const info = {
      href: anchor.getAttribute("href"),
      target: anchor.getAttribute("target"),
      download: anchor.getAttribute("download"),
      hasModifierKey: event.metaKey || event.ctrlKey || event.shiftKey || event.altKey,
      button: event.button,
      isSameOrigin: url.origin === location.origin,
      isSamePageFragment: url.pathname === location.pathname && url.search === location.search && anchor.getAttribute("href")?.includes("#") === true,
      defaultPrevented: event.defaultPrevented
    };
    if (!shouldInterceptLinkClick(info)) return;
    event.preventDefault();
    router.navigate(url.pathname);
  }
  root.addEventListener("click", onClick);
  return ()=>root.removeEventListener("click", onClick);
}
