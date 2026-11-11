/**
 * A hand tapping the plus of an accordion row, so phone visitors see the rows open. Phones and tablets only (CSS);
 * the accordion shows it on its first closed row until any row is opened. Decorative, hidden from screen readers.
 */
export function TapHint() {
  return <span aria-hidden className="tap-hint"><i /></span>
}
