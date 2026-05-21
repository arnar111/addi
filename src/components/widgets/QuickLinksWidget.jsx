const LINKS = [
  { label: 'The Athletic', icon: '⚽', href: 'https://theathletic.com', color: '#00d4aa' },
  { label: 'Eign', icon: '🏠', href: 'https://github.com/arnar111/Eign', color: '#8b5cf6' },
  { label: 'Takkarena', icon: '🎤', href: 'https://takkmvp.netlify.app', color: '#f97316' },
  { label: 'GOLF+', icon: '⛳', href: 'https://www.golfplus.com', color: '#22c55e' },
]

export default function QuickLinksWidget() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {LINKS.map(l => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all active:scale-95"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <span className="text-xl">{l.icon}</span>
          <span className="text-[10px] font-medium text-center leading-tight"
                style={{ color: 'var(--muted)' }}>{l.label}</span>
        </a>
      ))}
    </div>
  )
}
