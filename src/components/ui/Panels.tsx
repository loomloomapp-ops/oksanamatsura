import { cx } from '@/lib/cx'

const initials = (name: string) => name.split(' ').map((p) => p[0]).join('')

/** Portrait slot until the real photograph arrives. Never shows an invented face. */
export const Monogram = ({ name, dark, small }: { name: string; dark?: boolean; small?: boolean }) => (
  <div className={cx('panel', dark ? 'surface' : 'panel--light')}>
    <span className={cx('monogram', small && 'monogram--small')}>{initials(name)}</span>
  </div>
)

/** Office slot: the real address set as typography. */
export const AddressPanel = ({ city, street }: { city: string; street: string }) => (
  <div className="panel surface flex-col justify-between p-6 lg:p-10">
    <svg aria-hidden viewBox="0 0 400 160" className="w-full opacity-30" fill="none" stroke="currentColor" strokeWidth="1">
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${i * 50} 160V${40 + (i % 3) * 30}h46V160`} />)}
    </svg>
    <div>
      <p className="text-[clamp(3.5rem,7vw,6.5rem)] font-light leading-[1.05] tracking-[-0.03em]">{city}</p>
      <p className="mt-2 text-on-dark">{street}</p>
    </div>
  </div>
)

/** Case slot: a floor-plan drawing behind the real figures of the case. */
export const FloorPlan = ({ variant }: { variant: number }) => (
  <div className="panel surface">
    <svg aria-hidden viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full opacity-[0.13]" fill="none" stroke="currentColor" strokeWidth="1">
      {variant === 0 ? (
        <>
          <path d="M60 40h280v220H60zM60 150h120M180 40v60M180 130v130M260 150h80M260 150v110" />
          <path d="M180 100a30 30 0 0 1 30 30M260 190a26 26 0 0 0-26 26M92 150a28 28 0 0 0 28-28" />
          <path d="M60 80H48M60 120H48M340 80h12M340 120h12" />
        </>
      ) : (
        <>
          <path d="M80 30h240v240H80zM80 130h90M170 30v150M170 210v60M250 130h70M250 30v100M170 180h150" />
          <path d="M170 180a30 30 0 0 1-30 30M250 130a26 26 0 0 1-26-26M116 130a24 24 0 0 1-24 24" />
          <path d="M120 30V18M200 30V18M280 30V18" />
        </>
      )}
    </svg>
  </div>
)
