/**
 * Normalises a React Aria `Selection` into a list of string keys.
 *
 * React Aria types selection as `Set<Key> | "all"`. Spreading it directly is
 * unsafe — spreading the literal `"all"` yields its characters — and for the
 * menus in this app a select-all/none gesture has no meaningful mapping to the
 * option list, so it resolves to an empty selection.
 *
 * The parameter is typed structurally rather than importing `Selection` from
 * `react-aria-components`, which is only a transitive dependency here.
 */
export function selectionToKeys(selection: unknown): string[] {
  if (!(selection instanceof Set)) {
    return [];
  }

  return [...selection].filter((key): key is string => typeof key === "string");
}
