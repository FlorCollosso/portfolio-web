import { FaBehance, FaGithub, FaLinkedinIn } from 'react-icons/fa6'
import { FiMail } from 'react-icons/fi'
import type { SocialId } from '../../types/portfolio'

const icons = {
  linkedin: FaLinkedinIn,
  github: FaGithub,
  behance: FaBehance,
  email: FiMail,
} satisfies Record<SocialId, unknown>

export function SocialIcon({ id, className = 'size-5' }: { id: SocialId; className?: string }) {
  const Icon = icons[id]
  return <Icon aria-hidden="true" className={className} />
}
