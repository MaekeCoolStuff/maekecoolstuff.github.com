import { defineFormControl, dispatchComponentEvent, dispatchFormChange, dispatchFormInput, html } from "../../../components/dist/index.js";
import { fieldStyles } from "../shared-styles.js";
import { acceptedFiles } from "./file-accept.js";
const selectedFiles = new WeakMap();
const styles = `${fieldStyles}\n${":host {\n  display: block;\n  min-width: 0;\n}\n\n.field {\n  display: grid;\n  gap: 0.4rem;\n}\n\n.label {\n  color: var(--nala-ui-color-text, #18201d);\n  font-weight: 600;\n}\n\n.dropzone {\n  position: relative;\n  display: grid;\n  justify-items: center;\n  gap: 0.4rem;\n  border: 2px dashed var(--nala-ui-color-border, #cbcfc8);\n  border-radius: var(--nala-ui-radius-medium, 6px);\n  padding: 1.25rem;\n  background: var(--nala-ui-color-surface, #fffefa);\n  color: var(--nala-ui-color-text, #18201d);\n  text-align: center;\n  cursor: pointer;\n}\n\n.dropzone:hover,\n:host([dragging]) .dropzone {\n  border-color: var(--nala-ui-color-accent, #184d3b);\n  background: var(--nala-ui-color-accent-soft, #d8e8df);\n}\n\n.dropzone:focus-within {\n  outline: 2px solid var(--nala-ui-color-accent, #184d3b);\n  outline-offset: 2px;\n}\n\n.dropzone[aria-disabled=\"true\"] {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n\n.control {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n  clip-path: inset(50%);\n  white-space: nowrap;\n}\n\n.prompt {\n  font-weight: 600;\n}\n\n.selection {\n  max-width: 100%;\n  color: var(--nala-ui-color-text-muted, #68716c);\n  font-size: 0.85rem;\n  overflow-wrap: anywhere;\n}\n\n.hint {\n  color: var(--nala-ui-color-text-muted, #68716c);\n  font-size: 0.84rem;\n  line-height: 1.4;\n}\n\n.dropzone[aria-disabled=\"true\"] .selection {\n  color: inherit;\n}\n"}`;
function filesOf(element) {
  return selectedFiles.get(element) ?? [];
}
function updateSelection(element, files) {
  const next = element.multiple ? files : files.slice(0, 1);
  selectedFiles.set(element, next);
  const selection = element.shadowRoot?.querySelector(".selection");
  if (selection) {
    selection.textContent = next.length ? next.map((file)=>file.name).join(", ") : "No files selected";
  }
}
function acceptedSelection(element, files) {
  const acceptedByType = acceptedFiles(files, element.accept);
  const rejected = files.filter((file)=>!acceptedByType.some((acceptedFile)=>acceptedFile === file));
  if (!element.multiple && acceptedByType.length > 1) {
    rejected.push(...acceptedByType.slice(1));
  }
  return {
    accepted: element.multiple ? acceptedByType : acceptedByType.slice(0, 1),
    rejected
  };
}
function reportRejectedFiles(element, files) {
  if (files.length) {
    dispatchComponentEvent(element, "file-reject", {
      files
    }, {
      bubbles: true,
      composed: true
    });
  }
}
defineFormControl("nala-file-upload", {
  shadow: true,
  props: {
    label: "string",
    hint: "string",
    accept: "string",
    multiple: "boolean"
  },
  styles,
  template: (props)=>html`
      <div class="field" part="field">
        <span class="label" id="file-label" part="label">${props.label || "Upload files"}</span>
        <label class="dropzone" part="dropzone"
          aria-disabled=${String(props.disabled)}>
          <input
            class="control"
            id="file-input"
            part="control"
            type="file"
            accept=${props.accept || null}
            ?multiple=${props.multiple}
            ?disabled=${props.disabled}
            ?required=${props.required}
            aria-labelledby="file-label"
            aria-describedby=${props.hint ? "file-hint file-selection" : "file-selection"}
          />
          <span class="prompt" part="prompt">
            Choose ${props.multiple ? "files" : "a file"} or drop ${props.multiple ? "them" : "it"} here
          </span>
          <span class="selection" id="file-selection" part="selection"
            role="status" aria-live="polite">No files selected</span>
        </label>
        ${props.hint ? html`
            <span class="hint" id="file-hint" part="hint">${props.hint}</span>
          ` : null}
      </div>
    `,
  onUpdate: ({ element })=>{
    const upload = element;
    updateSelection(upload, [
      ...filesOf(upload)
    ]);
  },
  onConnect: ({ delegate, element })=>{
    const upload = element;
    updateSelection(upload, [
      ...filesOf(upload)
    ]);
    const readInput = (target)=>Array.from(target.files ?? []);
    const notifyDroppedFiles = (files)=>{
      if (!files.length) return;
      const selection = acceptedSelection(upload, files);
      updateSelection(upload, selection.accepted);
      dispatchFormInput(element, [
        ...filesOf(upload)
      ]);
      dispatchFormChange(element, [
        ...filesOf(upload)
      ]);
      reportRejectedFiles(element, selection.rejected);
    };
    delegate("input", "input[type=file]", (event, target)=>{
      event.stopPropagation();
      updateSelection(upload, acceptedSelection(upload, readInput(target)).accepted);
      dispatchFormInput(element, [
        ...filesOf(upload)
      ]);
    });
    delegate("change", "input[type=file]", (event, target)=>{
      event.stopPropagation();
      const selection = acceptedSelection(upload, readInput(target));
      updateSelection(upload, selection.accepted);
      dispatchFormChange(element, [
        ...filesOf(upload)
      ]);
      reportRejectedFiles(element, selection.rejected);
    });
    delegate("dragenter", ".dropzone", (event)=>{
      if (upload.disabled) return;
      event.preventDefault();
      element.setAttribute("dragging", "");
    });
    delegate("dragover", ".dropzone", (event)=>{
      event.preventDefault();
      if (upload.disabled) return;
      if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
    });
    delegate("dragleave", ".dropzone", (event, target)=>{
      const related = event.relatedTarget;
      if (!(related instanceof Node) || !target.contains(related)) {
        element.removeAttribute("dragging");
      }
    });
    delegate("drop", ".dropzone", (event)=>{
      const dragEvent = event;
      dragEvent.preventDefault();
      element.removeAttribute("dragging");
      if (upload.disabled) return;
      notifyDroppedFiles(Array.from(dragEvent.dataTransfer?.files ?? []));
    });
    delegate("click", ".dropzone", (event)=>{
      if (upload.disabled) event.preventDefault();
    });
  }
});
const prototype = customElements.get("nala-file-upload").prototype;
Object.defineProperties(prototype, {
  files: {
    get () {
      return [
        ...filesOf(this)
      ];
    }
  },
  clear: {
    value () {
      const input = this.shadowRoot?.querySelector("input[type=file]");
      if (input) input.value = "";
      updateSelection(this, []);
    }
  }
});
