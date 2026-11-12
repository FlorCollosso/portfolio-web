import type { ResponsiveImage as ResponsiveImageData } from '../../types/portfolio'
import { asset } from '../../utils/asset'

interface ResponsiveImageProps {
  image: ResponsiveImageData
  sizes: string
  className?: string
  priority?: boolean
}

// Cada imagen se genera en 640 y 1280 px con scripts/optimize-images.mjs.
export function ResponsiveImage({ image, sizes, className = '', priority = false }: ResponsiveImageProps) {
  const base = asset(image.base)

  return (
    <img
      src={`${base}-1280.webp`}
      srcSet={`${base}-640.webp 640w, ${base}-1280.webp 1280w`}
      sizes={sizes}
      alt={image.alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      style={image.position ? { objectPosition: image.position } : undefined}
      className={className}
    />
  )
}
