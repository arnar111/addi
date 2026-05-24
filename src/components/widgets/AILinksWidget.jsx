const AI_TOOLS = [
  { name: 'Claude', icon: '🤖', url: 'https://claude.ai', color: '#f97316', shortcut: 'Alt+C' },
  { name: 'Kimi', icon: '🌙', url: 'https://kimi.ai', color: '#8b5cf6', shortcut: 'Alt+K' },
  { name: 'Perplexity', icon: '🔍', url: 'https://perplexity.ai', color: '#00d4aa', shortcut: '' },
  { name: 'Brave', icon: '🦁', url: 'https://search.brave.com', color: '#f59e0b', shortcut: '' },
]

export default function AILinksWidget() {
  return (
    <div className="card">
      <div className="text-xs font-semibold mb-2" style={{ color: 'var(--muted)' }}>AI VERKFÆRI</div>
      <div className="grid grid-cols-4 gap-2">
        {AI_TOOLS.map(t => (
          <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer"
             className="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl transition-all hover:scale-105 active:scale-95"
             style={{ background: `${t.color}11`, border: `1px solid ${t.color}22`, textDecoration: 'none' }}>
            <span className="text-xl">{t.icon}</span>
            <span className="text-xs font-medium" style={{ color: t.color }}>{t.name}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
