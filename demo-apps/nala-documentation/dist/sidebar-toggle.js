import { localStorageAdapter } from "../../../vendor/state/dist/index.js";
export function initializeSidebarToggle(root = document) {
  const button = root.querySelector("#sidebar-toggle");
  const collapse = root.querySelector("#sidebar-collapse");
  const sidebar = root.querySelector("#documentation-sidebar");
  const layout = root.querySelector(".docs-layout");
  const view = root.defaultView;
  if (!button || !collapse || !sidebar || !layout || !view) {
    throw new Error("Documentation sidebar toggle controls are missing.");
  }
  const preference = localStorageAdapter({
    key: "nala-documentation.sidebar-expanded",
    version: 1,
    validate: (value)=>typeof value === "boolean",
    onError: (error, operation)=>{
      console.warn(`Documentation navigation preference ${operation} failed:`, error);
    }
  });
  const defaultExpanded = !view.matchMedia("(max-width: 52rem)").matches;
  let expanded = preference.load(defaultExpanded) ?? defaultExpanded;
  const update = ()=>{
    const moveFocus = !expanded && sidebar.contains(root.activeElement);
    const focusSidebar = expanded && root.activeElement === button;
    sidebar.hidden = !expanded;
    button.hidden = expanded;
    layout.classList.toggle("sidebar-collapsed", !expanded);
    button.setAttribute("aria-expanded", String(expanded));
    button.setAttribute("aria-label", expanded ? "Hide documentation navigation" : "Show documentation navigation");
    button.title = expanded ? "Hide navigation" : "Show navigation";
    collapse.setAttribute("aria-expanded", String(expanded));
    if (moveFocus) button.focus();
    if (focusSidebar) collapse.focus();
  };
  const toggle = ()=>{
    expanded = !expanded;
    update();
    preference.save(expanded);
  };
  update();
  button.addEventListener("click", toggle);
  collapse.addEventListener("click", toggle);
  return ()=>{
    button.removeEventListener("click", toggle);
    collapse.removeEventListener("click", toggle);
  };
}
