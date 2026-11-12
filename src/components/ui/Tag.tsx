interface TagProps {
  children: string
}

export function Tag({ children }: TagProps) {
  return (
    <span className="inline-block rounded-[0.3rem] border border-line bg-card px-2.5 py-1 text-xs font-medium text-ink-soft transition-colors duration-700">
      {children}
    </span>
  )
}
