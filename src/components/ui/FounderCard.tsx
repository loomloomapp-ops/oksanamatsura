import type { Person } from '@/content/types'
import { Button } from './Button'
import { ImageWrapper } from './ImageWrapper'
import { Monogram } from './Panels'

/** Portrait tile fused to a dark details card, used below the hero and beside forms. */
export const FounderCard = ({ person, cta, href }: { person: Person; cta: string; href: string }) => (
  <div className="founder">
    <div className="founder__avatar surface">
      <ImageWrapper image={person.image} fallback={<Monogram name={person.name} small />} priority sizes="132px" className="aspect-square w-full !rounded-[12px]" />
    </div>
    <div className="founder__info surface">
      <div className="min-w-0">
        <p className="text-sm text-on-dark">{person.role}</p>
        <p className="mt-1 text-lg font-medium leading-tight">{person.name}</p>
      </div>
      <Button href={href} variant="light" small className="w-full flex-none md:w-auto">{cta}</Button>
    </div>
  </div>
)
