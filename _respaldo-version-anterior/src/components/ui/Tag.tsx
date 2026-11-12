interface TagProps {
  children: string
  tone?: 'light' | 'dark'
}

export function Tag({ children, tone = 'light' }: TagProps) {
  const styles =
    tone === 'dark' ? 'border-white/20 text-white/85' : 'border-line bg-white text-ink-soft'

  return <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${styles}`}>{children}</span>
}
