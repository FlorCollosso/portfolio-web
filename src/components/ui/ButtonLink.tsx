import type { AnchorHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant
  icon?: ReactNode
  external?: boolean
}

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-paper shadow-[0.2rem_0.2rem_0_var(--color-rose)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[0.3rem_0.3rem_0_var(--color-rose)]',
  secondary: 'border border-ink/20 bg-card text-ink hover:border-ink',
  ghost: 'px-1! text-ink underline decoration-rose decoration-2 underline-offset-[0.35em] hover:decoration-rose-deep',
}

export const buttonBase =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ease-[var(--ease-soft)] active:translate-y-0'

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
