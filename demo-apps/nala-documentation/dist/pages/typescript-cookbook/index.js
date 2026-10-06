import { registerTypeScriptCookbookRecipe } from "./recipe-page.js";
import { recipe as asyncMapPromiseAll } from "./async-map-promise-all.js";
import { recipe as catchUnknown } from "./catch-unknown.js";
import { recipe as datesFromJson } from "./dates-from-json.js";
import { recipe as dynamicObjectKey } from "./dynamic-object-key.js";
import { recipe as emptyArrayInference } from "./empty-array-inference.js";
import { recipe as eventTargetNarrowing } from "./event-target-narrowing.js";
import { recipe as exhaustiveSwitch } from "./exhaustive-switch.js";
import { recipe as formValuesAreStrings } from "./form-values-are-strings.js";
import { recipe as filterTypeGuard } from "./filter-type-guard.js";
import { recipe as emptyObjectInference } from "./empty-object-inference.js";
import { recipe as genericArrayContainer } from "./generic-array-container.js";
import { recipe as genericConstraintPreservesType } from "./generic-constraint-preserves-type.js";
import { recipe as genericConstructorFactory } from "./generic-constructor-factory.js";
import { recipe as genericFilterDefined } from "./generic-filter-defined.js";
import { recipe as genericFunctionWrapper } from "./generic-function-wrapper.js";
import { recipe as genericInferenceAndTypeArguments } from "./generic-inference-and-type-arguments.js";
import { recipe as genericKeyValueRelationship } from "./generic-key-value-relationship.js";
import { recipe as genericPluckProperties } from "./generic-pluck-properties.js";
import { recipe as genericResultEnvelope } from "./generic-result-envelope.js";
import { recipe as genericValueMustComeFromInput } from "./generic-value-must-come-from-input.js";
import { recipe as immutableUpdate } from "./immutable-update.js";
import { recipe as jsonIsUnknown } from "./json-is-unknown.js";
import { recipe as literalUnionMembership } from "./literal-union-membership.js";
import { recipe as missingDomElement } from "./missing-dom-element.js";
import { recipe as narrowUnionProperties } from "./narrow-union-properties.js";
import { recipe as nullishDefaults } from "./nullish-defaults.js";
import { recipe as objectKeysAreStrings } from "./object-keys-are-strings.js";
import { recipe as objectLiteralWidening } from "./object-literal-widening.js";
import { recipe as optionalPropertyPatch } from "./optional-property-patch.js";
import { recipe as promiseAllSettledPartialResults } from "./promise-allsettled-partial-results.js";
import { recipe as safeArrayIndex } from "./safe-array-index.js";
import { recipe as satisfiesConfig } from "./satisfies-config.js";
import { recipe as typeOnlyImport } from "./type-only-import.js";
const recipes = [
  safeArrayIndex,
  missingDomElement,
  formValuesAreStrings,
  filterTypeGuard,
  eventTargetNarrowing,
  catchUnknown,
  jsonIsUnknown,
  nullishDefaults,
  datesFromJson,
  narrowUnionProperties,
  exhaustiveSwitch,
  emptyArrayInference,
  dynamicObjectKey,
  objectKeysAreStrings,
  objectLiteralWidening,
  literalUnionMembership,
  emptyObjectInference,
  optionalPropertyPatch,
  satisfiesConfig,
  immutableUpdate,
  asyncMapPromiseAll,
  promiseAllSettledPartialResults,
  genericArrayContainer,
  genericConstraintPreservesType,
  genericConstructorFactory,
  genericFilterDefined,
  genericFunctionWrapper,
  genericKeyValueRelationship,
  genericInferenceAndTypeArguments,
  genericPluckProperties,
  genericResultEnvelope,
  genericValueMustComeFromInput,
  typeOnlyImport
];
export const typescriptCookbookRecipes = recipes.map((recipe)=>({
    ...recipe,
    tagName: registerTypeScriptCookbookRecipe(recipe)
  }));
