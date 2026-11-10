type P = { size?: number; className?: string }
const base = (size = 16) => ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true })

export const Plus = ({ size, className }: P) => <svg {...base(size)} className={className}><path d="M12 5v14M5 12h14" /></svg>
export const Arrow = ({ size, className }: P) => <svg {...base(size)} className={className}><path d="M7 17 17 7M8 7h9v9" /></svg>
export const ArrowSide = ({ size, className }: P) => <svg {...base(size)} className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
export const Back = ({ size, className }: P) => <svg {...base(size)} className={className}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
export const Phone = ({ size, className }: P) => <svg {...base(size)} className={className}><path d="M21 16.5v3a2 2 0 0 1-2.2 2A19 19 0 0 1 2.5 5.2 2 2 0 0 1 4.5 3h3a2 2 0 0 1 2 1.7l.4 2.6a2 2 0 0 1-.6 1.8L8 10.4a15 15 0 0 0 5.6 5.6l1.3-1.3a2 2 0 0 1 1.8-.6l2.6.4a2 2 0 0 1 1.7 2Z" /></svg>
export const Minus = ({ size, className }: P) => <svg {...base(size)} className={className}><path d="M5 12h14" /></svg>
export const Globe =({ size, className }: P) => <svg {...base(size)} className={className}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.4 2.6 3.6 5.6 3.6 9s-1.2 6.4-3.6 9c-2.4-2.6-3.6-5.6-3.6-9S9.6 5.6 12 3Z" /></svg>
export const Menu =({ size, className }: P) => <svg {...base(size)} className={className}><path d="M4 8h16M4 16h16" /></svg>
export const Close = ({ size, className }: P) => <svg {...base(size)} className={className}><path d="M6 6l12 12M18 6 6 18" /></svg>
export const Chevron = ({ size, className }: P) => <svg {...base(size)} className={className}><path d="m6 9 6 6 6-6" /></svg>
export const Pin = ({ size, className }: P) => <svg {...base(size)} className={className}><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
export const Clock = ({ size, className }: P) => <svg {...base(size)} className={className}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
export const Alert = ({ size, className }: P) => <svg {...base(size)} className={className}><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.5v.01" /></svg>
export const Check = ({ size, className }: P) => <svg {...base(size)} className={className}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
export const Bank = ({ size, className }: P) => <svg {...base(size)} className={className}><path d="M3 10 12 4l9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" /></svg>
export const Home = ({ size, className }: P) => <svg {...base(size)} className={className}><path d="m3 11 9-7 9 7M5.5 9.5V20h13V9.5M10 20v-5.5h4V20" /></svg>
export const Eye = ({ size, className }: P) => <svg {...base(size)} className={className}><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.75" /></svg>
export const Doc = ({ size, className }: P) => <svg {...base(size)} className={className}><path d="M14 3.5H7a1.5 1.5 0 0 0-1.5 1.5v14A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5V8L14 3.5Z" /><path d="M14 3.5V8h4.5M9 13.5l2 2 4-4" /></svg>
export const Key = ({ size, className }: P) => <svg {...base(size)} className={className}><circle cx="8" cy="15" r="4" /><path d="m10.8 12.2 8.7-8.7M16.5 6.5l2.5 2.5M14 9l2 2" /></svg>
export const Chat = ({ size, className }: P) => <svg {...base(size)} className={className}><path d="M20 11.5a7.5 7.5 0 0 1-10.9 6.7L4.5 19.5l1.2-4.1A7.5 7.5 0 1 1 20 11.5Z" /><path d="M9 11.5h.01M12.5 11.5h.01M16 11.5h.01" /></svg>
export const Shield = ({ size, className }: P) => <svg {...base(size)} className={className}><path d="M12 3 5 6v5.5c0 4.4 2.9 7.8 7 9.5 4.1-1.7 7-5.1 7-9.5V6l-7-3Z" /><path d="m9 12 2.2 2.2L15.2 10" /></svg>
export const Instagram = ({ size, className }: P) => <svg {...base(size)} className={className}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.2 6.8h.01" /></svg>
export const Facebook = ({ size, className }: P) => <svg {...base(size)} className={className}><path d="M14.5 8H16V4.5h-2.2c-2.4 0-3.8 1.5-3.8 3.9V10.5H7.8V14H10v6.5h3.5V14h2.3l.5-3.5h-2.8V8.8c0-.5.4-.8 1-.8Z" /></svg>
