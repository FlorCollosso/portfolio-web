import type { AnchorHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant
  icon?: ReactNode
  external?: boolean
}

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-paper hover:bg-rose-deep',
  secondary: 'border border-ink/15 bg-white text-ink hover:border-ink',
  ghost: 'text-ink underline-offset-4 hover:underline',
}

export const buttonBase =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-200'

export function ButtonLink({ variant = 'primary', icon, external, className = '', children, ...props }: ButtonLinkProps) {
  return (
    <a
      {...props}
      {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      className={`${buttonBase} ${variants[variant]} ${className}`}
    >
      {icon}
      <span>{children}</span>
      {external && <span className="sr-only">(se abre en una pestaña nueva)</span>}
    </a>
  )
}
