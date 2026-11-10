/**
 * Phones and tablets only: a pointing hand above a sideways-scrolling row of cards, sliding left and right to show
 * the row can be swiped. Decorative. The icon (public/icons/swipe-hint.svg) is a vector redrawing of
 * Assets/Cursor 40x40.png, sharp on any screen, used as a mask so it takes the text colour.
 */
export const SwipeHint = ({ className }: { className?: string }) => (
  <span aria-hidden className={`swipe-hint ${className ?? ''}`}><i /></span>
)
