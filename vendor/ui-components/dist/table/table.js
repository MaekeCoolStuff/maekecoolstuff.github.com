import { defineComponent, html, repeat } from "../../../components/dist/index.js";
import "../pagination/pagination.js";
import { baseStyles } from "../shared-styles.js";
import { paginationInteger, paginationState } from "../pagination/pagination-state.js";
const styles = `${baseStyles}\n${":host { display: block; min-width: 0; }\nnala-pagination { margin-top: 0.75rem; }\n.scroll {\n  overflow-x: auto;\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-radius: var(--nala-ui-radius-medium, 6px);\n  background: var(--nala-ui-color-surface, #fffefa);\n}\ntable { width: 100%; border-collapse: collapse; text-align: left; }\ncaption { padding: 0.8rem 1rem; text-align: left; font-weight: 700; }\nth, td {\n  border-top: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  padding: 0.75rem 1rem;\n  overflow-wrap: anywhere;\n}\nth {\n  white-space: nowrap;\n  background: var(--nala-ui-color-surface-muted, #f7f7f2);\n}\n.empty { text-align: center; color: var(--nala-ui-color-text-muted, #68716c); }\n.scroll:focus-visible {\n  outline: 2px solid var(--nala-ui-color-accent, #184d3b);\n  outline-offset: 2px;\n}\n"}`;
function pagination(props) {
  return paginationState(props.page, props.pageSize, props.paging === "client" ? props.rows.length : props.total);
}
defineComponent("nala-table", {
  shadow: true,
  styles,
  props: {
    label: {
      type: "string",
      default: "Data"
    },
    paging: {
      type: "string",
      default: "client",
      validate (value) {
        if (value !== "client" && value !== "server") {
          throw new TypeError('paging must be "client" or "server"');
        }
      }
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
  properties: {
    rows: {
      default: ()=>[],
      validate (value) {
        if (!Array.isArray(value) || value.some((row)=>row === null || typeof row !== "object") || new Set(value).size !== value.length) {
          throw new TypeError("rows must be an array of distinct records");
        }
      }
    },
    columns: {
      default: ()=>[],
      validate (value) {
        if (!Array.isArray(value) || value.some((column)=>!column || typeof column.key !== "string" || typeof column.label !== "string") || new Set(value.map((column)=>column.key)).size !== value.length) {
          throw new TypeError("columns must have unique string keys and string labels");
        }
      }
    }
  },
  template: (props)=>{
    const state = pagination(props);
    const visible = props.paging === "client" ? props.rows.slice(state.offset, state.offset + state.pageSize) : props.rows;
    return html`
      <div class="scroll" part="container" tabindex="0" role="region"
        aria-label=${props.label} aria-busy=${String(props.loading)}>
        <table part="table">
          <caption part="caption">${props.label}</caption>
          <thead part="header">
            <tr>${repeat(props.columns, (column)=>column.key, (column)=>html`<th scope="col" part="header-cell">${column.label}</th>`)}</tr>
          </thead>
          <tbody>${repeat(visible, (row)=>row, (row)=>html`<tr part="row">${repeat(props.columns, (column)=>column.key, (column)=>html`<td part="cell">${row[column.key] == null ? "" : String(row[column.key])}</td>`)}</tr>`)}
            ${visible.length === 0 ? html`
                <tr>
                  <td class="empty" part="empty" colspan=${Math.max(1, props.columns.length)}>
                                  ${props.loading ? "Loading..." : "No data"}
                                </td>
                </tr>
              ` : null}
          </tbody>
        </table>
      </div>
      <nala-pagination exportparts="navigation:pagination,previous,next,status"
        .label=${`${props.label} pagination`} .page=${state.page}
        .pageSize=${state.pageSize} .total=${state.total}
        .loading=${props.loading}></nala-pagination>
    `;
  },
  onAfterRender: ({ element, props })=>{
    if (!element.isConnected) {
      return;
    }
    const state = pagination(props);
    if (props.page !== state.page) {
      Reflect.set(element, "page", state.page);
    }
  },
  onConnect: ({ element, delegate })=>{
    delegate("page-change", "nala-pagination", (event)=>{
      const table = element;
      const { page } = event.detail;
      table.page = page;
    });
  }
});
