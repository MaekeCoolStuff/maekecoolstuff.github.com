import { defineComponent, dispatchComponentEvent, html } from "../../../components/dist/index.js";
import { baseStyles } from "../shared-styles.js";
import { paginationInteger, paginationState } from "./pagination-state.js";
const styles = `${baseStyles}\n${":host {\n  display: block;\n  min-width: 0;\n}\nnav {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 0.75rem;\n}\n.status {\n  color: var(--nala-ui-color-text-muted, #68716c);\n  font-size: 0.85rem;\n}\nbutton {\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-radius: var(--nala-ui-radius-small, 4px);\n  padding: 0.5rem 0.75rem;\n  background: var(--nala-ui-color-surface, #fffefa);\n  color: inherit;\n  font: inherit;\n  cursor: pointer;\n}\nbutton:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\nbutton:focus-visible {\n  outline: 2px solid var(--nala-ui-color-accent, #184d3b);\n  outline-offset: 2px;\n}\n"}`;
function state(props) {
  return paginationState(props.page, props.pageSize, props.total);
}
defineComponent("nala-pagination", {
  shadow: true,
  styles,
  props: {
    label: {
      type: "string",
      default: "Pagination"
    },
    page: {
      type: "number",
      default: 1,
      validate: (value)=>{
        paginationInteger(value, "page", 1);
      }
    },
    pageSize: {
      type: "number",
      attribute: "page-size",
      default: 10,
      validate: (value)=>{
        paginationInteger(value, "pageSize", 1);
      }
    },
    total: {
      type: "number",
      default: 0,
      validate: (value)=>{
        paginationInteger(value, "total", 0);
      }
    },
    loading: "boolean"
  },
  template: (props)=>{
    const current = state(props);
    return html`
      <nav part="navigation" aria-label=${props.label}
        aria-busy=${String(props.loading)}>
        <button type="button" data-action="previous" part="previous"
          aria-label="Previous page"
          ?disabled=${props.loading || current.page === 1}>Previous</button>
        <span class="status" part="status" role="status" aria-live="polite">
          ${props.loading ? "Loading..." : `Page ${current.page} of ${current.pageCount} (${current.total} items)`}
        </span>
        <button type="button" data-action="next" part="next"
          aria-label="Next page"
          ?disabled=${props.loading || current.page === current.pageCount}>Next</button>
      </nav>
    `;
  },
  onAfterRender: ({ element, props })=>{
    if (!element.isConnected) {
      return;
    }
    const current = state(props);
    if (props.page !== current.page) {
      Reflect.set(element, "page", current.page);
    }
  },
  onConnect: ({ element, delegate })=>{
    delegate("click", "button[data-action]", (_event, target)=>{
      const pagination = element;
      const current = paginationState(pagination.page, pagination.pageSize, pagination.total);
      const page = current.page + (target.getAttribute("data-action") === "next" ? 1 : -1);
      if (pagination.loading || page < 1 || page > current.pageCount) {
        return;
      }
      pagination.page = page;
      dispatchComponentEvent(element, "page-change", {
        page,
        pageSize: current.pageSize,
        offset: (page - 1) * current.pageSize
      }, {
        bubbles: true,
        composed: true
      });
    });
  }
});
