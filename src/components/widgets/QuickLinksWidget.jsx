import { useLocalStorage } from '../../hooks/useLocalStorage'

const DEFAULT_LINKS = [
  { id: '1', label: 'Gmail', url: 'https://mail.google.com', icon: '📧' },
  { id: '2', label: 'Reddit', url: 'https://reddit.com', icon: '🔴' },
  { id: '3', label: 'Athletic', url: 'https://theathletic.com', icon: '📰' },
  { id: '4', label: 'LinkedIn', url: 'https://linkedin.com', icon: '💼' },
  { id: '5', label: 'Wolt', url: 'https://wolt.com', icon: '🍔' },
  { id: '6', label: 'GitHub', url: 'https://github.com/arnar111', icon: '🐱' },
  { id: '7', label: 'PETRIA', url: 'https://petria.is', icon: '🛍️' },
  { id: '8', label: 'Huel', url: 'https://huel.com', icon: '🥤' },
  { id: '9', label: 'WHU', url: 'https://www.whufc.com', icon: '⚒️' },
]

export default function QuickLinksWidget() {
  const [links] = useLocalStorage('addi_quicklinks', DEFAULT_LINKS)

  return (
    <div className="flex gap-3.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
      {links.map(link => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1.5 shrink-0 active:scale-90 transition-transform"
          style={{ textDecoration: 'none' }}
        >
          <div
            className="w-13 h-13 rounded-2xl flex items-center justify-center text-2xl"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              width: 52,
              height: 52,
            }}
          >
            {link.icon}
          </div>
          <span style={{ fontSize: 10, color: 'var(--muted)' }}>{link.label}</span>
        </a>
      ))}
    </div>
  )
}
