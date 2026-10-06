import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
defineComponent("docs-native-form-controls-example", {
  template: ()=>html`
      <form>
        <div class="control-grid">
          <nala-input label="Game title" name="title" maxlength="100"
            autocomplete="off" required></nala-input>
          <nala-select label="Shelf" name="status" value="" required>
            <option value="">Choose a shelf</option>
            <option value="backlog">Backlog</option>
            <option value="playing">Playing</option>
            <option value="completed">Completed</option>
          </nala-select>
        </div>
        <p class="button-row">
          <nala-button type="submit">Save game</nala-button>
          <nala-button type="reset" variant="secondary">Reset fields</nala-button>
        </p>
        <p role="status"
          data-result>Enter a title and choose a shelf. Empty required fields block submission.</p>
      </form>
    `,
  onConnect: ({ delegate, query })=>{
    delegate("submit", "form", (event, target)=>{
      event.preventDefault();
      if (!(target instanceof HTMLFormElement)) return;
      const values = new FormData(target);
      const result = query("[data-result]");
      if (!result) throw new Error("Form example is missing its result.");
      result.textContent = `Saved ${values.get("title")} to ${values.get("status")}.`;
    });
  }
});
export function formControlsPreview() {
  return html`<docs-native-form-controls-example></docs-native-form-controls-example>`;
}
