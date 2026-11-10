import { cx } from '@/lib/cx'
import { Words } from './Words'

export const SectionHeader = ({ eyebrow, h2, lead, dark, className }: { eyebrow: string; h2: string; lead?: string; dark?: boolean; className?: string }) => (
  <header className={cx('mb-8 grid gap-4 lg:mb-10 lg:grid-cols-12 lg:gap-6', className)}>
    <p className="t-label eyebrow reveal self-start lg:col-span-3 lg:pt-3">{eyebrow}</p>
    <div className="lg:col-span-9">
      <h2 className="t-h2 max-w-[30ch]" data-reveal><Words text={h2} /></h2>
      {lead && <p className={cx('reveal mt-3 max-w-[56ch]', dark ? 'text-on-dark' : 'text-muted')}>{lead}</p>}
    </div>
  </header>
)
