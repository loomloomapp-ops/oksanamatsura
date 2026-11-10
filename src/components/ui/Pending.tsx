import { SHOW_PENDING } from '@/lib/site'

/** Marks where the client's material goes. Renders nothing once placeholders are switched off. */
export const Pending = ({ label }: { label: string }) => (SHOW_PENDING ? <span className="pending">{label}</span> : null)
