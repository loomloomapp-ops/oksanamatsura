import Image from 'next/image'
import type { ReactNode } from 'react'
import type { ImageSlot } from '@/content/types'
import { cx } from '@/lib/cx'

/** Shows the photograph or, while there is none, a designed `fallback` panel. */
export const ImageWrapper = ({ image, fallback, priority, parallax, sizes = '(max-width: 1023px) 100vw, 50vw', className }: {
  image: ImageSlot
  fallback?: ReactNode
  priority?: boolean
  parallax?: boolean
  sizes?: string
  className?: string
}) => (
  <div className={cx('media-zoom relative overflow-hidden rounded-card', !priority && 'reveal-media', parallax && 'parallax', className)}>
    {image.src ? (
      <Image src={image.src} alt={image.alt} fill sizes={sizes} loading={priority ? 'eager' : undefined} fetchPriority={priority ? 'high' : undefined} className="object-cover" style={{ objectPosition: image.position }} />
    ) : (
      <div role="img" aria-label={image.alt} className="absolute inset-0 rounded-[inherit]">{fallback ?? <div className="placeholder" />}</div>
    )}
  </div>
)
