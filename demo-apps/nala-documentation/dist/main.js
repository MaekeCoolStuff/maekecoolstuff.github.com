import "../../../vendor/ui-components/dist/index.js";
import { attachLinkInterceptor, createRouter, defineRouterOutlet } from "../../../vendor/router/dist/index.js";
import { createComponentsPage } from "./pages/components-page.js";
import { createCssLayoutPage, cssLayoutPages } from "./pages/css-layout-page.js";
import { createCssReferencePage, cssReferencePages } from "./pages/css-reference-pages.js";
import "./pages/deno-page.js";
import "./pages/overview-page.js";
import { createPackageReferencePage, packageReferences } from "./pages/package-reference-page.js";
import { createObservableTypePage, observableTypeDocs } from "./pages/observable-type-page.js";
import "./pages/packages-page.js";
import "./pages/philosophy-page.js";
import "./pages/under-the-hood-components-page.js";
import "./pages/under-the-hood-http-page.js";
import "./pages/under-the-hood-observables-page.js";
import "./pages/under-the-hood-router-page.js";
import "./pages/under-the-hood-state-page.js";
import { typescriptBookChapters } from "./pages/typescript-book-page.js";
import { typescriptCookbookRecipes } from "./pages/typescript-cookbook/index.js";
import "./pages/typescript-cookbook-page.js";
import { createNativeLibraryPage, nativeLibraryPages } from "./pages/native-library-pages.js";
import { uiComponentDocs } from "./pages/ui-component-page.js";
import "./pages/ui-layouts-page.js";
import { initializeThemeChooser } from "./theme-preview.js";
import { initializeSidebarToggle } from "./sidebar-toggle.js";
import "./pages/workflow-page.js";
import { createTodoChapter, todoBookChapters } from "./pages/todo-book-page.js";
import { bookPath, chapterPath } from "./pages/todo-book/types.js";
defineRouterOutlet();
initializeThemeChooser();
initializeSidebarToggle();
const routes = [
  {
    path: "/",
    component: ()=>document.createElement("docs-overview-page")
  },
  {
    path: "/philosophy",
    component: ()=>document.createElement("docs-philosophy-page")
  },
  {
    path: "/deno",
    component: ()=>document.createElement("docs-deno-page")
  },
  {
    path: bookPath,
    component: ()=>document.createElement("docs-todo-book-page")
  },
  ...todoBookChapters.map(({ number })=>({
      path: chapterPath(number),
      component: ()=>createTodoChapter(number)
    })),
  {
    path: "/packages",
    component: ()=>document.createElement("docs-packages-page")
  },
  ...nativeLibraryPages.map(({ slug })=>({
      path: `/native-libraries/${slug}`,
      component: ()=>createNativeLibraryPage(slug)
    })),
  ...packageReferences.map(({ slug })=>({
      path: `/packages/${slug}`,
      component: ()=>createPackageReferencePage(slug)
    })),
  {
    path: "/under-the-hood/http",
    component: ()=>document.createElement("docs-under-the-hood-http-page")
  },
  {
    path: "/under-the-hood/components",
    component: ()=>document.createElement("docs-under-the-hood-components-page")
  },
  {
    path: "/under-the-hood/observables",
    component: ()=>document.createElement("docs-under-the-hood-observables-page")
  },
  {
    path: "/under-the-hood/router",
    component: ()=>document.createElement("docs-under-the-hood-router-page")
  },
  {
    path: "/under-the-hood/state",
    component: ()=>document.createElement("docs-under-the-hood-state-page")
  },
  ...observableTypeDocs.map(({ slug })=>({
      path: `/packages/observables/${slug}`,
      component: ()=>createObservableTypePage(slug)
    })),
  {
    path: "/components",
    component: ()=>createComponentsPage()
  },
  ...uiComponentDocs.map(({ slug })=>({
      path: `/components/${slug}`,
      component: ()=>createComponentsPage(slug)
    })),
  {
    path: "/components/layouts",
    component: ()=>document.createElement("docs-ui-layouts-page")
  },
  ...cssLayoutPages.map(({ slug })=>({
      path: `/css-layout/${slug}`,
      component: ()=>createCssLayoutPage(slug)
    })),
  ...cssReferencePages.map(({ slug })=>({
      path: `/css/${slug}`,
      component: ()=>createCssReferencePage(slug)
    })),
  {
    path: "/workflow",
    component: ()=>document.createElement("docs-workflow-page")
  },
  {
    path: "/typescript",
    component: ()=>document.createElement("docs-typescript-book-page")
  },
  ...typescriptBookChapters.map(({ slug, tagName })=>({
      path: `/typescript/${slug}`,
      component: ()=>document.createElement(tagName)
    })),
  {
    path: "/typescript/cookbook",
    component: ()=>document.createElement("docs-typescript-cookbook-page")
  },
  ...typescriptCookbookRecipes.map(({ slug, tagName })=>({
      path: `/typescript/cookbook/${slug}`,
      component: ()=>document.createElement(tagName)
    }))
];
const router = createRouter(routes);
const outlet = document.querySelector("router-outlet");
outlet.router = router;
attachLinkInterceptor(router);
router.subscribe(({ path })=>{
  for (const link of document.querySelectorAll(".side-nav a")){
    if (new URL(link.href).pathname === path) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  }
});
const navStateKey = "nala-docs:side-nav-open";
const sideNav = document.querySelector(".side-nav");
function navGroupKey(details) {
  const labels = [];
  for(let group = details; group && sideNav?.contains(group); group = group.parentElement?.closest("details") ?? null){
    labels.unshift(group.querySelector(":scope > summary")?.textContent?.trim() ?? "");
  }
  return labels.join("/");
}
function readOpenNavGroups() {
  try {
    const parsed = JSON.parse(localStorage.getItem(navStateKey) ?? "[]");
    return new Set(Array.isArray(parsed) ? parsed.filter((key)=>typeof key === "string") : []);
  } catch  {
    return new Set();
  }
}
if (sideNav) {
  const openGroups = readOpenNavGroups();
  for (const details of sideNav.querySelectorAll("details")){
    details.open = openGroups.has(navGroupKey(details));
  }
  // `toggle` does not bubble, so listen during capture.
  sideNav.addEventListener("toggle", (event)=>{
    if (!(event.target instanceof HTMLDetailsElement)) return;
    const key = navGroupKey(event.target);
    if (event.target.open) openGroups.add(key);
    else openGroups.delete(key);
    try {
      localStorage.setItem(navStateKey, JSON.stringify([
        ...openGroups
      ]));
    } catch  {
    // Storage may be unavailable; the nav still works for this session.
    }
  }, true);
  const openActiveNavGroup = (path)=>{
    const activeLink = Array.from(sideNav.querySelectorAll("a")).find((link)=>new URL(link.href).pathname === path);
    for(let group = activeLink?.closest("details") ?? null; group && sideNav.contains(group); group = group.parentElement?.closest("details") ?? null){
      group.open = true;
      openGroups.add(navGroupKey(group));
    }
  };
  openActiveNavGroup(router.current.path);
  router.subscribe(({ path })=>openActiveNavGroup(path));
}
