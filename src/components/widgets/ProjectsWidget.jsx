import { ExternalLink, Code2 } from 'lucide-react'

const PROJECTS = [
  { name: 'takkarena', emoji: '🛒', desc: 'Söluyfirlit', url: 'https://takkmvp.netlify.app', color: '#f97316' },
  { name: 'spira', emoji: '🌶️', desc: 'Piparrækt', url: 'https://spiran.netlify.app', color: '#22c55e' },
  { name: 'draumakaup', emoji: '⚽', desc: 'Flutningar', url: 'https://draumakaup.netlify.app', color: '#ef4444' },
  { name: 'addi', emoji: '🏠', desc: 'Þetta app', url: null, color: '#00d4aa' },
]

const LINKS = [
  { name: 'GitHub', emoji: '🐙', url: 'https://github.com/arnar111' },
  { name: 'Netlify', emoji: '⚡', url: 'https://app.netlify.com' },
  { name: 'The Athletic', emoji: '⚽', url: 'https://theathletic.com' },
  { name: 'Vísiр', emoji: '📰', url: 'https://visir.is' },
]

export default function ProjectsWidget() {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <Code2 size={15} style={{ color: 'var(--accent)' }} />
        <span className="text-sm font-semibold">Verkefni &amp; Tenglar</span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {PROJECTS.map(p => (
          <button key={p.name}
            onClick={() => p.url && window.open(p.url, '_blank')}
            disabled={!p.url}
            className="flex items-center gap-2 p-2.5 rounded-xl text-left transition-all"
            style={{
              background: `${p.color}12`,
              border: `1px solid ${p.color}25`,
              cursor: p.url ? 'pointer' : 'default',
            }}>
            <span className="text-lg">{p.emoji}</span>
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate" style={{ color: p.color }}>{p.name}</div>
              <div className="text-xs" style={{ color: 'var(--muted)', fontSize: 10 }}>{p.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {LINKS.map(l => (
          <a key={l.name} href={l.url} target="_blank" rel="noreferrer"
             className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-all"
             style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
             onClick={e => e.stopPropagation()}>
            <span>{l.emoji}</span> {l.name} <ExternalLink size={9} />
          </a>
        ))}
      </div>
    </div>
  )
}
